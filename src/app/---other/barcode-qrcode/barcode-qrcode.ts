import { Component, inject } from '@angular/core';
import { BarcodeService } from './service/barcode-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barcode-qrcode',
  imports: [FormsModule],
  templateUrl: './barcode-qrcode.html',
  styleUrl: './barcode-qrcode.scss',
})
export class BarcodeQrcode {
  private _barcodeService = inject(BarcodeService);
  value = '123456789012';
  dataUrl: string = '';

  async downloadPdf() {
    await this._barcodeService.addBarcodeOrCreatePdf(
      this.value,
      20,
      20, // x, y
      80,
      30, // width, height
      { format: 'CODE128' },
      undefined, // no existing doc → service creates one
      'barcode.pdf' // save file
    );
  }

  async previewCanvas() {
    this.dataUrl = await this._barcodeService.generateBarcodeDataUrl(
      this.value,
      {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: false,
      }
    );
  }
}
