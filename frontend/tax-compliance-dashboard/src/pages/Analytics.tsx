import React from 'react';
import ComprehensiveAnalytics from '../components/analytics/ComprehensiveAnalytics';
import RealTimeCharts from '../components/charts/RealTimeCharts';
import ExportManager from '../components/export/ExportManager';

const Analytics: React.FC = () => {
  const analyticsData = [
    { month: 'January', revenue: 180000, transactions: 1200, compliance: 94 },
    { month: 'February', revenue: 270000, transactions: 1800, compliance: 96 },
    { month: 'March', revenue: 315000, transactions: 2100, compliance: 98 },
    { month: 'April', revenue: 292500, transactions: 1950, compliance: 97 },
    { month: 'May', revenue: 360000, transactions: 2400, compliance: 99 },
    { month: 'June', revenue: 420000, transactions: 2800, compliance: 98 }
  ];

  const exportColumns = [
    { key: 'month', label: 'Month' },
    { key: 'revenue', label: 'Revenue ($)' },
    { key: 'transactions', label: 'Transactions' },
    { key: 'compliance', label: 'Compliance (%)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ComprehensiveAnalytics />
      <RealTimeCharts />
      <ExportManager 
        data={analyticsData}
        title="Tax Compliance Analytics Report"
        columns={exportColumns}
      />
    </div>
  );
};

export default Analytics;
