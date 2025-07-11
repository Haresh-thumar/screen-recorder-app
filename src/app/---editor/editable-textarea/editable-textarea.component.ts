import {
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-editable-textarea',
  imports: [],
  templateUrl: './editable-textarea.component.html',
  styleUrl: './editable-textarea.component.scss',
})
export class EditableTextareaComponent {
  //   content = signal<string>(
  //     `export interface DarkThemeList {
  //   id: number;
  //   darkheme: string;
  // }
  // export interface LightThemeList {
  //   id: number;
  //   lightheme: string;
  // }`
  //   );
  //   lines = signal<string[]>([]);
  //   constructor() {
  //     effect(() => {
  //       // This effect correctly updates `lines` whenever `content` changes
  //       this.lines.set(this.content().split('\n'));
  //     });
  //   }
  //   onInput(event: Event): void {
  //     const target = event.target as HTMLTextAreaElement;
  //     this.content.set(target.value);
  //   }

  /*-------------------------------------------------------------------------------------*/

  content = signal<string>(
    `export interface DarkThemeList {
  id: number;
  darkheme: string;
}

export interface LightThemeList {
  id: number;
  lightheme: string;
}`
  );
  lines = signal<string[]>(['']); // Initialize with one empty line
  codeArea = viewChild<ElementRef<HTMLTextAreaElement>>('codeArea');
  lineNumbers = viewChild<ElementRef<HTMLDivElement>>('lineNumbers');

  constructor() {
    // Initialize effect to update line numbers
    effect(() => {
      const content = this.content();
      const lines = content.split('\n');
      this.lines.set(lines.length > 0 ? lines : ['']); // Ensure at least one line

      // Adjust line numbers height after DOM update
      // afterNextRender(() => {
      this.adjustLineNumbersHeight();
      // });
    });
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.content.set(target.value);
  }

  onEnter(event: any): void {
    // Let the default Enter key behavior happen first
    setTimeout(() => {
      this.content.update((current) => current);
      this.adjustLineNumbersHeight();
    });
  }

  syncScroll(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const lineNumbersEl = this.lineNumbers()?.nativeElement;

    if (lineNumbersEl) {
      lineNumbersEl.scrollTop = target.scrollTop;
    }
  }

  private adjustLineNumbersHeight(): void {
    const codeAreaEl = this.codeArea()?.nativeElement;
    const lineNumbersEl = this.lineNumbers()?.nativeElement;

    if (codeAreaEl && lineNumbersEl) {
      // Calculate the required height based on the number of lines
      const lineHeight = parseFloat(getComputedStyle(codeAreaEl).lineHeight);
      const totalLines = this.lines().length;
      const totalHeight = totalLines * lineHeight;

      // Set the height of line numbers to match the content
      lineNumbersEl.style.height = `${totalHeight}px`;

      // Ensure the textarea has the same scroll height
      codeAreaEl.style.height = 'auto';
      codeAreaEl.style.height = `${codeAreaEl.scrollHeight}px`;
    }
  }
}
