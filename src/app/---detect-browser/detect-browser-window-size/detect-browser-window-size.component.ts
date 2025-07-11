import { Component } from '@angular/core';
import { fromEvent, map, startWith } from 'rxjs';
import { ZoomClassDirective } from './zoom-class.directive';

@Component({
  selector: 'app-detect-browser-window-size',
  imports: [ZoomClassDirective],
  templateUrl: './detect-browser-window-size.component.html',
  styleUrl: './detect-browser-window-size.component.scss',
})
export class DetectBrowserWindowSizeComponent {
  zoomLevel: number = 100;

  ngOnInit(): void {
    this.getZoomLevel().subscribe((level: any) => {
      this.zoomLevel = level;
      console.log('Zoom level:', level + '%');
    });

    this.getZoomLevel().subscribe((level) => {
      this.zoomLevel = level;
      document.body.classList.remove('zoom-100', 'zoom-125', 'zoom-150');
      document.body.classList.add(`zoom-${level}`);
    });
  }

  getZoomLevel() {
    return fromEvent(window, 'resize').pipe(
      startWith(null), // trigger on load
      map(() => {
        const ratio = Math.round(window.devicePixelRatio * 100);
        return ratio; // return zoom level in %
      })
    );
  }
}
