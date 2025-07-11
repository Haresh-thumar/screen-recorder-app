// adblock-detector.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdblockDetectorService {
  private adBlockEnabled = false;

  constructor() {}

  public async detectAdBlock(): Promise<boolean> {
    try {
      // First approach: Try to load a known ad script
      await this.testAdScript();

      // Second approach: Check fake ad element
      const elementTest = this.testFakeAdElement();

      // If either test fails, adblock is likely enabled
      this.adBlockEnabled = !elementTest;
      return this.adBlockEnabled;
    } catch (e) {
      this.adBlockEnabled = true;
      return true;
    }
  }

  private testFakeAdElement(): boolean {
    const ad = document.createElement('div');
    ad.innerHTML = '&nbsp;';
    ad.className =
      'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links';
    ad.style.width = '1px';
    ad.style.height = '1px';
    ad.style.position = 'absolute';
    ad.style.left = '-10000px';
    ad.style.top = '-10000px';
    ad.style.visibility = 'hidden';

    document.body.appendChild(ad);

    const isBlocked =
      ad.offsetHeight === 0 ||
      ad.offsetWidth === 0 ||
      ad.style.display === 'none' ||
      window.getComputedStyle(ad).display === 'none';

    document.body.removeChild(ad);
    return !isBlocked;
  }

  private async testAdScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.onload = () => {
        document.head.removeChild(script);
        resolve();
      };
      script.onerror = () => {
        document.head.removeChild(script);
        reject(new Error('Ad script blocked'));
      };
      document.head.appendChild(script);
    });
  }

  public isAdBlockEnabled(): boolean {
    return this.adBlockEnabled;
  }
}
