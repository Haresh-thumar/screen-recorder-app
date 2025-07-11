import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToastrService } from './toastr.service';

@Component({
    selector: 'app-toaster',
    templateUrl: './toastr.component.html',
    styleUrls: ['./toastr.component.scss'],
    imports: [NgClass],
    animations: [
        trigger('toastAnimation', [
            transition(':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class ToastrComponent implements OnInit, OnDestroy {
  private toasterService = inject(ToastrService)
  toasts: Toast[] = [];
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.toasterService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeToast(id: number) {
    this.toasterService.remove(id);
  }

}
