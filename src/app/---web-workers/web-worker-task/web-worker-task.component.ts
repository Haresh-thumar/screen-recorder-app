import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-web-worker-task',
    imports: [],
    templateUrl: './web-worker-task.component.html',
    styleUrl: './web-worker-task.component.scss'
})
export class WebWorkerTaskComponent {
  @ViewChild('originalCanvas', { static: true })
  originalCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('processedCanvas', { static: true })
  processedCanvas!: ElementRef<HTMLCanvasElement>;

  private worker: Worker | undefined;
  private originalImageData: ImageData | null = null;

  imageLoaded = false;
  processing = false;

  ngOnInit() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('./image-process.worker', import.meta.url)
      );

      this.worker.onmessage = ({ data }) => {
        const { type, imageData } = data;

        if (type === 'processed') {
          this.renderProcessedImage(imageData);
          this.processing = false;
        }
      };
    } else {
      console.error('Web Workers are not supported in this environment');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.setupCanvases(img);
          this.imageLoaded = true;
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  setupCanvases(img: HTMLImageElement) {
    // Configure original canvas
    const origCtx = this.originalCanvas.nativeElement.getContext('2d');
    this.originalCanvas.nativeElement.width = img.width;
    this.originalCanvas.nativeElement.height = img.height;
    origCtx?.drawImage(img, 0, 0);

    // Store original image data
    this.originalImageData =
      origCtx?.getImageData(0, 0, img.width, img.height) || null;

    // Configure processed canvas
    const procCanvas = this.processedCanvas.nativeElement;
    procCanvas.width = img.width;
    procCanvas.height = img.height;

    // Clear any previous processed image
    const procCtx = procCanvas.getContext('2d');
    procCtx?.clearRect(0, 0, procCanvas.width, procCanvas.height);

    // Initial display of original on both canvases
    if (this.originalImageData) {
      procCtx?.putImageData(this.originalImageData, 0, 0);
    }
  }

  applyFilter(filterType: string) {
    if (!this.worker || !this.originalImageData) return;

    this.processing = true;

    // Send image data to worker for processing
    this.worker.postMessage({
      type: 'process',
      imageData: this.originalImageData,
      filter: filterType,
    });
  }

  renderProcessedImage(processedImageData: ImageData) {
    const procCtx = this.processedCanvas.nativeElement.getContext('2d');
    if (procCtx) {
      procCtx.putImageData(processedImageData, 0, 0);
    }
  }

  ngOnDestroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
  }
}
