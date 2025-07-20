import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, CheckCircle, Upload, Shield } from 'lucide-react';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  duration: number;
  icon: React.ElementType;
}

const ProcessingPipeline: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps: ProcessingStep[] = [
    { id: 'upload', name: 'Document Upload', status: 'pending', duration: 1000, icon: Upload },
    { id: 'validate', name: 'Format Validation', status: 'pending', duration: 1500, icon: Shield },
    { id: 'parse', name: 'Data Parsing', status: 'pending', duration: 2000, icon: Cpu },
    { id: 'calculate', name: 'Tax Calculation', status: 'pending', duration: 1500, icon: FileText },
    { id: 'complete', name: 'Processing Complete', status: 'pending', duration: 500, icon: CheckCircle }
  ];

  const [pipelineSteps, setPipelineSteps] = useState(steps);

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentStep(0);
    
    const newSteps = [...steps];
    setPipelineSteps(newSteps.map(step => ({ ...step, status: 'pending' })));

    let stepIndex = 0;
    const processStep = () => {
      if (stepIndex < newSteps.length) {
        setPipelineSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === stepIndex ? 'processing' : index < stepIndex ? 'completed' : 'pending'
        })));
        
        setCurrentStep(stepIndex);
        
        setTimeout(() => {
          setPipelineSteps(prev => prev.map((step, index) => ({
            ...step,
            status: index <= stepIndex ? 'completed' : 'pending'
          })));
          
          stepIndex++;
          if (stepIndex < newSteps.length) {
            setTimeout(processStep, 300);
          } else {
            setIsProcessing(false);
          }
        }, newSteps[stepIndex].duration);
      }
    };
    
    processStep();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'processing': return 'bg-blue-500 text-white animate-pulse';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Document Processing Pipeline</h3>
          <p className="text-gray-600 mt-1">Real-time visualization of processing stages</p>
        </div>
        <button
          onClick={startProcessing}
          disabled={isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isProcessing ? 'Processing...' : 'Start Demo Processing'}
        </button>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-8 relative">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <motion.div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor(step.status)} transition-all duration-300 shadow-lg`}
                  animate={{
                    scale: step.status === 'processing' ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: step.status === 'processing' ? Infinity : 0,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                
                <div className="mt-3 text-center">
                  <div className="text-sm font-medium text-gray-900">{step.name}</div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
                    step.status === 'completed' ? 'bg-green-100 text-green-800' :
                    step.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    step.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {step.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-lg p-6"
          >
            <h4 className="font-semibold text-blue-900 mb-4">Current Processing Step</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">{pipelineSteps[currentStep]?.name}</div>
                <div className="text-sm text-blue-600">Current Step</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">{currentStep + 1} of {pipelineSteps.length}</div>
                <div className="text-sm text-blue-600">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">
                  {Math.round(((currentStep + 1) / pipelineSteps.length) * 100)}%
                </div>
                <div className="text-sm text-blue-600">Complete</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProcessingPipeline;
