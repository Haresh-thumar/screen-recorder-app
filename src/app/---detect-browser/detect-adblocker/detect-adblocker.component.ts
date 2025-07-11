import { Component, inject } from '@angular/core';
import { AdblockDetectorService } from './adblock-detector.service';

@Component({
  selector: 'app-detect-adblocker',
  imports: [],
  templateUrl: './detect-adblocker.component.html',
  styleUrl: './detect-adblocker.component.scss',
})
export class DetectAdblockerComponent {
  private adblockDetector = inject(AdblockDetectorService);
  showWarning = false;

  async ngOnInit() {
    await this.checkAdBlockStatus();
  }

  private async checkAdBlockStatus() {
    this.showWarning = await this.adblockDetector.detectAdBlock();
  }

  async recheckAdBlock() {
    await this.checkAdBlockStatus();
  }

  dismissWarning() {
    this.showWarning = false;
  }
}
