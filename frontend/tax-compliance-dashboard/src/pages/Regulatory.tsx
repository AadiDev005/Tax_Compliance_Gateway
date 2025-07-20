import React from 'react';
import RegulatoryManagement from '../components/regulatory/RegulatoryManagement';
import RuleValidation from '../components/compliance/RuleValidation';

const Regulatory: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <RegulatoryManagement />
      <RuleValidation />
    </div>
  );
};

export default Regulatory;
