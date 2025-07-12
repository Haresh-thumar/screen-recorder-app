import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { HighlightFormFieldDirective } from './highlight-form-field.directive';

@Component({
  selector: 'app-host-directive-example',
  imports: [ReactiveFormsModule, HighlightFormFieldDirective],
  templateUrl: './host-directive-example.component.html',
  styleUrl: './host-directive-example.component.scss',
  providers: [NgForm]
})
export class HostDirectiveExampleComponent {

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form submitted with:', this.registrationForm.value);
    } else {
      // Mark all fields as touched to trigger validation visuals
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();
      });
    }
  }

}
