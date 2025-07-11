import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse-img-pdf',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './browse-img-pdf.component.html',
  styleUrl: './browse-img-pdf.component.scss',
})
export class BrowseImgPdfComponent {
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isGenerating: boolean = false;
  errorMessage: string = '';

  async onFileSelected(event: Event): Promise<void> {
    try {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        const files = Array.from(input.files);
        for (const file of files) {
          if (file.type.startsWith('image/')) {
            this.selectedFiles.push(file);
            await this.createImagePreview(file);
          }
        }
      }
    } catch (error) {
      this.errorMessage = 'Error loading images. Please try again.';
      console.error('Error in onFileSelected:', error);
    }
  }

  private createImagePreview(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          this.previewUrls.push(e.target.result);
          resolve();
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  async convertToPdf(): Promise<void> {
    if (this.isGenerating) return;

    this.isGenerating = true;
    this.errorMessage = '';

    try {
      // Create a reusable canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Process images sequentially to avoid memory issues
      const processedImages: ProcessedImage[] = [];
      for (const file of this.selectedFiles) {
        const processedImage = await this.processImage(file, canvas, ctx);
        processedImages.push(processedImage);
      }

      // Generate PDF
      const pdfBytes = await this.generatePdf(processedImages);

      // Clean up processed images to free memory
      processedImages.length = 0;

      // Download the PDF
      this.downloadPdf(pdfBytes);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      this.errorMessage =
        'Error generating PDF. Please try again with fewer or smaller images.';
    } finally {
      this.isGenerating = false;
    }
  }

  private async processImage(
    file: File,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate dimensions (max 1500px)
          let width = img.width;
          let height = img.height;
          const maxSize = 1500;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height / width) * maxSize);
              width = maxSize;
            } else {
              width = Math.round((width / height) * maxSize);
              height = maxSize;
            }
          }

          // Set canvas size
          canvas.width = width;
          canvas.height = height;

          // Draw image
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with fixed quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const base64Data = dataUrl.split(',')[1];
          const binaryData = atob(base64Data);
          const imageData = new Uint8Array(binaryData.length);

          for (let i = 0; i < binaryData.length; i++) {
            imageData[i] = binaryData.charCodeAt(i);
          }

          resolve({
            width,
            height,
            data: imageData,
          });

          // Clean up
          URL.revokeObjectURL(img.src);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async generatePdf(images: ProcessedImage[]): Promise<Uint8Array> {
    // PDF structure arrays
    const parts: (string | Uint8Array)[] = [];
    const offsets: number[] = [];
    let currentOffset = 0;

    // PDF header
    parts.push('%PDF-1.7\n%����\n');
    currentOffset += parts[0].length;

    // Catalog
    offsets.push(currentOffset);
    const catalog = '1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n';
    parts.push(catalog);
    currentOffset += catalog.length;

    // Pages dictionary
    offsets.push(currentOffset);
    const pageRefs = images.map((_, i) => `${3 + i * 3} 0 R`).join(' ');
    const pages = `2 0 obj\n<<\n/Type /Pages\n/Kids [${pageRefs}]\n/Count ${images.length}\n>>\nendobj\n`;
    parts.push(pages);
    currentOffset += pages.length;

    // Process each image
    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      // Page object
      offsets.push(currentOffset);
      const pageObj = `${
        3 + i * 3
      } 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/XObject <<\n/Im${i} ${
        4 + i * 3
      } 0 R\n>>\n>>\n/MediaBox [0 0 595 842]\n/Contents ${
        5 + i * 3
      } 0 R\n>>\nendobj\n`;
      parts.push(pageObj);
      currentOffset += pageObj.length;

      // Image object
      offsets.push(currentOffset);
      const imgObj = `${
        4 + i * 3
      } 0 obj\n<<\n/Type /XObject\n/Subtype /Image\n/Width ${
        img.width
      }\n/Height ${
        img.height
      }\n/ColorSpace /DeviceRGB\n/BitsPerComponent 8\n/Filter /DCTDecode\n/Length ${
        img.data.length
      }\n>>\nstream\n`;
      parts.push(imgObj);
      currentOffset += imgObj.length;

      parts.push(img.data);
      currentOffset += img.data.length;

      const imgObjEnd = '\nendstream\nendobj\n';
      parts.push(imgObjEnd);
      currentOffset += imgObjEnd.length;

      // Calculate image positioning
      const scale = Math.min(595 / img.width, 842 / img.height);
      const scaledWidth = Math.round(img.width * scale);
      const scaledHeight = Math.round(img.height * scale);
      const x = Math.round((595 - scaledWidth) / 2);
      const y = Math.round((842 - scaledHeight) / 2);

      // Content stream
      offsets.push(currentOffset);
      const content = `${5 + i * 3} 0 obj\n<<\n/Length ${
        44 +
        String(scaledWidth).length +
        String(scaledHeight).length +
        String(x).length +
        String(y).length
      }\n>>\nstream\nq\n${scaledWidth} 0 0 ${scaledHeight} ${x} ${y} cm\n/Im${i} Do\nQ\nendstream\nendobj\n`;
      parts.push(content);
      currentOffset += content.length;
    }

    // XRef
    const xrefOffset = currentOffset;
    const xref = this.createXref(offsets);
    parts.push(xref);

    // Trailer
    parts.push(
      `trailer\n<<\n/Size ${
        offsets.length + 1
      }\n/Root 1 0 R\n>>\nstartxref\n${xrefOffset}\n%%EOF`
    );

    // Combine all parts
    const totalLength = parts.reduce(
      (sum, part) =>
        sum +
        (part instanceof Uint8Array
          ? part.length
          : new TextEncoder().encode(part).length),
      0
    );

    const result = new Uint8Array(totalLength);
    let position = 0;

    for (const part of parts) {
      if (part instanceof Uint8Array) {
        result.set(part, position);
        position += part.length;
      } else {
        const bytes = new TextEncoder().encode(part);
        result.set(bytes, position);
        position += bytes.length;
      }
    }

    return result;
  }

  private createXref(offsets: number[]): string {
    let xref = 'xref\n';
    xref += `0 ${offsets.length + 1}\n`;
    xref += '0000000000 65535 f \n';

    for (const offset of offsets) {
      xref += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    }

    return xref;
  }

  private downloadPdf(pdfData: Uint8Array): void {
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-images.pdf';
    link.click();
    URL.revokeObjectURL(url);
  }
}

interface ProcessedImage {
  width: number;
  height: number;
  data: Uint8Array;
}
