import { NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="card">
      <ng-container *ngTemplateOutlet="customTemplate"></ng-container>
    </div>
  `,
  styles: [
    `
      .card {
        border: 1px solid #ccc;
        padding: 16px;
        border-radius: 4px;
      }
    `,
  ],
})
export class CardComponent {
  @Input() customTemplate!: TemplateRef<any>;
}

@Component({
  selector: 'app-dynamic-template',
  imports: [NgTemplateOutlet, CardComponent],
  templateUrl: './dynamic-template.component.html',
  styleUrl: './dynamic-template.component.scss',
})
export class DynamicTemplateComponent {
  status: string = 'success';

  users = [
    { name: 'Haresh', age: 30 },
    { name: 'Vishal', age: 25 },
    { name: 'Jayesh', age: 28 },
  ];
}
