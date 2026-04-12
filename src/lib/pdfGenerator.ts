import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice } from './utils';

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  paymentMethod: 'wave' | 'orange' | 'whatsapp';
  paymentStatus: 'paid' | 'pending';
  orderDate: Date;
  message?: string;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Couleurs OpenTech
  const colors = {
    primary: [0, 112, 243], // Bleu OpenTech
    secondary: [0, 188, 212], // Cyan
    accent: [255, 107, 0], // Orange
    text: [51, 51, 51],
    textLight: [102, 102, 102],
    border: [240, 240, 240]
  };

  // Header avec logo et titre
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('OpenTech Business', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Facture', pageWidth - 30, 25, { align: 'right' });
  
  // Ligne de séparation
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.line(20, 50, pageWidth - 20, 50);
  
  // Informations de la facture
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const invoiceNumber = `INV-${invoiceData.orderId.slice(-8).toUpperCase()}`;
  const dateStr = invoiceData.orderDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.text(`N° Facture : ${invoiceNumber}`, 20, 65);
  doc.text(`Date : ${dateStr}`, 20, 75);
  doc.text(`Commande N° : ${invoiceData.orderId.slice(-8).toUpperCase()}`, 20, 85);
  
  // Informations client
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations client', 20, 110);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom : ${invoiceData.customerName}`, 20, 125);
  doc.text(`Email : ${invoiceData.customerEmail || 'Non renseigné'}`, 20, 135);
  doc.text(`Téléphone : ${invoiceData.customerPhone}`, 20, 145);
  
  // Tableau des produits
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Détails de la commande', 20, 170);
  
  const tableData = invoiceData.items.map(item => [
    item.name,
    `${formatPrice(item.price)} FCFA`,
    item.quantity.toString(),
    `${formatPrice(item.price * item.quantity)} FCFA`
  ]);
  
  autoTable(doc, {
    startY: 180,
    head: [['Produit', 'Prix unitaire', 'Quantité', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: colors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: colors.text
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: 'right' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 40, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 220;
  
  // Total
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.line(20, finalY + 10, pageWidth - 20, finalY + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text(`Total : ${formatPrice(invoiceData.totalAmount)} FCFA`, pageWidth - 50, finalY + 25, { align: 'right' });
  
  // Informations de paiement
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  const paymentMethodText = {
    wave: 'Wave',
    orange: 'Orange Money',
    whatsapp: 'WhatsApp (Paiement à la livraison)'
  };
  
  const paymentStatusText = invoiceData.paymentStatus === 'paid' ? '✅ Payé' : '⏳ En attente';
  const paymentStatusColor = invoiceData.paymentStatus === 'paid' ? [76, 175, 80] : [255, 152, 0];
  
  doc.text(`Méthode de paiement : ${paymentMethodText[invoiceData.paymentMethod]}`, 20, finalY + 35);
  doc.setTextColor(paymentStatusColor[0], paymentStatusColor[1], paymentStatusColor[2]);
  doc.text(`Statut : ${paymentStatusText}`, 20, finalY + 45);
  
  // Message du client
  if (invoiceData.message) {
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text('Message :', 20, finalY + 60);
    doc.setFontSize(9);
    const splitMessage = doc.splitTextToSize(invoiceData.message, pageWidth - 40);
    doc.text(splitMessage, 20, finalY + 70);
  }
  
  // Footer
  const footerY = pageHeight - 30;
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
  
  doc.setFontSize(8);
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.text('OpenTech Business - Solutions Digitales & Formations', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Tél: +221 76 656 02 58 | Email: businessopentech@gmail.com', pageWidth / 2, footerY + 8, { align: 'center' });
  
  // Retourner le PDF en Blob
  return doc.output('blob');
}

export async function downloadInvoice(invoiceData: InvoiceData, filename?: string) {
  try {
    const pdfBlob = await generateInvoicePDF(invoiceData);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `facture-${invoiceData.orderId.slice(-8)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return false;
  }
}