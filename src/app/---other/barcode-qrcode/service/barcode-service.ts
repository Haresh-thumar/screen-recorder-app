// src/app/services/barcode.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

export interface BarcodeOptions {
  format?: string; // e.g. 'CODE128', 'EAN13'
  width?: number; // narrow bar width in px
  height?: number; // barcode height in px
  displayValue?: boolean; // show human readable text
  margin?: number; // margin around barcode (px)
  background?: string; // background color
  lineColor?: string; // color of bars
}

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  /**
   * Generate a barcode as a DataURL (PNG). Uses a hidden canvas.
   * Returns Promise<string> -> base64 data URL of the barcode image.
   */
  generateBarcodeDataUrl(
    value: string,
    opts: BarcodeOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create canvas element
        const canvas = document.createElement('canvas');
        // Default options mapping to JsBarcode options
        const jsbOptions: any = {
          format: opts.format || 'CODE128',
          width: opts.width ?? 2,
          height: opts.height ?? 60,
          displayValue: opts.displayValue ?? true, // show bottom side numbers
          margin: opts.margin ?? 4,
          background: opts.background ?? '#ffffff',
          lineColor: opts.lineColor ?? '#000000',
        };
        // Draw barcode on canvas
        JsBarcode(canvas, value, jsbOptions);
        // Convert to DataURL (PNG)
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Universal helper:
   * - If 'doc' exists → adds barcode to that PDF.
   * - If 'doc' is NOT provided → creates a new PDF, adds barcode, and optionally saves it.
   * Returns the jsPDF instance so the caller can continue adding content.
   */
  async addBarcodeOrCreatePdf(
    value: string,
    x: number,
    y: number,
    pdfWidth: number,
    pdfHeight: number,
    opts: BarcodeOptions = {},
    doc?: jsPDF,
    saveAsFileName?: string
  ): Promise<jsPDF> {
    // 1. Create PDF only if caller did not provide one
    const pdf = doc ?? new jsPDF();
    // 2. Generate the barcode image
    const dataUrl = await this.generateBarcodeDataUrl(value, {
      displayValue: false,
    });
    // 3. Add image to the PDF
    pdf.addImage(dataUrl, 'PNG', x, y, pdfWidth, pdfHeight);
    // 4. Save PDF only if filename is given
    if (saveAsFileName) {
      pdf.save(saveAsFileName);
    }
    // 5. Return the PDF so the user can keep working on it
    return pdf;
  }
}
