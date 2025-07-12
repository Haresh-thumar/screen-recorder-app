import { Component, ContentChildren, QueryList } from '@angular/core';
import { Child1Component } from './child-1/child-1.component';

@Component({
  selector: 'app-content-childeren-template',
  imports: [],
  templateUrl: './content-childeren-template.component.html',
  styleUrl: './content-childeren-template.component.scss',
})
export class ContentChilderenTemplateComponent {
  @ContentChildren(Child1Component) children!: QueryList<Child1Component>;

  ngAfterContentInit() {
    console.log('Children Components:', this.children.toArray());
  }
}
