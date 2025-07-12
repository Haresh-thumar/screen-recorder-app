import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

@Component({
  selector: 'app-print-1',
  imports: [],
  templateUrl: './print-1.component.html',
  styleUrl: './print-1.component.scss',
})
export class Print1Component {
  dataArray1 = [
    { id: '5001', type: 'None' },
    { id: '5002', type: 'Glazed' },
    { id: '5005', type: 'Sugar' },
    { id: '5007', type: 'Powdered Sugar' },
    { id: '5006', type: 'Chocolate with Sprinkles' },
    { id: '5003', type: 'Chocolate' },
    { id: '5004', type: 'Maple' },
  ];

  reviews = [
    {
      rating: 2,
      comment: 'Very unhappy with my purchase!',
      reviewerName: 'John Doe',
      reviewerEmail: 'john.doe@x.dummyjson.com',
    },
    {
      rating: 2,
      comment: 'Not as described!',
      reviewerName: 'Nolan Gonzalez',
      reviewerEmail: 'nolan.gonzalez@x.dummyjson.com',
    },
    {
      rating: 5,
      comment: 'Very satisfied!',
      reviewerName: 'Scarlett Wright',
      reviewerEmail: 'scarlett.wright@x.dummyjson.com',
    },
  ];

  logData = [
    {
      id: 1,
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
    },
    {
      id: 2,
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
    },
    {
      id: 3,
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
    },
    {
      id: 4,
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
    },
    {
      id: 5,
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
    },
  ];

  cartData = [
    {
      id: 1,
      title: 'Essence ',
      price: 9.99,
      quantity: 1,
      total: 9.99,
      discountPercentage: 7.17,
      discountedPrice: 9,
    },
    {
      id: 2,
      title: 'Mascara',
      price: 9.99,
      quantity: 1,
      total: 9.99,
      discountPercentage: 7.17,
      discountedPrice: 9,
    },
    {
      id: 3,
      title: 'Lash 123',
      price: 9.99,
      quantity: 1,
      total: 9.99,
      discountPercentage: 7.17,
      discountedPrice: 9,
    },
    {
      id: 4,
      title: 'Princess',
      price: 9.99,
      quantity: 1,
      total: 9.99,
      discountPercentage: 7.17,
      discountedPrice: 9,
    },
  ];

  postData = [
    {
      id: 1,
      title: 'His mother ',
      tags: ['history', 'american', 'crime'],
      reactions: {
        likes: 192,
        dislikes: 25,
      },
      views: 305,
      userId: 121,
      total: 251,
      skip: 0,
      limit: 30,
    },
    {
      id: 2,
      title: 'always taught him',
      tags: ['history'],
      reactions: {
        likes: 192,
        dislikes: 25,
      },
      views: 305,
      userId: 121,
      total: 251,
      skip: 0,
      limit: 30,
    },
  ];

  letterheadBase64 = '/icons/bmc-letter-head.png';
  imagesrc = '/icons/bmc-letter-head.png'; // base64 image


  /*--------------------------------------------------------------------------------------------------------------------
                                Print Multiple Table based on array length using Auto-Table 
  --------------------------------------------------------------------------------------------------------------------*/
  async printAutoTable() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const topMargin = 37;
    const bottomMargin = 15;
    const printDate = new Date().toLocaleDateString();
    let currentY = topMargin;

    // Global Table Styles with Bottom Border for Headers
    const globalTableStyles: UserOptions = {
      theme: 'grid', // Using grid theme for structured table
      margin: { left: 5, right: 5 },
      tableWidth: 'auto',
      styles: {
        fontSize: 7,
        textColor: [0, 0, 0],
        cellPadding: { horizontal: 2, vertical: 1 },
        overflow: "linebreak",
        lineWidth: 0, // Ensure a subtle line width
        // lineColor: [0, 0, 0], // Black border color
      },
      headStyles: {
        fontSize: 7,
        fillColor: [255, 255, 255], // White background
        textColor: '#9f9f9f', // Dark gray text
        fontStyle: 'normal',
        lineWidth: { bottom: 0.1 },
        // lineColor: '#9f9f9f', // Black border color
      },
      bodyStyles: {

      },
      didDrawCell: (hookData) => {
        const { doc, row, cell } = hookData;
        if (row.section === 'head') {
          doc.setLineWidth(0.4);
          doc.setDrawColor('#9f9f9f'); // Black color
          const { x, y, width, height } = cell;
          doc.line(x, y + height, x + width, y + height); // Draw bottom border for heading
        } else {
          doc.setLineWidth(0);
        }
      },
      didDrawPage: (hookData) => {
        const { pageNumber } = hookData;
        if (pageNumber > 1) {
          addBackground();
          addFooter(pageNumber, doc.getNumberOfPages());
        }
      },
    };

