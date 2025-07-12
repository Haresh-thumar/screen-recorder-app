import { inject, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { ToastService } from '@services';
import * as moment from 'moment';
import autoTable from 'jspdf-autotable';
import { PRINT_KEY_MAPPING } from './camp-registration.constant';
import { CampListService } from '../camp-list/service/camp-list.service';
import { map } from 'rxjs';
import { DestroyBehavior } from '@strategies';
import { CampRegistrationService } from './camp-registration.service';
import { Observable } from 'rxjs';
import { QrPdfGeneratorService } from './qr-pdf-generator.service';
@Injectable({
  providedIn: 'root',
})
export class CampRegistrationPrintService extends DestroyBehavior {
  /** Toast service for displaying notifications */
  private readonly _toast = inject(ToastService);
  private _campListService = inject(CampListService);
  private _campRegistrationPrintService = inject(CampRegistrationPrintService);
  public _campRegistrationService = inject(CampRegistrationService);
  public _qrPDFService = inject(QrPdfGeneratorService);

  campDetails;
  staffAllocationData;
  preInstruction: any;
  preInstructionData: any;

  private readonly MARGIN = 20;
  private readonly LINE_HEIGHT = 8;
  private readonly SECTION_SPACING = 15;
  private readonly HEADER_HEIGHT = 12;
  campStaffDetails;

  /** Base64 encoded image for PDF letterhead/stationary */
  base64StationaryImage: string | null = null;

  /** Username of the currently logged in user */
  loggedInUsername: string = '';

  /** Current date and time string */
  currentDateTime: string = '';

  /** Flag indicating if PDF generation is in progress */
  pdfLoading: boolean = false;

  // PDF layout constants
  /** Left margin for PDF documents */
  private readonly MARGIN_LEFT = 15;

  /** Right margin for PDF documents */
  private readonly MARGIN_RIGHT = 15;

  /** Initial Y position for content in PDF documents */
  private readonly INITIAL_Y_POSITION = 37;

  /** Footer position from bottom of page */
  private readonly FOOTER_POSITION = 20;

  /** Footer text position from bottom of page */
  private readonly FOOTER_TEXT_POSITION = 16;

  /** Text center horizontal position */
  private readonly TEXT_CENTER_ALIGNMENT = 108;

  /** Right margin offset for page numbers */
  private readonly PAGE_NUMBER_OFFSET = 20;

  // Font size constants
  /** Normal font size for text */
  private readonly FONT_SIZE_NORMAL = 8;

  /** Font size for section titles */
  private readonly FONT_SIZE_SECTION_TITLE = 11;

  /** Font size for subsection titles */
  private readonly FONT_SIZE_SUBSECTION_TITLE = 9;

  // Line styling constants
  /** Width for divider lines */
  private readonly DIVIDER_LINE_WIDTH = 0.05;

  /** Footer line width */
  private readonly FOOTER_LINE_WIDTH = 0.3;

  /** Space after divider lines */
  private readonly DIVIDER_SPACING = 4;
  private readonly DIVIDER_SPACINGWithTitle = 2;

  /** Space after section titles */
  private readonly SECTION_TITLE_SPACING = 7;

  /** Space after subsection titles */
  private readonly SUBSECTION_TITLE_SPACING = 2;

  /** Space after data rows */
  private readonly DATA_ROW_SPACING = 2;

  // Color constants
  /** Color for divider lines */
  private readonly DIVIDER_COLOR = 150;

  /** Color for text labels */
  private readonly LABEL_TEXT_COLOR: [number, number, number] = [92, 92, 92];

  /** Color for table lines */
  private readonly TABLE_LINE_COLOR: [number, number, number] = [238, 238, 238];

  /** Color for table headers background */
  private readonly TABLE_HEAD_FILL_COLOR: [number, number, number] = [240, 240, 240];

  /** Color for black elements */
  private readonly COLOR_BLACK: [number, number, number] = [0, 0, 0];

  /** Color for white elements */
  private readonly COLOR_WHITE: [number, number, number] = [255, 255, 255];

  // Table constants
  /** Padding for table cells */
  private readonly TABLE_PADDING = 2;

  /** Width for table lines */
  private readonly TABLE_LINE_WIDTH = 0.1;

  /** Minimal table padding */
  private readonly TABLE_PADDING_MINIMAL = { top: 1, right: 0, bottom: 1, left: 0 };

  // Signature section constants
  /** Signature section offset from bottom */
  private readonly SIGNATURE_SECTION_OFFSET = 40;

  /** Left column width ratio in signature section */
  private readonly SIGNATURE_LEFT_WIDTH = 0.7;

  /** Right column width ratio in signature section */
  private readonly SIGNATURE_RIGHT_WIDTH = 0.3;

  /** QR Code Size in Header */
  private readonly QR_CODE_SIZE = 20;

  // Column width ratios
  /** Width ratio for standard half columns */
  private readonly HALF_COLUMN_WIDTH = 0.5;

  /** Width ratio for third columns */
  private readonly THIRD_COLUMN_WIDTH = 1 / 3;

  /** Width for various specific columns in team data */
  private readonly TEAM_NAME_COLUMN_WIDTH = 0.33;
  private readonly TEAM_DURATION_COLUMN_WIDTH = 0.22;
  private readonly TEAM_DATETIME_COLUMN_WIDTH = 0.25;
  private readonly TEAM_MOBILE_COLUMN_WIDTH = 0.2;

  /** Width for remark label column */
  private readonly REMARK_LABEL_WIDTH = 36;

  /**
   * Mapping between field keys and their corresponding data properties
   * Used for accessing data values in a consistent way
   */
  private readonly keyMapping: { [key: string]: string } = PRINT_KEY_MAPPING;

  /**
   * Sets the username of the logged in user
   * @param userFullName - Full name of the logged in user
   */
  setLoggedInUsername(userFullName: string) {
    this.loggedInUsername = userFullName ?? '';
  }

  /**
   * Sets the base64 encoded stationary image for PDF letterhead
   * @param base64 - Base64 encoded image string
   */
  setStationaryImage(base64: string) {
    this.base64StationaryImage = base64 ?? '';
  }

  /**
   * Gets a value from the data object using the key mapping
   * @param data - The data object
   * @param key - The key to look up
   * @returns The value from the data object or '-' if not found
   */
  private getValue(data: any, key: string): string {
    const mappedKey = this.keyMapping[key];
    return data[mappedKey] ?? '-';
  }

  /**
   * Adds the letterhead background image to the PDF
   * @param pdf - The jsPDF document
   * @param pageWidth - Width of the page
   * @param pageHeight - Height of the page
   */
  private addLetterheadBackground(pdf: jsPDF, pageWidth: number, pageHeight: number) {
    if (this.base64StationaryImage) {
      pdf.addImage(this.base64StationaryImage, 'JPEG', 0, 0, pageWidth, pageHeight);
    }
  }

  /**
   * Sets up the PDF document with background and initial configuration
   * @param doc - The jsPDF document
   */
  private setupPdfDocument(doc: jsPDF) {
    this.addLetterheadBackground(
      doc,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    );
  }

  /**
   * Adds a footer to each page of the PDF
   * @param doc - The jsPDF document
   * @param totalPagesExp - Total pages expression placeholder
   */
  private addFooter(doc: jsPDF, totalPagesExp: string) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(this.FOOTER_LINE_WIDTH);
    doc.setTextColor(...this.LABEL_TEXT_COLOR);
    doc.setDrawColor(...this.LABEL_TEXT_COLOR);
    doc.line(
      this.MARGIN_LEFT,
      pageHeight - this.FOOTER_POSITION,
      pageWidth - this.MARGIN_RIGHT,
      pageHeight - this.FOOTER_POSITION
    );
    doc.setFontSize(this.FONT_SIZE_NORMAL);
    doc.setFont('Helvetica', 'normal');
    doc.text(
      `Printed By: ${this.loggedInUsername}`,
      this.MARGIN_LEFT,
      pageHeight - this.FOOTER_TEXT_POSITION
    );
    this.currentDateTime = moment(new Date()).format('DD-MMMM-yyyy / hh:mm A');
    doc.text(
      this.currentDateTime,
      this.TEXT_CENTER_ALIGNMENT,
      pageHeight - this.FOOTER_TEXT_POSITION,
      { align: 'center' }
    );
    let pageStr = `Page ${doc.getNumberOfPages()}`;
    if (typeof (doc as any).putTotalPages === 'function') {
      pageStr = `Page ${doc.getNumberOfPages()} of ${totalPagesExp}`;
    }
    doc.text(
      pageStr,
      pageWidth - this.MARGIN_RIGHT - this.PAGE_NUMBER_OFFSET,
      pageHeight - this.FOOTER_TEXT_POSITION
    );
  }

  /**
   * Finalizes the PDF document by adding footers, document properties, and opening it
   * @param doc - The jsPDF document
   * @param totalPagesExp - Total pages expression placeholder
   * @param filename - Filename for the PDF
   * @param subject - Subject for the PDF metadata
   */
  private finalizePdf(doc: jsPDF, totalPagesExp: string, filename: string, subject: string) {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      this.addFooter(doc, totalPagesExp);
    }
    doc.setDocumentProperties({
      title: filename,
      subject: subject,
      author: 'BMC Health Portal',
      keywords: subject,
      creator: this.loggedInUsername,
    });
    if (typeof (doc as any).putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    doc.output('dataurlnewwindow', { filename: filename });
  }

  /**
   * Adds a horizontal divider line to the PDF
   * @param doc - The jsPDF document
   * @param yPosition - Y position for the line
   * @param width - Width of the line
   * @returns New Y position after adding the line
   */
  private addDividerLine(doc: jsPDF, yPosition: number, width: number) {
    doc.setLineWidth(this.DIVIDER_LINE_WIDTH);
    doc.setDrawColor(this.DIVIDER_COLOR);
    doc.line(this.MARGIN_LEFT, yPosition, width + this.MARGIN_LEFT, yPosition);
    return yPosition + this.DIVIDER_SPACING;
  }

  /**
   * Adds a section title to the PDF
   * @param doc - The jsPDF document
   * @param startY - Starting Y position
   * @param title - Title text
   * @param width - Width of the title section
   * @returns New Y position after adding the title
   */
  private addSectionTitle(doc: jsPDF, startY: number, title: string, width: number): number {
    autoTable(doc, {
      startY: startY,
      head: [],
      body: [
        [
          {
            content: title,
            styles: {
              fontStyle: 'bold',
              fontSize: this.FONT_SIZE_SECTION_TITLE,
              halign: 'center',
            },
          },
        ],
      ],
      styles: {
        lineColor: this.COLOR_WHITE,
      },
      theme: 'plain',
      tableWidth: width,
      margin: { left: this.MARGIN_LEFT, right: this.MARGIN_RIGHT },
    });
    return (doc as any).lastAutoTable.finalY + this.SECTION_TITLE_SPACING;
  }

  private addSectionTitleWithLine(
    doc: jsPDF,
    startY: number,
    title: string,
    usableWidth: number
  ): number {
    // Check if there's enough space for the title and the line + some buffer
    const requiredSpace = 10; // Approx height of title + line
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerTop = pageHeight - this.FOOTER_POSITION - 5; // 5mm above footer
    if (startY + requiredSpace > footerTop) {
      doc.addPage();
      startY = this.INITIAL_Y_POSITION; // Reset Y position for new page
    }
    doc.setFontSize(10); // Adjust font size as needed for section titles
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Use COLOR_BLACK from your constants
    // Position the title text (left-aligned)
    const textX = this.MARGIN_LEFT;
    doc.text(title, textX, startY);
    // Draw the horizontal line below the title
    const lineY = startY + 3; // Adjust vertical position of the line relative to text
    doc.setDrawColor(163, 163, 163); // Gray color for the line (matching your header lines)
    doc.setLineWidth(0.4); // Line width
    doc.line(this.MARGIN_LEFT, lineY, this.MARGIN_LEFT + usableWidth, lineY);
    return lineY + 2; // Return new Y position, adding some space after line Bottom Side
  }

  /**
   * Adds a subsection title to the PDF
   * @param doc - The jsPDF document
   * @param startY - Starting Y position
   * @param title - Title text
   * @param width - Width of the title section
   * @returns New Y position after adding the subsection title
   */
  private addSubsectionTitle(doc: jsPDF, startY: number, title: string, width: number): number {
    autoTable(doc, {
      startY: startY,
      head: [],
      body: [
        [
          {
            content: title,
            styles: {
              fontStyle: 'bold',
              fontSize: this.FONT_SIZE_SUBSECTION_TITLE,
            },
          },
        ],
      ],
      styles: {
        lineColor: this.COLOR_WHITE,
        cellPadding: this.TABLE_PADDING_MINIMAL,
      },
      theme: 'plain',
      tableWidth: width,
      margin: { left: this.MARGIN_LEFT, right: this.MARGIN_RIGHT },
    });
    return (doc as any).lastAutoTable.finalY + this.SUBSECTION_TITLE_SPACING;
  }

  private addSubsectionTitleWithLine(
    doc: jsPDF,
    startY: number,
    title: string,
    width: number
  ): number {
    autoTable(doc, {
      startY: startY,
      head: [],
      body: [
        [
          {
            content: title,
            styles: {
              fontStyle: 'bold',
              fontSize: this.FONT_SIZE_SUBSECTION_TITLE,
            },
          },
        ],
      ],
      styles: {
        lineColor: this.COLOR_WHITE,
        cellPadding: this.TABLE_PADDING_MINIMAL,
      },
      theme: 'plain',
      tableWidth: width,
      margin: { left: this.MARGIN_LEFT, right: this.MARGIN_RIGHT },
    });
    const currentY = (doc as any).lastAutoTable.finalY + this.SUBSECTION_TITLE_SPACING;
    // Add divider line below the title
    this.addDividerLine(doc, currentY - 1.7, width);
    return currentY + this.DIVIDER_SPACINGWithTitle; // Add spacing after the divider line
  }

  /**
   * Creates a data row with labels and values
   * @param doc - The jsPDF document
   * @param startY - Starting Y position
   * @param labels - Array of label texts
   * @param values - Array of value texts
   * @param columnWidths - Array of column widths
   * @param width - Total width of the row
   * @param cellPadding - Optional: Custom cell padding for this row. Defaults to TABLE_PADDING_MINIMAL.
   * @param headerFontSize - Optional: Font size for labels (headers). Defaults to 8.
   * @param dataFontSize - Optional: Font size for values (data). Defaults to 9.
   * @param headerFontWeight - Optional: Font weight for labels. Defaults to 'normal'.
   * @param dataFontWeight - Optional: Font weight for values. Defaults to 'bold'.
   * @returns New Y position after adding the data row
   */
  private createDataRow(
    doc: jsPDF,
    startY: number,
    labels: string[],
    values: string[],
    columnWidths: number[],
    width: number,
    cellPadding?: { top: number; right: number; bottom: number; left: number },
    headerFontSize: number = 8, // Default value
    dataFontSize: number = 9, // Default value
    headerFontWeight: 'normal' | 'bold' = 'normal', // Default value
    dataFontWeight: 'normal' | 'bold' = 'bold' // Default value
  ): number {
    const labelsRow = labels.map(label => ({
      content: label,
      styles: {
        fontSize: headerFontSize, // Use parameter
        fontStyle: headerFontWeight, // Use parameter
        textColor: this.LABEL_TEXT_COLOR,
      },
    }));
    const valuesRow = values.map(value => ({
      content: value,
      styles: {
        fontSize: dataFontSize, // Use parameter
        fontStyle: dataFontWeight, // Use parameter
        textColor: this.COLOR_BLACK, // Assuming data text should be black
      },
    }));
    const effectiveCellPadding = cellPadding || this.TABLE_PADDING_MINIMAL;
    autoTable(doc, {
      startY: startY,
      head: [],
      body: [labelsRow as any, valuesRow as any],
      styles: {
        // General styles for the table. Specific font sizes are now handled per cell in labelsRow/valuesRow.
        cellPadding: effectiveCellPadding,
        lineColor: this.COLOR_WHITE,
      },
      theme: 'plain',
      tableWidth: width,
      margin: { left: this.MARGIN_LEFT, right: this.MARGIN_RIGHT },
      columnStyles: columnWidths.reduce((acc, width, index) => {
        acc[index] = { cellWidth: width };
        return acc;
      }, {}),
    });
    return (doc as any).lastAutoTable.finalY + this.DATA_ROW_SPACING;
  }

  /**
   * Creates a table for displaying list items
   * @param doc - The jsPDF document
   * @param startY - Starting Y position
   * @param headers - Array of table header texts
   * @param width - Total width of the table
   * @param items - Array of items to display in the table
   * @param columnWidths - Array of column widths
   * @returns New Y position after adding the table
   */
  private createItemsTable(
    doc: jsPDF,
    startY: number,
    headers: string[],
    width: number,
    items: any[] = [],
    columnWidths: number[] = [],
    tablePadding: number = 2
  ): number {
    const tableHeaders = headers.map(header => header);
    let tableBody;
    if (!items || items.length === 0) {
      tableBody = [
        [{ content: 'No records found', colSpan: headers.length, styles: { halign: 'center' } }],
      ];
    } else {
      tableBody = items.map(item => headers.map((_, index) => item[Object.keys(item)[index]]));
    }
    autoTable(doc, {
      startY: startY,
      head: [tableHeaders],
      body: tableBody,
      theme: 'plain', // Use plain theme — no borders
      styles: {
        font: 'helvetica',
        fontSize: this.FONT_SIZE_NORMAL,
        textColor: this.COLOR_BLACK,
        cellPadding: tablePadding,
        lineWidth: 0, // No line borders
      },
      headStyles: {
        fontStyle: 'bold', // Bold header text
        textColor: this.COLOR_BLACK,
        fillColor: false, // No header background
      },
      alternateRowStyles: {
        fillColor: false,
      },
      margin: { left: this.MARGIN_LEFT, right: this.MARGIN_RIGHT },
      tableWidth: width,
      columnStyles: columnWidths.length
        ? columnWidths.reduce((acc, colWidth, index) => {
            acc[index] = { cellWidth: colWidth };
            return acc;
          }, {})
        : undefined,
    });
    return (doc as any).lastAutoTable.finalY + this.DATA_ROW_SPACING;
  }

  /**
   * Adds a signature section to the PDF
   * @param doc - The jsPDF document
   * @param yPosition - Y position for the signature section
   * @param width - Width of the signature section
   * @param title - Set your own custom title
   * @param titleTextWeight - Set the custom font-weight of title text
   * @returns New Y position after adding the signature section
   */
  private addSignatureSection(
    doc: jsPDF,
    yPosition: number,
    width: number,
    title: string = 'Signature of CDO/PRO',
    titleTextWeight: 'normal' | 'bold' = 'normal'
  ): number {
    autoTable(doc, {
      startY: yPosition,
      head: [],
      body: [
        [
          { content: '' },
          {
            content: title,
            styles: {
              halign: 'right',
              fontStyle: titleTextWeight,
              fontSize: this.FONT_SIZE_SUBSECTION_TITLE,
            },
          },
        ],
      ],
      styles: {
        lineColor: this.COLOR_WHITE,
      },
      theme: 'plain',
      tableWidth: width,
      margin: { left: this.MARGIN_LEFT, right: this.MARGIN_RIGHT },
      columnStyles: {
        0: { cellWidth: width * this.SIGNATURE_LEFT_WIDTH },
        1: { cellWidth: width * this.SIGNATURE_RIGHT_WIDTH },
      },
    });
    return (doc as any).lastAutoTable.finalY;
  }

  /**
   * Core method to generate a PDF with the given data and content
   * @param data - The data to use in the PDF
   * @param filename - Filename for the PDF
   * @param subject - Subject for the PDF metadata
   * @param contentCallback - Callback function to add specific content to the PDF
   */
  private async generatePdf(
    data: any,
    filename: string,
    subject: string,
    contentCallback: (doc: jsPDF, usableWidth: number) => void
  ) {
    if (!data) return;
    this.pdfLoading = true;
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const totalPagesExp = '{total_pages_count_string}';
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      this.setupPdfDocument(doc);
      contentCallback(doc, usableWidth);
      this.finalizePdf(doc, totalPagesExp, filename, subject);
    } catch (error) {
      this._toast.error('Error generating PDF. Please try again.');
      console.error('Error generating PDF:', error);
    } finally {
      this.pdfLoading = false;
    }
  }

  /**
   * Generates and prints a camp registration PDF
   * @param data - The camp registration data
   */

  createDynamicPreInspectionRows(
    doc: any,
    currentY: number,
    data: any,
    usableWidth: number
  ): number {
    // Filter active items
    // const activeItems = data.filter(item => item.isActive);
    const activeItems = data;
    // Process items in groups of 3 (or fewer for the last group)
    for (let i = 0; i < activeItems.length; i += 3) {
      const groupItems = activeItems.slice(i, i + 3);
      // Extract labels and values for this group
      const labels = groupItems.map(item => item.checkListName);
      const values = groupItems.map(item => (item.value ? 'Yes' : 'No'));
      // Calculate widths based on the number of items in this group
      const itemWidth = this.THIRD_COLUMN_WIDTH;
      const widths = groupItems.map(() => usableWidth * itemWidth);
      // Create the row in the PDF
      currentY = this.createDataRow(doc, currentY, labels, values, widths, usableWidth);
    }
    return currentY;
  }

  printCampRegistration(data: any) {
    // this.getCampDetails(data?.campId);
    // this.preInstructionList();
    this.generatePdf(data, 'Camp-Registration.pdf', 'Camp Registration', (doc, usableWidth) => {
      let currentY = this.INITIAL_Y_POSITION;

      currentY = this.createDataRow(
        doc,
        currentY,
        ['Camp Name', 'Expected Donors', 'Distance from Blood Bank', 'Date & Time'],
        [
          this.getValue(data.registrationData, 'campName'),
          this.getValue(data.registrationData, 'probableDonor'),
          this.getValue(data.registrationData, 'distanceFromCenter'),
          this.getValue(data.registrationData, 'campStartDate'),
        ],
        [
          usableWidth * this.TEAM_NAME_COLUMN_WIDTH,
          usableWidth * this.TEAM_DURATION_COLUMN_WIDTH,
          usableWidth * this.TEAM_DATETIME_COLUMN_WIDTH,
          usableWidth * this.TEAM_MOBILE_COLUMN_WIDTH,
        ],
        usableWidth
      );

      currentY = this.createDataRow(
        doc,
        currentY,
        ['Address'],
        [this.getValue(data.registrationData, 'location')],
        [usableWidth],
        usableWidth
      );

      currentY = this.addDividerLine(doc, currentY + this.DIVIDER_SPACING, usableWidth);
      currentY = this.addSectionTitle(doc, currentY, 'Camp Registration', usableWidth);
      currentY = this.addSubsectionTitle(doc, currentY, 'Pre-inspection of the Site', usableWidth);

      if (data.preInstruction && data.preInstruction.length > 0) {
        // Create the first row with Type in the first column and first two dynamic items in columns 2 and 3
        const firstRowLabels = ['Type'];
        const firstRowValues = [this.getValue(data.registrationData, 'inspectionTypeName')];
        const firstRowWidths = [usableWidth * this.THIRD_COLUMN_WIDTH];

        // Add up to 2 items from preInstruction to complete the first row
        const itemsForFirstRow = Math.min(2, data.preInstruction.length);
        for (let i = 0; i < itemsForFirstRow; i++) {
          firstRowLabels.push(data.preInstruction[i].checkListName);
          firstRowValues.push(data.preInstruction[i].value ? 'Yes' : 'No');
          firstRowWidths.push(usableWidth * this.THIRD_COLUMN_WIDTH);
        }

        // Create the first row
        currentY = this.createDataRow(
          doc,
          currentY,
          firstRowLabels,
          firstRowValues,
          firstRowWidths,
          usableWidth
        );

        // If there are more than 2 preInstruction items, create additional rows with 3 items per row
        if (data.preInstruction.length > 2) {
          // Start from the 3rd item (index 2)
          const remainingItems = data.preInstruction.slice(2);
          // Process the remaining items in groups of 3
          for (let i = 0; i < remainingItems.length; i += 3) {
            const groupItems = remainingItems.slice(i, i + 3);
            // Extract labels and values for this group
            const labels = groupItems.map(item => item.checkListName);
            const values = groupItems.map(item => (item.value ? 'Yes' : 'No'));
            // Calculate widths
            const widths = groupItems.map(() => usableWidth * this.THIRD_COLUMN_WIDTH);
            // Create the row
            currentY = this.createDataRow(doc, currentY, labels, values, widths, usableWidth);
          }
        }
      } else {
        // If there's no preInstruction data, just show the Type
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Type'],
          [this.getValue(data.registrationData, 'inspectionTypeName')],
          [usableWidth],
          usableWidth
        );
      }

      currentY = this.createDataRow(
        doc,
        currentY,
        ['Other Facilities'],
        [this.getValue(data.registrationData, 'otherFacilities')],
        [usableWidth],
        usableWidth
      );

      // currentY = this.createDataRow(
      //   doc,
      //   currentY,
      //   [
      //     'Furniture/Equipment Available',
      //     'Waste Disposal Facility',
      //     'Medical Examination Facility',
      //   ],
      //   [
      //     this.getValue(data, 'furnitureAvailable'),
      //     this.getValue(data, 'wasteDisposal'),
      //     this.getValue(data, 'medicalFacility'),
      //   ],
      //   [
      //     usableWidth * this.THIRD_COLUMN_WIDTH,
      //     usableWidth * this.THIRD_COLUMN_WIDTH,
      //     usableWidth * this.THIRD_COLUMN_WIDTH,
      //   ],
      //   usableWidth
      // );

      this.createDataRow(
        doc,
        currentY,
        ['Remark of CDO'],
        [this.getValue(data.registrationData, 'approvedRemarks')],
        [usableWidth],
        usableWidth
      );

      this.addSignatureSection(
        doc,
        doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET,
        usableWidth
      );
    });
  }

  /**
   * Generates and prints a camp registration equipment PDF
   * @param data - The camp registration equipment data
   */
  async printCampRegistrationEquipment(data: any) {
    data.registrationData = data.data3;
    await this.generatePdfAsync(
      data,
      'Camp-Registration-Equipment.pdf',
      'Camp Registration Equipment',
      async (doc, usableWidth) => {
        let currentY = this.INITIAL_Y_POSITION;

        currentY = this.addSectionTitle(doc, currentY - 2.5, 'EQUIPMENT CHECKLIST', usableWidth);
        await this.createCampDetailsHeader(doc, currentY - 5, data, usableWidth, 2);
        currentY = this.addSectionTitleWithLine(
          doc,
          currentY + 7 * this.DIVIDER_SPACING,
          'Blood Bags',
          usableWidth
        );

        const equipmentBloodBagItems = data?.mergedData?.filter(item => item.type === 2) ?? [];
        const equipmentBloodBagHeaders = ['No.', 'Name', 'Type', 'Qty', 'Remarks'];

        this.createItemsTable(
          doc,
          currentY,
          equipmentBloodBagHeaders,
          usableWidth,

          equipmentBloodBagItems.map((equipment, index) => [
            (index + 1).toString(),
            equipment.itemAlias || '',
            equipment.bagType || '',
            equipment.quantityIssued || '',
            equipment.remarks || '',
          ]),
          [
            usableWidth * 0.05,
            usableWidth * 0.5,
            usableWidth * 0.1,
            usableWidth * 0.1,
            usableWidth * 0.25,
          ],
          1.2
        );

        currentY = this.addSectionTitleWithLine(
          doc,
          currentY + 7 * this.DIVIDER_SPACING,
          'Other Items',
          usableWidth
        );
        const equipmentOtherItems = data?.mergedData?.filter(item => item.type === 1) ?? [];
        const equipmentOtherHeaders = ['No.', 'Name', 'Type', 'Qty', 'Availability'];

        this.createItemsTable(
          doc,
          currentY,
          equipmentOtherHeaders,
          usableWidth,

          equipmentOtherItems.map((equipment, index) => [
            (index + 1).toString(),
            equipment.itemAlias || '',
            equipment.bagType || '',
            equipment.quantityIssued || '',
            equipment.remarks || '',
          ]),
          [
            usableWidth * 0.05,
            usableWidth * 0.5,
            usableWidth * 0.1,
            usableWidth * 0.1,
            usableWidth * 0.25,
          ],
          1.2
        );

        this.addSignatureSection(
          doc,
          doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET,
          usableWidth
        );
      }
    );
  }

  /*---------------------------------------------------------------------------------------------*/
  /*----*/
  /*----*/
  /*---- Camp Completed Print ----*/
  /*----*/
  /*----*/
  /*---------------------------------------------------------------------------------------------*/
  /**
   * Creates the donor screening header section with QR code area
   * @param doc - The jsPDF document
   * @param startY - Starting Y position
   * @param data - Donor screening data
   * @param usableWidth - Available width for content
   * @returns New Y position after adding the header
   */
  /*-------------------------------------------------
                Camp Complete Header
  -------------------------------------------------*/
  private async createCampCompletedHeaderDynamic(
    doc: jsPDF,
    startY: number,
    data: any,
    usableWidth: number
  ): Promise<number> {
    const contentY = startY + 5;
    const rowHeight = 5;
    const leftX = this.MARGIN_LEFT + 2;
    const midX = this.MARGIN_LEFT + usableWidth / 2;

    // Get dynamic data if needed
    const campName = String(
      this.getValue(data.registrationData ? data.registrationData : data, 'campName') ||
        'BMC Mega Blood Drive'
    );
    const campType = String(
      (data.registrationData?.campTypeName
        ? data.registrationData?.campTypeName
        : data.campTypeName) || 'In-House'
    );
    const orgName = String(
      (data.registrationData?.organizationName
        ? data.registrationData?.organizationName
        : data.organizationName) || '-'
    );
    const orgType = String(
      (data.registrationData?.organizationTypeName
        ? data.registrationData?.organizationTypeName
        : data.organizationTypeName) || '-'
    );
    const mobile = String(
      (data.registrationData?.primaryContact
        ? data.registrationData?.primaryContact
        : data.primaryContact) || '-'
    );

    const address = String(
      this.getValue(data.registrationData ? data.registrationData : data, 'location') ||
        'Malad East, Mumbai'
    );
    const duration = String(
      this.getValue(data.registrationData ? data.registrationData : data, 'duration') || '1 Day'
    );
    const dateOfCamp = String(
      this.formatDateTime(
        this.getValue(data.registrationData ? data.registrationData : data, 'campStartDate')
      ) || '11-Jan-2025'
    );
    const deptDateTime = String(
      this.formatDateTime(
        this.getValue(data.registrationData ? data.registrationData : data, 'departureDateTime')
      ) || '14-Jan-2025 | 10:00'
    );
    const vehicle = String(
      this.getValue(data.registrationData ? data.registrationData : data, 'vehicleUsed') ||
        'MH01AB5432'
    );

    // Calculate column widths
    const leftValueX = leftX + 22;
    const leftColumnMaxWidth = usableWidth / 2; // More generous width for left column

    // Prepare text wrapping only for fields that are likely to be long
    const campNameLines = doc.splitTextToSize(campName, leftColumnMaxWidth);
    const addressLines = doc.splitTextToSize(address, leftColumnMaxWidth);
    const orgNameLines = doc.splitTextToSize(orgName, leftColumnMaxWidth);
    const orgTypeLines = doc.splitTextToSize(orgType, leftColumnMaxWidth);

    // Keep shorter fields as single lines (no wrapping needed typically)
    const campTypeLines = [campType];
    const mobileLines = [mobile];
    const durationLines = [duration];
    const dateOfCampLines = [dateOfCamp];
    const deptDateTimeLines = [deptDateTime];
    const vehicleLines = [vehicle];

    // Calculate heights needed for each row based on left column wrapping
    const row1Height = campNameLines.length * rowHeight;
    const row2Height = rowHeight; // Camp type is single line
    const row3Height = addressLines.length * rowHeight;
    const row4Height = orgNameLines.length * rowHeight;
    const row5Height = orgTypeLines.length * rowHeight;

    // Calculate total dynamic header height
    const headerHeight = row1Height + row2Height + row3Height + row4Height + row5Height + 1.5; // 4 for top/bottom padding

    // Draw rectangle AFTER calculating dynamic height
    doc.setFillColor(204, 204, 204);
    doc.rect(this.MARGIN_LEFT, startY, usableWidth, headerHeight, 'F');

    // Start with first row Y position
    let currentDetailY = contentY;
    let rightColumnY = contentY; // Separate Y tracking for right column

    // ROW 1: Camp Name & Mobile No
    doc.setFontSize(this.FONT_SIZE_NORMAL);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Camp Name', leftX, currentDetailY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(campNameLines, leftValueX, currentDetailY);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Mobile No', midX, rightColumnY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(mobileLines[0], midX + 30, rightColumnY);
    currentDetailY += row1Height;
    rightColumnY += rowHeight; // Right column always advances by single row height

    // ROW 2: Camp Type & Duration
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Camp Type', leftX, currentDetailY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(campTypeLines[0], leftValueX, currentDetailY);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Duration', midX, rightColumnY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(durationLines[0], midX + 30, rightColumnY);
    currentDetailY += row2Height;
    rightColumnY += rowHeight;

    // ROW 3: Address & Date of Camp
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Address', leftX, currentDetailY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(addressLines, leftValueX, currentDetailY);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Date of Camp', midX, rightColumnY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(dateOfCampLines[0], midX + 30, rightColumnY);
    currentDetailY += row3Height;
    rightColumnY += rowHeight;

    // ROW 4: Org Name & Date & Time of Dept.
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Org. Name', leftX, currentDetailY - 2);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(orgNameLines, leftValueX, currentDetailY - 2);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Date & Time of Dept.', midX, rightColumnY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(deptDateTimeLines[0], midX + 30, rightColumnY);
    currentDetailY += row4Height;
    rightColumnY += rowHeight;

    // ROW 5: Org Type & Vehicle Used
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Org. Type', leftX, currentDetailY - 2);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(orgTypeLines, leftValueX, currentDetailY - 2);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Vehicle Used', midX, rightColumnY);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(vehicleLines[0], midX + 30, rightColumnY);

    // QR code
    // const qrX = this.MARGIN_LEFT + usableWidth - this.QR_CODE_SIZE - 2;
    //   const qrY = startY + 2;
    const qrX = this.MARGIN_LEFT + usableWidth - this.QR_CODE_SIZE + 2.5;
    const qrY = startY + 2;
    try {
      const campId = data.registrationData ? data.registrationData.campId : data.campId;
      const qrCodeDataURL = await this._qrPDFService.generateQRCodeForPdf(data, campId, 4);
      // Add QR code to PDF

      doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, 15, 15);
    } catch (error) {
      doc.rect(qrX, qrY, 15, 15, 'S');
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text('QR', qrX + 5, qrY + 8);
    }

    // Add borders & Outer borders
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(this.MARGIN_LEFT, startY, this.MARGIN_LEFT + usableWidth, startY); // Top Side Line
    doc.line(
      this.MARGIN_LEFT,
      startY + headerHeight,
      this.MARGIN_LEFT + usableWidth,
      startY + headerHeight
    ); // Bottom Side Line

    // Vertical separator line between left and right columns with top/bottom spacing
    const leftColumnWidth = usableWidth / 2;
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(
      leftX + leftColumnWidth - 10,
      startY + 1.8, // Add spacing from top
      leftX + leftColumnWidth - 10,
      startY + headerHeight - 1.8 // Subtract spacing from bottom
    );
    // Return new bottom Y
    return startY + headerHeight + 5;
  }

  /*-------------------------------------------------
                Camp Completed Print
  -------------------------------------------------*/
  async printCampCompleted(data: any) {
    await this.generatePdfAsync(
      data,
      'Camp-completed.pdf',
      'Camp Completed',
      async (doc, usableWidth) => {
        let currentY = this.INITIAL_Y_POSITION;
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerTop = pageHeight - this.FOOTER_POSITION - 5;
        currentY = this.addSectionTitle(doc, currentY - 3, 'CAMP COMPLETED', usableWidth);
        // Use returned currentY
        currentY = await this.createCampCompletedHeaderDynamic(
          doc,
          currentY - 5,
          data,
          usableWidth
        );
        /*-----------------------------------
                   Blood Bags
      -----------------------------------*/
        currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Blood Bags', usableWidth);
        const equipmentBloodBagItems = data?.mergedData?.filter(item => item.type === 2) ?? [];
        const equipmentHeaders = ['No.', 'Bags Type', 'Total Bags Issued', 'Bags Collected'];
        currentY = this.createItemsTable(
          doc,
          currentY,
          equipmentHeaders,
          usableWidth,
          equipmentBloodBagItems.map((equipment, index) => [
            (index + 1).toString(),
            equipment.itemAlias || '',
            equipment.quantityIssued || '',
            equipment.quantityReturned || '',
          ]),
          [usableWidth * 0.05, usableWidth * 0.32, usableWidth * 0.32, usableWidth * 0.31],
          1
        );

        /*------------------------------------------
             Add signature & Footer section
      ------------------------------------------*/
        const signatureSectionHeight = 15; // Approximate height of signature section
        if (currentY + signatureSectionHeight + this.SIGNATURE_SECTION_OFFSET > footerTop) {
          doc.addPage();
          currentY = this.INITIAL_Y_POSITION;
        }

        this.addSignatureSection(
          doc,
          doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET + 5,
          usableWidth,
          'Signature of CDO/PRO',
          'bold'
        );
      }
    );
  }

  /**
   * Generates and prints a camp registration team PDF
   * @param data - The camp registration team data
   */
  async printCampRegistrationTeam(data?: any) {
    await this.generatePdfAsync(
      data,
      'Camp-Registration-Team.pdf',
      'Camp Registration Team',
      async (doc, usableWidth) => {
        let currentY = this.INITIAL_Y_POSITION;

        currentY = this.addSectionTitle(doc, currentY - 2.5, 'STAFF ALLOCATION', usableWidth);
        currentY = await this.createCampDetailsHeaderDynamic(doc, currentY - 5, data, usableWidth);

        currentY = this.addSectionTitleWithLine(
          doc,
          currentY + 2 * this.DIVIDER_SPACING,
          'Team Members',
          usableWidth
        );

        // Add medical officer to camp staffs
        data.staffAllocationData?.campStaffs.push({
          technicianName: data.staffAllocationData.medicalOfficerName,
          technicianRole: 'Medical Officer',
        });

        const teamMembers = data.staffAllocationData?.campStaffs ?? [];

        // Define the role hierarchy for sorting
        const roleHierarchy = {
          'CDO': 1,
          'Medical Officer': 2,
          'BTO': 3,
          'Nursing Staff': 4,
          'Lab Tech': 5,
          'Other Staff': 6,
        };

        // Function to get role priority (lower number = higher priority)
        const getRolePriority = (role: string): number => {
          // Check exact matches first
          if (roleHierarchy[role]) {
            return roleHierarchy[role];
          }

          // Check partial matches for flexibility
          const lowerRole = role.toLowerCase();
          if (lowerRole.includes('cdo')) return 1;
          if (lowerRole.includes('medical officer')) return 2;
          if (lowerRole.includes('bto')) return 3;
          if (lowerRole.includes('nursing')) return 4;
          if (lowerRole.includes('lab') && lowerRole.includes('tech')) return 5;

          // Default to "Other Staff" category
          return 6;
        };

        // Sort team members by role hierarchy
        const sortedTeamMembers = teamMembers.sort((a, b) => {
          const priorityA = getRolePriority(a.technicianRole || '');
          const priorityB = getRolePriority(b.technicianRole || '');

          // If roles have same priority, sort alphabetically by name
          if (priorityA === priorityB) {
            return (a.technicianName || '').localeCompare(b.technicianName || '');
          }

          return priorityA - priorityB;
        });

        const teamHeaders = ['No.', 'Name', 'Designation', 'Signature'];

        currentY = this.createItemsTable(
          doc,
          currentY,
          teamHeaders,
          usableWidth,
          sortedTeamMembers.map((member, index) => [
            (index + 1).toString(),
            member.technicianName || '',
            member.technicianRole || '',
            '', // Leave signature empty
          ]),
          [], // Use default column widths
          1.2
        );

        currentY += this.DIVIDER_SPACING;
        currentY = this.addSectionTitleWithLine(
          doc,
          currentY + 1.5 * this.DIVIDER_SPACING,
          'Remark of CDO on Camp:',
          usableWidth
        );

        const remarkText = data?.registrationData?.approvedRemarks || '';
        // Adjust Y as needed (example: if your divider ends at `currentY`)
        const remarkStartY = currentY;

        // Set font and color
        doc.setFontSize(this.FONT_SIZE_NORMAL);
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(60, 60, 60);

        // Calculate max width
        const remarkMaxWidth = usableWidth; // or adjust if you want margins

        // Split text into lines
        const remarkLines = doc.splitTextToSize(remarkText, remarkMaxWidth);

        // Draw text
        doc.text(remarkLines, this.MARGIN_LEFT, remarkStartY + 2, {
          maxWidth: remarkMaxWidth,
          align: 'left',
        });

        // Update currentY for next content
        currentY = remarkStartY + remarkLines.length;
        this.addSignatureSection(
          doc,
          doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET,
          usableWidth
        );
      }
    );
  }

  // Helper methods you should add to your class
  private formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // or format as you prefer
  }

  formatDatewithTimeAmPm(date: string): string {
    if (!date) return '';
    return moment(date).format('DD-MMM-YYYY | HH:mm A');
  }

  /*------- Get Difference Using Date ---------*/
  getDurationInDays(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return '0 Days';
    const start = moment(startDate);
    const end = moment(endDate);
    const duration = end.diff(start, 'days');
    return `${duration} Day${duration !== 1 ? 's' : ''}`;
  }

  getCampDetails(id: any): Observable<any> {
    this.preInstructionList();
    return this._campListService.getCampDetails(id).pipe(
      map((res: any) => {
        const data = res.responseObject;
        const locationParts = [
          data?.address,
          data?.areaName,
          data?.cityName,
          data?.stateName,
          data?.countryName,
          data?.postalCode,
        ].filter(Boolean);
        data.location = locationParts.join(', ');
        if (data.campStatus !== 1) {
          data.inspectionTypeName = data.inspectionType === 1 ? 'Hall' : 'Pandal';
          data.campSiteSurveyChecklistDto.forEach(res => {
            this.preInstruction.forEach((item: any) => {
              if (res.siteSurveyChecklistId === item.id) {
                item.value = res.isChecked;
                item.campSiteSurveyCheckListId = res.campSiteSurveyCheckListId;
              }
            });
          });
        }
        this._campRegistrationPrintService.campDetails = data;
        return data;
      })
    );
  }

  preInstructionList() {
    this._campRegistrationService
      .getPreInstructionList()
      .pipe()
      .subscribe({
        next: (res: any) => {
          if (res) {
            const data = res.responseObject.map((item: any) => {
              let mappedValue = null;
              if (item.value === true) {
                mappedValue = 1;
              } else if (item.value === false) {
                mappedValue = 2;
              }
              return {
                ...item,
                value: mappedValue,
              };
            });
            this.preInstruction = data;
            this.preInstructionData = data;
            this.preInstructionData.forEach((item: any) => {
              if (res.siteSurveyChecklistId === item.id) {
                item.value = res.isChecked;
                item.campSiteSurveyCheckListId = res.campSiteSurveyCheckListId;
              }
            });
          }
        },
      });
  }

  /**
   * Fetches and organizes staff allocation data by staff type
   * @param id - Camp ID
   */
  getCampStaffDetails(id: any): Observable<{ [key: string]: number[] }> {
    return this._campRegistrationService.getCampStaff(id).pipe(
      map((res: any) => {
        const data = res.responseObject;
        return data; // This is correct!
      })
    );
  }

  /**
   * Fetches and organizes staff allocation data by staff type
   * @param id - Camp ID
   * @param type - Type to determine which parameter to send
   */
  getbloodbankissueditemsDetails(id: any, type: number): Observable<{ [key: string]: number[] }> {
    let payload;

    if (type == 2) {
      payload = {
        page: 0,
        size: 1500,
        searchKey: '',
        sort: {
          column: 'campitemidp',
          order: 'desc',
        },
      };
    } else {
      payload = {
        page: 0,
        size: 1500,
        searchKey: '',
        sort: {
          column: 'campconsumableidp',
          order: 'desc',
        },
      };
    }

    let callFromParam: string;

    if (type == 1) {
      callFromParam = 'ForConsumable'; // Set this for type 1
    } else {
      callFromParam = 'ForBloodBags'; // Set different value for other types
    }

    return this._campRegistrationService.getOtherItem(payload, callFromParam, id).pipe(
      map((res: any) => {
        const data = res.responseObject;
        return data.map(item => ({
          ...item,
          type: type, // Add the type to help with filtering
        }));
      })
    );
  }

  /**
   * Creates the camp details header section with QR code area
   * @param doc - The jsPDF document
   * @param startY - Starting Y position
   * @param data - Camp data
   * @param usableWidth - Available width for content
   * @returns New Y position after adding the header
   */

  /*-------------------------------------------------
                Camp Registration Header
  -------------------------------------------------*/
  private async createCampDetailsHeader(
    doc: jsPDF,
    startY: number,
    data: any,
    usableWidth: number,
    type: number
  ): Promise<number> {
    const headerHeight = 20; // Total height for the header section
    const contentWidth = usableWidth - this.QR_CODE_SIZE - 5; // Content area width
    const leftColumnWidth = contentWidth * 0.5; // 50% for left column
    const rightColumnWidth = contentWidth * 0.5; // 50% for right column

    // Background rectangle for the entire header
    doc.setFillColor(204, 204, 204); // Light gray background
    doc.rect(this.MARGIN_LEFT, startY, usableWidth, headerHeight, 'F');

    // Content area setup
    const contentX = this.MARGIN_LEFT;
    const contentY = startY + 2;
    const rowHeight = 5;
    // Set text properties
    doc.setFontSize(this.FONT_SIZE_NORMAL);
    doc.setTextColor(0, 0, 0);

    // Column 1: Camp Name
    const row1Y = contentY + 3;
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Camp Name', contentX + 2, row1Y);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    const campName = String(
      this.getValue(data.registrationData ? data.registrationData : data, 'campName') ||
        'Artem Health Tech'
    );
    // doc.text(campName, contentX + 2 + leftColumnWidth * 0.4, row1Y);
    const camNameMaxWidth = leftColumnWidth * 0.8; // Adjust Space From Right Side
    const camNameLines = doc.splitTextToSize(campName, camNameMaxWidth);
    doc.text(camNameLines, contentX + 2 + leftColumnWidth * 0.25, row1Y);

    // Column 2: Date & Time
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Date & Time', contentX + 2 + leftColumnWidth, row1Y);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    const dateTime = String(
      this.formatDateTime(
        this.getValue(data.registrationData ? data.registrationData : data, 'campStartDate')
      ) || '11-Jan-2025 | 22:00'
    );
    doc.text(dateTime, contentX + 2 + leftColumnWidth + rightColumnWidth * 0.25, row1Y);

    // Column 3: Expected Donors
    const row2Y = contentY + rowHeight + 3;
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Exp. Donors', contentX + 2, row2Y);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    const expDonors = String(
      this.getValue(data.registrationData ? data.registrationData : data, 'probableDonor') || '150'
    );
    doc.text(expDonors, contentX + 2 + leftColumnWidth * 0.4, row2Y);

    // Column 4: Address
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Address', contentX + 2 + leftColumnWidth, row2Y);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    const address = String(
      this.getValue(data.registrationData ? data.registrationData : data, 'address') ||
        'Malad East, Mumbai'
    );
    const addressMaxWidth = rightColumnWidth * 0.8; // Adjust Space From Right Side
    const addressLines = doc.splitTextToSize(address, addressMaxWidth);
    doc.text(addressLines, contentX + 2 + leftColumnWidth + rightColumnWidth * 0.25, row2Y);

    // Column 5: Distance from Blood Bank
    const row3Y = contentY + rowHeight * 2 + 3;
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Dist. from Blood Bank', contentX + 2, row3Y);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    const distance = String(
      this.getValue(
        data.registrationData ? data.registrationData : data,
        'distanceFromBloodBank'
      ) || '200 km'
    );
    doc.text(distance, contentX + 2 + leftColumnWidth * 0.4, row3Y);

    // Adjust total header height
    const dynamicHeaderHeight = row3Y - startY + rowHeight;
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(this.MARGIN_LEFT, startY, this.MARGIN_LEFT + usableWidth, startY); // Top line
    doc.line(
      this.MARGIN_LEFT,
      startY + dynamicHeaderHeight,
      this.MARGIN_LEFT + usableWidth,
      startY + dynamicHeaderHeight
    ); // Bottom line

    // Vertical separator
    doc.line(
      contentX + leftColumnWidth,
      startY + 1.8,
      contentX + leftColumnWidth,
      startY + dynamicHeaderHeight - 1.8
    );

    // QR Code positioning
    const qrX = this.MARGIN_LEFT + usableWidth - this.QR_CODE_SIZE;
    const qrY = startY - 0.5;

    // Generate QR code that links to PDF viewer with the same data
    try {
      const campId = data.registrationData ? data.registrationData.campId : data.campId;
      const qrCodeDataURL = await this._qrPDFService.generateQRCodeForPdf(data, campId, type);
      // Add QR code to PDF
      doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, this.QR_CODE_SIZE, this.QR_CODE_SIZE);
    } catch (error) {
      console.error('Error adding QR code to PDF:', error);
      // Add fallback text or placeholder
      doc.setFontSize(8);
      doc.text('QR Code', qrX + 5, qrY + 10);
    }
    // Add borders & Outer borders
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(this.MARGIN_LEFT, startY, this.MARGIN_LEFT + usableWidth, startY); // Top Side Line
    doc.line(
      this.MARGIN_LEFT,
      startY + headerHeight,
      this.MARGIN_LEFT + usableWidth,
      startY + headerHeight
    ); // Bottom Side Line

    // Vertical separator line between left and right columns with top/bottom spacing
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(
      contentX + leftColumnWidth,
      startY + 1.8, // Add spacing from top
      contentX + leftColumnWidth,
      startY + headerHeight - 1.8 // Subtract spacing from bottom
    );
    return startY + headerHeight + 5; // Calculate header end position
  }

  /**
   * Updated printCampDetails method - now async to handle QR code generation
   */
  async printCampDetails(data: any) {
    await this.generatePdfAsync(
      data,
      'Camp-Details.pdf',
      'Camp Details',
      async (doc, usableWidth) => {
        let currentY = this.INITIAL_Y_POSITION;
        // Add the main title
        currentY = this.addSectionTitle(doc, currentY, 'CAMP REGISTRATION', usableWidth);
        // Create the camp details header section with QR code
        // FIXED: Now properly awaiting the async QR code generation
        currentY = await this.createCampDetailsHeader(doc, currentY - 5, data, usableWidth, 1);
        currentY = this.addSubsectionTitleWithLine(
          doc,
          currentY,
          'Pre-inspection of the Site',
          usableWidth
        );
        if (data.preInstruction && data.preInstruction.length > 0) {
          // Create the first row with Type in the first column and first three dynamic items in columns 2, 3, and 4
          const firstRowLabels = ['Type'];
          const firstRowValues = [this.getValue(data.registrationData, 'inspectionTypeName')];
          const firstRowWidths = [usableWidth * 0.25]; // 25% for each column in 4-column layout

          // Add up to 3 items from preInstruction to complete the first row
          const itemsForFirstRow = Math.min(3, data.preInstruction.length);
          for (let i = 0; i < itemsForFirstRow; i++) {
            firstRowLabels.push(data.preInstruction[i].checkListName);
            firstRowValues.push(data.preInstruction[i].value ? 'Yes' : 'No');
            firstRowWidths.push(usableWidth * 0.25);
          }
          // Create the first row
          currentY = this.createDataRow(
            doc,
            currentY,
            firstRowLabels,
            firstRowValues,
            firstRowWidths,
            usableWidth
          );
          // If there are more than 3 preInstruction items, create additional rows with 4 items per row
          if (data.preInstruction.length > 3) {
            // Start from the 4th item (index 3)
            const remainingItems = data.preInstruction.slice(3);
            // Process the remaining items in groups of 4
            for (let i = 0; i < remainingItems.length; i += 4) {
              const groupItems = remainingItems.slice(i, i + 4);
              // Extract labels and values for this group
              const labels = groupItems.map(item => item.checkListName);
              const values = groupItems.map(item => (item.value ? 'Yes' : 'No'));
              // Calculate widths - 25% for each column in 4-column layout
              const widths = groupItems.map(() => usableWidth * 0.25);
              // Create the row
              currentY = this.createDataRow(doc, currentY, labels, values, widths, usableWidth);
            }
          }
        } else {
          // If there's no preInstruction data, just show the Type
          currentY = this.createDataRow(
            doc,
            currentY,
            ['Type'],
            [this.getValue(data.registrationData, 'inspectionTypeName')],
            [usableWidth],
            usableWidth
          );
        }
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Other Facilities'],
          [this.getValue(data.registrationData, 'otherFacilities')],
          [usableWidth],
          usableWidth
        );
        this.createDataRow(
          doc,
          currentY,
          ['Remark of CDO'],
          [this.getValue(data.registrationData, 'approvedRemarks')],
          [usableWidth],
          usableWidth
        );
        this.addSignatureSection(
          doc,
          doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET,
          usableWidth
        );
      }
    );
  }
  async generateCampDetailsPdfBlob(data: any): Promise<string | null> {
    if (!data) return null;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      this.base64StationaryImage = data.base64StationaryImage;
      // Setup the PDF document (if you have this method)
      this.setupPdfDocument(doc);

      let currentY = this.INITIAL_Y_POSITION;

      // Add the main title
      currentY = this.addSectionTitle(doc, currentY, 'CAMP REGISTRATION', usableWidth);

      // Create the camp details header section with QR code
      currentY = await this.createCampDetailsHeader(doc, currentY - 5, data, usableWidth, 1);

      currentY = this.addSubsectionTitleWithLine(
        doc,
        currentY,
        'Pre-inspection of the Site',
        usableWidth
      );

      if (data.campSiteSurveyChecklistDto && data.campSiteSurveyChecklistDto.length > 0) {
        // Create the first row with Type in the first column and first three dynamic items in columns 2, 3, and 4
        const firstRowLabels = ['Type'];
        const firstRowValues = [
          this.getValue(data.registrationData ? data.registrationData : data, 'inspectionTypeName'),
        ];
        const firstRowWidths = [usableWidth * 0.25]; // 25% for each column in 4-column layout

        // Add up to 3 items from preInstruction to complete the first row
        const itemsForFirstRow = Math.min(3, data.campSiteSurveyChecklistDto.length);
        for (let i = 0; i < itemsForFirstRow; i++) {
          firstRowLabels.push(data.campSiteSurveyChecklistDto[i].checkListName);
          firstRowValues.push(data.campSiteSurveyChecklistDto[i].isChecked ? 'Yes' : 'No');
          firstRowWidths.push(usableWidth * 0.25);
        }

        // Create the first row
        currentY = this.createDataRow(
          doc,
          currentY,
          firstRowLabels,
          firstRowValues,
          firstRowWidths,
          usableWidth
        );

        // If there are more than 3 preInstruction items, create additional rows with 4 items per row
        if (data.campSiteSurveyChecklistDto.length > 3) {
          // Start from the 4th item (index 3)
          const remainingItems = data.campSiteSurveyChecklistDto.slice(3);
          // Process the remaining items in groups of 4
          for (let i = 0; i < remainingItems.length; i += 4) {
            const groupItems = remainingItems.slice(i, i + 4);
            // Extract labels and values for this group
            const labels = groupItems.map(item => item.checkListName);
            const values = groupItems.map(item => (item.isChecked ? 'Yes' : 'No'));
            // Calculate widths - 25% for each column in 4-column layout
            const widths = groupItems.map(() => usableWidth * 0.25);
            // Create the row
            currentY = this.createDataRow(doc, currentY, labels, values, widths, usableWidth);
          }
        }
      } else {
        // If there's no preInstruction data, just show the Type
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Type'],
          [this.getValue(data, 'inspectionTypeName')],
          [usableWidth],
          usableWidth
        );
      }

      currentY = this.createDataRow(
        doc,
        currentY,
        ['Other Facilities'],
        [this.getValue(data, 'otherFacilities')],
        [usableWidth],
        usableWidth
      );

      this.createDataRow(
        doc,
        currentY,
        ['Remark of CDO'],
        [this.getValue(data, 'approvedRemarks')],
        [usableWidth],
        usableWidth
      );

      this.addSignatureSection(
        doc,
        doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET,
        usableWidth
      );

      // Generate blob and return URL
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      return blobUrl;
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      return null;
    }
  }
  async generateCampEquipmentPdfBlob(data: any): Promise<string | null> {
    if (!data) return null;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      this.base64StationaryImage = data.base64StationaryImage;
      // Setup the PDF document (if you have this method)
      this.setupPdfDocument(doc);

      let currentY = this.INITIAL_Y_POSITION;

      currentY = this.addSectionTitle(doc, currentY - 2.5, 'EQUIPMENT CHECKLIST', usableWidth);
      await this.createCampDetailsHeader(doc, currentY - 5, data, usableWidth, 2);
      currentY = this.addSectionTitleWithLine(
        doc,
        currentY + 7 * this.DIVIDER_SPACING,
        'Blood Bags',
        usableWidth
      );

      const equipmentBloodBagItems =
        data?.equipmentData?.filter(item => item.itemTypeIdf === 6) ?? [];
      const equipmentBloodBagHeaders = ['No.', 'Name', 'Type', 'Qty', 'Remarks'];

      this.createItemsTable(
        doc,
        currentY,
        equipmentBloodBagHeaders,
        usableWidth,

        equipmentBloodBagItems.map((equipment, index) => [
          (index + 1).toString(),
          equipment.itemAlias || '',
          equipment.bagType || '',
          equipment.quantityIssued || '',
          equipment.remarks || '',
        ]),
        [
          usableWidth * 0.05,
          usableWidth * 0.5,
          usableWidth * 0.1,
          usableWidth * 0.1,
          usableWidth * 0.25,
        ],
        1.2
      );

      currentY = this.addSectionTitleWithLine(
        doc,
        currentY + 7 * this.DIVIDER_SPACING,
        'Other Items',
        usableWidth
      );
      const equipmentOtherItems = data?.equipmentData?.filter(item => item.type !== 6) ?? [];
      const equipmentOtherHeaders = ['No.', 'Name', 'Type', 'Qty', 'Availability'];

      this.createItemsTable(
        doc,
        currentY,
        equipmentOtherHeaders,
        usableWidth,

        equipmentOtherItems.map((equipment, index) => [
          (index + 1).toString(),
          equipment.itemAlias || '',
          equipment.bagType || '',
          equipment.quantityIssued || '',
          equipment.remarks || '',
        ]),
        [
          usableWidth * 0.05,
          usableWidth * 0.5,
          usableWidth * 0.1,
          usableWidth * 0.1,
          usableWidth * 0.25,
        ],
        1.2
      );

      this.addSignatureSection(
        doc,
        doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET,
        usableWidth
      );

      // Generate blob and return URL
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      return blobUrl;
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      return null;
    }
  }
  async generateCampStaffPdfBlob(data: any): Promise<string | null> {
    if (!data) return null;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      this.base64StationaryImage = data.base64StationaryImage;

      // Setup the PDF document
      this.setupPdfDocument(doc);

      let currentY = this.INITIAL_Y_POSITION;

      currentY = this.addSectionTitle(doc, currentY - 2.5, 'STAFF ALLOCATION', usableWidth);
      currentY = await this.createCampDetailsHeaderDynamic(doc, currentY - 5, data, usableWidth);

      currentY = this.addSectionTitleWithLine(
        doc,
        currentY + 2 * this.DIVIDER_SPACING,
        'Team Members',
        usableWidth
      );

      // Add medical officer to camp staffs
      data.campStaff?.campStaffs.push({
        technicianName: data.campStaff.medicalOfficerName,
        technicianRole: 'Medical Officer',
      });

      const teamMembers = data.campStaff?.campStaffs ?? [];

      // Define the role hierarchy for sorting
      const roleHierarchy = {
        'CDO': 1,
        'Medical Officer': 2,
        'BTO': 3,
        'Nursing Staff': 4,
        'Lab Tech': 5,
        'Other Staff': 6,
      };

      // Function to get role priority (lower number = higher priority)
      const getRolePriority = (role: string): number => {
        // Check exact matches first
        if (roleHierarchy[role]) {
          return roleHierarchy[role];
        }

        // Check partial matches for flexibility
        const lowerRole = role.toLowerCase();
        if (lowerRole.includes('cdo')) return 1;
        if (lowerRole.includes('medical officer')) return 2;
        if (lowerRole.includes('bto')) return 3;
        if (lowerRole.includes('nursing')) return 4;
        if (lowerRole.includes('lab') && lowerRole.includes('tech')) return 5;

        // Default to "Other Staff" category
        return 6;
      };

      // Sort team members by role hierarchy
      const sortedTeamMembers = teamMembers.sort((a, b) => {
        const priorityA = getRolePriority(a.technicianRole || '');
        const priorityB = getRolePriority(b.technicianRole || '');

        // If roles have same priority, sort alphabetically by name
        if (priorityA === priorityB) {
          return (a.technicianName || '').localeCompare(b.technicianName || '');
        }

        return priorityA - priorityB;
      });

      const teamHeaders = ['No.', 'Name', 'Designation', 'Signature'];

      currentY = this.createItemsTable(
        doc,
        currentY,
        teamHeaders,
        usableWidth,
        sortedTeamMembers.map((member, index) => [
          (index + 1).toString(),
          member.technicianName || '',
          member.technicianRole || '',
          '', // Leave signature empty
        ]),
        [], // Use default column widths
        1.2
      );

      currentY += this.DIVIDER_SPACING;
      currentY = this.addSectionTitleWithLine(
        doc,
        currentY + 1.5 * this.DIVIDER_SPACING,
        'Remark of CDO on Camp:',
        usableWidth
      );

      const remarkText = data?.campRegistration?.approvedRemarks || '';
      // Adjust Y as needed (example: if your divider ends at `currentY`)
      const remarkStartY = currentY;

      // Set font and color
      doc.setFontSize(this.FONT_SIZE_NORMAL);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);

      // Calculate max width
      const remarkMaxWidth = usableWidth; // or adjust if you want margins

      // Split text into lines
      const remarkLines = doc.splitTextToSize(remarkText, remarkMaxWidth);

      // Draw text
      doc.text(remarkLines, this.MARGIN_LEFT, remarkStartY + 2, {
        maxWidth: remarkMaxWidth,
        align: 'left',
      });

      // Update currentY for next content
      currentY = remarkStartY + remarkLines.length;
      this.addSignatureSection(
        doc,
        doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET,
        usableWidth
      );

      // Generate blob and return URL
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      return blobUrl;
    } catch (error) {
      console.error('Error generating camp staff PDF blob:', error);
      return null;
    }
  }
  async generateCampCompletedPdfBlob(data: any): Promise<string | null> {
    if (!data) return null;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      this.base64StationaryImage = data.base64StationaryImage;

      // Setup the PDF document
      this.setupPdfDocument(doc);

      let currentY = this.INITIAL_Y_POSITION;
      const pageHeight = doc.internal.pageSize.getHeight();
      const footerTop = pageHeight - this.FOOTER_POSITION - 5;

      currentY = this.addSectionTitle(doc, currentY - 3, 'CAMP COMPLETED', usableWidth);

      // Use returned currentY
      currentY = await this.createCampCompletedHeaderDynamic(doc, currentY - 5, data, usableWidth);

      /*-----------------------------------
               Blood Bags
    -----------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Blood Bags', usableWidth);
      const equipmentBloodBagItems =
        data?.compCompleted?.filter(item => item.itemTypeIdf === 3) ?? [];
      const equipmentHeaders = ['No.', 'Bags Type', 'Total Bags Issued', 'Bags Collected'];

      currentY = this.createItemsTable(
        doc,
        currentY,
        equipmentHeaders,
        usableWidth,
        equipmentBloodBagItems.map((equipment, index) => [
          (index + 1).toString(),
          equipment.itemAlias || '',
          equipment.quantityIssued || '',
          equipment.quantityReturned || '',
        ]),
        [usableWidth * 0.05, usableWidth * 0.32, usableWidth * 0.32, usableWidth * 0.31],
        1
      );

      /*------------------------------------------
         Add signature & Footer section
    ------------------------------------------*/
      const signatureSectionHeight = 15; // Approximate height of signature section
      if (currentY + signatureSectionHeight + this.SIGNATURE_SECTION_OFFSET > footerTop) {
        doc.addPage();
        currentY = this.INITIAL_Y_POSITION;
      }

      this.addSignatureSection(
        doc,
        doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET + 5,
        usableWidth,
        'Signature of CDO/PRO',
        'bold'
      );

      // Generate blob and return URL
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      return blobUrl;
    } catch (error) {
      console.error('Error generating camp completed PDF blob:', error);
      return null;
    }
  }

  // Usage example:
  async showPdfInIframe(data: any) {
    const pdfUrl = await this.generateCampDetailsPdfBlob(data);

    if (pdfUrl) {
      // Method 1: Set iframe src directly
      const iframe = document.getElementById('pdfIframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = pdfUrl;
      }

      // Method 2: Or return the URL to use in template
      // <iframe [src]="pdfUrl" width="100%" height="600px"></iframe>

      // Clean up after some time (optional)
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 300000); // 5 minutes
    }
  }

  // Alternative: Return both blob and URL
  async generateCampDetailsPdfData(data: any): Promise<{ blob: Blob; url: string } | null> {
    if (!data) return null;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      // const pageWidth = doc.internal.pageSize.getWidth();
      // const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;

      // Setup the PDF document
      this.setupPdfDocument(doc);

      // ... same PDF generation logic as above ...

      // Generate blob
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      return {
        blob: pdfBlob,
        url: blobUrl,
      };
    } catch (error) {
      console.error('Error generating PDF data:', error);
      return null;
    }
  }

  /**
   * Async version of generatePdf method
   */
  private async generatePdfAsync(
    data: any,
    filename: string,
    subject: string,
    contentCallback: (doc: jsPDF, usableWidth: number) => Promise<void>
  ): Promise<void> {
    if (!data) return;
    this.pdfLoading = true;
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      this.setupPdfDocument(doc);

      // Execute the content callback
      await contentCallback(doc, usableWidth);

      // Create blob and open in new tab
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab
      const newWindow = window.open(blobUrl, '_blank');

      // Check if popup was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback: try to download the file if popup is blocked
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // this._toast.warning('Popup blocked. PDF downloaded instead.');
      }

      // Clean up the blob URL after a short delay to prevent memory leaks
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      this._toast.error('Error generating PDF. Please try again.');
    } finally {
      this.pdfLoading = false;
    }
  }

  /*-------------------------------------------------
            Camp Registration Header dynamic
  -------------------------------------------------*/
  private async createCampDetailsHeaderDynamic(
    doc: jsPDF,
    startY: number,
    data: any,
    usableWidth: number
  ): Promise<number> {
    const rowHeight = 4.5;
    const leftX = this.MARGIN_LEFT + 2;
    const midX = this.MARGIN_LEFT + usableWidth / 2;
    const leftValueX = leftX + 25;
    const rightValueX = midX + 30;
    const leftColumnMaxWidth = usableWidth / 2;
    const rightColumnMaxWidth = usableWidth / 2 - 10;
    const regData = data.registrationData;

    // Get all data values
    const duration = this.getDurationInDays(
      this.getValue(regData ? regData : data.campRegistration, 'campStartDate'),
      this.getValue(regData ? regData : data.campRegistration, 'campEndDate')
    );
    const linesLeft = [
      doc.splitTextToSize(
        String(this.getValue(regData ? regData : data.campRegistration, 'campName')),
        leftColumnMaxWidth
      ),
      doc.splitTextToSize(
        String(this.getValue(regData ? regData : data.campRegistration, 'campTypeName')),
        leftColumnMaxWidth
      ),
      doc.splitTextToSize(
        String(
          this.getValue(regData ? regData : data.campRegistration, regData ? 'location' : 'address')
        ),
        leftColumnMaxWidth
      ),
      doc.splitTextToSize(duration, leftColumnMaxWidth),
    ];
    const linesRight = [
      doc.splitTextToSize(
        this.formatDatewithTimeAmPm(
          this.getValue(regData ? regData : data.campRegistration, 'campStartDate')
        ),
        rightColumnMaxWidth
      ),
      doc.splitTextToSize(
        this.formatDatewithTimeAmPm(
          this.getValue(regData ? regData : data.campRegistration, 'campEndDate')
        ),
        rightColumnMaxWidth
      ),
      doc.splitTextToSize(
        String(this.getValue(regData ? regData : data.campRegistration, 'vehicleNo')),
        rightColumnMaxWidth
      ),
    ];
    // Calculate total height of each column (sum of lines * rowHeight)
    const totalHeightLeft = linesLeft.reduce((acc, line) => acc + line.length * rowHeight, 0);
    const totalHeightRight = linesRight.reduce((acc, line) => acc + line.length * rowHeight, 0);
    // Take the max of the two column heights to set header height
    const headerHeight = Math.max(totalHeightLeft, totalHeightRight) + 3.5; // 3.5px padding of bottom of header
    // Draw header background
    doc.setFillColor(204, 204, 204);
    doc.rect(this.MARGIN_LEFT, startY, usableWidth, headerHeight, 'F');

    // === LEFT COLUMN ===
    doc.setFontSize(this.FONT_SIZE_NORMAL);
    const leftLabels = ['Camp Name', 'Camp Type', 'Address', 'Duration'];
    let leftY = startY + 5;
    leftLabels.forEach((label, idx) => {
      const valueLines = linesLeft[idx];
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(label, leftX, leftY);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(valueLines, leftValueX, leftY);
      // Increase Y by value line height (reduce space only used by current value)
      leftY += valueLines.length * rowHeight;
    });

    // === RIGHT COLUMN ===
    const rightLabels = ['Date of Camp', 'Date & Time of Dept.', 'Vehicle Used'];
    let rightY = startY + 5;
    rightLabels.forEach((label, idx) => {
      const valueLines = linesRight[idx];
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(label, midX, rightY);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(valueLines, rightValueX, rightY);
      // Increase Y by height only of this content
      rightY += valueLines.length * rowHeight;
    });

    // === QR CODE ===
    // QR code
    const qrX = this.MARGIN_LEFT + usableWidth - this.QR_CODE_SIZE + 4.7;
    const qrY = startY + 1.8;
    try {
      const campId = regData ? regData.campId : data.campRegistration.campId;
      const qrCodeDataURL = await this._qrPDFService.generateQRCodeForPdf(data, campId, 3);
      // Add QR code to PDF
      doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, this.QR_CODE_SIZE - 7, this.QR_CODE_SIZE - 7);
    } catch (error) {
      doc.rect(qrX, qrY, 15, 15, 'S');
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text('QR', qrX + 5, qrY + 8);
    }

    // === BORDER LINES ===
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(this.MARGIN_LEFT, startY, this.MARGIN_LEFT + usableWidth, startY); // top
    doc.line(
      this.MARGIN_LEFT,
      startY + headerHeight,
      this.MARGIN_LEFT + usableWidth,
      startY + headerHeight
    ); // bottom
    doc.line(midX - 3, startY + 1.8, midX - 3, startY + headerHeight - 1.8); // vertical divider
    // Return bottom Y for next section
    return startY + headerHeight + 5;
  }
}
