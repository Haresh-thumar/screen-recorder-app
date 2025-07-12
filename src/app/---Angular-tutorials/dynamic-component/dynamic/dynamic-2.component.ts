/*-------- Dynamic-Component ---------*/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-2',
  imports: [],
  template: `<p>Message: {{ message }}</p>`,
  styles: ['p { color: green; font-weight: bold; }'],
})
export class Dynamic2Component {
  @Input() message!: string;
}
