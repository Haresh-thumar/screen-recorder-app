import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-square-print',
  imports: [],
  templateUrl: './square-print.html',
  styleUrl: './square-print.scss',
})
export class SquarePrint {
  generatePdf() {
    const barcodeBase64 = '';

    const doc = new jsPDF({
      unit: 'mm',
      format: [104, 104], // jsPDF doc sized 104 x 104 mm
      orientation: 'portrait',
    });

    /*----------------------------------------
                      Utilities
    ----------------------------------------*/
    const WIDTH = 104;
    const margin = 2;
    // colors
    const blue = '#284996';
    const greyText = '#000000';
    const lightGreyText = '#5C5C5C';
    const darkBorder = '#000000';
    // set default font family
    doc.setFont('helvetica');

    /*-----------------------------------------------
             phone, centered title, license
    ------------------------------------------------*/
    doc.setFontSize(6);
    doc.setTextColor(greyText);
    doc.text('Ph. : 022-24107507', margin + 3, 5);

    // License at right
    doc.text('Lic. No: 954', WIDTH - margin - 3, 5, { align: 'right' });

    // Title: centered
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('K. E. M. Hospital Blood Centre', WIDTH / 2, 5, {
      align: 'center',
    });

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Acharya Donde Marg, Parel, Mumbai - 400 012', WIDTH / 2, 8.2, {
      align: 'center',
    });

    // thin separator line under header
    doc.setDrawColor(darkBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, 11, WIDTH - margin, 11);

    /*-----------------------------------------------------------
         left details & right blood-group rounded rectangle
    -----------------------------------------------------------*/
    let leftY = 14;
    const leftW = 100;

    // Draw thin Rectangle Line
    doc.setLineWidth(0.3);
    doc.setDrawColor(darkBorder);
    doc.rect(margin, leftY - 1.5, leftW, 28.5, 'S');

    // Unit No
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Unit No.', margin + 1, leftY + 1.5);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('KD25/00000', margin + 1, leftY + 4.4);

    // Component Type
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Component Type.', margin + 25, leftY + 1.5);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Packed Red Blood Cells I.P.', margin + 25, leftY + 4.4);

    leftY += 6.5;
    // Barcode
    if (barcodeBase64) {
      // draw barcode scaled to fit
      doc.addImage(barcodeBase64, 'PNG', margin + 3, leftY + 5, 25, 8);
    } else {
      // placeholder barcode: thin vertical lines
      for (let i = 0; i < 25; i++) {
        const bx = margin + 1.5 + i * 0.7;
        if (i % 3 === 0) doc.setLineWidth(0.5);
        else doc.setLineWidth(0.2);
        doc.line(bx, leftY, bx, leftY + 5.5);
      }
    }

    leftY += 8;
    // Collection Date
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Collection Date.', margin + 1, leftY + 1);
    doc.setTextColor(greyText);
    doc.setFont('helvetica', 'bold');
    doc.text('10-Nov-2022', margin + 1, leftY + 4.1);

    // Expiry Date
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Expiry Date.', margin + 25, leftY + 1);
    doc.setTextColor(greyText);
    doc.setFont('helvetica', 'bold');
    doc.text('10-Nov-2023 ( up to 12 midnight )', margin + 25, leftY + 4.1);

    // Nature of Donor
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Nature of Donor', margin + 1, leftY + 7.8);
    doc.setTextColor(greyText);
    doc.setFont('helvetica', 'bold');
    doc.text('Voluntary', margin + 1, leftY + 10.8);

    // Anticoagulant/Addictive Solution
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Anticoagulant/Addictive Solution.', margin + 25, leftY + 7.8);
    doc.setTextColor(greyText);
    doc.setFont('helvetica', 'bold');
    doc.text('CPDA', margin + 25, leftY + 10.8);

    /*-----------------------------------------------------------
                Blood group rounded rectangle (pill)
    -----------------------------------------------------------*/
    const pillW = 20;
    const pillH = 17;
    const pillX = WIDTH - margin - pillW - 2.5;
    const pillY = leftY - 13.8;

    /*------- Rounded Rect Background (Blue Border) -------*/
    doc.setDrawColor(blue);
    doc.setLineWidth(0.3);
    try {
      // @ts-ignore
      doc.roundedRect(pillX, pillY, pillW, pillH, 3, 3, 'S');
    } catch (e) {
      doc.rect(pillX, pillY, pillW, pillH, 'S');
    }

    // B (Blood-Group)
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(blue);
    doc.text('B', pillX + pillW / 2, pillY + 10.5, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Positive', pillX + pillW / 2, pillY + 14.5, { align: 'center' });

    // info text under pill
    doc.setFontSize(6);
    doc.setTextColor(greyText);
    doc.setFont('helvetica', 'normal');
    doc.text('Storage and transport', pillX - 0.5, pillY + pillH + 3.5);
    doc.text('temperature is 2 to 6 C', pillX - 1, pillY + pillH + 6);

    /*-----------------------------------------------------------
                      Draw thin Rectangle Line
    -----------------------------------------------------------*/
    let highlightY = leftY + 13.9;
    doc.setLineWidth(0.15);
    doc.setDrawColor(darkBorder);
    doc.rect(margin, highlightY, WIDTH - margin * 2, 4.5, 'S');

    // Non-reactive Unit
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'The Unit is non-reactive for HIV-1 & 2, HCV, HbsAg, VDRL & negative for MP & Atypical Antibody',
      WIDTH / 2,
      highlightY + 3,
      { align: 'center' }
    );

    /*-----------------------------------------------------------
                      Instructions Points List
    -----------------------------------------------------------*/
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    const instr = [
      '• Transfuse the unit within 30 minutes of issue from the blood center.',
      '• Before transfusion verify the information in report, bag label and patient case paper.',
      '• Check unit for hemolysis, clot, leakage, discoloration etc.',
      '• Record the time of start & transfuse with slow rate under supervision of clinician.',
      '• Record the vital data before, during and after completion of transfusion.',
      '• Do not warm the unit by keeping it in boiling water. Do not keep it in a deep fridge.',
      '• For any adverse reaction stop the transfusion and inform the blood center immediately.',
    ];
    highlightY += 8.3;
    for (let i = 0; i < instr.length; i++) {
      const lines = doc.splitTextToSize(instr[i], WIDTH - margin * 2);
      doc.text(lines, margin + 1.5, highlightY);
      highlightY += lines.length * 2.5;
    }

    /*-----------------------------------------------------------
                      Patient Details Section
    -----------------------------------------------------------*/
    // ---- Line Seperator -----
    doc.setDrawColor(darkBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, highlightY, WIDTH - margin, highlightY);

    // ---- Title -----
    doc.setFontSize(9.2);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Details', WIDTH / 2 - 3, highlightY + 4.5, {
      align: 'center',
    });

    // ----- Line 1 ------
    highlightY += 9;
    // Patient Name
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Patient Name', margin + 1, highlightY + 0.5);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Nidhi Oza', margin + 1, highlightY + 3.6);

    // Age | Gender
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Age | Gender', margin + 25, highlightY + 0.5);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('22/Female', margin + 25, highlightY + 3.6);

    // Unit Head
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Unit Head', margin + 49, highlightY + 0.5);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Head Name', margin + 49, highlightY + 3.6);

    // ----- Line 2 ------
    highlightY += 6.5;
    // Hospital
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Hospital', margin + 1, highlightY + 1.3);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('KEM Hospital', margin + 1, highlightY + 4.4);

    // IPD No.
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('IPD No.', margin + 25, highlightY + 1.3);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('12345678909876', margin + 25, highlightY + 4.4);

    // BBR No
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('BBR No', margin + 49, highlightY + 1.3);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('1106', margin + 49, highlightY + 4.4);

    // ----- Line 3 ------
    highlightY += 6.5;
    // Ward & Bed
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Ward & Bed', margin + 1, highlightY + 1.7);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Special Ward, 104', margin + 1, highlightY + 4.5);

    // Requesting Doctor
    doc.setTextColor(lightGreyText);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Requesting Doctor', margin + 25, highlightY + 1.7);
    doc.setTextColor(greyText);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor Name', margin + 25, highlightY + 4.5);

    // Barcode
    if (barcodeBase64) {
      doc.addImage(barcodeBase64, 'PNG', margin + 3, highlightY, 25, 8);
    } else {
      for (let i = 0; i < 25; i++) {
        const bx = margin + 49 + i * 0.7;
        if (i % 3 === 0) doc.setLineWidth(0.5);
        else doc.setLineWidth(0.2);
        doc.line(bx, highlightY, bx, highlightY + 5);
      }
    }

    /*-----------------------------------------------------------
                      Small Blood-Group Pill
    -----------------------------------------------------------*/
    // ---- Rounded Rect Background (Blue Border) ----
    highlightY -= 13.5;
    const smallPillX = WIDTH - margin - 17.5;
    doc.setDrawColor(blue);
    doc.setLineWidth(0.3);
    try {
      doc.roundedRect(smallPillX, highlightY, 15, 12, 3, 3, 'S');
    } catch (e) {
      doc.rect(smallPillX, highlightY, 15, 12, 'S');
    }

    // B
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(blue);
    doc.text('B', smallPillX + 7.5, highlightY + 6.5, { align: 'center' });
    // Positive
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(blue);
    doc.text('Positive', smallPillX + 7.5, highlightY + 10, {
      align: 'center',
    });
    doc.setTextColor(greyText);

    /*---------------------------------------------
                        Footer
    ----------------------------------------------*/
    highlightY += 20.5;
    // Draw thin Rectangle Line
    doc.setLineWidth(0.1);
    doc.setDrawColor(lightGreyText);
    doc.rect(margin, highlightY, leftW, 4.5, 'S');

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Issue Date & Time:10-Nov-2022 | 18:00',
      margin + 1,
      highlightY + 3
    );
    doc.text('Issued by : Rajat Sisodiya', WIDTH - margin - 1, highlightY + 3, {
      align: 'right',
    });

    // doc.save('blood-label-104x104.pdf');
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }
}
