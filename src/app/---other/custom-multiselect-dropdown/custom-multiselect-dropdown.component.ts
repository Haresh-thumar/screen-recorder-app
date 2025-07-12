import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';

@Component({
  selector: 'app-custom-multiselect-dropdown',
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, MultiSelectDropdownComponent],
  templateUrl: './custom-multiselect-dropdown.component.html',
  styleUrl: './custom-multiselect-dropdown.component.scss'
})
export class CustomMultiselectDropdownComponent {

  // Reactive Form
  reactiveForm: FormGroup;

  // Template-Driven Form
  templateDrivenSelectedItems: any[] = [];

  // Common options for both forms
  dropdownOptions = [
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
    { id: 4, label: 'Dragonfruit' },
    { id: 5, label: 'Elderberry' },
    { id: 6, label: 'Fig' },
    { id: 7, label: 'Grape' },
    { id: 8, label: 'Honeydew' },
  ];

  constructor(private fb: FormBuilder) {
    // Initialize reactive form
    this.reactiveForm = this.fb.group({
      selectedItems: [[]], // Initialize with empty array
    });
  }

  ngOnInit() {
    // You can set initial values if needed
    // For reactive form
    this.reactiveForm.get('selectedItems')?.setValue([1, 3]); // Set initial values by IDs

    // For template-driven form
    this.templateDrivenSelectedItems = [2, 5]; // Set initial values by IDs
  }

  // Reactive form change handler
  onReactiveFormChange(selectedItems: any[]) {
    console.log('Reactive form selected items:', selectedItems);
    // Additional logic if needed
  }

  // Template-driven form change handler
  onTemplateDrivenChange(selectedItems: any[]) {
    console.log('Template-driven form selected items:', selectedItems);
    // Additional logic if needed
  }

}
