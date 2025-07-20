import React from 'react';
import TaxCalculatorComponent from '../components/TaxCalculator';
import LiveMetrics from '../components/LiveMetrics';
import CountryGrid from '../components/CountryGrid';
import ProcessingPipeline from '../components/ProcessingPipeline';

const TaxCalculator: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <TaxCalculatorComponent />
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

export default TaxCalculator;
