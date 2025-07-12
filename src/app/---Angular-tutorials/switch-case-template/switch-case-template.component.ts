import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-switch-case-template',
  imports: [CommonModule],
  templateUrl: './switch-case-template.component.html',
  styleUrl: './switch-case-template.component.scss',
})
export class SwitchCaseTemplateComponent {
  role: string = 'admin';
  userType: string = 'editor';
}
