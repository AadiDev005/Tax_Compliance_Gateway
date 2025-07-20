import React from 'react';
import SystemStatusComponent from '../components/SystemStatus';
import LiveMetrics from '../components/LiveMetrics';

const SystemStatus: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Status & Monitoring</h1>
        <p className="text-gray-600">Real-time monitoring of all system components and services</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SystemStatusComponent />
        <LiveMetrics />
      </div>
    </div>
  );
};

export default SystemStatus;
