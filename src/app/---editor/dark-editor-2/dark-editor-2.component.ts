import {
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import hljs from 'highlight.js';
import * as htmlToImage from 'html-to-image';

@Component({
  selector: 'app-dark-editor-2',
  imports: [FormsModule],
  templateUrl: './dark-editor-2.component.html',
  styleUrl: './dark-editor-2.component.scss',
})
export class DarkEditor2Component {
  // --- VIEW REFERENCES ---
  @ViewChild('imageWrapper') imageWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('codeDisplay') codeDisplay!: ElementRef<HTMLPreElement>;

  // --- STATE MANAGEMENT WITH SIGNALS ---

  // Default code to display
  code = signal(`export interface User {
  id: number;
  name: string;
  email?: string;
}`);

  // Editable filename
  fileName = signal('user.interface.ts');

  // Toggle for line numbers
  showLineNumbers = signal(true);

  // Theme selection state
  themeType = signal<'dark' | 'light'>('dark');
  selectedTheme = signal('atom-one-dark');

  // --- THEME DEFINITIONS ---

  darkThemes: Theme[] = [
    { name: 'Atom One Dark', value: 'atom-one-dark' },
    { name: 'Agate', value: 'agate' },
    { name: 'GitHub Dark', value: 'github-dark' },
    { name: 'Monokai', value: 'monokai' },
    { name: 'Night Owl', value: 'night-owl' },
    { name: 'VS2015', value: 'vs2015' },
  ];

  lightThemes: Theme[] = [
    { name: 'Atom One Light', value: 'atom-one-light' },
    { name: 'A11y Light', value: 'a11y-light' },
    { name: 'GitHub Light', value: 'github-light' },
    { name: 'VS', value: 'vs' },
    { name: 'Xcode', value: 'xcode' },
  ];

  // Computed signal to determine which theme list to show
  availableThemes = computed(() => {
    return this.themeType() === 'dark' ? this.darkThemes : this.lightThemes;
  });

  // --- LIFECYCLE & EFFECTS ---

  constructor() {
    // This effect runs whenever the selected theme changes
    effect(() => {
      this.loadThemeCss(this.selectedTheme());
    });

    // This effect runs whenever the dependencies change, and re-highlights the code
    effect(() => {
      // Trigger re-highlight when code, language, or line numbers change
      this.code();
      this.showLineNumbers();
      // This ensures that after the view is checked, we highlight the code.
      setTimeout(() => this.highlightCode(), 0);
    });
  }

  ngAfterViewInit() {
    // Initial load
    this.loadThemeCss(this.selectedTheme());
    this.highlightCode();
  }

  // --- THEME LOGIC ---

  onThemeTypeChange(type: 'dark' | 'light') {
    this.themeType.set(type);
    // When type changes, select the first theme from the new list
    this.selectedTheme.set(this.availableThemes()[0].value);
  }

  loadThemeCss(theme: string) {
    const existingLink = document.getElementById('hljs-theme');
    if (existingLink) {
      existingLink.remove();
    }
    const link = document.createElement('link');
    link.id = 'hljs-theme';
    link.rel = 'stylesheet';
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
    link.onload = () => {
      // Once the new CSS is loaded, re-highlight to apply new colors
      this.highlightCode();
    };
    document.head.appendChild(link);
  }

  // --- CODE EDITING & HIGHLIGHTING ---

  highlightCode() {
    if (!this.codeDisplay || !this.codeDisplay.nativeElement) return;

    const codeElement = this.codeDisplay.nativeElement.querySelector('code');
    if (!codeElement) return;

    const currentCode = this.code();
    let highlightedCode = hljs.highlight(currentCode, {
      language: 'typescript',
    }).value;

    if (this.showLineNumbers()) {
      const lines = highlightedCode.split('\n');
      // We add a non-breaking space to empty lines to ensure they have height
      highlightedCode = lines
        .map(
          (line, i) =>
            `<span class="line-number">${i + 1}</span>${line || '&nbsp;'}`
        )
        .join('\n');
    }

    codeElement.innerHTML = highlightedCode;
  }

  // This function is called when the user types in the contenteditable area
  onCodeInput(event: Event) {
    const element = event.target as HTMLElement;
    // We update the signal with the raw text content of the element
    this.code.set(element.innerText);
  }

  // --- EXPORT FUNCTIONS ---

  private getExportNode(): HTMLElement {
    const node = this.imageWrapper.nativeElement;
    if (!node) {
      throw new Error('Image wrapper element not found!');
    }
    return node;
  }

  async exportToPng() {
    try {
      const node = this.getExportNode();
      // Temporarily remove the focus outline for a clean screenshot
      node.classList.add('preparing-export');

      const dataUrl = await htmlToImage.toPng(node, {
        quality: 1,
        pixelRatio: 2,
      });

      node.classList.remove('preparing-export');

      const link = document.createElement('a');
      link.download = `${
        this.fileName().replace(/\.[^/.]+$/, '') || 'code-snippet'
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting to PNG:', error);
      alert('Could not export image. See console for details.');
    }
  }

  async copyImageToClipboard() {
    try {
      const node = this.getExportNode();
      node.classList.add('preparing-export');

      const blob = await htmlToImage.toBlob(node, { pixelRatio: 2 });

      node.classList.remove('preparing-export');

      if (!blob) throw new Error('Could not create blob from element');

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      alert('Image copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy image:', error);
      alert('Failed to copy image. Your browser may not support this feature.');
    }
  }
}

// Interface for our theme objects
interface Theme {
  name: string;
  value: string;
}
