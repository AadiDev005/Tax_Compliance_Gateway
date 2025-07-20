import React, { useState } from 'react';
import { Download, FileText, Table, File } from 'lucide-react';
import { exportToPDF, exportToExcel, exportToCSV, type ExportData } from '../../utils/exportUtils';

interface ExportManagerProps {
  data: any[];
  title: string;
  columns: { key: string; label: string; }[];
}

const ExportManager: React.FC<ExportManagerProps> = ({ data, title, columns }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    
    const exportData: ExportData = {
      title,
      data,
      columns,
      metadata: {
        generatedAt: new Date().toLocaleString(),
        generatedBy: 'Tax Compliance Gateway',
        totalRecords: data.length
      }
    };

    try {
      switch (format) {
        case 'pdf':
          exportToPDF(exportData);
          break;
        case 'excel':
          exportToExcel(exportData);
          break;
        case 'csv':
          exportToCSV(exportData);
          break;
      }
      
      // Show success message
      setTimeout(() => {
        alert(`✅ ${format.toUpperCase()} export completed successfully!`);
      }, 500);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert(`❌ Export failed: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Download className="w-5 h-5 mr-2 text-blue-600" />
        Export Data ({data.length} records)
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-5 h-5 mr-2" />
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </button>
        
        <button
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Table className="w-5 h-5 mr-2" />
          {isExporting ? 'Exporting...' : 'Export as Excel'}
        </button>
        
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <File className="w-5 h-5 mr-2" />
          {isExporting ? 'Exporting...' : 'Export as CSV'}
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <div className="font-medium mb-2">Export Options:</div>
        <div className="space-y-1">
          <p>• <strong>PDF:</strong> Formatted report with professional layout</p>
          <p>• <strong>Excel:</strong> Structured data with formulas and formatting</p>
          <p>• <strong>CSV:</strong> Raw data for external analysis and import</p>
        </div>
      </div>
    </div>
  );
};

export default ExportManager;
