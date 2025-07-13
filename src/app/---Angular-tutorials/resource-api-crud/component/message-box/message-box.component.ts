import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-box',
  imports: [NgClass],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss'
})
export class MessageBoxComponent {

  @Input() isVisible: boolean = false;
  @Input() title: string = 'Message';
  @Input() message: string = '';
  @Input() showConfirm: boolean = false;
  @Output() confirmed = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit(true);
    this.isVisible = false;
  }

  onClose(): void {
    this.closed.emit();
    this.isVisible = false;
  }

}
