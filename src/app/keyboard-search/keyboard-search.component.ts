import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-keyboard-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './keyboard-search.component.html',
  styleUrl: './keyboard-search.component.scss',
})
export class KeyboardSearchComponent {
  showSearchBar = false;
  searchText = '';

  // Listen for Ctrl + H globally
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'h') {
      event.preventDefault(); // Avoid browser conflicts
      this.toggleSearchBar();
    }

    // Also allow escape globally to close if search is open
    if (event.key === 'Escape' && this.showSearchBar) {
      this.closeSearchBar();
    }
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    if (this.showSearchBar) {
      setTimeout(() => {
        const input = document.querySelector(
          '.search-box input'
        ) as HTMLInputElement;
        input?.focus();
      }, 0);
    }
  }

  closeSearchBar() {
    this.showSearchBar = false;
  }

  performSearch() {
    console.log('Searching for:', this.searchText);
    // Your search logic here
    this.closeSearchBar();
  }
}
