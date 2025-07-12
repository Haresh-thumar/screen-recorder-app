/*-------- Dynamic-Component ---------*/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-3',
  imports: [],
  template: `<p>Dynamic Component #{{ id }}: {{ text }}</p>`,
  styles: ['p { color: purple; font-weight: bold; }'],
})
export class Dynamic3Component {
  @Input() id!: number;
  @Input() text!: string;
}
