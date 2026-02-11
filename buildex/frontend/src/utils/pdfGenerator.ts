import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quotation, CompanyDetails } from '@/types/quotation';

export function generateQuotationPDF(quotation: Quotation, companyDetails: CompanyDetails): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const primaryColor: [number, number, number] = [37, 99, 235]; // Blue
  const textColor: [number, number, number] = [31, 41, 55];
  const mutedColor: [number, number, number] = [107, 114, 128];

  let yPos = 20;

  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');

  let textX = 15;

  // Add Logo if available
  if (companyDetails.logo) {
    try {
      // enhanced error handling or validation could go here
      doc.addImage(companyDetails.logo, 'PNG', 15, 10, 25, 25);
      textX = 45;
    } catch (error) {
      console.warn('Failed to load company logo for PDF:', error);
      // Fallback: stick to default X if logo fails
    }
  }

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(companyDetails.name, textX, yPos);

  // Company details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  yPos += 8;
  doc.text(companyDetails.address, textX, yPos);
  yPos += 5;
  doc.text(`Phone: ${companyDetails.phone} | Email: ${companyDetails.email}`, textX, yPos);
  yPos += 5;
  doc.text(`GST: ${companyDetails.gstNumber}`, textX, yPos);

  // Quotation title
  yPos = 55;
  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', 15, yPos);

  // Quotation number and date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`Quotation #: ${quotation.id.slice(0, 8).toUpperCase()}`, pageWidth - 15, yPos - 8, { align: 'right' });
  doc.text(`Date: ${new Date(quotation.clientDetails.quotationDate || quotation.createdAt).toLocaleDateString()}`, pageWidth - 15, yPos, { align: 'right' });
  doc.text(`Valid Till: ${new Date(quotation.clientDetails.validTill).toLocaleDateString()}`, pageWidth - 15, yPos + 8, { align: 'right' });

  // Divider
  yPos += 10;
  doc.setDrawColor(229, 231, 235);
  doc.line(15, yPos, pageWidth - 15, yPos);

  // Client Details Section
  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Bill To:', 15, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 7;
  doc.text(quotation.clientDetails.name, 15, yPos);
  yPos += 5;
  doc.setTextColor(...mutedColor);
  doc.text(quotation.clientDetails.siteAddress, 15, yPos);
  yPos += 5;
  doc.text(`Phone: ${quotation.clientDetails.phone}`, 15, yPos);
  yPos += 5;
  doc.text(`Email: ${quotation.clientDetails.email}`, 15, yPos);

  // Project Details Section
  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Project Details:', 15, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 7;
  doc.setTextColor(...mutedColor);
  doc.text(`Project Type: ${quotation.projectDetails.projectType}`, 15, yPos);
  yPos += 5;
  doc.text(`Built-up Area: ${quotation.projectDetails.builtUpArea} ${quotation.projectDetails.areaUnit}`, 15, yPos);
  yPos += 5;
  doc.text(`Location: ${quotation.projectDetails.city}, ${quotation.projectDetails.area}`, 15, yPos);
  yPos += 5;
  doc.text(`Construction Quality: ${quotation.projectDetails.constructionQuality.charAt(0).toUpperCase() + quotation.projectDetails.constructionQuality.slice(1)}`, 15, yPos);

  // Cost Items Table
  yPos += 15;

  const tableData = quotation.costItems.map((item, index) => [
    (index + 1).toString(),
    item.itemName,
    item.quantity.toString(),
    item.unit,
    `₹${item.rate.toLocaleString('en-IN')}`,
    `₹${item.total.toLocaleString('en-IN')}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Description', 'Qty', 'Unit', 'Rate', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: textColor,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 15, right: 15 },
  });

  // Get final Y position after table
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Summary Section
  const summaryX = pageWidth - 80;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);

  doc.text('Subtotal:', summaryX, yPos);
  doc.text(`₹${quotation.summary.subtotal.toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });

  yPos += 7;
  doc.text(`GST (${quotation.summary.gstPercentage}%):`, summaryX, yPos);
  doc.text(`₹${quotation.summary.gstAmount.toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });

  yPos += 7;
  doc.text('Discount:', summaryX, yPos);
  doc.text(`-₹${quotation.summary.discount.toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });

  yPos += 3;
  doc.setDrawColor(229, 231, 235);
  doc.line(summaryX, yPos, pageWidth - 15, yPos);

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Grand Total:', summaryX, yPos);
  doc.text(`₹${quotation.summary.grandTotal.toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });

  // Terms & Conditions
  yPos += 25;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Terms & Conditions:', 15, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);

  const terms = [
    '1. This quotation is valid for 30 days from the date of issue.',
    '2. 50% advance payment required before work commencement.',
    '3. Balance payment due upon project completion.',
    '4. Prices are subject to change based on material cost variations.',
    '5. Any additional work will be charged separately.',
  ];

  yPos += 7;
  terms.forEach((term) => {
    doc.text(term, 15, yPos);
    yPos += 5;
  });

  // Signature Section
  yPos += 15;
  doc.setDrawColor(...mutedColor);
  doc.line(pageWidth - 80, yPos + 20, pageWidth - 15, yPos + 20);
  doc.setFontSize(9);
  doc.text('Authorized Signature', pageWidth - 47.5, yPos + 28, { align: 'center' });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save the PDF
  doc.save(`Quotation-${quotation.id.slice(0, 8).toUpperCase()}.pdf`);
}
