import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, X, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationRule {
  id: string;
  category: 'tax_calculation' | 'document_format' | 'regulatory_compliance' | 'data_accuracy';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'passed' | 'failed' | 'pending' | 'not_applicable';
  details?: string;
  suggestion?: string;
}

const RuleValidation: React.FC = () => {
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([
    {
      id: 'tax_calc_001',
      category: 'tax_calculation',
      title: 'VAT Rate Validation',
      description: 'Verify correct VAT rates are applied for each jurisdiction',
      severity: 'critical',
      status: 'passed',
      details: 'All VAT rates match current regulatory requirements'
    },
    {
      id: 'doc_format_001',
      category: 'document_format',
      title: 'Invoice Format Compliance',
      description: 'Check invoice format meets local requirements',
      severity: 'critical',
      status: 'failed',
      details: 'Missing required VAT identification number',
      suggestion: 'Add VAT ID field to invoice template'
    },
    {
      id: 'reg_comp_001',
      category: 'regulatory_compliance',
      title: 'E-invoicing Standards',
      description: 'Validate against latest e-invoicing regulations',
      severity: 'warning',
      status: 'passed',
      details: 'Complies with current e-invoicing standards'
    },
    {
      id: 'data_acc_001',
      category: 'data_accuracy',
      title: 'Currency Conversion',
      description: 'Verify currency conversion rates and calculations',
      severity: 'warning',
      status: 'pending',
      details: 'Awaiting latest exchange rate data'
    },
    {
      id: 'tax_calc_002',
      category: 'tax_calculation',
      title: 'Cross-border Transaction Rules',
      description: 'Validate cross-border tax calculation rules',
      severity: 'info',
      status: 'not_applicable',
      details: 'No cross-border transactions in current batch'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isValidating, setIsValidating] = useState(false);

  const categories = [
    { id: 'all', name: 'All Rules', count: validationRules.length },
    { id: 'tax_calculation', name: 'Tax Calculation', count: validationRules.filter(r => r.category === 'tax_calculation').length },
    { id: 'document_format', name: 'Document Format', count: validationRules.filter(r => r.category === 'document_format').length },
    { id: 'regulatory_compliance', name: 'Regulatory', count: validationRules.filter(r => r.category === 'regulatory_compliance').length },
    { id: 'data_accuracy', name: 'Data Accuracy', count: validationRules.filter(r => r.category === 'data_accuracy').length }
  ];

  const filteredRules = selectedCategory === 'all' 
    ? validationRules 
    : validationRules.filter(rule => rule.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-700 bg-green-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const runValidation = async () => {
    setIsValidating(true);
    
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update some random statuses
    setValidationRules(prev => prev.map(rule => ({
      ...rule,
      status: Math.random() > 0.7 ? 'failed' : 'passed'
    })));
    
    setIsValidating(false);
  };

  const overallScore = Math.round(
    (validationRules.filter(r => r.status === 'passed').length / validationRules.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rule Validation & Compliance</h2>
            <p className="text-gray-600">Automated validation of tax compliance rules and regulations</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${overallScore >= 90 ? 'text-green-600' : overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {overallScore}%
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
            
            <button
              onClick={runValidation}
              disabled={isValidating}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
              {isValidating ? 'Validating...' : 'Run Validation'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Validation Rules */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredRules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${getSeverityColor(rule.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {getStatusIcon(rule.status)}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{rule.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rule.status)}`}>
                        {rule.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rule.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        rule.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rule.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{rule.description}</p>
                    
                    {rule.details && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">{rule.details}</p>
                      </div>
                    )}
                    
                    {rule.suggestion && rule.status === 'failed' && (
                      <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                        <div className="flex items-start">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">Suggestion:</span> {rule.suggestion}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No validation rules found for the selected category.</p>
        </div>
      )}
    </div>
  );
};

export default RuleValidation;
