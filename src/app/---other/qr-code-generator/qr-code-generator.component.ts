import {
  Component,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type TabType = 'url' | 'text' | 'contact';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  url: string;
}

@Component({
  selector: 'app-qr-code-generator',
  imports: [FormsModule],
  templateUrl: './qr-code-generator.component.html',
  styleUrl: './qr-code-generator.component.scss',
})
export class QrCodeGeneratorComponent {
  @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;

  activeTab = signal<TabType>('url');
  qrData = signal('');
  copied = signal(false);

  // Form states for different types
  urlInput = signal('');
  textInput = signal('');
  contactInfo = signal<ContactInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: '',
  });

  tabs: Tab[] = [
    { id: 'url', label: 'URL', icon: 'bi-link-45deg' },
    { id: 'text', label: 'Text', icon: 'bi-chat-square-text' },
    { id: 'contact', label: 'Contact', icon: 'bi-person' },
  ];

  constructor() {
    // React to changes and generate QR code
    effect(() => {
      let data = '';
      const currentTab = this.activeTab();

      switch (currentTab) {
        case 'url':
          data = this.formatUrl(this.urlInput());
          break;
        case 'text':
          data = this.textInput();
          break;
        case 'contact':
          const contact = this.contactInfo();
          if (
            contact.firstName ||
            contact.lastName ||
            contact.phone ||
            contact.email
          ) {
            data = this.generateVCard(contact);
          }
          break;
      }

      this.qrData.set(data);
      this.generateQRCode(data);
    });
  }

  async generateQRCode(text: string) {
    if (!text.trim()) {
      if (this.qrContainer?.nativeElement) {
        this.qrContainer.nativeElement.innerHTML = '';
      }
      return;
    }

    try {
      // Load QRious library dynamically
      if (!(window as any).QRious) {
        const script = document.createElement('script');
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
        script.onload = () => {
          this.createQR(text);
        };
        document.head.appendChild(script);
      } else {
        this.createQR(text);
      }
    } catch (error) {
      console.error('Error loading QR library:', error);
      this.generateFallbackQR(text);
    }
  }

  createQR(text: string) {
    if (!this.qrContainer.nativeElement) return;

    try {
      // Clear previous QR code
      this.qrContainer.nativeElement.innerHTML = '';

      // Create canvas element
      const canvas = document.createElement('canvas');
      this.qrContainer.nativeElement.appendChild(canvas);

      // Generate QR code
      const qr = new (window as any).QRious({
        element: canvas,
        value: text,
        size: 300,
        background: 'white',
        foreground: 'black',
        level: 'M',
      });

      // Style the canvas
      canvas.className = 'w-100 h-auto rounded-3 shadow bg-white';
      canvas.style.maxWidth = '300px';
      canvas.style.height = 'auto';
    } catch (error) {
      console.error('Error creating QR code:', error);
      this.generateFallbackQR(text);
    }
  }

  generateFallbackQR(text: string) {
    if (!this.qrContainer.nativeElement) return;

    // Clear previous content
    this.qrContainer.nativeElement.innerHTML = '';

    // Create img element for fallback
    const img = document.createElement('img');
    const encodedData = encodeURIComponent(text);
    img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8`;
    img.alt = 'Generated QR Code';
    img.className = 'w-100 h-auto rounded-3 shadow bg-white p-3';
    img.style.maxWidth = '300px';
    img.style.height = 'auto';

    // Add error handling for the fallback image
    img.onerror = () => {
      // If Google Charts also fails, try QR Server API
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
    };

    this.qrContainer.nativeElement.appendChild(img);
  }

  formatUrl(url: string): string {
    if (!url.trim()) return '';

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  generateVCard(contact: ContactInfo): string {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
    return vcard;
  }

  downloadQRCode() {
    if (!this.qrData()) return;

    const canvas = this.qrContainer.nativeElement?.querySelector('canvas');
    const img = this.qrContainer.nativeElement?.querySelector('img');

    if (canvas) {
      // Download from canvas
      const link = document.createElement('a');
      link.download = `qr-code-${this.activeTab()}.png`;
      link.href = (canvas as HTMLCanvasElement).toDataURL();
      link.click();
    } else if (img) {
      // Download from image
      const link = document.createElement('a');
      link.download = `qr-code-${this.activeTab()}.png`;
      link.href = (img as HTMLImageElement).src;
      link.click();
    }
  }

  async copyToClipboard() {
    if (this.qrData()) {
      try {
        await navigator.clipboard.writeText(this.qrData());
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }

  resetForm() {
    this.urlInput.set('');
    this.textInput.set('');
    this.contactInfo.set({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: '',
      url: '',
    });
    this.qrData.set('');
    if (this.qrContainer.nativeElement) {
      this.qrContainer.nativeElement.innerHTML = '';
    }
  }

  // Helper methods for template
  setActiveTab(tabId: TabType) {
    this.activeTab.set(tabId);
  }

  updateContactField(field: keyof ContactInfo, value: string) {
    this.contactInfo.update((current) => ({
      ...current,
      [field]: value,
    }));
  }
}
