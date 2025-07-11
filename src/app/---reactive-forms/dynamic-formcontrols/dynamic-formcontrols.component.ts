import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
    selector: 'app-dynamic-formcontrols',
    imports: [ReactiveFormsModule, JsonPipe],
    templateUrl: './dynamic-formcontrols.component.html',
    styleUrl: './dynamic-formcontrols.component.scss'
})
export class DynamicFormcontrolsComponent {
  _fb = inject(FormBuilder);
  dynamicForm!: FormGroup;

  ngOnInit() {
    this.dynamicForm = this._fb.group({
      videoList: this._fb.array([]),
    });
    this.addCard(); // Add default card
  }

  get videoList() {
    return this.dynamicForm.get('videoList') as FormArray;
  }

  createCard(): FormGroup {
    return this._fb.group({
      imageUrl: [''],
      title: [''],
      date: [''],
      description: [''],
    });
  }

  addCard() {
    this.videoList.push(this.createCard());
  }

  removeCard(index: number) {
    if (this.videoList.length > 1) {
      this.videoList.removeAt(index);
    }
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      this.dynamicForm.value;
    }
  }

  clearData() {
    this.videoList.reset();
    this.videoList.clear();
    this.addCard();
  }
}
