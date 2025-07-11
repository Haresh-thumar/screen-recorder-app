// toastr.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private show(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') {
    const id = Date.now();
    const toast: Toast = { id, title, message, type };
    this.toasts.push(toast);
    this.toastsSubject.next(this.toasts);
    setTimeout(() => this.remove(id), 3000);
    return id;
  }

  success(title: string, message: string): number {
    return this.show(title, message, 'success');
  }

  error(title: string, message: string): number {
    return this.show(title, message, 'error');
  }

  info(title: string, message: string): number {
    return this.show(title, message, 'info');
  }

  warning(title: string, message: string): number {
    return this.show(title, message, 'warning');
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next(this.toasts);
  }
}