import { Component } from '@angular/core';
import { DeferChildComponent } from './defer-child/defer-child.component';

@Component({
  selector: 'app-lazy-loading-defer',
  imports: [DeferChildComponent],
  templateUrl: './lazy-loading-defer.component.html',
  styleUrl: './lazy-loading-defer.component.scss',
})
export class LazyLoadingDeferComponent {
  loadComponent: boolean = false;
}
