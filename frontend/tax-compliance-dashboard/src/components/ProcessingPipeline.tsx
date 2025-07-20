import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, Cog, CheckCircle } from 'lucide-react';

const ProcessingPipeline: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, name: 'Document Upload', icon: FileText, status: 'completed', time: '0.2s' },
    { id: 2, name: 'Format Detection', icon: Cog, status: 'completed', time: '0.5s' },
    { id: 3, name: 'Tax Calculation', icon: Cog, status: 'processing', time: '1.2s' },
    { id: 4, name: 'Compliance Check', icon: CheckCircle, status: 'pending', time: '0.8s' },
    { id: 5, name: 'Result Generation', icon: CheckCircle, status: 'pending', time: '0.3s' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Processing Pipeline</h3>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          
          return (
            <React.Fragment key={step.id}>
              <div className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-blue-50 border-2 border-blue-200' : 
                isCompleted ? 'bg-green-50 border-2 border-green-200' : 
                'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isActive ? 'bg-blue-500 animate-pulse' :
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                } text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-gray-900 text-center">{step.name}</div>
                <div className="text-xs text-gray-500">{step.time}</div>
              </div>
              
              {index < steps.length - 1 && (
                <ArrowRight className={`w-6 h-6 mx-2 ${
                  currentStep > index ? 'text-green-500' : 'text-gray-300'
                } transition-colors duration-300`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingPipeline;
