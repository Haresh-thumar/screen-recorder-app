import {
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Dynamic1Component } from './dynamic/dynamic-1.component';
import { Dynamic2Component } from './dynamic/dynamic-2.component';
import { Dynamic3Component } from './dynamic/dynamic-3.commponent';

@Component({
  selector: 'app-dynamic-component',
  imports: [],
  templateUrl: './dynamic-component.component.html',
  styleUrl: './dynamic-component.component.scss',
})
export class DynamicComponentComponent {
  /*--------- Example 1 (Load Component Dynamically) --------*/
  @ViewChild('container1', { read: ViewContainerRef })
  container1!: ViewContainerRef;
  componentRef!: ComponentRef<Dynamic1Component>;
  createComponent1() {
    this.container1.clear(); // Remove previous component
    this.componentRef = this.container1.createComponent(Dynamic1Component);
  }
  destroyComponent1() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  /*--------- Example 2 (Pass Data While Creating Component) --------*/
  @ViewChild('container2', { read: ViewContainerRef })
  container2!: ViewContainerRef;

  createComponent2() {
    this.container2.clear();
    const componentRef = this.container2.createComponent(Dynamic2Component);
    componentRef.instance.message = 'Hello from Parent Component!';
  }

  /*-------- Parent-Component ---------*/
  @ViewChild('container3', { read: ViewContainerRef })
  container3!: ViewContainerRef;
  componentCount = 0;

  addComponent() {
    const componentRef = this.container3.createComponent(Dynamic3Component);
    componentRef.instance.id = ++this.componentCount;
    componentRef.instance.text = `This is component number ${this.componentCount}`;
  }
}
