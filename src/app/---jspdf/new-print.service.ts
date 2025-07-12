import { inject, Injectable } from '@angular/core';
import { ToastService } from '@services';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { PRINT_KEY_MAPPING } from './camp-registration.constant';

// Assuming these are part of a class structure
@Injectable({
  providedIn: 'root',
})
export class JsPDFPrintService {
  private readonly _toast = inject(ToastService);

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

  /** Footer line width */
  private readonly FOOTER_LINE_WIDTH = 0.3;

  /** Space after section titles */
  private readonly SECTION_TITLE_SPACING = 7;

  /** Space after data rows */
  private readonly DATA_ROW_SPACING = 2;

  /** Color for text labels */
  private readonly LABEL_TEXT_COLOR: [number, number, number] = [92, 92, 92];

  /** Color for black elements */
  private readonly COLOR_BLACK: [number, number, number] = [0, 0, 0];

  /** Color for white elements */
  private readonly COLOR_WHITE: [number, number, number] = [255, 255, 255];

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

  private base64StationaryImage: string = ''; // Assume this is loaded
  /** Username of the currently logged in user */
  loggedInUsername: string = '';
  currentDateTime: string = '';

  // For loading indicatorMock toast service
  private pdfLoading: boolean = false;

  /**
   * Mapping between field keys and their corresponding data properties
   * Used for accessing data values in a consistent way
   */
  private readonly keyMapping: { [key: string]: string } = PRINT_KEY_MAPPING;

  /**
   * Sets the base64 encoded stationary image for PDF letterhead
   * @param base64 - Base64 encoded image string
   */
  setStationaryImage(base64: string) {
    this.base64StationaryImage = base64 ?? '';
  }

  /**
   * Sets the username of the logged in user
   * @param userFullName - Full name of the logged in user
   */
  setLoggedInUsername(userFullName: string) {
    this.loggedInUsername = userFullName ?? '';
  }

  /**
   * @param data - The source object containing key-value data.
   * @param key - The original key to look up (which may be mapped).
   * @returns The corresponding value as a string, or `'-'` if missing.
   */
  private getValue(data: any, key: string): string {
    const mappedKey = this.keyMapping[key] || key; // Use key directly if not mapped
    return data?.[mappedKey] !== undefined && data?.[mappedKey] !== null
      ? String(data[mappedKey])
      : '-';
  }

  /*----------------------------------------------------------------
                         Helper Methods Start
  ----------------------------------------------------------------*/
  getAgeFromDOB(dob: string): string {
    if (!dob) return '';
    const birthDate = moment(dob, 'YYYY-MM-DD');
    const today = moment();
    const years = today.diff(birthDate, 'years');
    birthDate.add(years, 'years');
    const months = today.diff(birthDate, 'months');
    birthDate.add(months, 'months');
    const days = today.diff(birthDate, 'days');
    return `${years}Y ${months}M ${days}D`;
  }

  getEvenTypeName(eventType: number): string {
    return eventType === 1 ? 'Walk In' : 'Camp';
  }

  formatDateToDisplay(date: string): string {
    if (!date) return '';
    return moment(date).format('DD-MMM-YYYY');
  }

  formatDatewithTime(date: string): string {
    if (!date) return '';
    return moment(date).format('DD-MMM-YYYY | HH:mm');
  }

  formatDatewithTimeAmPm(date: string): string {
    if (!date) return '';
    return moment(date).format('DD-MMM-YYYY | HH:mm A');
  }

  donorStatusName(status: number): string {
    switch (status) {
      case 1:
        return 'Registered';
      case 2:
        return 'Accepted';
      case 3:
        return 'Temporary Rejected';
      case 4:
        return 'Permanent Rejected';
      case 5:
        return 'Cancelled';
      case 6:
        return 'Completed';
      default:
        return '-';
    }
  }
  /*----------------------------------------------------------------
                          Helper Methods End
  ----------------------------------------------------------------*/

  /**
   * @param pdf - The jsPDF document instance.
   * @param pageWidth - The width of the PDF page (in mm).
   * @param pageHeight - The height of the PDF page (in mm).
   */
  private addLetterheadBackground(pdf: jsPDF, pageWidth: number, pageHeight: number) {
    if (this.base64StationaryImage) {
      pdf.addImage(this.base64StationaryImage, 'JPEG', 0, 0, pageWidth, pageHeight);
    }
  }

