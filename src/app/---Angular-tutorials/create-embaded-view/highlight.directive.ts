import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appHighlight(condition: boolean) {
    if (condition) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
