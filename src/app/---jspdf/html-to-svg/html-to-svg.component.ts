import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-html-to-svg',
  standalone: true,
  imports: [],
  templateUrl: './html-to-svg.component.html',
  styleUrl: './html-to-svg.component.scss',
})
export class HtmlToSvgComponent {
  // @ViewChild('htmlContent') htmlContent!: ElementRef;
  /*-------- Convert HTML to SVG --------*/
  // convertToSVG() {
  //   const container = this.htmlContent.nativeElement;
  //   const width = container.offsetWidth;
  //   const height = container.offsetHeight;
  //   const svgString = this.generateSVG(container, width, height);
  //   const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'converted_content.svg';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // }
  /*-------- Convert HTML to PNG --------*/
  // convertToPNG() {
  //   const container = this.htmlContent.nativeElement;
  //   const width = container.offsetWidth;
  //   const height = container.offsetHeight;
  //   const svgString = this.generateSVG(container, width, height);
  //   const encodedData =
  //     'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  //   const img = new Image();
  //   img.src = encodedData;
  //   img.onload = () => {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = width * 2; // High resolution
  //     canvas.height = height * 2;
  //     const ctx = canvas.getContext('2d');
  //     if (!ctx) {
  //       console.error('Could not get canvas context');
  //       return;
  //     }
  //     ctx.fillStyle = 'white'; // Set white background
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);
  //     ctx.scale(2, 2);
  //     ctx.drawImage(img, 0, 0, width, height);
  //     canvas.toBlob((blob) => {
  //       if (blob) {
  //         const url = URL.createObjectURL(blob);
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.download = 'converted_content.png';
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         URL.revokeObjectURL(url);
  //       }
  //     }, 'image/png');
  //   };
  //   img.onerror = () => {
  //     console.error('Failed to load SVG as image.');
  //   };
  // }
  /*-------- Generate SVG --------*/
  // private generateSVG(
  //   element: HTMLElement,
  //   width: number,
  //   height: number
  // ): string {
  //   const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  //   const foreignObject = document.createElementNS(
  //     'http://www.w3.org/2000/svg',
  //     'foreignObject'
  //   );
  //   const clonedElement = element.cloneNode(true) as HTMLElement;
  //   const wrapper = document.createElement('div');
  //   wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  //   const styleElement = document.createElement('style');
  //   styleElement.textContent = this.getAllStyles();
  //   wrapper.appendChild(styleElement);
  //   wrapper.appendChild(clonedElement);
  //   foreignObject.setAttribute('width', '100%');
  //   foreignObject.setAttribute('height', '100%');
  //   foreignObject.appendChild(wrapper);
  //   svg.setAttribute('width', width.toString());
  //   svg.setAttribute('height', height.toString());
  //   svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  //   svg.appendChild(foreignObject);
  //   return new XMLSerializer().serializeToString(svg);
  // }
  /*-------- Get CSS Styling in DOM --------*/
  // private getAllStyles(): string {
  //   let styles = '';
  //   for (let i = 0; i < document.styleSheets.length; i++) {
  //     try {
  //       const styleSheet = document.styleSheets[i];
  //       if (!styleSheet.cssRules) continue;
  //       for (let j = 0; j < styleSheet.cssRules.length; j++) {
  //         const rule = styleSheet.cssRules[j];
  //         styles += rule.cssText + '\n';
  //       }
  //     } catch (e) {
  //       console.warn('Could not access stylesheet rules', e);
  //     }
  //   }
  //   return styles;
  // }

  @ViewChild('htmlContent') htmlContent!: ElementRef;

  async convertToPNG() {
    try {
      const element = this.htmlContent.nativeElement;

      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Ensure styles are copied to the cloned document
          const clonedElement = clonedDoc.body.querySelector('.tree-container');
          if (clonedElement) {
            this.copyStyles(element, clonedElement as HTMLElement);
          }
        },
      });

      // Convert to PNG and download
      const dataUrl = canvas.toDataURL('image/png');
      this.downloadFile(dataUrl, 'converted-content.png');
    } catch (error) {
      console.error('Error converting to PNG:', error);
      alert('Error converting to PNG. Please try again.');
    }
  }

  async convertToPDF() {
    try {
      const element = this.htmlContent.nativeElement;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector('.tree-container');
          if (clonedElement) {
            this.copyStyles(element, clonedElement as HTMLElement);
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');

      // A4 dimensions in pts (72 dpi)
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to maintain aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Calculate number of pages needed
      const totalPages = Math.ceil(scaledHeight / pdfHeight);

      // Add pages
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate the height of content to show on this page
        const remainingHeight = scaledHeight - page * pdfHeight;
        const currentPageHeight = Math.min(pdfHeight, remainingHeight);

        // Add content to PDF
        pdf.addImage(
          imgData,
          'PNG',
          0,
          -page * pdfHeight,
          scaledWidth,
          scaledHeight
        );
      }

      // Download PDF
      pdf.save('converted-content.pdf');
    } catch (error) {
      console.error('Error converting to PDF:', error);
      alert('Error converting to PDF. Please try again.');
    }
  }

  private copyStyles(sourceElement: HTMLElement, targetElement: HTMLElement) {
    // Copy computed styles
    const computedStyle: any = window.getComputedStyle(sourceElement);
    for (const style of computedStyle) {
      targetElement.style.setProperty(
        style,
        computedStyle.getPropertyValue(style)
      );
    }

    // Copy styles for child elements
    const sourceChildren = sourceElement.children;
    const targetChildren = targetElement.children;
    for (let i = 0; i < sourceChildren.length; i++) {
      if (
        sourceChildren[i] instanceof HTMLElement &&
        targetChildren[i] instanceof HTMLElement
      ) {
        this.copyStyles(
          sourceChildren[i] as HTMLElement,
          targetChildren[i] as HTMLElement
        );
      }
    }
  }

  private downloadFile(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
