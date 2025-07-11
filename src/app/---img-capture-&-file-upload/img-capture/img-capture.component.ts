import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamModule } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-img-capture',
    imports: [WebcamModule, NgStyle],
    templateUrl: './img-capture.component.html',
    styleUrl: './img-capture.component.scss'
})
export class ImgCaptureComponent {
  // Standard photo dimensions (12 inch × 18 inch at 300 DPI)
  readonly PHOTO_WIDTH = 3600; // 12 inches * 300 DPI
  readonly PHOTO_HEIGHT = 5400; // 18 inches * 300 DPI

  // Preview dimensions
  width = 450; // Preview width
  height = 675; // Preview height (maintains aspect ratio)

  capturedImageUrl: string | null = null;
  savedImages: CapturedImage[] = [];
  isSaving = false;

  // Webcam configuration
  showWebcam = true;
  facingMode: 'user' | 'environment' = 'user';
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();

  // Image transformation states
  scale = 1;
  rotation = 0;
  horizontalFlip = false;
  verticalFlip = false;

  webcamConfig = {
    width: this.width,
    height: this.height,
    imageQuality: 1,
    imageType: 'image/jpeg',
  };

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  async handleImage(webcamImage: WebcamImage) {
    // Convert base64 to blob
    const response = await fetch(webcamImage.imageAsDataUrl);
    const blob = await response.blob();

    // Create high-quality image maintaining aspect ratio
    const img = new Image();
    img.src = webcamImage.imageAsDataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.PHOTO_WIDTH;
        canvas.height = this.PHOTO_HEIGHT;
        const ctx = canvas.getContext('2d')!;

        // Calculate scaling to maintain aspect ratio
        const scale = Math.min(
          this.PHOTO_WIDTH / img.width,
          this.PHOTO_HEIGHT / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image
        const x = (this.PHOTO_WIDTH - scaledWidth) / 2;
        const y = (this.PHOTO_HEIGHT - scaledHeight) / 2;

        // Draw image maintaining aspect ratio
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        canvas.toBlob(
          (newBlob) => {
            if (newBlob) {
              this.capturedImageUrl = URL.createObjectURL(newBlob);
            }
          },
          'image/jpeg',
          1.0
        );

        resolve();
      };
    });
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  async switchCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
  }

  captureImage(): void {
    this.trigger.next();
  }

  getImageTransformStyle() {
    return {
      transform: `scale(${this.scale}) rotate(${this.rotation}deg) scaleX(${
        this.horizontalFlip ? -1 : 1
      }) scaleY(${this.verticalFlip ? -1 : 1})`,
    };
  }

  zoomIn() {
    this.scale = Math.min(this.scale + 0.1, 3);
  }

  zoomOut() {
    this.scale = Math.max(this.scale - 0.1, 0.5);
  }

  rotate() {
    this.rotation = (this.rotation + 90) % 360;
  }

  flipHorizontal() {
    this.horizontalFlip = !this.horizontalFlip;
  }

  flipVertical() {
    this.verticalFlip = !this.verticalFlip;
  }

  clearImage() {
    if (this.capturedImageUrl) {
      URL.revokeObjectURL(this.capturedImageUrl);
    }
    this.capturedImageUrl = null;
    this.resetTransformations();
  }

  resetTransformations() {
    this.scale = 1;
    this.rotation = 0;
    this.horizontalFlip = false;
    this.verticalFlip = false;
  }

  async saveImage() {
    if (!this.capturedImageUrl || this.isSaving) return;

    this.isSaving = true;

    try {
      const response = await fetch(this.capturedImageUrl);
      const blob = await response.blob();

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.PHOTO_WIDTH;
      tempCanvas.height = this.PHOTO_HEIGHT;

      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error('Could not get canvas context');

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = this.capturedImageUrl!;
      });

      const centerX = tempCanvas.width / 2;
      const centerY = tempCanvas.height / 2;

      tempCtx.translate(centerX, centerY);
      tempCtx.rotate((this.rotation * Math.PI) / 180);
      tempCtx.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
      tempCtx.drawImage(
        img,
        -this.PHOTO_WIDTH / 2,
        -this.PHOTO_HEIGHT / 2,
        this.PHOTO_WIDTH,
        this.PHOTO_HEIGHT
      );

      const finalBlob = await new Promise<Blob>((resolve, reject) => {
        tempCanvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          1.0
        );
      });

      const fileName = `IMG_${new Date().getTime()}.jpg`;
      const newImage: CapturedImage = {
        id: Date.now(),
        fileName: fileName,
        blob: finalBlob,
        previewUrl: URL.createObjectURL(finalBlob),
        dimensions: {
          width: this.PHOTO_WIDTH,
          height: this.PHOTO_HEIGHT,
        },
      };

      this.savedImages = [...this.savedImages, newImage];
      this.clearImage();
    } catch (err) {
      console.error('Error saving image:', err);
      alert('Error saving image');
    } finally {
      this.isSaving = false;
    }
  }

  deleteImage(id: number) {
    const image = this.savedImages.find((img) => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }
    this.savedImages = this.savedImages.filter((img) => img.id !== id);
  }

  submitImages() {
    const processImages = this.savedImages.map(async (image) => {
      return new Promise<{ fileName: string; base64: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            fileName: image.fileName,
            base64: reader.result as string,
          });
        };
        reader.readAsDataURL(image.blob);
      });
    });

    Promise.all(processImages).then((results) => {
      console.log('Images ready for submission:', results);
      // Handle your submission logic here
    });
  }

  ngOnDestroy() {
    this.savedImages.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });
    if (this.capturedImageUrl) {
      URL.revokeObjectURL(this.capturedImageUrl);
    }
  }
}

interface CapturedImage {
  id: number;
  fileName: string;
  blob: Blob;
  previewUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
}