    // Load Background Image
    const img = new Image();
    img.src = this.letterheadBase64;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn('Could not load letterhead image');
        resolve();
      };
    });

    // Function to add background image
    const addBackground = () => {
      doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
    };

    // Function to add footer
    const addFooter = (pageNumber: number, totalPages: number) => {
      const y = pageHeight - bottomMargin;
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      // doc.line(10, 18, 200, 18) // set horizontal line
      doc.setFont('helvetica', 'normal');
      doc.text('Printed by: Haresh', 5, y);
      doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, y, { align: 'center' });
      doc.text(printDate, pageWidth - 5, y, { align: 'right' });
    };

    // Function to add a table
    const addTable = (title: string, head: string[][], body: any[][]) => {
      const estimatedHeight = 10 + body.length * 5;
      if (currentY + estimatedHeight > pageHeight - bottomMargin) {
        addFooter(doc.getNumberOfPages(), 0);
        doc.addPage();
        currentY = topMargin;
        addBackground();
      }

      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 5, currentY, { align: 'left' });
      currentY += 3;

      autoTable(doc, {
        ...globalTableStyles,
        startY: currentY,
        head: head,
        body: body,
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;
    };
    // Add Background to First Page
    addBackground();


    if (this.dataArray1?.length) {
      addTable('Data Array 1', [['ID', 'Type']], this.dataArray1.map((item: any) => [item.id, item.type]));
    }

    if (this.reviews?.length) {
      addTable('Reviews', [['Rating', 'Comment', 'Reviewer Name', 'Reviewer Email']],
        this.reviews.map((item: any) => [item.rating, item.comment, item.reviewerName, item.reviewerEmail])
      );
    }

    if (this.logData?.length) {
      addTable('Log Data', [['ID', 'Email', 'First Name', 'Last Name']],
        this.logData.map((item: any) => [item.id, item.email, item.firstName, item.lastName])
      );
    }

    if (this.cartData?.length) {
      addTable('Cart Data', [['ID', 'Title', 'Price', 'Quantity', 'Total', 'Discount %', 'Discounted Price']],
        this.cartData.map((item: any) => [item.id, item.title, item.price, item.quantity, item.total, item.discountPercentage, item.discountedPrice])
      );
    }

    if (this.postData?.length) {
      addTable('Post Data', [['ID', 'Title', 'Tags', 'Likes', 'Dislikes', 'Views', 'User ID']],
        this.postData.map((item: any) => [item.id, item.title, item.tags.join(', '), item.reactions.likes, item.reactions.dislikes, item.views, item.userId])
      );
    }

    if (this.dataArray1?.length) {
      addTable('Data Array 1', [['ID', 'Type']], this.dataArray1.map((item: any) => [item.id, item.type]));
    }

    if (this.reviews?.length) {
      addTable('Reviews', [['Rating', 'Comment', 'Reviewer Name', 'Reviewer Email']],
        this.reviews.map((item: any) => [item.rating, item.comment, item.reviewerName, item.reviewerEmail])
      );
    }

    if (this.logData?.length) {
      addTable('Log Data', [['ID', 'Email', 'First Name', 'Last Name']],
        this.logData.map((item: any) => [item.id, item.email, item.firstName, item.lastName])
      );
    }

    if (this.cartData?.length) {
      addTable('Cart Data', [['ID', 'Title', 'Price', 'Quantity', 'Total', 'Discount %', 'Discounted Price']],
        this.cartData.map((item: any) => [item.id, item.title, item.price, item.quantity, item.total, item.discountPercentage, item.discountedPrice])
      );
    }

    if (this.postData?.length) {
      addTable('Post Data', [['ID', 'Title', 'Tags', 'Likes', 'Dislikes', 'Views', 'User ID']],
        this.postData.map((item: any) => [item.id, item.title, item.tags.join(', '), item.reactions.likes, item.reactions.dislikes, item.views, item.userId])
      );
    }

    // Add footer to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }

    doc.save('Multi_Table_Report.pdf');
  }


  /*--------------------------------------------------------------------------------------------------------------------
                                                  print Custom Grid List 
  --------------------------------------------------------------------------------------------------------------------*/
  printCustomGridLayout() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 10; // Start Y position

    // **Custom Styling**
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);

    // **Header - Patient Information**
    const lineHeight = 7;
    doc.text('Patient Name', 5, currentY);
    doc.text('Date', 70, currentY);
    doc.text('UHID', 110, currentY);
    doc.text('Age', 150, currentY);
    doc.text('Gender', 185, currentY);

    doc.setFont('helvetica', 'normal');
    currentY += 4;
    doc.text('Yami Singh', 5, currentY);
    doc.text('27-Mar-2025', 70, currentY);
    doc.text('21061700770908', 110, currentY);
    doc.text('13Y 9M 10D', 150, currentY);
    doc.text('Male', 185, currentY);

    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Mobile Number', 5, currentY);
    doc.text('Address', 70, currentY);

    doc.setFont('helvetica', 'normal');
    currentY += 4;
    doc.text('0987654321', 5, currentY);
    doc.text('Krishna Pathology, Ajeetmal, Auraiya, Uttar Pradesh, India', 70, currentY);

    // **Bottom Border Line**
    currentY += 5;
    doc.setLineWidth(0.2);
    doc.setDrawColor('#9f9f9f'); // Black color
    doc.line(5, currentY, pageWidth - 5, currentY);

    // **Save PDF**
    doc.save('Patient_Details.pdf');
  }


}
