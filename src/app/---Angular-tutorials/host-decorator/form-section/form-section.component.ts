import { TitleCasePipe } from '@angular/common';
import { Component, Host, Input, Optional } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../form-validation.service';
import { HostDecoratorComponent } from '../host-decorator.component';

@Component({
  selector: 'app-form-section',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.scss'
})
export class FormSectionComponent {

  @Input() sectionName: string = '';
  sectionForm!: FormGroup<any>;

  constructor(
    @Host() private parentForm: HostDecoratorComponent,
    @Host() @Optional() public validationService: FormValidationService
  ) { }

  ngOnInit() {
    // Access the form group from the parent container using the section name
    if (this.parentForm && this.sectionName) {
      this.sectionForm = this.parentForm.registrationForm.get(this.sectionName) as FormGroup;
    }
  }

  validateSection() {
    if (this.validationService && this.sectionForm) {
      const isValid = this.validationService.validateForm(this.sectionForm);
      if (isValid) {
        console.log(`${this.sectionName} section is valid!`);
      } else {
        console.log(`${this.sectionName} section has errors!`);
        this.markFormGroupTouched(this.sectionForm);
      }
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
