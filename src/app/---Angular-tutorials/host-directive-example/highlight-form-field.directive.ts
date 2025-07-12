
import { Directive, ElementRef, Host, HostListener, inject, Input, Optional, Renderer2 } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';

@Directive({
  selector: '[appHighlightFormField]'
})
export class HighlightFormFieldDirective {

  private el = inject(ElementRef)
  private renderer = inject(Renderer2)
  @Host() @Optional() private formGroupDir = inject(FormGroupDirective)
  @Host() @Optional() private ngForm = inject(NgForm)

  @Input() highlightColor = '#f5f5f5';
  @Input() errorColor = '#fff0f0';
  private originalBackgroundColor: string = '';

  constructor() {
    // Store the original background color
    this.originalBackgroundColor = this.el.nativeElement.style.backgroundColor || '';
  }

  @HostListener('focus')
  onFocus() {
    // Apply highlight when element receives focus
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.highlightColor);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s');
  }

  @HostListener('blur')
  onBlur() {
    // When element loses focus, check if it has errors
    if (this.hasErrors()) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.errorColor);
    } else {
      // Restore original background if no errors
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.originalBackgroundColor);
    }
  }

  private hasErrors(): boolean {
    // Get control name from the element's attributes
    const controlName = this.el.nativeElement.getAttribute('formControlName') ||
      this.el.nativeElement.getAttribute('name');

    if (!controlName) return false;

    // Try to get control from form group directive first
    if (this.formGroupDir && this.formGroupDir.form.get(controlName)) {
      const control = this.formGroupDir.form.get(controlName);
      return control ? (control.invalid && control.touched) : false;
    }

    // If no form group directive, try NgForm
    if (this.ngForm) {
      const control = this.ngForm.form.get(controlName);
      return control ? (control.invalid && control.touched) : false;
    }

    return false;
  }

}
