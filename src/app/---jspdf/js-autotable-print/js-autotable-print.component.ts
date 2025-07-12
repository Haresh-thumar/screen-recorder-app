import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-js-autotable-print',
  imports: [],
  templateUrl: './js-autotable-print.component.html',
  styleUrl: './js-autotable-print.component.scss',
})
export class JsAutotablePrintComponent {
  generatePDF() {
    const vendorData = {
      vendorName: 'Velavan B',
      vendorAddress: '14/203, Kallakulam, Seenapuram',
      vendorPinCode: '638057',
      contactPerson: 'Santhosh D',
      contactPersonMobNo: '8993298712',
    };

    const itemsData = [
      {
        itemName: 'Water Tanks',
        quantity: '15',
        uom: 'Liters',
        unitPrice: '1200',
        total: '18000',
      },
      {
        itemName: 'Laptops',
        quantity: '5',
        uom: 'Pieces',
        unitPrice: '25000',
        total: '125000',
      },
      {
        itemName: 'Coffee Mugs',
        quantity: '50',
        uom: 'Pieces',
        unitPrice: '50',
        total: '2500',
      },
    ];

    const pdf = new jsPDF();

    pdf.setProperties({ title: 'Request For Quotation' });

    const logoImage = 'assets/aalam.png'; // Place image in assets folder
    const callIcon = 'assets/Calling.png';

    // Add logo image - convert to Base64 or preload if needed
    // pdf.addImage(logoImage, 'JPEG', 10, 5, 40, 12); // Uncomment if you have base64 image

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REQUEST FOR QUOTATION', 150, 12, { align: 'right' });

    pdf.setLineWidth(0.1);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, 18, 200, 18);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Contact Person:', 13, 23);
    pdf.text('Nithish Kumar CP', 50, 23);
    // pdf.addImage(callIcon, 'PNG', 13, 25, 3, 3); // Optional call icon
    pdf.text('9078382732', 18, 28);

    pdf.text('RFQ No:', 130, 23);
    pdf.text('RFQ20240092', 160, 23);
    pdf.text('RFQ Date:', 130, 27);
    pdf.text('12-Nov-2025', 160, 27);
    pdf.text('Due Date:', 130, 31);
    pdf.text('2024-02-08', 160, 31);

    pdf.line(10, 34, 200, 34);

    pdf.text('To:', 13, 39);
    pdf.setFont('helvetica', 'bold');
    pdf.text(vendorData.vendorName, 13, 44);
    pdf.setFont('helvetica', 'normal');
    pdf.text(vendorData.vendorAddress, 13, 48);
    pdf.text(`P.O BOX : ${vendorData.vendorPinCode}`, 13, 52);
    pdf.text(`Contact Person: ${vendorData.contactPerson}`, 13, 56);
    // pdf.addImage(callIcon, 'PNG', 13, 58, 3, 3); // Optional call icon
    pdf.text(vendorData.contactPersonMobNo, 18, 61);

    pdf.text('Purchase Centre Address:', 130, 39);
    pdf.text('Head Office', 130, 44);
    pdf.text('CHENNAI', 130, 48);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Dear Sir,', 13, 72);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      'Please send your most competitive offer mentioning your Terms & Conditions before the due date.',
      13,
      78
    );

    // Items Table
    const itemDetailsRows = itemsData.map((item, index) => [
      (index + 1).toString(),
      item.itemName,
      item.quantity,
      item.uom,
      item.total,
    ]);

    const itemDetailsHeaders = [
      'S.No',
      'Item Name',
      'Quantity',
      'UOM',
      'Total',
    ];

    autoTable(pdf, {
      head: [itemDetailsHeaders],
      body: itemDetailsRows,
      startY: 85,
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 9 },
      theme: 'striped',
      styles: { halign: 'center' },
      columnStyles: { 1: { halign: 'left' } },
    });

    const finalY = (pdf as any).lastAutoTable.finalY + 10;
    pdf.text('Thank you for your response.', 13, finalY);

    // Save PDF
    pdf.save('RequestForQuotation.pdf');
  }
}
