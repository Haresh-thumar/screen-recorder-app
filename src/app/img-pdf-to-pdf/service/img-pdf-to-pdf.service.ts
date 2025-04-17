import { Injectable } from '@angular/core';
import { FileItem } from './file-upload.model';

declare const pdfjsLib: any;
declare const jsPDF: any;

@Injectable({
  providedIn: 'root',
})
export class ImgPdfToPdfService {
  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';
  }

  async generatePdf(selectedFiles: FileItem[]): Promise<Blob> {
    const doc = new jsPDF();
    let currentPage = 0;

    try {
      for (const [index, fileItem] of selectedFiles.entries()) {
        if (index > 0) {
          doc.addPage();
          currentPage++;
        }

        if (fileItem.type === 'image') {
          await this.addImageToPdf(doc, fileItem);
        } else if (fileItem.type === 'pdf') {
          await this.addPdfToPdf(doc, fileItem);
        }
      }

      return doc.output('blob');
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  private async addImageToPdf(doc: any, fileItem: FileItem): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          // Calculate dimensions to maintain aspect ratio
          const ratio = Math.min(
            (pageWidth - 20) / img.width,
            (pageHeight - 20) / img.height
          );

          const width = img.width * ratio;
          const height = img.height * ratio;
          const x = (pageWidth - width) / 2;
          const y = (pageHeight - height) / 2;

          doc.addImage(img, 'JPEG', x, y, width, height);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = fileItem.url;
    });
  }

  private async addPdfToPdf(doc: any, fileItem: FileItem): Promise<void> {
    try {
      const pdfBytes = await this.readFileAsArrayBuffer(fileItem.file);
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
      const srcPdf = await loadingTask.promise;

      for (let i = 1; i <= srcPdf.numPages; i++) {
        if (i > 1) {
          doc.addPage();
        }

        const page = await srcPdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for better quality

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imageData = canvas.toDataURL('image/jpeg', 0.9); // High quality JPEG

        // Calculate dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const ratio = Math.min(
          pageWidth / canvas.width,
          pageHeight / canvas.height
        );

        doc.addImage(
          imageData,
          'JPEG',
          0,
          0,
          canvas.width * ratio,
          canvas.height * ratio
        );
      }
    } catch (error) {
      console.error('PDF processing failed:', error);
      throw error;
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}
