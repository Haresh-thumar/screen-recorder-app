import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-content-to-pdf',
  standalone: true,
  imports: [],
  templateUrl: './content-to-pdf.component.html',
  styleUrl: './content-to-pdf.component.scss',
})
export class ContentToPdfComponent {
  @ViewChild('htmlContent') htmlContent!: ElementRef;

  convertToSVG() {
    const container = this.htmlContent.nativeElement;

    // Get all styles from document
    const styles = this.getStyles();

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const foreignObject = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject'
    );

    // Get the content's dimensions
    const width = container.scrollWidth;
    const height = container.getBoundingClientRect().height;

    // Set SVG attributes
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Create wrapper with all styles
    const wrapper = document.createElement('div');
    wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

    // Add style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    wrapper.appendChild(styleElement);

    // Clone the content
    const contentClone = container.cloneNode(true);
    wrapper.appendChild(contentClone);

    // Set up foreign object
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.appendChild(wrapper);
    svg.appendChild(foreignObject);

    try {
      // Convert to SVG string with XML declaration
      const svgString =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        new XMLSerializer().serializeToString(svg);

      // Create blob and download
      const blob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'fancy_table.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG Conversion Error:', error);
      alert('Failed to convert to SVG. Please try again.');
    }
  }

  private getStyles(): string {
    let styles = '';

    // Get all stylesheet rules
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const styleSheet = document.styleSheets[i];
        if (!styleSheet.cssRules) continue;

        for (let j = 0; j < styleSheet.cssRules.length; j++) {
          const rule = styleSheet.cssRules[j];
          styles += rule.cssText + '\n';
        }
      } catch (e) {
        console.warn('Could not access stylesheet rules', e);
      }
    }

    // Add critical styles to ensure proper rendering
    styles += `
      .tree-container {
        width: 100%;
        margin: 0;
        padding: 10px;
        background-color: #f5f5f5;
      }
      .customers {
        font-family: "Rubik", serif;
        border-collapse: collapse;
        width: 100%;
      }

      .customers td,
      .customers th {
        border: 1px solid #ddd;
        padding: 8px;
        font-size: 10px !important;
        width: max-content;
      }

      .customers tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      .customers tr:hover {
        background-color: #ddd;
      }

      .customers th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        font-size: 12px;
        background-color: #04aa6d;
        color: white;
      }
    `;

    return styles;
  }
}
