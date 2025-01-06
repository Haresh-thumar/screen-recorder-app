import { Component } from '@angular/core';

@Component({
  selector: 'app-base64-compress',
  standalone: true,
  imports: [],
  templateUrl: './base64-compress.component.html',
  styleUrl: './base64-compress.component.scss',
})
export class Base64CompressComponent {
  files: FileObject[] = [];

  async onFileSelect(event: any): Promise<void> {
    const selectedFiles: FileList = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type.startsWith('image/')) {
        try {
          // First convert to base64
          const originalBase64 = await this.fileToBase64(file);
          // Compress image
          const compressedBase64 = await this.compressImage(originalBase64);
          // Calculate sizes
          const originalSize = this.getBase64Size(originalBase64);
          const compressedSize = this.getBase64Size(compressedBase64);
          // Calculate compression ratio
          const compressionRatio = Math.round(
            ((originalSize - compressedSize) / originalSize) * 100
          );
          this.files.push({
            fileName: file.name,
            fileSize: this.formatFileSize(file.size),
            originalSize: originalSize,
            compressedSize: compressedSize,
            originalBase64: originalBase64,
            compressedBase64: compressedBase64,
            blobFile: file,
            id: this.generateUniqueId(),
            compressionRatio: compressionRatio.toString(),
          });
          console.log('files', this.files);
        } catch (error) {
          console.error('Error processing file:', file.name, error);
        }
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private compressImage(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        const maxSize = 800;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        // Apply image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        // Convert to compressed base64
        // Adjust quality (0.5 = 50% quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
        resolve(compressedBase64);
      };
      img.src = base64;
    });
  }

  private getBase64Size(base64: string): number {
    const base64Length = base64.length - (base64.indexOf(',') + 1);
    const padding =
      base64.charAt(base64.length - 2) === '='
        ? 2
        : base64.charAt(base64.length - 1) === '='
        ? 1
        : 0;
    return base64Length * 0.75 - padding;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private generateUniqueId(): string {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  removeFile(id: string): void {
    this.files = this.files.filter((file) => file.id !== id);
  }
}

interface FileObject {
  fileName: string;
  fileSize: string;
  originalSize: number;
  compressedSize: number;
  originalBase64: string;
  compressedBase64: string;
  blobFile: File;
  id: string;
  compressionRatio: string;
}
