import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import hljs from 'highlight.js';
import * as htmlToImage from 'html-to-image';

@Component({
  selector: 'app-dark-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dark-editor.component.html',
  styleUrls: ['./dark-editor.component.scss'],
})
export class DarkEditorComponent implements AfterViewInit {
  // Use a new wrapper div for capturing the image
  @ViewChild('imageWrapper') imageWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('codeDisplay') codeDisplay!: ElementRef<HTMLPreElement>;

  code = `export interface DarkThemeList {
  id: number;
  darktheme: string;
}

export interface LightThemeList {
  id: number;
  lighttheme: string;
}`;

  showLineNumbers = signal(true);
  selectedTheme = signal('atom-one-dark'); // A good default dark theme
  selectedLanguage = signal('typescript');
  fileName = signal('interface.ts');
  authorName = signal('johndoe');

  themes = [
    { value: 'a11y-dark', name: 'A11y Dark' },
    { value: 'agate', name: 'Agate' },
    { value: 'atom-one-dark', name: 'Atom One Dark' },
    { value: 'atom-one-light', name: 'Atom One Light' },
    { value: 'github-dark', name: 'GitHub Dark' },
    { value: 'github-light', name: 'GitHub Light' },
    { value: 'monokai', name: 'Monokai' },
    { value: 'night-owl', name: 'Night Owl' },
    { value: 'vs2015', name: 'VS 2015' },
  ];

  languages = [
    { value: 'typescript', name: 'TypeScript' },
    { value: 'javascript', name: 'JavaScript' },
    { value: 'html', name: 'HTML' },
    { value: 'css', name: 'CSS' },
    { value: 'java', name: 'Java' },
    { value: 'python', name: 'Python' },
    { value: 'csharp', name: 'C#' },
    { value: 'php', name: 'PHP' },
    { value: 'json', name: 'JSON' },
    { value: 'xml', name: 'XML' },
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.loadTheme(this.selectedTheme());
    this.highlightCode();
  }

  // Use a signal for the code to automatically trigger updates
  onCodeChange(event: Event) {
    const newCode = (event.target as HTMLTextAreaElement).value;
    this.code = newCode;
    this.highlightCode();
  }

  private highlightCode() {
    if (!this.codeDisplay?.nativeElement) return;

    const codeElement = this.codeDisplay.nativeElement.querySelector('code');
    if (!codeElement) return;

    // Use the raw code for highlighting
    let highlightedCode = hljs.highlight(this.code, {
      language: this.selectedLanguage(),
    }).value;

    if (this.showLineNumbers()) {
      highlightedCode = highlightedCode
        .split('\n')
        .map((line, i) => `<span class="line-number">${i + 1}</span>${line}`)
        .join('\n');
    }

    codeElement.innerHTML = highlightedCode;
  }

  loadTheme(theme: string) {
    const existingLink = document.getElementById('hljs-theme');
    if (existingLink) {
      existingLink.remove();
    }

    const link = document.createElement('link');
    link.id = 'hljs-theme';
    link.rel = 'stylesheet';
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
    link.onload = () => {
      // We need to re-run highlighting after the new theme has loaded
      this.highlightCode();
    };
    document.head.appendChild(link);
  }

  onThemeChange(theme: string) {
    this.selectedTheme.set(theme);
    this.loadTheme(theme);
  }

  onLanguageChange(language: string) {
    this.selectedLanguage.set(language);
    this.highlightCode();
  }

  onShowLineNumbersChange(checked: boolean) {
    this.showLineNumbers.set(checked);
    this.highlightCode();
  }

  // --- EXPORT AND COPY FUNCTIONS ---

  private getExportNode(): HTMLElement {
    const node = this.imageWrapper.nativeElement;
    if (!node) {
      throw new Error('Image wrapper element not found!');
    }
    return node;
  }

  async exportToPng() {
    try {
      const dataUrl = await htmlToImage.toPng(this.getExportNode(), {
        quality: 1, // Higher quality
        pixelRatio: 2, // Double resolution for crispier images
      });
      const link = document.createElement('a');
      link.download = `${this.fileName().replace(/\.[^/.]+$/, '') || 'code-snippet'
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
      const blob = await htmlToImage.toBlob(this.getExportNode(), {
        pixelRatio: 2,
      });
      if (!blob) {
        throw new Error('Could not create blob from element');
      }
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
