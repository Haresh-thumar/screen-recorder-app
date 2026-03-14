import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface ConvertedFile {
  name: string;
  url: string;
  loading: boolean;
  file: File;
}

@Component({
  selector: 'app-svg-to-img',
  imports: [CommonModule],
  templateUrl: './svg-to-img.html',
  styleUrl: './svg-to-img.scss',
})
export class SvgToImg {
  convertedFiles: ConvertedFile[] = [];
  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
  }

  processFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (file.type === 'image/svg+xml') {
        const convertedFile: ConvertedFile = {
          name: file.name,
          url: '',
          loading: true,
          file: file,
        };
        this.convertedFiles.push(convertedFile);
        this.convertSvgToPng(convertedFile);
      }
    });
  }

  convertSvgToPng(convertedFile: ConvertedFile) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          convertedFile.url = canvas.toDataURL('image/png');
          convertedFile.loading = false;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(convertedFile.file);
  }

  deleteFile(index: number) {
    this.convertedFiles.splice(index, 1);
  }

  deleteAll() {
    this.convertedFiles = [];
  }

  downloadFile(file: ConvertedFile) {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name.replace('.svg', '.png');
    link.click();
  }

  downloadAll() {
    this.convertedFiles.forEach((file) => {
      if (!file.loading) {
        this.downloadFile(file);
      }
    });
  }
}