  /**
   * @param doc - The jsPDF document instance.
   * @param startY - The vertical position on the page to begin the title.
   * @param title - The title text to be rendered in the section.
   * @param width - The total width of the table (typically the usable content width).
   * @returns The new Y position (`finalY + spacing`) after rendering the title.
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

  /**
   * @param doc - The jsPDF document instance.
   * @param startY - The vertical position on the page to start drawing the section.
   * @param title - The section title text to be displayed.
   * @param usableWidth - The width of the drawable area (used to determine line length).
   * @returns The new Y position after drawing the title and line (to be used for subsequent content).
   */
  private addSectionTitleWithLine(
    doc: jsPDF,
    startY: number,
    title: string,
    usableWidth: number
  ): number {
    const requiredSpace = 10; // Approx height of title + line + some buffer
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerTop = pageHeight - this.FOOTER_POSITION - 5; // 5mm above footer
    if (startY + requiredSpace > footerTop) {
      doc.addPage();
      startY = this.INITIAL_Y_POSITION; // Reset Y position for new page content
    }
    doc.setFontSize(10); // Adjust font size as needed for section titles
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Use COLOR_BLACK from your constants
    const textX = this.MARGIN_LEFT;
    doc.text(title, textX, startY);
    const lineY = startY + 3; // Adjust vertical position of the line relative to text
    doc.setDrawColor(163, 163, 163); // Gray color for the line (matching your header lines)
    doc.setLineWidth(0.4); // Line width
    doc.line(this.MARGIN_LEFT, lineY, this.MARGIN_LEFT + usableWidth, lineY);
    return lineY + 2; // Return new Y position, adding some space after line Bottom Side
  }

