import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reuse-template',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './reuse-template.component.html',
  styleUrl: './reuse-template.component.scss',
})
export class ReuseTemplateComponent {}
