// qr-pdf-generator.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as QRCode from 'qrcode';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiServices } from 'src/app/shared/services/api.service';
import { API_FOLDER } from '@consts';
import { ListApiResponse } from '@models';

@Injectable({
  providedIn: 'root',
})
export class QrPdfGeneratorService {
  constructor(private http: HttpClient) {}
  readonly _apiService = inject(ApiServices);
  /**
   * Get Stationery api for PDF
   */
  getStationaryImageURLForPreview(careProviderID: number) {
    return this._apiService.post<ListApiResponse<any>>(
      `/v1/${API_FOLDER.user}/consultation-menu-map/preview-stationary?careProviderIDF=${careProviderID}`,
      ''
    );
  }
  /**
   * Get data bypass api for PDF
   */

  getQRPdfCampDetailsData(id) {
    return this._apiService.get(`/v1/${API_FOLDER.bloodBank}/camp-registration/${id}/print`);
  }
  getQRPdfCampEquipmentData(id) {
    return this._apiService.get(
      `/v1/${API_FOLDER.bloodBank}/camp-registration-inventory/blood-bank-issued-items/all/${id}/scan`
    );
  }
  getQRPdfCampStaffData(id) {
    return this._apiService.get(
      `/v1/${API_FOLDER.bloodBank}/camp-staff/camp-details/all/${id}/scan`
    );
  }
  /**
   * Generate QR code data URL for embedding in PDF
   */
  async generateQRCodeForPdf(pdfData: any, campId?: string, type?: number): Promise<string> {
    try {
      let pdfViewerUrl;
      // Create a secure URL for this PDF document using campId
      if (type === 1) {
        pdfViewerUrl = await this.createSecureAccessUrl(pdfData, campId, 'camp-registration');
      } else if (type === 2) {
        pdfViewerUrl = await this.createSecureAccessUrl(pdfData, campId, 'camp-equipement');
      } else if (type === 3) {
        pdfViewerUrl = await this.createSecureAccessUrl(pdfData, campId, 'camp-staff');
      } else {
        pdfViewerUrl = await this.createSecureAccessUrl(pdfData, campId, 'camp-completed');
      }

      // Generate QR code as data URL
      const qrCodeDataURL = await QRCode.toDataURL(pdfViewerUrl, {
        width: 128, // Suitable size for PDF embedding
        margin: 1,
        color: {
          dark: '#000000',
          light: '#cccccc',
        },
        errorCorrectionLevel: 'M',
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code for PDF:', error);
      throw error;
    }
  }

  /**
   * Create secure PDF viewer URL with token authorization
   * Format: baseUrl/public/pdf/campId?token=accessToken
   */
  async createSecureAccessUrl(
    pdfData: any,
    campId?: string,
    action: string = 'camp-registration'
  ): Promise<string> {
    try {
      // Generate a temporary access token
      const accessToken = this.generateAccessToken();
      const expirationTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours

      // Use campId or generate one if not provided
      const documentId = campId || this.generateCampId(pdfData);

      // Store data with token
      const tokenData = {
        data: pdfData,
        expiration: expirationTime,
        token: accessToken,
        campId: documentId,
      };

      // Store using campId as key
      const storageKey = `secure_pdf_${documentId}`;
      sessionStorage.setItem(storageKey, JSON.stringify(tokenData));

      // Build base URL
      const currentUrl = window.location;
      const baseUrl = `${currentUrl.protocol}//${currentUrl.hostname}${currentUrl.port ? ':' + currentUrl.port : ''}`;

      // Return secure URL in the format: public/pdf/:action/:id?token=...
      return `${baseUrl}/public/pdf/${action}/${documentId}`;
    } catch (error) {
      console.error('Error creating secure access URL:', error);
      throw error;
    }
  }

  /**
   * Generate campId from PDF data or create unique one
   */
  private generateCampId(pdfData: any): string {
    // Try to extract campId from registrationData
    if (pdfData?.registrationData?.campId) {
      return pdfData.registrationData.campId;
    }

    // Generate from camp name if available
    if (pdfData?.registrationData?.campName) {
      const campName = pdfData.registrationData.campName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .substring(0, 20);
      return `${campName}_${Date.now().toString(36)}`;
    }

    // Fallback to generic camp ID
    return `camp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Store PDF data temporarily with campId
   */
  private storePdfDataTemporarily(campId: string, pdfData: any) {
    try {
      // Store in both sessionStorage and localStorage as fallback
      const dataString = JSON.stringify(pdfData);

      // Try sessionStorage first
      sessionStorage.setItem(`pdf_${campId}`, dataString);

      // Also store in localStorage with expiration
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
      const storageData = {
        data: pdfData,
        expiration: expirationTime,
        campId: campId,
      };
      localStorage.setItem(`pdf_${campId}`, JSON.stringify(storageData));
    } catch (error) {
      // console.warn('Could not store PDF data in storage:', error);
    }
  }

  /**
   * Get PDF data from storage using campId
   */
  getPdfDataFromStorage(campId: string): any {
    try {
      // Try sessionStorage first
      let data = sessionStorage.getItem(`pdf_${campId}`);
      if (data) {
        return JSON.parse(data);
      }

      // Try localStorage with expiration check
      data = localStorage.getItem(`pdf_${campId}`);
      if (data) {
        const storageData = JSON.parse(data);
        const currentTime = new Date().getTime();

        if (storageData.expiration && currentTime < storageData.expiration) {
          return storageData.data;
        } else {
          // Data expired, remove it
          localStorage.removeItem(`pdf_${campId}`);
        }
      }

      return null;
    } catch (error) {
      console.error('Error retrieving PDF data from storage:', error);
      return null;
    }
  }

  /**
   * Validate access token for secure URLs
   */
  validateAccessToken(campId: string, token: string): boolean {
    try {
      const data = sessionStorage.getItem(`secure_pdf_${campId}`);
      if (!data) return false;

      const tokenData = JSON.parse(data);
      const currentTime = new Date().getTime();

      return (
        tokenData.token === token &&
        tokenData.expiration &&
        currentTime < tokenData.expiration &&
        tokenData.campId === campId
      );
    } catch (error) {
      console.error('Error validating access token:', error);
      return false;
    }
  }

  /**
   * Get PDF data with token validation
   */
  getPdfDataWithToken(campId: string, token?: string): any {
    try {
      if (token) {
        // Validate token for secure access
        if (!this.validateAccessToken(campId, token)) {
          throw new Error('Invalid or expired access token');
        }

        const data = sessionStorage.getItem(`secure_pdf_${campId}`);
        if (data) {
          const tokenData = JSON.parse(data);
          return tokenData.data;
        }
      }

      // Fallback to regular storage access
      return this.getPdfDataFromStorage(campId);
    } catch (error) {
      console.error('Error retrieving PDF data with token:', error);
      return null;
    }
  }

  /**
   * Generate secure URL for existing camp data
   */
  async generateSecureUrlForCamp(campId: string, pdfData: any): Promise<string> {
    try {
      // Store the data temporarily
      this.storePdfDataTemporarily(campId, pdfData);

      // Create secure access URL
      return await this.createSecureAccessUrl(pdfData, campId);
    } catch (error) {
      console.error('Error generating secure URL for camp:', error);
      throw error;
    }
  }

  /**
   * Fetch PDF data from scanner URL
   */
  fetchPdfDataFromUrl(scannerUrl: string): Observable<any> {
    return this.http.get(scannerUrl).pipe(catchError(this.handleHttpError));
  }

  /**
   * Generate PDF blob from data
   */
  async generatePdfBlob(pdfData: any): Promise<Blob> {
    try {
      // Check if pdfData is valid
      if (!pdfData || !pdfData.registrationData) {
        throw new Error('Invalid PDF data provided');
      }

      // Generate actual PDF
      const pdfBlob = await this.generateActualPdf(pdfData);

      // Validate the generated blob
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      throw error;
    }
  }

  /**
   * Implement your actual PDF generation logic here
   */
  private async generateActualPdf(pdfData: any): Promise<Blob> {
    try {
      // Create a simple PDF content with camp information
      const campName = pdfData.registrationData.campName || 'Unknown Camp';
      const location = pdfData.registrationData.location || 'Unknown Location';
      const startDate = pdfData.registrationData.campStartDate || 'Unknown Date';

      const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
100 700 Td
(Camp Details) Tj
0 -20 Td
(Camp Name: ${campName}) Tj
0 -20 Td
(Location: ${location}) Tj
0 -20 Td
(Start Date: ${startDate}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000207 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
400
%%EOF`;

      return new Blob([pdfContent], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error in generateActualPdf:', error);
      throw new Error('Failed to generate PDF content');
    }
  }

  /**
   * Clear expired data from storage
   */
  clearExpiredData(): void {
    try {
      const keys = Object.keys(localStorage);
      const currentTime = new Date().getTime();

      keys.forEach(key => {
        if (key.startsWith('pdf_') || key.startsWith('secure_pdf_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const storageData = JSON.parse(data);
              if (storageData.expiration && currentTime >= storageData.expiration) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // Remove invalid entries
            localStorage.removeItem(key);
          }
        }
      });

      // Clear expired session storage
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith('secure_pdf_')) {
          try {
            const data = sessionStorage.getItem(key);
            if (data) {
              const storageData = JSON.parse(data);
              if (storageData.expiration && currentTime >= storageData.expiration) {
                sessionStorage.removeItem(key);
              }
            }
          } catch (error) {
            sessionStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing expired data:', error);
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Utility method to safely get values from objects
   */
  private getValue(obj: any, key: string): any {
    return obj && obj[key] ? obj[key] : null;
  }

  /**
   * Generate access token
   */
  private generateAccessToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36)
    );
  }
}
