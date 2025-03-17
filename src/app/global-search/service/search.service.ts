import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchHighlightService {
  private renderer: Renderer2;
  private markedElements: HTMLElement[] = [];
  private currentIndex = -1;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  searchAndHighlight(searchText: string, rootElement: HTMLElement): void {
    // Clear any existing highlights first
    this.clearHighlights();

    // If search text is empty, we don't need to do anything
    if (!searchText.trim()) {
      return;
    }

    try {
      // Split search into individual terms for multi-word search
      const searchTerms = searchText
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 0);

      // Process each search term separately for better multi-word matches
      for (const term of searchTerms) {
        // Escape special regex characters to prevent errors
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedTerm, 'gi'); // 'gi' for global, case-insensitive

        this.highlightTextNodes(rootElement, regex);
      }

      // Move to first match if available
      if (this.markedElements.length > 0) {
        this.currentIndex = 0;
        this.updateHighlight();
      }
    } catch (error) {
      console.error('Error during search highlighting:', error);
    }
  }

  private highlightTextNodes(element: HTMLElement, regex: RegExp): void {
    // Skip script and style elements
    if (
      !element ||
      ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(element.tagName)
    ) {
      return;
    }

    // We need to create a static copy of childNodes because the DOM will be modified
    const childNodes = Array.from(element.childNodes);

    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;

        if (text && text.trim() && regex.test(text)) {
          // Reset regex lastIndex
          regex.lastIndex = 0;

          // Create a wrapper span
          const span = document.createElement('span');
          span.classList.add('search-highlight-wrapper');

          // Replace matches with highlighted marks
          span.innerHTML = text.replace(
            regex,
            (match) =>
              `<mark class="highlight" data-original-text="${match}">${match}</mark>`
          );

          if (span.innerHTML !== text) {
            // Replace the text node with our span containing highlighted text
            if (node.parentNode) {
              node.parentNode.replaceChild(span, node);
            }

            // Collect all the new highlight elements
            const newHighlights = Array.from(
              span.querySelectorAll('.highlight') as NodeListOf<HTMLElement>
            );

            this.markedElements.push(...newHighlights);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip elements that already have highlights (to prevent double-highlighting)
        if (
          !(node as HTMLElement).classList?.contains('highlight') &&
          !(node as HTMLElement).classList?.contains('search-highlight-wrapper')
        ) {
          // Recursively process element nodes
          this.highlightTextNodes(node as HTMLElement, regex);
        }
      }
    }
  }

  navigateHighlight(next: boolean): void {
    if (this.markedElements.length === 0) return;

    this.clearActiveHighlight();

    if (next) {
      this.currentIndex = (this.currentIndex + 1) % this.markedElements.length;
    } else {
      this.currentIndex =
        (this.currentIndex - 1 + this.markedElements.length) %
        this.markedElements.length;
    }

    this.updateHighlight();
  }

  private updateHighlight(): void {
    if (this.markedElements[this.currentIndex]) {
      this.renderer.addClass(
        this.markedElements[this.currentIndex],
        'active-highlight'
      );
      this.markedElements[this.currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  private clearActiveHighlight(): void {
    this.markedElements.forEach((el) =>
      this.renderer.removeClass(el, 'active-highlight')
    );
  }

  clearHighlights(): void {
    // First remove active highlights
    this.clearActiveHighlight();

    // Get all wrapper spans in the document
    const wrappers = document.querySelectorAll('.search-highlight-wrapper');

    wrappers.forEach((wrapper) => {
      if (wrapper.parentNode) {
        // Create a text node with all the original text content
        const textContent = wrapper.textContent || '';
        const textNode = document.createTextNode(textContent);

        // Replace the wrapper with the original text
        wrapper.parentNode.replaceChild(textNode, wrapper);
      }
    });

    // Reset our tracking arrays and indexes
    this.markedElements = [];
    this.currentIndex = -1;
  }
}
