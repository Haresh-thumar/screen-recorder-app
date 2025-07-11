import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appZoomClass]',
})
export class ZoomClassDirective implements OnInit, OnDestroy {
  @Input() zoomLevel110?: string;
  @Input() zoomLevel125?: string;
  @Input() zoomLevel150?: string;
  @Input() zoomLevel175?: string;
  @Input() zoomLevel200?: string;

  private destroy$ = new Subject<void>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(startWith(null), debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        const zoomPercent = Math.round(window.devicePixelRatio * 100);
        this.applyZoomClass(zoomPercent);
      });
  }

  private applyZoomClass(zoomLevel: number): void {
    const target = this.el.nativeElement;

    // First remove all zoom-related classes
    this.removeAllZoomClasses(target);

    // Then add the appropriate class based on zoom level
    let zoomClass = '';

    if (zoomLevel >= 200 && this.zoomLevel200) {
      zoomClass = this.zoomLevel200;
    } else if (zoomLevel >= 175 && this.zoomLevel175) {
      zoomClass = this.zoomLevel175;
    } else if (zoomLevel >= 150 && this.zoomLevel150) {
      zoomClass = this.zoomLevel150;
    } else if (zoomLevel >= 125 && this.zoomLevel125) {
      zoomClass = this.zoomLevel125;
    } else if (zoomLevel >= 110 && this.zoomLevel110) {
      zoomClass = this.zoomLevel110;
    }

    if (zoomClass) {
      this.renderer.addClass(target, zoomClass);
    }
  }

  private removeAllZoomClasses(target: any): void {
    const classesToRemove = Array.from(target.classList).filter(
      (cls: any) =>
        (this.zoomLevel110 && cls === this.zoomLevel110) ||
        (this.zoomLevel125 && cls === this.zoomLevel125) ||
        (this.zoomLevel150 && cls === this.zoomLevel150) ||
        (this.zoomLevel175 && cls === this.zoomLevel175) ||
        (this.zoomLevel200 && cls === this.zoomLevel200)
    );

    classesToRemove.forEach((cls: any) =>
      this.renderer.removeClass(target, cls)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
