import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportData {
  title: string;
  data: any[];
  columns: { key: string; label: string; }[];
  metadata?: {
    generatedAt: string;
    generatedBy: string;
    totalRecords: number;
  };
}

export const exportToPDF = (exportData: ExportData) => {
  const doc = new jsPDF();
  const { title, data, columns, metadata } = exportData;
  
  // Header
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Metadata
  if (metadata) {
    doc.setFontSize(10);
    doc.text(`Generated: ${metadata.generatedAt}`, 20, 30);
    doc.text(`By: ${metadata.generatedBy}`, 20, 35);
    doc.text(`Records: ${metadata.totalRecords}`, 20, 40);
  }
  
  // Table headers
  doc.setFontSize(12);
  let yPosition = 50;
  
  columns.forEach((col, index) => {
    doc.text(col.label, 20 + (index * 40), yPosition);
  });
  
  // Table data
  yPosition += 10;
  data.forEach((row) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    columns.forEach((col, colIndex) => {
      const value = row[col.key]?.toString() || '';
      doc.text(value.substring(0, 15), 20 + (colIndex * 40), yPosition);
    });
    
    yPosition += 5;
  });
  
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};

export const exportToExcel = (exportData: ExportData) => {
  const { title, data, columns } = exportData;
  
  const wb = XLSX.utils.book_new();
  const headers = columns.map(col => col.label);
  const rows = data.map(row => columns.map(col => row[col.key]));
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  const colWidths = columns.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`);
};

export const exportToCSV = (exportData: ExportData) => {
  const { title, data, columns } = exportData;
  
  const headers = columns.map(col => col.label).join(',');
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key]?.toString() || '';
      return value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`);
};
