import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HighlightDirective } from './highlight.directive';

@Component({
  selector: 'app-create-embaded-view',
  imports: [HighlightDirective],
  templateUrl: './create-embaded-view.component.html',
  styleUrl: './create-embaded-view.component.scss',
})
export class CreateEmbadedViewComponent {
  /*-------- Example 1 ---------*/
  @ViewChild('myTemplate') templateRef!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  showTemplate() {
    this.container.createEmbeddedView(this.templateRef);
  }

  /*-------- Example 2 ---------*/
  @ViewChild('greetingTemplate') greetingTemplate!: TemplateRef<any>;
  @ViewChild('containers', { read: ViewContainerRef })
  containers!: ViewContainerRef;

  showGreeting(name: string) {
    this.containers.clear();
    this.containers.createEmbeddedView(this.greetingTemplate, { name: name });
  }

  /*-------- TYPESCRIPT ---------*/
  isVisible = false;

  toggle() {
    this.isVisible = !this.isVisible;
  }
}
