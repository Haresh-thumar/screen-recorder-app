import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { multiFieldUniqueValidator } from './unique-select-advanced.validator';

@Component({
  selector: 'app-unique-validator-formarray',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './unique-validator-formarray.html',
  styleUrl: './unique-validator-formarray.scss',
})
export class UniqueValidatorFormarray {
  private fb = inject(FormBuilder);

  userOptions = [
    { id: 1, name: 'Haresh' },
    { id: 2, name: 'Ravi' },
    { id: 3, name: 'Nirav' },
  ];

  roleOptions = [
    { id: 10, name: 'Admin' },
    { id: 11, name: 'Manager' },
    { id: 12, name: 'Staff' },
  ];

  form = this.fb.group({
    rows: this.fb.array(
      [],
      multiFieldUniqueValidator(['userId', 'roleId', 'code'])
    ),
  });

  get rowsArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      userId: ['', Validators.required],
      roleId: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  addRow() {
    this.rowsArray.push(this.createRow());
    // force validation (important so new row isn't seen as duplicate incorrectly)
    this.rowsArray.updateValueAndValidity();
  }

  removeRow(i: number) {
    this.rowsArray.removeAt(i);
    this.rowsArray.updateValueAndValidity();
  }

  // helper for debugging
  debug() {
    console.log('form value', this.form.value);
    console.log('form errors', this.form.errors);
    console.log(
      'rows errors',
      this.rowsArray.controls.map((c) => c.errors)
    );
  }
}
