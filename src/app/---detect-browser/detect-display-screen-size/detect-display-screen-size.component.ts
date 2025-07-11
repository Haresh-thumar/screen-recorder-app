import { Component } from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-detect-display-screen-size',
  imports: [],
  templateUrl: './detect-display-screen-size.component.html',
  styleUrl: './detect-display-screen-size.component.scss',
})
export class DetectDisplayScreenSizeComponent {
  currentScale: number = 100;
  isHighDpi: boolean = false;
  private resizeSubscription!: Subscription;

  ngOnInit() {
    this.updateScale();
    // Listen for resize events with debounce
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.updateScale();
      });
  }

  private updateScale() {
    this.currentScale = Math.round((window.devicePixelRatio || 1) * 100);
    this.isHighDpi = window.matchMedia(
      '(min-resolution: 120dpi), (-webkit-min-device-pixel-ratio: 1.25)'
    ).matches;
    console.log('Display scale updated:', this.currentScale + '%');
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
