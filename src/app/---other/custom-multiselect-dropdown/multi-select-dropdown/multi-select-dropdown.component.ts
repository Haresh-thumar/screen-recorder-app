import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrl: './multi-select-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectDropdownComponent),
      multi: true,
    },
  ],
})
export class MultiSelectDropdownComponent implements ControlValueAccessor, OnInit {
  @Input() options: Array<{ id: string | number; label: string }> = [];
  @Input() placeholder: string = 'Select items';
  @Output() selectionChange = new EventEmitter<Array<{ id: string | number; label: string }>>();

  dropdownOptions: DropdownOption[] = [];
  filteredOptions: DropdownOption[] = [];
  isOpen: boolean = false;
  searchControl = new FormControl('');

  private onChange: any = () => { };
  private onTouched: any = () => { };

  ngOnInit() {
    // Initialize dropdown options
    this.dropdownOptions = this.options.map((option) => ({
      ...option,
      selected: false,
    }));
    this.filteredOptions = [...this.dropdownOptions];

    // Subscribe to search input changes
    this.searchControl.valueChanges.subscribe((term: any) => {
      this.filterOptions(term || '');
    });
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.multiselect-container')) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onTouched();
    }
  }

  filterOptions(searchTerm: string) {
    if (!searchTerm) {
      this.filteredOptions = [...this.dropdownOptions];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredOptions = this.dropdownOptions.filter((option) =>
      option.label.toLowerCase().includes(term)
    );
  }

  toggleOption(option: DropdownOption, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    option.selected = !option.selected;
    this.emitChanges();
  }

  toggleSelectAll() {
    const allSelected = this.allSelected();
    this.dropdownOptions.forEach((option) => {
      option.selected = !allSelected;
    });
    this.filteredOptions = [...this.dropdownOptions];
    this.emitChanges();
  }

  allSelected(): boolean {
    return (
      this.dropdownOptions.length > 0 &&
      this.dropdownOptions.every((option) => option.selected)
    );
  }

  someButNotAllSelected(): boolean {
    const selectedCount = this.dropdownOptions.filter(
      (option) => option.selected
    ).length;
    return selectedCount > 0 && selectedCount < this.dropdownOptions.length;
  }

  getSelectedItems(): DropdownOption[] {
    return this.dropdownOptions.filter((option) => option.selected);
  }

  removeItem(item: DropdownOption, event: Event) {
    event.stopPropagation();
    item.selected = false;
    this.emitChanges();
  }

  getSelectedValues(): Array<{ id: string | number; label: string }> {
    const selectedItems = this.dropdownOptions
      .filter((option) => option.selected)
      .map(({ id, label }) => ({ id, label }));

    // Log the selected objects to console
    console.log('Selected items:', selectedItems);

    return selectedItems;
  }

  emitChanges() {
    const selectedValues = this.getSelectedValues();
    this.onChange(selectedValues.map(item => item.id));
    this.selectionChange.emit(selectedValues);
  }

  // ControlValueAccessor methods
  writeValue(values: Array<string | number>): void {
    if (Array.isArray(values) && this.dropdownOptions.length) {
      this.dropdownOptions.forEach((option) => {
        option.selected = values.includes(option.id);
      });
      this.filteredOptions = [...this.dropdownOptions];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement if needed
  }
}

interface DropdownOption {
  id: string | number;
  label: string;
  selected: boolean;
}