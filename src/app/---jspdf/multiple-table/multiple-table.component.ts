import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-multiple-table',
    imports: [],
    templateUrl: './multiple-table.component.html',
    styleUrl: './multiple-table.component.scss'
})
export class MultipleTableComponent {
  //   generatePDF() {
  //     const doc = new jsPDF();

  //     // Sample data for the first table
  //     const firstTableData = [
  //       { id: 1, name: 'John Doe', age: 30 },
  //       { id: 2, name: 'Jane Smith', age: 25 },
  //       { id: 3, name: 'Sam Johnson', age: 40 },
  //     ];

  //     // Sample data for the second table
  //     const secondTableData = [
  //       { product: 'Laptop', price: 1000 },
  //       { product: 'Phone', price: 500 },
  //       { product: 'Tablet', price: 300 },
  //     ];

  //     // First Table
  //     autoTable(doc, {
  //       head: [['ID', 'Name', 'Age']],
  //       body: firstTableData.map((item) => [item.id, item.name, item.age]),
  //       startY: 10, // Start position for the first table
  //     });

  //     // Calculate the position for the second table
  //     const firstTableHeight = (doc as any).autoTable.previous.finalY; // Get the height of the first table
  //     // Set the start position for the second table
  //     const secondTableStartY = firstTableHeight + 5; // Add some space before the second table

  //     // Second Table
  //     autoTable(doc, {
  //       head: [['Product', 'Price']],
  //       body: secondTableData.map((item) => [item.product, item.price]),
  //       startY: secondTableStartY, // Start position for the second table
  //     });

  //     // Save the PDF
  //     doc.save('report.pdf');
  //   }
  // }

  tableData = [
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
    {
      doa: '03-Feb-2025',
      diagnosis: 'Absence seizure (petit mal seizure)',
      dod: '07-Feb-2025',
      treatment: 'sbdf',
      procedure: 'Anti-AChR (Anti-acetylcholine Receptor)',
      careProfessional: 'Diemo Franck',
      surgeon: 'Franck Malemba',
      careProvider: 'A-ONE X ray Center - X Ray',
      dateofSurgery: '05-Feb-2025',
      remarks:
        'The only thing required is either the html or body option. If you want more control over the columns you can specify the columns property. If columns are not set they will be automatically computed based on the content of the html content or head, body and foot.',
    },
  ];

  generatePDF() {
    const doc = new jsPDF();
    let startY = 10; // Initial Y position for the first table

    // Sample data for first table
    const firstTableData = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Smith', age: 25 },
      { id: 3, name: 'Sam Johnson', age: 40 },
      { id: 3, name: 'Sam Johnson', age: 40 },
      { id: 3, name: 'Sam Johnson', age: 40 },
      { id: 3, name: 'Sam Johnson', age: 40 },
    ];

    // Sample data for second table
    const secondTableData = [
      { product: 'Laptop', price: '$1000' },
      { product: 'Phone', price: '$500' },
      { product: 'Tablet', price: '$300' },
    ];

    // Function to draw a table with only a bottom border on the heading
    const drawTable = (head: string[], bodyData: any[], startY: number) => {
      autoTable(doc, {
        head: [head],
        body: bodyData.map((row, index) => [index + 1, ...row]), // Add Sr. No.
        startY: startY,
        theme: 'plain',
        styles: { fontSize: 7, cellPadding: 1 },
        headStyles: {
          fontSize: 7,
          fontStyle: 'bold',
          textColor: [0, 0, 0], // Black text color
          lineWidth: 0, // No outer border
        },
        margin: { left: 10, right: 10 },
        bodyStyles: { lineWidth: 0 }, // Remove all body borders
        didDrawCell: (data) => {
          if (data.row.index === 0 && data.section === 'head') {
            // Draw bottom border only for header row
            doc.setDrawColor(173, 173, 173);
            doc.setLineWidth(0.1); // Border thickness
            doc.line(
              data.cell.x,
              data.cell.y + data.cell.height,
              data.cell.x + data.cell.width,
              data.cell.y + data.cell.height
            );
          }
        },
      });

      // Return the final Y position for next table placement
      return (doc as any).lastAutoTable.finalY + 5;
    };