  /**
   * Generates a PDF document with a custom letterhead, footer, and dynamic content.
   * @param data - The data used for generating content (used by `contentCallback`). If null or undefined, the PDF is not generated.
   * @param filename - The name of the generated PDF file.
   * @param subject - The subject/title used in the document metadata.
   * @param contentCallback - A callback function that receives the `doc` instance, usable width, and `totalPagesExp` string.
   * This function should be responsible for adding main content (e.g. using jsPDF-AutoTable),
   * and may include page-wise `didDrawPage()` to call `addFooter`.
   */
  private async generatePdf(
    data: any,
    filename: string,
    subject: string,
    contentCallback: (doc: jsPDF, usableWidth: number, totalPagesExp: string) => void
  ) {
    if (!data) return;
    this.pdfLoading = true;
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const totalPagesExp = '{total_pages_count_string}';
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      // Override addPage to re-apply background
      const originalAddPage = doc.addPage;
      doc.addPage = (...args: any[]) => {
        originalAddPage.apply(doc, args);
        this.addLetterheadBackground(
          doc,
          doc.internal.pageSize.getWidth(),
          doc.internal.pageSize.getHeight()
        );
        return doc;
      };
      // Initial background
      this.addLetterheadBackground(
        doc,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight()
      );
      // Call callback (will include autoTable inside it)
      contentCallback(doc, usableWidth, totalPagesExp);
      // Finalize: Add footer to all pages
      this.finalizePdf(doc, totalPagesExp, filename, subject);
    } catch (error) {
      this._toast.error('Error generating PDF. Please try again.');
      console.error('Error generating PDF:', error);
    } finally {
      this.pdfLoading = false;
    }
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
      this.addFooter(doc, i, totalPagesExp); // ✅ pass current page
    }
    doc.setDocumentProperties({
      title: filename,
      subject: subject,
      author: 'BMC Health Portal',
      keywords: subject,
      creator: this.loggedInUsername,
    });
    if (typeof (doc as any).putTotalPages === 'function') {
      (doc as any).putTotalPages(totalPagesExp);
    }
    doc.output('dataurlnewwindow', { filename });
  }

  /**
   * Adds a footer to the specified page of the PDF document.
   * @param doc - The jsPDF document instance.
   * @param pageNumber - The current page number being processed.
   * @param totalPagesExp - A placeholder string (e.g. `{total_pages_count_string}`) used for total page count,
   */
  private addFooter(doc: jsPDF, pageNumber: number, totalPagesExp: string) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(this.FOOTER_LINE_WIDTH);
    doc.setTextColor(...this.LABEL_TEXT_COLOR);
    doc.setDrawColor(...this.LABEL_TEXT_COLOR);
    // Line
    doc.line(
      this.MARGIN_LEFT,
      pageHeight - this.FOOTER_POSITION,
      pageWidth - this.MARGIN_RIGHT,
      pageHeight - this.FOOTER_POSITION
    );
    doc.setFontSize(this.FONT_SIZE_NORMAL);
    doc.setFont('Helvetica', 'normal');
    // Printed By
    doc.text(
      `Printed By: ${this.loggedInUsername}`,
      this.MARGIN_LEFT,
      pageHeight - this.FOOTER_TEXT_POSITION
    );
    // DateTime
    this.currentDateTime = moment().format('DD-MMMM-yyyy / hh:mm A');
    doc.text(
      this.currentDateTime,
      this.TEXT_CENTER_ALIGNMENT,
      pageHeight - this.FOOTER_TEXT_POSITION,
      { align: 'center' }
    );
    // Page number text
    const pageStr = `Page ${pageNumber} of ${totalPagesExp}`;
    doc.text(
      pageStr,
      pageWidth - this.MARGIN_RIGHT - this.PAGE_NUMBER_OFFSET,
      pageHeight - this.FOOTER_TEXT_POSITION
    );
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
    tablePadding: number = 2,
    halign: 'left' | 'center' | 'right' | 'justify' = 'left'
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
      theme: 'plain',
      styles: {
        halign: halign,
        font: 'helvetica',
        fontSize: this.FONT_SIZE_NORMAL,
        textColor: this.COLOR_BLACK,
        cellPadding: tablePadding,
        lineWidth: 0,
      },
      headStyles: {
        fontStyle: 'bold',
        textColor: this.COLOR_BLACK,
        fillColor: false,
      },
      alternateRowStyles: {
        fillColor: false,
      },
      margin: {
        // to avoid footer overlap
        top: this.INITIAL_Y_POSITION,
        bottom: this.FOOTER_POSITION + 4,
        left: this.MARGIN_LEFT,
        right: this.MARGIN_RIGHT,
      },
      tableWidth: width,
      columnStyles: columnWidths.length
        ? columnWidths.reduce(
            (acc, colWidth, index) => {
              acc[index] = { cellWidth: colWidth };
              return acc;
            },
            {} as Record<number, any>
          )
        : undefined,
    });
    return (doc as any).lastAutoTable.finalY + this.DATA_ROW_SPACING;
  }

  /*---------------------------------------------------------------------------------------------*/
  /*----*/
  /*----*/
  /*---- Donor Screening Print ----*/
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
                Donor Screening Header
  -------------------------------------------------*/
  private createDonorScreeningHeader(doc: jsPDF, startY: number, data: any, usableWidth: number) {
    const headerHeight = 25; // Total height for the header section
    const contentX = this.MARGIN_LEFT;
    const contentY = startY + 2;
    const rowHeight = 5;

    // Background rectangle for the entire header
    doc.setFillColor(204, 204, 204); // Light gray background
    doc.rect(this.MARGIN_LEFT, startY, usableWidth, headerHeight, 'F');

    // Set text properties for the main header title (Name and Date)
    doc.setFontSize(this.FONT_SIZE_NORMAL + 2); // Slightly larger font for the main title
    doc.setTextColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Black color

    /*------------------------------------------
                    Left side: Name
    ------------------------------------------*/
    let nameText = String(
      this.getValue(data.demoGraphicInfo, 'firstName') +
        ' ' +
        this.getValue(data.demoGraphicInfo, 'middleName') +
        ' ' +
        this.getValue(data.demoGraphicInfo, 'familyName')
    );
    const gender = String(this.getValue(data.demoGraphicInfo, 'gender')); // 'M' or 'F' or other
    const dateOfBirth = this.getAgeFromDOB(this.getValue(data.tappingData[0], 'dateOfBirth'));
    // Format name with gender and age
    if (nameText) {
      nameText += ` (${gender} / ${dateOfBirth})`;
    }
    /*------------------------------------------
                    Left side: Icon
    ------------------------------------------*/
    // Determine icon and draw based on gender
    const iconX = contentX + 2;
    const iconY = contentY - 0.7; // Adjust Y to align with text
    const iconSize = 3.4; // Size of the icon
    doc.setDrawColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Set icon color
    doc.setFillColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Set fill color for solid parts
    const girlIcon = './assets/icons/girl-icon.png';
    const boyIcon = './assets/icons/boy-icon.png';
    if (gender && gender === 'Male') {
      doc.addImage(boyIcon, 'PNG', iconX, iconY, iconSize, iconSize);
    } else {
      doc.addImage(girlIcon, 'PNG', iconX, iconY, iconSize, iconSize);
    }
    // Set font for name to bold
    doc.setFont('Helvetica', 'bold');
    // Position the name text next to the icon
    const nameTextX = iconX + iconSize + 2; // Space after icon
    doc.text(nameText, nameTextX, contentY + 2.3);

    /*------------------------------------------
             Right side: Date and Time
    ------------------------------------------*/
    const dateTime = String(
      this.formatDatewithTimeAmPm(this.getValue(data.demoGraphicInfo, 'statusDateTime')) ||
        '25-Jun-2025 | 18:15' // Fallback to provided date if data is missing
    );
    doc.setFont('Helvetica', 'normal'); // Set font back to normal for date
    doc.setFontSize(this.FONT_SIZE_NORMAL); // Smaller font size for date
    doc.text(dateTime, this.MARGIN_LEFT + usableWidth - this.MARGIN_RIGHT + 12, contentY + 2.5, {
      align: 'right',
    });

    // Draw the horizontal line below the title
    const lineY = startY + 6.5; // Adjust vertical position of the line relative to text
    doc.setDrawColor(163, 163, 163); // Gray color for the line (matching your header lines)
    doc.setLineWidth(0.3); // Line width
    doc.line(this.MARGIN_LEFT + 2, lineY, this.MARGIN_LEFT - 3 + usableWidth, lineY);
    lineY + 2; // Return new Y position, adding some space after line Bottom Side

    // --- Details in two columns below the main header ---
    // Reset font to normal and size for detail rows
    doc.setFontSize(this.FONT_SIZE_NORMAL);
    doc.setTextColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]);
    const leftColumnX = contentX + 2;
    const rightColumnX = contentX + usableWidth * 0.5 + 2; // Midpoint + small offset

    // Row 1: UHID and Donor ID
    let currentDetailY = contentY + 10;
    doc.setTextColor(60, 60, 60); // Gray for labels
    doc.setFont('Helvetica', 'normal');
    doc.text('UHID', leftColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0); // Black for values
    doc.setFont('Helvetica', 'bold');
    doc.text(this.getValue(data.demoGraphicInfo, 'citizenCode'), leftColumnX + 25, currentDetailY); // Adjust 25 for label width

    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Donor ID', rightColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.text(this.getValue(data.demoGraphicInfo, 'donorCode'), rightColumnX + 25, currentDetailY);

    // Row 2: Address and Blood Unit No
    currentDetailY += rowHeight;
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Address', leftColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    const address =
      this.getValue(data.tappingData[0], 'areaName') +
      ' ' +
      this.getValue(data.tappingData[0], 'address1') +
      ' ' +
      this.getValue(data.tappingData[0], 'address2') +
      ' ' +
      this.getValue(data.tappingData[0], 'cityName');
    const addressMaxWidth = usableWidth * 0.5 - 30; // Adjust max width for address to fit
    const addressLines = doc.splitTextToSize(address, addressMaxWidth);
    doc.text(addressLines, leftColumnX + 25, currentDetailY); // Adjust 30 for label width

    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Blood Unit No', rightColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.text(this.getValue(data.tappingData[0], 'bagNo'), rightColumnX + 25, currentDetailY); // Adjust 30 for label width

    // Row 3: Donation Type
    currentDetailY += rowHeight;
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Donation Type', leftColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.text(this.getValue(data.tappingData[0], 'donationType'), leftColumnX + 25, currentDetailY); // Adjust 25 for label width

    //----------- QR Code positioning ------------
    const qrX = this.MARGIN_LEFT + usableWidth - this.QR_CODE_SIZE;
    const qrY = startY + 7.3; // Adjusted QR Y to be within the shaded header area
    // Add QR Code (existing logic, ensure it's still positioned correctly within the header)
    try {
      const bgColor = 'cccccc';
      const qrUrl = this.getValue(data, 'scannerURL');
      const qrCodeServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}&format=png&bgcolor=${bgColor}`;
      // Calculate image position with margins
      const imageX = qrX + 4;
      const imageY = qrY + 2;
      // Add the QR code image
      doc.addImage(qrCodeServiceUrl, 'PNG', imageX, imageY, 13, 13);
    } catch (error) {
      doc.rect(qrX + 2, qrY + 2, this.QR_CODE_SIZE - 8, headerHeight - 4, 'S');
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text('QR', qrX + this.QR_CODE_SIZE / 2 - 2, qrY + headerHeight / 2 + 1);
    }
    // Add borders & Outer borders (existing logic)
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(this.MARGIN_LEFT, startY, this.MARGIN_LEFT + usableWidth, startY); // Top Side Line
    doc.line(
      this.MARGIN_LEFT,
      startY + headerHeight,
      this.MARGIN_LEFT + usableWidth,
      startY + headerHeight
    ); // Bottom Side Line
    // Vertical separator line between left and right columns with top/bottom spacing (existing logic)
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(
      contentX + usableWidth * 0.5, // This line is for the main columns below the name/date, adjust if needed
      startY + 8, // Add spacing from top (adjust based on new top section)
      contentX + usableWidth * 0.5,
      startY + headerHeight - 1.8 // Subtract spacing from bottom
    );
    return startY + headerHeight + 5; // Calculate header end position
  }

  /*-------------------------------------------------
                Donor Screening Print
  -------------------------------------------------*/
  public printDonorScreening(data: any) {
    this.generatePdf(data, 'Donor-screening.pdf', 'Donor screening', async (doc, usableWidth) => {
      let currentY = this.INITIAL_Y_POSITION;
      const pageHeight = doc.internal.pageSize.getHeight();
      const footerTop = pageHeight - this.FOOTER_POSITION - 5;
      currentY = this.addSectionTitle(doc, currentY - 3, 'DONOR SCREENING', usableWidth);
      // Use returned currentY
      currentY = this.createDonorScreeningHeader(doc, currentY - 5, data, usableWidth);
      // Custom cell padding
      const cell_padding = { top: 0.5, right: 0, bottom: 0.5, left: 0 };

      /*-----------------------------------
                   Event Details
      -----------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Event Details', usableWidth);
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Event Type', 'Component Type'],
        [
          this.getEvenTypeName(Number(this.getValue(data.donorComponentDetails?.[0], 'eventType'))), // Added optional chaining
          String(this.getValue(data.donorComponentDetails?.[0], 'bloodComponentName')), // Added optional chaining
        ],
        [usableWidth * 0.5, usableWidth * 0.5],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );

      /*-----------------------------------
                    Donor Details
      -----------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Donor Details', usableWidth);
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Email', 'Date of Birth', 'Occupation', 'Contact No.'],
        [
          this.getValue(data.donorOtherDetails, 'emailAddress'),
          this.formatDateToDisplay(this.getValue(data.tappingData?.[0], 'dateOfBirth')), // Added optional chaining
          this.getValue(data.donorOtherDetails, 'occupation'),
          this.getValue(data.tappingData?.[0], 'contactDetails'), // Added optional chaining
        ],
        [usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Identity Type', 'Identity No.'],
        [
          this.getValue(data.donorOtherDetails, 'identityName'),
          this.getValue(data.donorOtherDetails, 'identityNumber'),
        ],
        [usableWidth * 0.25, usableWidth * 0.25],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );

      /*-----------------------------------
                      UHID Reference
      -----------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'UHID Reference', usableWidth);
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Patient Name', 'Patient UHID'],
        [
          this.getValue(data.demoGraphicInfo, 'firstName') +
            ' ' +
            this.getValue(data.demoGraphicInfo, 'middleName') +
            ' ' +
            this.getValue(data.demoGraphicInfo, 'familyName'),
          this.getValue(data.demoGraphicInfo, 'citizenCode'),
        ],
        [usableWidth * 0.5, usableWidth * 0.5],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );

      /*-----------------------------------
                  Permanent Address
      -----------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Permanent Address', usableWidth);
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Address', 'Area', 'City'],
        [
          (this.getValue(data.tappingData?.[0], 'address1') || '') +
            (this.getValue(data.tappingData?.[0], 'address2') || ''),
          this.getValue(data.tappingData?.[0], 'areaName'),
          this.getValue(data.tappingData?.[0], 'cityName'),
        ],
        [usableWidth * 0.5, usableWidth * 0.25, usableWidth * 0.25],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Pincode', 'State', 'Country'],
        [
          this.getValue(data.donorOtherDetails, 'pincode'),
          this.getValue(data.donorOtherDetails, 'stateName'),
          this.getValue(data.donorOtherDetails, 'countryName'),
        ],
        [usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );

      /*-----------------------------------------
            Previous Blood Donation Details
      -----------------------------------------*/
      currentY = this.addSectionTitleWithLine(
        doc,
        currentY + 7,
        'Previous Blood Donation Details',
        usableWidth
      );
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Donate Earlier', 'Date of Donation'],
        [
          this.getValue(data.donorOtherDetails, 'donatedEarlier'),
          this.getValue(data.donorOtherDetails, 'dateOfLastDonation'),
        ],
        [usableWidth * 0.5, usableWidth * 0.5],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );

      /*-----------------------------------------
                        Vitals
      -----------------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 8, 'Vitals', usableWidth);
      const vitalsData = data?.vitalsData ?? [];
      const filteredVitals = vitalsData.filter(
        v => v.measurementValue !== null && v.measurementValue !== undefined
      );
      const headers = filteredVitals.map(v => v.measurementLabel?.trim() || '-');
      const valuesRow = filteredVitals.map(v => v.measurementValue?.toString().trim() || '-');
      const unitsRow = filteredVitals.map(v => v.valueTag?.trim() || '-');
      const vitalsTableRows = [valuesRow, unitsRow];
      const colWidth = usableWidth / headers.length;
      const columnWidths = headers.map(() => colWidth);
      currentY = this.createItemsTable(
        doc,
        currentY,
        headers,
        usableWidth,
        vitalsTableRows,
        columnWidths,
        1
      );

      /*-----------------------------------------
                    Component Details
      -----------------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Component Details', usableWidth);
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Blood Group'],
        [this.getValue(data.demoGraphicInfo, 'bloodGroup')],
        [usableWidth],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );

      /*-----------------------------------------
                    Questionnaire Table
      -----------------------------------------*/
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Questionnaire', usableWidth);
      const emrQuestionnaireData = data?.emrQuestionnaire ?? [];
      const questionnaireTableRows = emrQuestionnaireData.map((item, index) => [
        (index + 1).toString(),
        item.question?.trim() || '-',
        item.questionValue?.toLowerCase() === 'yes' ? 'Y' : 'N',
        item.remarks?.trim() || '-',
      ]);
      currentY = this.createItemsTable(
        // Ensure currentY is updated
        doc,
        currentY,
        ['No.', 'Question', 'Y/N', 'Remarks'],
        usableWidth,
        questionnaireTableRows,
        [usableWidth * 0.05, usableWidth * 0.65, usableWidth * 0.05, usableWidth * 0.25],
        1
      );

      /*-----------------------------------------
                  Informed Consent Section
      -----------------------------------------*/
      const consentTextLines = [
        'I Understand:',
        '1. I declared that have I read and understood the information regarding Blood Donation and answered all the question',
        '   honestly and correctly given in Donation Form.',
        '2. Blood Donation is a totally voluntary act not inducement or remuneration has been offered.',
        '3. My blood will be tested for Hepatitis B, Hepatitis C, HIV/AIDS, Syphilis, and Malaria Parasite in addition to any other',
        '   screening tests required ensuring blood safety.',
        '4. Donation of blood is a medical procedure and that by donating voluntarily, I accept the risk associated with this',
        '   procedure.',
        '5. My donated blood may sent to other blood bank, blood storage center for patient use.',
      ];
      const lineHeight = 5;
      const consentTextHeight = consentTextLines.length * lineHeight + 10; // Add some buffer for title and spacing
      if (currentY + consentTextHeight > footerTop) {
        doc.addPage();
        currentY = this.INITIAL_Y_POSITION; // Reset Y position for the new page
      }
      currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Informed Consent', usableWidth);
      currentY += 3; // Space after title
      doc.setFontSize(this.FONT_SIZE_NORMAL);
      doc.setTextColor(0, 0, 0);
      doc.setFont('Helvetica', 'normal');
      consentTextLines.forEach(line => {
        doc.text(line, this.MARGIN_LEFT, currentY);
        currentY += lineHeight;
      });

      /*-----------------------------------------
                    Counselling Outcome
      -----------------------------------------*/
      currentY = this.addSectionTitleWithLine(
        doc,
        currentY + 7,
        'Counselling Outcome',
        usableWidth
      );
      currentY = this.createDataRow(
        doc,
        currentY,
        ['Date & Time', 'Donor Status', 'Range Date'],
        [
          this.formatDatewithTime(this.getValue(data.demoGraphicInfo, 'statusDateTime')),
          this.donorStatusName(Number(this.getValue(data.demoGraphicInfo, 'donationStatus'))),
          this.formatDateToDisplay(this.getValue(data.demoGraphicInfo, 'rejectionStartDate')) +
            ' - ' +
            this.formatDateToDisplay(this.getValue(data.demoGraphicInfo, 'rejectionEndDate')),
        ],
        [usableWidth * 0.33, usableWidth * 0.33, usableWidth * 0.33],
        usableWidth,
        cell_padding,
        8,
        9,
        'normal',
        'normal'
      );

      /*---------- Signature Section ----------*/
      this.addSignatureSection(doc, currentY + 20, usableWidth, 'Donor’s Signature', 'bold');
    });
  }

  /*---------------------------------------------------------------------------------------------*/
  /*----*/
  /*----*/
  /*---- Donor Screening Print ----*/
  /*----*/
  /*----*/
  /*---------------------------------------------------------------------------------------------*/
  /**
   * Creates the donor Registration header section with QR code area
   * @param doc - The jsPDF document
   * @param startY - Starting Y position
   * @param data - Donor Registration data
   * @param usableWidth - Available width for content
   * @returns New Y position after adding the header
   */
  /*-------------------------------------------------
                Donor Registration Header
  -------------------------------------------------*/
  private createDonorRegistrationHeader(
    doc: jsPDF,
    startY: number,
    data: any,
    usableWidth: number
  ) {
    const headerHeight = 25; // Total height for the header section
    const contentX = this.MARGIN_LEFT;
    const contentY = startY + 2;
    const rowHeight = 5;

    // Background rectangle for the entire header
    doc.setFillColor(204, 204, 204); // Light gray background
    doc.rect(this.MARGIN_LEFT, startY, usableWidth, headerHeight, 'F');

    // Set text properties for the main header title (Name and Date)
    doc.setFontSize(this.FONT_SIZE_NORMAL + 2); // Slightly larger font for the main title
    doc.setTextColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Black color

    /*------------------------------------------
                    Left side: Name
    ------------------------------------------*/
    let nameText = String(
      this.getValue(data.donorData.demoGraphicInfo, 'firstName') +
        ' ' +
        this.getValue(data.donorData.demoGraphicInfo, 'middleName') +
        ' ' +
        this.getValue(data.donorData.demoGraphicInfo, 'familyName')
    );
    const gender = String(this.getValue(data.donorData.demoGraphicInfo, 'gender')); // 'M' or 'F' or other
    const dateOfBirth = this.getAgeFromDOB(
      this.getValue(data.donorData.tappingData[0], 'dateOfBirth')
    );
    // Format name with gender and age
    if (nameText) {
      nameText += ` (${gender} / ${dateOfBirth})`;
    }
    /*------------------------------------------
                    Left side: Icon
    ------------------------------------------*/
    // Determine icon and draw based on gender
    const iconX = contentX + 2;
    const iconY = contentY - 0.7; // Adjust Y to align with text
    const iconSize = 3.4; // Size of the icon
    doc.setDrawColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Set icon color
    doc.setFillColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]); // Set fill color for solid parts
    const girlIcon = './assets/icons/girl-icon.png';
    const boyIcon = './assets/icons/boy-icon.png';
    if (gender && gender === 'Male') {
      doc.addImage(boyIcon, 'PNG', iconX, iconY, iconSize, iconSize);
    } else {
      doc.addImage(girlIcon, 'PNG', iconX, iconY, iconSize, iconSize);
    }
    // Set font for name to bold
    doc.setFont('Helvetica', 'bold');
    // Position the name text next to the icon
    const nameTextX = iconX + iconSize + 2; // Space after icon
    doc.text(nameText, nameTextX, contentY + 2.3);

    /*------------------------------------------
             Right side: Date and Time
    ------------------------------------------*/
    const dateTime = String(
      this.formatDatewithTimeAmPm(
        this.getValue(data.donorData.demoGraphicInfo, 'statusDateTime')
      ) || '25-Jun-2025 | 18:15' // Fallback to provided date if data is missing
    );
    doc.setFont('Helvetica', 'normal'); // Set font back to normal for date
    doc.setFontSize(this.FONT_SIZE_NORMAL); // Smaller font size for date
    doc.text(dateTime, this.MARGIN_LEFT + usableWidth - this.MARGIN_RIGHT + 12, contentY + 2.5, {
      align: 'right',
    });

    // Draw the horizontal line below the title
    const lineY = startY + 6.5; // Adjust vertical position of the line relative to text
    doc.setDrawColor(163, 163, 163); // Gray color for the line (matching your header lines)
    doc.setLineWidth(0.3); // Line width
    doc.line(this.MARGIN_LEFT + 2, lineY, this.MARGIN_LEFT - 3 + usableWidth, lineY);
    lineY + 2; // Return new Y position, adding some space after line Bottom Side

    // --- Details in two columns below the main header ---
    // Reset font to normal and size for detail rows
    doc.setFontSize(this.FONT_SIZE_NORMAL);
    doc.setTextColor(this.COLOR_BLACK[0], this.COLOR_BLACK[1], this.COLOR_BLACK[2]);
    const leftColumnX = contentX + 2;
    const rightColumnX = contentX + usableWidth * 0.5 + 2; // Midpoint + small offset

    // Row 1: UHID and Donor ID
    let currentDetailY = contentY + 10;
    doc.setTextColor(60, 60, 60); // Gray for labels
    doc.setFont('Helvetica', 'normal');
    doc.text('UHID', leftColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0); // Black for values
    doc.setFont('Helvetica', 'bold');
    doc.text(
      this.getValue(data.donorData.demoGraphicInfo, 'citizenCode'),
      leftColumnX + 25,
      currentDetailY
    ); // Adjust 25 for label width

    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Donor ID', rightColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      this.getValue(data.donorData.demoGraphicInfo, 'donorCode'),
      rightColumnX + 25,
      currentDetailY
    );

    // Row 2: Address and Blood Unit No
    currentDetailY += rowHeight;
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Address', leftColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    const address =
      this.getValue(data.donorData.tappingData[0], 'areaName') +
      ' ' +
      this.getValue(data.donorData.tappingData[0], 'address1') +
      ' ' +
      this.getValue(data.donorData.tappingData[0], 'address2') +
      ' ' +
      this.getValue(data.donorData.tappingData[0], 'cityName');
    const addressMaxWidth = usableWidth * 0.5 - 30; // Adjust max width for address to fit
    const addressLines = doc.splitTextToSize(address, addressMaxWidth);
    doc.text(addressLines, leftColumnX + 25, currentDetailY); // Adjust 30 for label width

    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Blood Unit No', rightColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      this.getValue(data.donorData.tappingData[0], 'bagNo'),
      rightColumnX + 25,
      currentDetailY
    ); // Adjust 30 for label width

    // Row 3: Donation Type
    currentDetailY += rowHeight;
    doc.setTextColor(60, 60, 60);
    doc.setFont('Helvetica', 'normal');
    doc.text('Donation Type', leftColumnX, currentDetailY);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'bold');
    doc.text(
      this.getValue(data.donorData.tappingData[0], 'donationType'),
      leftColumnX + 25,
      currentDetailY
    ); // Adjust 25 for label width

    //----------- QR Code positioning ------------
    const qrX = this.MARGIN_LEFT + usableWidth - this.QR_CODE_SIZE;
    const qrY = startY + 7.3; // Adjusted QR Y to be within the shaded header area
    // Add QR Code (existing logic, ensure it's still positioned correctly within the header)
    try {
      const bgColor = 'cccccc';
      const qrUrl = this.getValue(data, 'scannerURL');
      const qrCodeServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}&format=png&bgcolor=${bgColor}`;
      // Calculate image position with margins
      const imageX = qrX + 4;
      const imageY = qrY + 2;
      // Add the QR code image
      doc.addImage(qrCodeServiceUrl, 'PNG', imageX, imageY, 13, 13);
    } catch (error) {
      doc.rect(qrX + 2, qrY + 2, this.QR_CODE_SIZE - 8, headerHeight - 4, 'S');
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text('QR', qrX + this.QR_CODE_SIZE / 2 - 2, qrY + headerHeight / 2 + 1);
    }
    // Add borders & Outer borders (existing logic)
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(this.MARGIN_LEFT, startY, this.MARGIN_LEFT + usableWidth, startY); // Top Side Line
    doc.line(
      this.MARGIN_LEFT,
      startY + headerHeight,
      this.MARGIN_LEFT + usableWidth,
      startY + headerHeight
    ); // Bottom Side Line
    // Vertical separator line between left and right columns with top/bottom spacing (existing logic)
    doc.setDrawColor(163, 163, 163);
    doc.setLineWidth(0.4);
    doc.line(
      contentX + usableWidth * 0.5, // This line is for the main columns below the name/date, adjust if needed
      startY + 8, // Add spacing from top (adjust based on new top section)
      contentX + usableWidth * 0.5,
      startY + headerHeight - 1.8 // Subtract spacing from bottom
    );
    return startY + headerHeight + 5; // Calculate header end position
  }

  /*-------------------------------------------------
                Donor Registration Print
  -------------------------------------------------*/
  public printDonorRegistration(data: any) {
    this.generatePdf(
      data,
      'Donor-Registration.pdf',
      'Donor Registration',
      async (doc, usableWidth) => {
        let currentY = this.INITIAL_Y_POSITION;
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerTop = pageHeight - this.FOOTER_POSITION - 5;
        currentY = this.addSectionTitle(doc, currentY - 3, 'DONOR REGISTRATION', usableWidth);
        // Use returned currentY
        currentY = this.createDonorRegistrationHeader(doc, currentY - 5, data, usableWidth);
        // Custom cell padding
        const cell_padding = { top: 0.5, right: 0, bottom: 0.5, left: 0 };

        /*-----------------------------------
                    Donor Details
      -----------------------------------*/
        currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'Donor Details', usableWidth);
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Event Type', 'Camp Name', 'Component Type', 'Marital Status'],
          [
            this.getEvenTypeName(
              Number(this.getValue(data.donorData.donorComponentDetails?.[0], 'eventType'))
            ), // Added optional chaining
            this.getValue(data.donorData.donorOtherDetails, 'campName'),
            String(this.getValue(data.donorData.donorOtherDetails, 'maritalStatus')), // Added optional chaining
          ],
          [usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25],
          usableWidth,
          cell_padding,
          8,
          9,
          'normal',
          'normal'
        );
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Contact No.', 'Email', 'Occupation', 'Identity Type'],
          [
            this.getValue(data.donorData.tappingData?.[0], 'contactDetails'),
            this.getValue(data.donorData.donorOtherDetails, 'emailAddress'),
            this.getValue(data.donorData.donorOtherDetails, 'occupation'),
            this.getValue(data.donorData.donorOtherDetails, 'identityName'), // Added optional chaining
          ],
          [usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25],
          usableWidth,
          cell_padding,
          8,
          9,
          'normal',
          'normal'
        );
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Identity Number'],
          [this.getValue(data.donorData.donorOtherDetails, 'identityNumber')],
          [usableWidth * 0.25, usableWidth * 0.25],
          usableWidth,
          cell_padding,
          8,
          9,
          'normal',
          'normal'
        );

        /*-----------------------------------
                      UHID Reference
      -----------------------------------*/
        currentY = this.addSectionTitleWithLine(doc, currentY + 7, 'UHID Reference', usableWidth);
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Patient Name', 'Patient UHID'],
          [
            this.getValue(data.donorData.demoGraphicInfo, 'firstName') +
              ' ' +
              this.getValue(data.donorData.demoGraphicInfo, 'middleName') +
              ' ' +
              this.getValue(data.donorData.demoGraphicInfo, 'familyName'),
            this.getValue(data.donorData.demoGraphicInfo, 'citizenCode'),
          ],
          [usableWidth * 0.5, usableWidth * 0.5],
          usableWidth,
          cell_padding,
          8,
          9,
          'normal',
          'normal'
        );

        /*-----------------------------------
                  Permanent Address
      -----------------------------------*/
        currentY = this.addSectionTitleWithLine(
          doc,
          currentY + 7,
          'Permanent Address',
          usableWidth
        );
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Address', 'Area', 'City'],
          [
            (this.getValue(data.donorData.tappingData?.[0], 'address1') || '') +
              (this.getValue(data.donorData.tappingData?.[0], 'address2') || ''),
            this.getValue(data.donorData.tappingData?.[0], 'areaName'),
            this.getValue(data.donorData.tappingData?.[0], 'cityName'),
          ],
          [usableWidth * 0.5, usableWidth * 0.25, usableWidth * 0.25],
          usableWidth,
          cell_padding,
          8,
          9,
          'normal',
          'normal'
        );
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Pincode', 'State', 'Country'],
          [
            this.getValue(data.donorData.donorOtherDetails, 'pincode'),
            this.getValue(data.donorData.donorOtherDetails, 'stateName'),
            this.getValue(data.donorData.donorOtherDetails, 'countryName'),
          ],
          [usableWidth * 0.25, usableWidth * 0.25, usableWidth * 0.25],
          usableWidth,
          cell_padding,
          8,
          9,
          'normal',
          'normal'
        );

        /*-----------------------------------------
            Previous Blood Donation Details
      -----------------------------------------*/
        currentY = this.addSectionTitleWithLine(
          doc,
          currentY + 7,
          'Previous Blood Donation Details',
          usableWidth
        );
        currentY = this.createDataRow(
          doc,
          currentY,
          ['Donate Earlier', 'Date of Donation'],
          [
            this.getValue(data.donorData.donorOtherDetails, 'donatedEarlier'),
            this.getValue(data.donorData.donorOtherDetails, 'dateOfLastDonation'),
          ],
          [usableWidth * 0.5, usableWidth * 0.5],
          usableWidth,
          cell_padding,
          8,
          9,
          'normal',
          'normal'
        );

        /*------------------------------------------
             Add signature & Footer section
      ------------------------------------------*/
        // const signatureSectionHeight = 15; // Approximate height of signature section
        // if (currentY + signatureSectionHeight + this.SIGNATURE_SECTION_OFFSET > footerTop) {
        //   doc.addPage();
        //   currentY = this.INITIAL_Y_POSITION;
        // }

        // this.addSignatureSection(
        //   doc,
        //   doc.internal.pageSize.getHeight() - this.SIGNATURE_SECTION_OFFSET + 5,
        //   usableWidth,
        //   'Donor’s Signature',
        //   'bold'
        // );
      }
    );
  }
}
