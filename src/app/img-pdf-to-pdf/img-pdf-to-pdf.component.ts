import { Component, inject } from '@angular/core';
import { ImgPdfToPdfService } from './service/img-pdf-to-pdf.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FileItem } from './service/file-upload.model';

@Component({
  selector: 'app-img-pdf-to-pdf',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './img-pdf-to-pdf.component.html',
  styleUrl: './img-pdf-to-pdf.component.scss',
})
export class ImgPdfToPdfComponent {
  private pdfService = inject(ImgPdfToPdfService);
  fileItems: FileItem[] = [];
  isLoading = false;
  acceptedFileTypes = '.jpg,.jpeg,.png,.pdf';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];

        // Check if file type is allowed
        if (this.isFileTypeAllowed(file)) {
          const fileItem = new FileItem(file);
          this.fileItems.push(fileItem);
        } else {
          alert(
            `File "${file.name}" is not an allowed file type. Please upload only JPG, JPEG, PNG or PDF files.`
          );
        }
      }

      // Reset the input so the same file can be selected again
      input.value = '';
    }
  }

  isFileTypeAllowed(file: File): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    return allowedTypes.includes(file.type);
  }

  deleteFile(id: string): void {
    const index = this.fileItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(this.fileItems[index].url);
      this.fileItems.splice(index, 1);
    }
  }

  toggleSelection(id: string): void {
    const fileItem = this.fileItems.find((item) => item.id === id);
    if (fileItem) {
      fileItem.selected = !fileItem.selected;
    }
  }

  get selectedFiles(): FileItem[] {
    return this.fileItems.filter((item) => item.selected);
  }

  async convertToPdf(): Promise<void> {
    if (this.selectedFiles.length === 0) {
      alert('Please select at least one file to convert.');
      return;
    }

    this.isLoading = true;
    try {
      const pdfBlob = await this.pdfService.generatePdf(this.selectedFiles);

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted-files.pdf';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again with different files.');
    } finally {
      this.isLoading = false;
    }
  }
}
