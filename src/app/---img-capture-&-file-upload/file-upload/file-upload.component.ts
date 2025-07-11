import { Component } from '@angular/core';

@Component({
    selector: 'app-file-upload',
    imports: [],
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  uploadedFiles: UploadedFile[] = [];
  private maxFileSize = 1024 * 1024; // 1MB in bytes

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        if (this.validateFile(file)) {
          this.processFile(file);
        }
      });
    }
  }

  validateFile(file: File): boolean {
    if (file.size > this.maxFileSize) {
      alert(`File ${file.name} is too large. Maximum size is 1MB`);
      return false;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert(
        `File ${file.name} is not a supported format. Please upload JPG, PNG or PDF files only`
      );
      return false;
    }

    return true;
  }

  processFile(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile: UploadedFile = {
          ecounterServiceId: Math.floor(Math.random() * 100000),
          fileName: file.name,
          fileBlobObjects: file,
          preview: reader.result,
        };
        this.uploadedFiles = [...this.uploadedFiles, newFile];
        console.log('image :', this.uploadedFiles);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF files
      const newFile: UploadedFile = {
        ecounterServiceId: Math.floor(Math.random() * 100000),
        fileName: file.name,
        fileBlobObjects: file,
        preview: null,
      };
      this.uploadedFiles = [...this.uploadedFiles, newFile];
      console.log('pdf :', this.uploadedFiles);
    }
  }

  removeFile(id: number): void {
    this.uploadedFiles = this.uploadedFiles.filter(
      (file) => file.ecounterServiceId !== id
    );
  }
}

interface UploadedFile {
  ecounterServiceId: number;
  fileName: string;
  fileBlobObjects: any;
  preview?: string | ArrayBuffer | null;
}
