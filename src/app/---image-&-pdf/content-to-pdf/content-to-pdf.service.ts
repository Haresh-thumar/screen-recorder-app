import { ElementRef, Injectable, ViewChild } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContentToPDFService {
  @ViewChild('htmlContent') htmlContent!: ElementRef;

  async convertToPDF() {
    try {
      // First convert content to SVG
      const svgContent = await this.generateSVG();

      // A4 dimensions in pixels (assuming 96 DPI)
      const a4Width = 795; // 210mm = 8.27in = 793.7px
      const a4Height = 1123; // 297mm = 11.69in = 1122.5px

      // Create a canvas for rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }
      7;
      // Load SVG into an image
      const img = new Image();
      const svgBlob = new Blob([svgContent], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Calculate number of pages needed
            const totalHeight = img.height;
            const numPages = Math.ceil(totalHeight / (a4Height - 40)); // 40px margin

            // Initialize PDF document content
            let pdfContent = '';

            // Process each page
            for (let page = 0; page < numPages; page++) {
              // Set canvas size to A4
              canvas.width = a4Width;
              canvas.height = a4Height;

              // Clear canvas and set white background
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              // Calculate source and destination dimensions
              const srcHeight = Math.min(
                a4Height - 40,
                totalHeight - page * (a4Height - 40)
              );
              const srcY = page * (a4Height - 40);

              // Draw portion of SVG for this page
              ctx.drawImage(
                img,
                0,
                srcY,
                img.width,
                srcHeight,
                20,
                20,
                a4Width - 40,
                srcHeight
              );

              // Convert canvas to base64 image
              const pageData = canvas.toDataURL('image/jpeg', 1.0);

              // Add page to PDF content
              if (page > 0) {
                pdfContent += '\n';
              }
              pdfContent += pageData;
            }

            // Generate PDF
            this.generatePDF(pdfContent, numPages);

            // Cleanup
            URL.revokeObjectURL(svgUrl);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Failed to load SVG image'));
        };

        img.src = svgUrl;
      });
    } catch (error) {
      console.error('PDF Conversion Error:', error);
      alert('Failed to convert to PDF. Please try again.');
    }
  }

  private generatePDF(pagesContent: string, numPages: number): void {
    // Split pages content into array
    const pages = pagesContent.split('\n');

    // Create PDF document content
    let docDefinition = '';
    docDefinition += '%PDF-1.7\n';

    // Add pages
    let objectNumber = 1;
    const objects: any[] = [];

    // Create page objects
    pages.forEach((pageData, index) => {
      // Create image object
      const imageObj = {
        num: objectNumber++,
        data: pageData,
        width: 795,
        height: 1123,
      };
      objects.push(imageObj);

      // Create page object
      const pageObj = {
        num: objectNumber++,
        imageObj: imageObj.num,
      };
      objects.push(pageObj);
    });

    // Write objects to document
    let offset = docDefinition.length;
    const xref: number[] = [];

    objects.forEach((obj) => {
      xref[obj.num] = offset;
      docDefinition += `${obj.num} 0 obj\n`;

      if ('data' in obj) {
        // Image object
        docDefinition += `<<\n/Type /XObject\n/Subtype /Image\n/Width ${obj.width}\n/Height ${obj.height}\n/ColorSpace /DeviceRGB\n/BitsPerComponent 8\n/Filter /DCTDecode\n/Length ${obj.data.length}\n>>\nstream\n${obj.data}\nendstream\n`;
      } else {
        // Page object
        docDefinition += `<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/XObject <<\n/Im${
          obj.imageObj
        } ${
          obj.imageObj
        } 0 R\n>>\n>>\n/MediaBox [0 0 595.276 841.89]\n/Contents ${
          obj.num + 1
        } 0 R\n>>\n`;
      }

      docDefinition += 'endobj\n';
      offset = docDefinition.length;
    });

    // Write xref table
    const xrefOffset = docDefinition.length;
    docDefinition += 'xref\n';
    docDefinition += `0 ${objects.length + 1}\n`;
    docDefinition += '0000000000 65535 f\n';
    xref.forEach((offset) => {
      docDefinition += `${offset.toString().padStart(10, '0')} 00000 n\n`;
    });

    // Write trailer
    docDefinition += 'trailer\n';
    docDefinition += `<<\n/Size ${objects.length + 1}\n/Root 1 0 R\n>>\n`;
    docDefinition += 'startxref\n';
    docDefinition += `${xrefOffset}\n`;
    docDefinition += '%%EOF';

    // Create and download PDF file
    const pdfBlob = new Blob([docDefinition], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = 'nist_tree_detailed.pdf';
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Cleanup
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(pdfUrl);
  }

  private async generateSVG(): Promise<string> {
    const container = this.htmlContent.nativeElement;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const foreignObject = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject'
    );

    const width = container.scrollWidth;
    const actualHeight = container.getBoundingClientRect().height;

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', `${width}px`);
    svg.setAttribute('height', `${actualHeight}px`);
    svg.setAttribute('viewBox', `0 0 ${width} ${actualHeight}`);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = container.innerHTML;
    wrapper.style.cssText = `
    font-family: "Rubik", serif;
    font-size: 9px;
    line-height: 1.2;
    color: #333;
    width: ${width}px;
    min-height: ${actualHeight}px;
    padding: 10px;
    margin: 0;
    box-sizing: border-box;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
  `;

    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.appendChild(wrapper);
    svg.appendChild(foreignObject);

    return new XMLSerializer().serializeToString(svg);
  }
}
