import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import hljs from 'highlight.js';

@Component({
  selector: 'app-wysiwyg-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wysiwyg-editor.html',
  styleUrl: './wysiwyg-editor.scss',
  encapsulation: ViewEncapsulation.None,
})
export class WysiwygEditor implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  isPreviewMode = false;
  htmlSource = '';
  showLinkInput = false;
  linkUrl = '';
  savedSelection: Range | null = null;

  toolbarState: { [key: string]: boolean } = {
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    insertOrderedList: false,
    insertUnorderedList: false,
    subscript: false,
    superscript: false,
  };

  currentForeColor = '#000000';
  currentBackColor = '#ffffff';
  currentFontSize = 16; // Default font size

  // Toolbar options
  fontSizes = Array.from({ length: 23 }, (_, i) => 13 + i);
  headings = [
    { label: 'Normal', value: 'p' },
    { label: 'Small', value: 'small' },
    { label: 'H1', value: 'h1' },
    { label: 'H2', value: 'h2' },
    { label: 'H3', value: 'h3' },
    { label: 'H4', value: 'h4' },
    { label: 'H5', value: 'h5' },
    { label: 'H6', value: 'h6' },
  ];

  currentHeading = 'p';
  
  // History management
  public undoStack: { html: string; selection: { start: number; end: number } }[] = [];
  public redoStack: { html: string; selection: { start: number; end: number } }[] = [];
  private isRestoringState = false;
  private maxStackSize = 50;
  private inputTimeout: any = null;
  private activeTimeouts = new Set<any>();
  private selectionChangeListener: (() => void) | null = null;

  languages = [
    { label: 'Plain Text', value: 'plaintext' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C#', value: 'csharp' },
    { label: 'PHP', value: 'php' },
    { label: 'SQL', value: 'sql' },
    { label: 'JSON', value: 'json' },
  ];
  selectedLanguage = 'typescript';

  ngAfterViewInit() {
    this.editor.nativeElement.focus({ preventScroll: true });

    // Listen for selection changes to update toolbar state
    this.selectionChangeListener = () => {
      if (
        document.activeElement === this.editor.nativeElement ||
        this.editor.nativeElement.contains(document.activeElement)
      ) {
        this.updateToolbarState();
      }
    };
    document.addEventListener('selectionchange', this.selectionChangeListener);

    // Record initial state
    const timeout = setTimeout(() => this.recordState(), 100);
    this.activeTimeouts.add(timeout);
  }

  ngOnDestroy() {
    // 1. Remove global event listeners
    if (this.selectionChangeListener) {
      document.removeEventListener('selectionchange', this.selectionChangeListener);
    }

    // 2. Clear all active timeouts
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }
    this.activeTimeouts.forEach(t => clearTimeout(t));
    this.activeTimeouts.clear();
  }

  private runTrackedTimeout(fn: Function, delay: number) {
    const timeout = setTimeout(() => {
      fn();
      this.activeTimeouts.delete(timeout);
    }, delay);
    this.activeTimeouts.add(timeout);
  }

  onInput() {
    if (this.inputTimeout) clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      this.recordState();
    }, 400); // 400ms debounce
  }

  updateToolbarState() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.commonAncestorContainer;
    
    // Auto-save selection if inside editor
    if (this.editor.nativeElement.contains(node)) {
      this.saveSelection();
    }

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    if (node) {
      const element = node as HTMLElement;
      const computedStyle = window.getComputedStyle(element);

      // 1. Detect Standard Formatting States (Replacing queryCommandState)
      this.toolbarState['bold'] = computedStyle.fontWeight !== 'normal' && parseInt(computedStyle.fontWeight) >= 600;
      this.toolbarState['italic'] = computedStyle.fontStyle === 'italic';
      this.toolbarState['underline'] = computedStyle.textDecoration.includes('underline');
      
      const textAlign = computedStyle.textAlign;
      this.toolbarState['justifyLeft'] = textAlign === 'left' || textAlign === 'start';
      this.toolbarState['justifyCenter'] = textAlign === 'center';
      this.toolbarState['justifyRight'] = textAlign === 'right' || textAlign === 'end';
      
      this.toolbarState['insertOrderedList'] = !!element.closest('ol');
      this.toolbarState['insertUnorderedList'] = !!element.closest('ul');
      
      const vAlign = computedStyle.verticalAlign;
      this.toolbarState['subscript'] = vAlign === 'sub';
      this.toolbarState['superscript'] = vAlign === 'super';

      // 2. Detect Font Size (using Math.round for sub-pixel accuracy)
      const fontSize = Math.round(parseFloat(computedStyle.fontSize));
      if (!isNaN(fontSize)) {
        this.currentFontSize = fontSize;
      }

      // 3. Detect Block Format (Heading)
      this.currentHeading = 'p'; // Default
      const hNode = element.closest('h1, h2, h3, h4, h5, h6');
      if (hNode) {
        this.currentHeading = hNode.tagName.toLowerCase();
      } else {
        // Detect simulated heading based on rounded font-size + weight
        if (fontSize === 13) {
          this.currentHeading = 'small';
        } else if (fontSize === 25) {
          this.currentHeading = 'h1';
        } else if (fontSize === 22) {
          this.currentHeading = 'h2';
        } else if (fontSize === 20) {
          this.currentHeading = 'h3';
        } else if (fontSize === 18) {
          this.currentHeading = 'h4';
        } else if (fontSize === 14) {
          this.currentHeading = 'h6';
        } else if (fontSize === 16 && this.toolbarState['bold']) {
          this.currentHeading = 'h5';
        }
      }

      // 4. Detect Colors
      this.currentForeColor = this.rgbToHex(computedStyle.color);
      this.currentBackColor = this.rgbToHex(computedStyle.backgroundColor);

      // 5. Detect Language
      const codeElement = element.closest('code');
      const preElement = element.closest('pre');
      const code = codeElement || preElement?.querySelector('code');

      if (code) {
        const classes = Array.from(code.classList);
        const langClass = classes.find(c => c.startsWith('language-'));
        if (langClass) {
          this.selectedLanguage = langClass.replace('language-', '');
        }
      } else {
        this.selectedLanguage = 'typescript';
      }
    }
  }

  private rgbToHex(color: string): string {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
        return '#ffffff';
    }
    if (color.startsWith('#')) return color;
    
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return '#ffffff';
    
    // Check if it's rgba and alpha is 0
    if (rgb.length === 4 && parseInt(rgb[3]) === 0) {
      return '#ffffff';
    }
    
    const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
    const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
    const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  }

  updateCodeBlockLanguage() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let node: Node | null = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }

      const pre = (node as HTMLElement).closest('pre');
      const code = pre?.querySelector('code') || (node as HTMLElement).closest('code');

      if (code) {
        // Get raw text content (stripping existing HLJS spans)
        const text = code.textContent || '';
        
        // Reset classes and set new language
        code.className = `language-${this.selectedLanguage}`;
        code.removeAttribute('data-highlighted'); // Remove HLJS marker
        
        // Reset content to raw text
        code.textContent = text;
        
        // Re-highlight
        hljs.highlightElement(code as HTMLElement);
      }
    }
  }

  execCommand(
    command: string,
    value: string | undefined = undefined,
    skipUpdate = false,
    skipRecord = false
  ) {
    if (!skipRecord) {
       this.recordState(); // Capture BEFORE change
    }
    this.editor.nativeElement.focus({ preventScroll: true });
    document.execCommand(command, false, value);
    if (!skipUpdate) {
      this.updateToolbarState();
    }
  }

  // --- History Management Methods ---

  recordState() {
    if (this.isRestoringState) return;

    const currentState = {
      html: this.editor.nativeElement.innerHTML,
      selection: this.getSelectionOffsets()
    };

    // Only push if different from last state to avoid duplicates
    const lastState = this.undoStack[this.undoStack.length - 1];
    if (!lastState || lastState.html !== currentState.html) {
      this.undoStack.push(currentState);
      if (this.undoStack.length > this.maxStackSize) {
        this.undoStack.shift();
      }
      this.redoStack = []; // Clear redo on new action
    }
  }

  undo() {
    let currentHtml = this.editor.nativeElement.innerHTML;
    
    // If the top of the stack is identical to current state, pop it
    // because it was recorded AFTER the change (e.g. from onInput)
    if (this.undoStack.length > 0) {
       const top = this.undoStack[this.undoStack.length - 1];
       if (top.html === currentHtml) {
          this.undoStack.pop();
       }
    }

    if (this.undoStack.length === 0) return;

    const currentState = {
      html: currentHtml,
      selection: this.getSelectionOffsets()
    };
    this.redoStack.push(currentState);

    const state = this.undoStack.pop()!;
    this.restoreState(state);
  }

  redo() {
    if (this.redoStack.length === 0) return;

    const currentState = {
      html: this.editor.nativeElement.innerHTML,
      selection: this.getSelectionOffsets()
    };
    this.undoStack.push(currentState);

    const state = this.redoStack.pop()!;
    this.restoreState(state);
  }

  private restoreState(state: { html: string; selection: { start: number; end: number } }) {
    this.isRestoringState = true;
    this.editor.nativeElement.innerHTML = state.html;
    this.editor.nativeElement.focus({ preventScroll: true });
    
    // Use a tracked timeout to ensure DOM is ready before setting selection
    this.runTrackedTimeout(() => {
      this.setSelectionOffsets(state.selection);
      this.updateToolbarState();
      this.isRestoringState = false;
    }, 0);
  }

  private getSelectionOffsets(): { start: number; end: number } {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !this.editor.nativeElement.contains(sel.anchorNode)) {
      return { start: 0, end: 0 };
    }

    const range = sel.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(this.editor.nativeElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    return {
      start: start,
      end: start + range.toString().length
    };
  }

  private setSelectionOffsets(offsets: { start: number; end: number }) {
    const sel = window.getSelection();
    if (!sel) return;

    const range = document.createRange();
    let charCount = 0;
    let startNode: Node | null = null;
    let startOffset = 0;
    let endNode: Node | null = null;
    let endOffset = 0;

    const traverse = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharCount = charCount + (node.textContent?.length || 0);
        if (!startNode && offsets.start >= charCount && offsets.start <= nextCharCount) {
          startNode = node;
          startOffset = offsets.start - charCount;
        }
        if (!endNode && offsets.end >= charCount && offsets.end <= nextCharCount) {
          endNode = node;
          endOffset = offsets.end - charCount;
        }
        charCount = nextCharCount;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          traverse(node.childNodes[i]);
          if (startNode && endNode) break;
        }
      }
    };

    traverse(this.editor.nativeElement);

    if (startNode && endNode) {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }


  formatBlock(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    
    // Font size mapping for each heading type
    const fontSizeMap: { [key: string]: number } = {
      'h1': 25,
      'h2': 22,
      'h3': 20,
      'h4': 18,
      'h5': 16,
      'h6': 14,
      'p': 16,
      'small': 13
    };
    
    this.recordState();
    this.restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const isCollapsed = range.collapsed;

    // Check if we should change the tag (block level) or just style (character level)
    let shouldChangeTag = isCollapsed;
    
    if (!isCollapsed) {
       const block = this.getClosestBlock(range.commonAncestorContainer);
       if (block) {
          const blockText = block.innerText.trim();
          const selectedText = selection.toString().trim();
          // If selection covers significantly most of the block, treat as block-level change
          if (blockText === selectedText || (blockText.length > 0 && selectedText.length > blockText.length * 0.8)) {
             shouldChangeTag = true;
          }
       }
    }

    if (shouldChangeTag) {
      if (value === 'small') {
        this.execCommand('formatBlock', 'p', true, true);
        this.applyFontSizeToSelection(13, true);
        this.currentFontSize = 13;
      } else {
        this.execCommand('formatBlock', value, true, true);
        if (fontSizeMap[value]) {
          this.applyFontSizeToSelection(fontSizeMap[value], true);
          this.currentFontSize = fontSizeMap[value];
        }
      }
    } else {
      // Character-level style application for partial selections
      if (fontSizeMap[value]) {
        this.applyFontSizeToSelection(fontSizeMap[value], true);
        this.currentFontSize = fontSizeMap[value];
        
        // Update boldness for headings vs normal text
        const isHeading = value.startsWith('h');
        const selection = window.getSelection();
        let currentlyBold = false;
        if (selection && selection.rangeCount > 0) {
          const node = selection.getRangeAt(0).commonAncestorContainer;
          const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as HTMLElement;
          if (element) {
            const weight = window.getComputedStyle(element).fontWeight;
            currentlyBold = weight !== 'normal' && parseInt(weight) >= 600;
          }
        }
        
        if (isHeading !== currentlyBold) {
           this.execCommand('bold', undefined, false, true);
        }
      }
    }
  }

  private getClosestBlock(node: Node): HTMLElement | null {
    let curr: Node | null = node;
    while (curr && curr !== this.editor.nativeElement) {
      if (curr.nodeType === Node.ELEMENT_NODE) {
        const el = curr as HTMLElement;
        const tagName = el.tagName;
        const display = window.getComputedStyle(el).display;
        if (display === 'block' || display === 'list-item' || 
            ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'DIV'].includes(tagName)) {
          return el;
        }
      }
      curr = curr.parentNode;
    }
    return null;
  }

  
  applyFontSizeToSelection(size: number, skipRecord = false) {
    if (!skipRecord) {
       this.recordState();
    }
    this.editor.nativeElement.focus({ preventScroll: true });
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const isCollapsed = selection.getRangeAt(0).collapsed;
    
    // Store colors
    let existingColor: string | null = null;
    let existingBackgroundColor: string | null = null;
    
    const range = selection.getRangeAt(0);
    let node: Node | null = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    
    if (node) {
      const element = node as HTMLElement;
      const computedStyle = window.getComputedStyle(element);
      existingColor = computedStyle.color;
      existingBackgroundColor = computedStyle.backgroundColor;
    }

    this.execCommand('fontSize', '7', true, true);
    
    const fontElements = this.editor.nativeElement.getElementsByTagName('font');
    for (let i = fontElements.length - 1; i >= 0; i--) {
      const font = fontElements[i];
      if (font.getAttribute('size') === '7') {
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        
        if (existingColor && existingColor !== 'rgb(0, 0, 0)') {
          span.style.color = existingColor;
        }
        if (existingBackgroundColor && existingBackgroundColor !== 'rgba(0, 0, 0, 0)' && existingBackgroundColor !== 'transparent') {
          span.style.backgroundColor = existingBackgroundColor;
        }
        
        span.innerHTML = font.innerHTML;
        
        if (span.innerHTML === '' && isCollapsed) {
          span.innerHTML = '&#8203;';
        }

        font.parentNode?.replaceChild(span, font);

        if (isCollapsed && selection) {
          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }
    this.updateToolbarState();
  }

  setFontSize(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.restoreSelection();
    this.applyFontSizeToSelection(parseInt(value));
  }

  updateColor(type: 'fore' | 'back', value: string) {
    if (!value) return;
    
    // Ensure it starts with # if it's a hex-like string (3 or 6 chars)
    if (!value.startsWith('#') && /^[0-9A-Fa-f]{3,6}$/.test(value)) {
      value = '#' + value;
    }

    if (type === 'fore') {
      this.currentForeColor = value;
      this.recordState();
      this.restoreSelection();
      this.execCommand('foreColor', value, false, true);
    } else {
      this.currentBackColor = value;
      this.recordState();
      this.restoreSelection();
      this.execCommand('hiliteColor', value, false, true);
    }
  }

  onColorPickerChange(type: 'fore' | 'back', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.updateColor(type, value);
  }

  onHexInputChange(type: 'fore' | 'back', event: Event) {
    // If Enter key, trigger blur to handle logic there and avoid double-execution
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
        (event.target as HTMLElement).blur();
        return;
    }

    const input = event.target as HTMLInputElement;
    let value = input.value.trim();
    
    // Auto-fix missing hash
    if (!value.startsWith('#') && /^[0-9A-Fa-f]{3,6}$/.test(value)) {
       value = '#' + value;
       input.value = value; // Update input display
    }

    // Validate Hex
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      this.updateColor(type, value);
    }
  }

  saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // Only save if the selection is within the editor content
      if (this.editor.nativeElement.contains(range.commonAncestorContainer)) {
        this.savedSelection = range.cloneRange();
      }
    }
  }

  restoreSelection() {
    if (this.savedSelection) {
      const sel = window.getSelection();
      if (sel) {
        // Focus execution context first to ensure selection is visually applied
        this.editor.nativeElement.focus({ preventScroll: true });
        sel.removeAllRanges();
        sel.addRange(this.savedSelection);
      }
    }
  }

  toggleLinkInput() {
    if (this.showLinkInput) {
      this.showLinkInput = false;
      this.linkUrl = '';
    } else {
      this.saveSelection();
      this.showLinkInput = true;
    }
  }

  applyLink() {
    if (this.linkUrl) {
      this.recordState();
      this.restoreSelection();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Remove existing links in the range if any
        document.execCommand('unlink'); 
        
        const a = document.createElement('a');
        a.href = this.linkUrl;
        a.target = '_blank';
        
        if (range.collapsed) {
             a.textContent = this.linkUrl;
             range.insertNode(a);
        } else {
             a.appendChild(range.extractContents());
             range.insertNode(a);
        }
        
        this.updateToolbarState();
      }
    }
    this.showLinkInput = false;
    this.linkUrl = '';
  }

  insertImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        this.recordState();
        this.restoreSelection();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
           const range = selection.getRangeAt(0);
           range.deleteContents();
           
           const img = document.createElement('img');
           img.src = imgUrl;
           img.style.maxWidth = '100%';
           range.insertNode(img);
           
           this.updateToolbarState();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const items = event.clipboardData?.items;
    let handled = false;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imgUrl = e.target?.result as string;
              this.execCommand('insertImage', imgUrl);
            };
            reader.readAsDataURL(blob);
            handled = true;
          }
        }
      }
    }

    if (!handled) {
      const html = event.clipboardData?.getData('text/html');
      const text = event.clipboardData?.getData('text/plain');

      if (html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 1. Detect and Convert "fake" code blocks (divs/spans with styles from VS Code etc.)
        const allElements = tempDiv.querySelectorAll('*');
        allElements.forEach((el) => {
          const element = el as HTMLElement;
          const style = element.style;
          const fontFamily = style.fontFamily?.toLowerCase() || '';
          
          if (
            (fontFamily.includes('monospace') || 
             fontFamily.includes('consolas') || 
             fontFamily.includes('courier new')) && 
             element.tagName.toLowerCase() !== 'code'
          ) {
              const parent = element.parentElement;
              const parentFont = parent?.style.fontFamily?.toLowerCase() || '';
              const isChildOfCode = parentFont.includes('monospace') || parentFont.includes('consolas');

              if (!isChildOfCode) {
                 const newPre = document.createElement('pre');
                 const newCode = document.createElement('code');
                 newCode.className = `language-${this.selectedLanguage}`;
                 
                 // manual newline extraction helper
                 let contentHtml = element.innerHTML;
                 contentHtml = contentHtml.replace(/<br\s*\/?>/gi, '\n');
                 contentHtml = contentHtml.replace(/<\/div>/gi, '\n');
                 contentHtml = contentHtml.replace(/<\/p>/gi, '\n');
                 contentHtml = contentHtml.replace(/<\/tr>/gi, '\n');
                 contentHtml = contentHtml.replace(/<\/li>/gi, '\n');
                 
                 const decoder = document.createElement('div');
                 decoder.innerHTML = contentHtml;
                 newCode.textContent = decoder.textContent || '';
                 
                 newPre.appendChild(newCode);
                 element.replaceWith(newPre);
              }
          }
        });

        // 2. Sanitize existing pre blocks
        const preElements = tempDiv.querySelectorAll('pre');
        preElements.forEach((pre) => {
          const languageClass = `language-${this.selectedLanguage}`;
          
          let contentHtml = pre.innerHTML;
          contentHtml = contentHtml.replace(/<br\s*\/?>/gi, '\n');
          // pre content usually is just text but sometimes contain br if edited visually
          
          const decoder = document.createElement('div');
          decoder.innerHTML = contentHtml;
          const codeContent = decoder.textContent || pre.innerText || '';
          
          const newPre = document.createElement('pre');
          const newCode = document.createElement('code');
          newCode.className = languageClass;
          newCode.textContent = codeContent;
          newPre.appendChild(newCode);
          
          pre.parentNode?.replaceChild(newPre, pre);
        });

        // HEADINGS FONT SIZE CONTROL
        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((hNode) => {
          const h = hNode as HTMLElement;
          const tagName = h.tagName.toLowerCase();
          
          switch (tagName) {
            case 'h1': h.style.fontSize = '25px'; break;
            case 'h2': h.style.fontSize = '22px'; break;
            case 'h3': h.style.fontSize = '20px'; break;
            case 'h4': h.style.fontSize = '18px'; break;
            case 'h5': h.style.fontSize = '16px'; break;
            case 'h6': h.style.fontSize = '14px'; break;
          }
          
          const children = h.querySelectorAll('[style]');
          children.forEach((c) => {
             (c as HTMLElement).style.removeProperty('font-size');
          });
        });

        this.cleanListItemsInElement(tempDiv);
        this.execCommand('insertHTML', tempDiv.innerHTML);
      } else if (text) {
        this.execCommand('insertText', text);
      }
      
      // Ensure syntax highlighting is applied to pasted content
      this.runTrackedTimeout(() => this.highlightCode(), 0);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // Handle Undo/Redo Shortcuts
    if ((event.ctrlKey || event.metaKey)) {
      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
        return;
      }
      if (key === 'y') {
        event.preventDefault();
        this.redo();
        return;
      }
    }

    if (event.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node: Node | null = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }

        // Check if we are inside a code block (pre or code)
        const codeBlock = (node as HTMLElement).closest('pre') || (node as HTMLElement).closest('code');
        
        if (codeBlock) {
          event.preventDefault();
          
          // Manual newline insertion
          const newline = document.createTextNode('\n');
          range.deleteContents();
          range.insertNode(newline);
          
          // Move cursor after the new line
          range.setStartAfter(newline);
          range.setEndAfter(newline);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }

  insertCodeBlock() {
    this.recordState();
    // Just insert an empty block with the selected language
    const uniqueId = 'code-' + Date.now();
    const html = `<pre id="${uniqueId}"><code class="language-${this.selectedLanguage}"></code></pre><p><br></p>`;
    this.execCommand('insertHTML', html);

    this.runTrackedTimeout(() => {
      this.highlightCode();
      // Select the inserted block content to allow easy removal
      const block = this.editor.nativeElement.querySelector(`#${uniqueId}`);
      if (block) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(block);
        selection?.removeAllRanges();
        selection?.addRange(range);
        
        // Remove ID after selection
        block.removeAttribute('id');
      }
    }, 0);
  }

  highlightCode() {
    if (this.editor) {
      const blocks = this.editor.nativeElement.querySelectorAll('pre code');
      blocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }

  togglePreview() {
    if (this.isPreviewMode) {
      // Record state when coming BACK from preview mode
      // to capture any HTML edits made there.
      this.recordState();
    }

    if (!this.isPreviewMode) {
      this.cleanListItemsInElement(this.editor.nativeElement);
    }
    this.isPreviewMode = !this.isPreviewMode;
    if (this.isPreviewMode) {
      this.htmlSource = this.editor.nativeElement.innerHTML;
    } else {
      this.runTrackedTimeout(() => this.highlightCode(), 0);
    }
  }

  exportPdf() {
    window.print();
  }

  private cleanListItemsInElement(element: HTMLElement) {
    const listItems = element.querySelectorAll('li');
    listItems.forEach((li) => {
      const paragraphs = li.querySelectorAll('p');
      paragraphs.forEach((p) => {
        // Move all child nodes of p to its parent, before p
        if (p.parentNode) {
          while (p.firstChild) {
            p.parentNode.insertBefore(p.firstChild, p);
          }
          // Remove the p tag
          p.parentNode.removeChild(p);
        }
      });
      // Also remove any br tags that might be left over if they are the only thing
      const brs = li.querySelectorAll('br');
      brs.forEach((br) => {
        if (li.childNodes.length === 1 && br === li.firstChild) {
          // Keep br if it's the only thing? No, empty li is fine.
        }
      });
    });
  }
}
