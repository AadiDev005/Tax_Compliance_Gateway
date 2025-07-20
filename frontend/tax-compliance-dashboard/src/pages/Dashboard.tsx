import React from 'react';
import LiveMetrics from '../components/LiveMetrics';
import CountryGrid from '../components/CountryGrid';
import ProcessingPipeline from '../components/ProcessingPipeline';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Real-time insights into your tax compliance operations</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <LiveMetrics />
        </div>
        <div>
          <CountryGrid />
        </div>
      </div>
      
      <ProcessingPipeline />
    </div>
  );
};

export default Dashboard;
