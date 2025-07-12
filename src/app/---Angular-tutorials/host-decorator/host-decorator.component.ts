import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSectionComponent } from "./form-section/form-section.component";

@Component({
  selector: 'app-host-decorator',
  imports: [ReactiveFormsModule, FormSectionComponent],
  templateUrl: './host-decorator.component.html',
  styleUrl: './host-decorator.component.scss'
})
export class HostDecoratorComponent {

  registrationForm: FormGroup;
  private _fb = inject(FormBuilder)

  constructor() {
    this.registrationForm = this._fb.group({
      personalInfo: this._fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthDate: ['']
      }),
      contactInfo: this._fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        address: ['']
      })
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form submitted with:', this.registrationForm.value);
    }
  }

}