    // Draw First Table with Sr. No.
    startY = drawTable(
      ['Sr. No.', 'Name', 'Age'],
      firstTableData.map((row) => [row.name, row.age]),
      startY
    );

    // Draw Second Table with Sr. No.
    startY = drawTable(
      ['Sr. No.', 'Product', 'Price'],
      secondTableData.map((row) => [row.product, row.price]),
      startY
    );

    // Loop through tableData for dynamic tables
    this.tableData.forEach((data, index) => {
      const formattedData = [
        ['Sr No.', index + 1, 'DOA', data.doa],
        ['Diagnosis', data.diagnosis, 'DOD', data.dod],
        ['Treatment', data.treatment, 'Procedure', data.procedure],
        ['Care Professional', data.careProfessional, 'Surgeon', data.surgeon],
        [
          'Care Provider',
          data.careProvider,
          'Date of Surgery',
          data.dateofSurgery,
        ],
      ];

      autoTable(doc, {
        body: formattedData,
        theme: 'plain',
        styles: { fontSize: 7, cellPadding: 0.7, lineWidth: 0 },
        columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } },
        margin: { left: 10, right: 10 },
        startY: startY,
      });

      // Get final Y position of table
      startY = (doc as any).lastAutoTable.finalY;

      // Add Remarks Below Table
      autoTable(doc, {
        body: [['Remarks:', data.remarks]],
        theme: 'plain',
        tableWidth: 'wrap',
        styles: {
          fontSize: 7,
          lineWidth: 0,
          cellPadding: { top: 1, bottom: 0 },
        },
        columnStyles: {
          0: { cellWidth: 33.5, fontStyle: 'bold' },
          1: { cellWidth: 160 },
        },
        startY: startY,
        margin: { left: 11, right: 10 },
      });

      // Get final Y position after Remarks
      startY = (doc as any).lastAutoTable.finalY + 2;

      // Add a bottom border line (except for the last record)
      if (index < this.tableData.length - 1) {
        doc.setLineWidth(0.1);
        doc.setDrawColor(173, 173, 173);
        doc.line(10, startY, 200, startY);
        startY += 2; // Move down for the next table
      }
    });

    doc.save('multiple_tables.pdf');
  }

  // generatePDF() {
  //   const doc = new jsPDF();
  //   let index = 1; // Start index for Sr No.
  //   let startY = 10; // Initial Y position for first record

  //   const allRows: any[] = []; // Array to store all table rows

  //   this.tableData.forEach((data, recordIndex) => {
  //     const isLastRecord = recordIndex === this.tableData.length - 1;

  //     // Push the structured data for the table
  //     allRows.push(
  //       ['Sr No.', index++, 'DOA', data.doa],
  //       ['Diagnosis', data.diagnosis, 'DOD', data.dod],
  //       ['Treatment', data.treatment, 'Procedure', data.procedure],
  //       ['Care Professional', data.careProfessional, 'Surgeon', data.surgeon],
  //       [
  //         'Care Provider',
  //         data.careProvider,
  //         'Date of Surgery',
  //         data.dateofSurgery,t
  //       ],
  //       ['Remarks:', data.remarks] // Full-width remarks
  //     );

  //     // Add a separator row (empty row) before the next record
  //     if (!isLastRecord) {
  //       allRows.push(['', '', '', '']); // Creates spacing
  //     }
  //   });

  //   // Single autoTable function for all records
  //   autoTable(doc, {
  //     body: allRows,
  //     theme: 'plain',
  //     styles: { fontSize: 7, cellPadding: 1, lineWidth: 0 },
  //     columnStyles: {
  //       0: { fontStyle: 'bold', cellWidth: 33.5 }, // First column bold
  //       2: { fontStyle: 'bold', cellWidth: 33.5 }, // Third column bold
  //       1: { cellWidth: 80 }, // Set width for value columns
  //       3: { cellWidth: 80 },
  //     },
  //     tableWidth: 'auto',
  //     margin: { left: 10, right: 10 },
  //     startY: startY,
  //   });

  //   doc.save('multiple_records.pdf');
  // }
}
