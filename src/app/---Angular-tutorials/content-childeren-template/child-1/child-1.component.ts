import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child-1',
  imports: [],
  templateUrl: './child-1.component.html',
  styleUrl: './child-1.component.scss',
})
export class Child1Component {
  @Input() name = '';
}
