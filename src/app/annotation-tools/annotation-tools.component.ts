import { NgStyle } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-annotation-tools',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './annotation-tools.component.html',
  styleUrl: './annotation-tools.component.scss',
})
export class AnnotationToolsComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  // Standard photo dimensions (12 inch × 18 inch at 300 DPI)
  readonly PHOTO_WIDTH = 3600; // 12 inches * 300 DPI
  readonly PHOTO_HEIGHT = 5400; // 18 inches * 300 DPI

  // Preview dimensions
  width = 450; // Preview width
  height = 675; // Preview height (maintains aspect ratio)

  capturedImageUrl: string | null = null;
  capturedBlob: Blob | null = null;
  savedImages: CapturedImage[] = [];
  currentStream: MediaStream | null = null;
  isCapturing = false;
  isSaving = false;

  // Image transformation states
  scale = 1;
  rotation = 0;
  horizontalFlip = false;
  verticalFlip = false;
  facingMode: 'user' | 'environment' = 'user';

  ngOnInit() {
    this.initializeCamera();
  }

  private readonly constraints = {
    video: {
      facingMode: 'user',
      width: { ideal: this.PHOTO_WIDTH },
      height: { ideal: this.PHOTO_HEIGHT },
    },
  };

  private async initializeCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        this.constraints
      );
      this.currentStream = stream;
      const video = this.videoElement.nativeElement;
      video.srcObject = stream;
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
    } catch (err) {
      console.error('Error initializing camera:', err);
      alert('Error accessing camera');
    }
  }

  async switchCamera() {
    if (this.isCapturing) return;

    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';

    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
    }

    const newConstraints = {
      ...this.constraints,
      video: {
        ...this.constraints.video,
        facingMode: this.facingMode,
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(newConstraints);
      this.currentStream = stream;
      const video = this.videoElement.nativeElement;
      video.srcObject = stream;
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
    } catch (err) {
      console.error('Error switching camera:', err);
      alert('Error switching camera');
    }
  }

  async captureImage() {
    if (this.isCapturing) return;

    this.isCapturing = true;

    try {
      const video = this.videoElement.nativeElement;

      // Create a temporary canvas for capturing at full resolution
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.PHOTO_WIDTH;
      tempCanvas.height = this.PHOTO_HEIGHT;

      const ctx = tempCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Draw the video frame at full resolution
      ctx.drawImage(video, 0, 0, this.PHOTO_WIDTH, this.PHOTO_HEIGHT);

      // Convert to blob with high quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        tempCanvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          1.0 // Maximum quality
        );
      });

      // Store the blob and create URL
      this.capturedBlob = blob;
      if (this.capturedImageUrl) {
        URL.revokeObjectURL(this.capturedImageUrl);
      }
      this.capturedImageUrl = URL.createObjectURL(blob);

      // Reset transformations
      this.resetTransformations();
    } catch (err) {
      alert('Error capturing image');
    } finally {
      this.isCapturing = false;
    }
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
    if (!this.capturedImageUrl || !this.capturedBlob || this.isSaving) return;

    this.isSaving = true;

    try {
      // Create a temporary canvas at full resolution
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.PHOTO_WIDTH;
      tempCanvas.height = this.PHOTO_HEIGHT;

      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error('Could not get canvas context');

      // Load the full resolution image
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = this.capturedImageUrl!;
      });

      // Apply transformations at full resolution
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

      // Create high-quality blob
      const blob = await new Promise<Blob>((resolve, reject) => {
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
        blob: blob,
        previewUrl: URL.createObjectURL(blob),
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
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
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
