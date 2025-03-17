import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHighlightService } from './service/search.service';
import { ChildListComponent } from './child/child-list/child-list.component';
import { ChildParagraphComponent } from './child/child-paragraph/child-paragraph.component';
import { ChildTableComponent } from './child/child-table/child-table.component';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    FormsModule,
    ChildListComponent,
    ChildParagraphComponent,
    ChildTableComponent,
  ],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
})
export class GlobalSearchComponent {
  // searchQuery: string = '';
  // @ViewChild('content', { static: true }) contentRef!: ElementRef;

  // constructor(private searchService: SearchHighlightService) {}

  // onSearch(): void {
  //   this.searchService.searchAndHighlight(
  //     this.searchQuery,
  //     this.contentRef.nativeElement
  //   );
  // }

  // onKeydown(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     this.searchService.navigateHighlight(true);
  //   }
  // }

  // clearSearch(): void {
  //   this.searchQuery = '';
  //   this.searchService.clearHighlights();
  // }

  searchQuery: string = '';
  searchService = inject(SearchHighlightService);
  @ViewChild('content', { static: true }) contentRef!: ElementRef;

  onSearch(): void {
    // Clear highlights if search query is empty
    if (!this.searchQuery.trim()) {
      this.clearSearch();
      return;
    }

    this.searchService.searchAndHighlight(
      this.searchQuery,
      this.contentRef.nativeElement
    );
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      // If there's a search query, navigate to next highlight
      if (this.searchQuery.trim()) {
        this.searchService.navigateHighlight(true);
      }
    } else if (event.key === 'Escape') {
      // Clear search on Escape key
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchService.clearHighlights();
  }
}
