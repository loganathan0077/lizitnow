const PDFDocument = require('pdfkit');

function generateInvoicePDF(invoice, res, action = 'download') {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    const disposition = action === 'view' ? 'inline' : 'attachment';
    res.setHeader('Content-Disposition', `${disposition}; filename=${invoice.invoiceNumber}.pdf`);

    doc.pipe(res);

    // --- Colors & Styles ---
    const primaryColor = '#F57799'; // Website Premium Pink
    const textColor = '#1F2937';    // Dark text
    const lightGray = '#F3F4F6';    // Light background
    const borderColor = '#E5E7EB';  // Borders

    // --- Top Bar Header ---
    doc.rect(0, 0, doc.page.width, 10).fill(primaryColor);

    // --- Header Section ---
    doc.y = 50;
    doc.font('Helvetica-Bold').fontSize(24).fillColor(primaryColor);
    doc.text('SHERMON INDUSTRIES', 50, 40);

    // --- Right Header Side ---
    const title = invoice.gstinUsed ? 'TAX INVOICE' : 'INVOICE';
    doc.font('Helvetica-Bold').fontSize(20).fillColor(textColor);
    doc.text(title, 400, 40, { width: 145, align: 'right' });

    // --- Company Info & Invoice Box ---
    doc.y = 80;
    const infoY = doc.y;

    // Company Address
    doc.font('Helvetica').fontSize(10).fillColor('#4B5563');
    doc.text('109, Anna Nagar, Kinathukadavu', 50, infoY);
    doc.text('Coimbatore, Tamil Nadu, India – 642109');
    doc.text('Platform GSTIN: 33AKYPL4569R1ZX');

    // Invoice details card
    doc.rect(340, infoY - 10, 205, 80).fill('#FAFAFA').stroke();
    doc.font('Helvetica-Bold').fontSize(10).fillColor(textColor);

    doc.text('Invoice Number:', 350, infoY);
    doc.font('Helvetica').fillColor('#4B5563').text(invoice.invoiceNumber, 440, infoY, { width: 95, align: 'right' });

    doc.font('Helvetica-Bold').fillColor(textColor).text('Date:', 350, infoY + 20);
    doc.font('Helvetica').fillColor('#4B5563').text(new Date(invoice.paymentDate).toLocaleDateString(), 440, infoY + 20, { width: 95, align: 'right' });

    doc.font('Helvetica-Bold').fillColor(textColor).text('Status:', 350, infoY + 40);
    doc.font('Helvetica-Bold').fillColor(invoice.status === 'success' ? primaryColor : '#EF4444')
        .text(invoice.status.toUpperCase(), 440, infoY + 40, { width: 95, align: 'right' });

    // --- Billed To Section ---
    const billedToY = infoY + 100;

    // Billed to header block
    doc.rect(50, billedToY, doc.page.width - 100, 25).fill(lightGray);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(textColor).text('BILLED TO', 60, billedToY + 8);

    doc.y = billedToY + 35;
    doc.font('Helvetica-Bold').fontSize(12).fillColor(textColor).text(invoice.user.name, 50, doc.y);
    doc.font('Helvetica').fontSize(10).fillColor('#4B5563');
    if (invoice.billingAddress) doc.text(invoice.billingAddress);
    doc.text(invoice.user.email);
    if (invoice.gstinUsed) {
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').fillColor(primaryColor).text(`Customer GSTIN: ${invoice.gstinUsed}`);
    }

    // --- Table Header ---
    doc.moveDown(2);
    const tableTop = doc.y;

    doc.rect(50, tableTop, doc.page.width - 100, 30).fill(primaryColor);

    doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF');
    doc.text('DESCRIPTION', 60, tableTop + 10);
    doc.text('HSN/SAC', 300, tableTop + 10, { width: 80, align: 'center' });
    doc.text('AMOUNT (INR)', 430, tableTop + 10, { width: 105, align: 'right' });

    // --- Table Content ---
    const rowTop = tableTop + 40;
    doc.font('Helvetica').fontSize(10).fillColor(textColor);

    const baseAmount = invoice.amount - invoice.gstAmount;

    doc.text(invoice.planName, 60, rowTop);
    doc.text(invoice.hsnCode || '998319', 300, rowTop, { width: 80, align: 'center' });
    doc.text(baseAmount.toFixed(2), 430, rowTop, { width: 105, align: 'right' });

    // Bottom Table Line
    const tableBottom = rowTop + 25;
    doc.moveTo(50, tableBottom).lineTo(doc.page.width - 50, tableBottom).lineWidth(1).strokeColor(borderColor).stroke();

    // --- Totals Section ---
    const totalsTop = tableBottom + 20;

    // Grey block for totals
    doc.rect(340, totalsTop - 10, 205, 110).fill(lightGray);

    doc.font('Helvetica').fontSize(10).fillColor(textColor);
    doc.text(`Subtotal:`, 350, totalsTop);
    doc.text(baseAmount.toFixed(2), 440, totalsTop, { width: 95, align: 'right' });

    let currentY = totalsTop + 20;

    if (invoice.cgst > 0 && invoice.sgst > 0) {
        doc.text(`CGST (9%):`, 350, currentY);
        doc.text(invoice.cgst.toFixed(2), 440, currentY, { width: 95, align: 'right' });
        currentY += 15;
        doc.text(`SGST (9%):`, 350, currentY);
        doc.text(invoice.sgst.toFixed(2), 440, currentY, { width: 95, align: 'right' });
        currentY += 15;
    } else if (invoice.igst > 0) {
        doc.text(`IGST (18%):`, 350, currentY);
        doc.text(invoice.igst.toFixed(2), 440, currentY, { width: 95, align: 'right' });
        currentY += 15;
    }

    // Divider Line
    doc.moveTo(350, currentY).lineTo(535, currentY).lineWidth(1).strokeColor(borderColor).stroke();
    currentY += 10;

    doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor);
    doc.text(`TOTAL:`, 350, currentY - 2);
    doc.text(`₹${invoice.amount.toFixed(2)}`, 440, currentY - 2, { width: 95, align: 'right' });

    // --- Footer ---
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 90; // Stop well before bottom margin to prevent new pages

    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#6B7280');
    doc.text(
        'Thank you for your business.',
        0, footerY,
        { align: 'center', width: doc.page.width }
    );
    doc.font('Helvetica').fontSize(8);
    doc.text(
        'This is a computer-generated document. No signature is required.',
        0, footerY + 15,
        { align: 'center', width: doc.page.width }
    );

    doc.end();
}

module.exports = { generateInvoicePDF };

