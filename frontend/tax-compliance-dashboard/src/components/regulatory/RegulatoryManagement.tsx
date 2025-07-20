import React, { useState } from 'react';
import { Calendar, Bell, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const RegulatoryManagement: React.FC = () => {
  const [activeView, setActiveView] = useState('timeline');

  const regulatoryChanges = [
    {
      id: '1',
      country: 'Germany',
      flag: '🇩🇪',
      title: 'VAT Rate Update for Digital Services',
      description: 'New 19% VAT rate applies to all digital services effective Q4 2025',
      effectiveDate: '2025-10-01',
      status: 'upcoming',
      impact: 'high',
      affectedTransactions: 12000,
      estimatedImpact: '$125,000'
    },
    {
      id: '2',
      country: 'Italy',
      flag: '🇮🇹',
      title: 'E-invoicing Mandatory Format Change',
      description: 'FatturaPA XML format requirements updated with new validation rules',
      effectiveDate: '2025-08-15',
      status: 'active',
      impact: 'medium',
      affectedTransactions: 8500,
      estimatedImpact: '$67,000'
    },
    {
      id: '3',
      country: 'Mexico',
      flag: '🇲🇽',
      title: 'CFDI 4.0 Implementation Deadline',
      description: 'Complete migration to CFDI 4.0 format required for all invoices',
      effectiveDate: '2025-09-30',
      status: 'in-progress',
      impact: 'high',
      affectedTransactions: 15000,
      estimatedImpact: '$180,000'
    },
    {
      id: '4',
      country: 'France',
      flag: '🇫🇷',
      title: 'Real-time Invoice Reporting',
      description: 'Implementation of continuous transaction controls (CTC)',
      effectiveDate: '2026-01-01',
      status: 'planned',
      impact: 'high',
      affectedTransactions: 9800,
      estimatedImpact: '$95,000'
    }
  ];

  const complianceDeadlines = [
    {
      country: 'Germany',
      flag: '🇩🇪',
      deadline: '2025-09-15',
      task: 'Digital Services VAT Registration',
      priority: 'high',
      daysLeft: 57
    },
    {
      country: 'Mexico',
      flag: '🇲🇽',
      deadline: '2025-08-30',
      task: 'CFDI 4.0 Testing Completion',
      priority: 'critical',
      daysLeft: 41
    },
    {
      country: 'Italy',
      flag: '🇮🇹',
      deadline: '2025-08-10',
      task: 'FatturaPA Compliance Update',
      priority: 'medium',
      daysLeft: 21
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'upcoming': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'in-progress': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-3">Regulatory Management Center</h1>
            <p className="text-indigo-100 text-xl">Track compliance changes, deadlines, and regulatory impact</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <div className="text-sm text-indigo-200">Active Changes</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <div className="text-sm text-indigo-200">Upcoming Deadlines</div>
              <div className="text-2xl font-bold">7</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex space-x-4">
          {[
            { id: 'timeline', name: 'Change Timeline', icon: Calendar },
            { id: 'deadlines', name: 'Compliance Deadlines', icon: Bell },
            { id: 'impact', name: 'Impact Analysis', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeView === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Content Views */}
      {activeView === 'timeline' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Regulatory Change Timeline</h2>
          <div className="space-y-4">
            {regulatoryChanges.map((change, index) => (
              <motion.div
                key={change.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{change.flag}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(change.status)}
                        <h3 className="text-lg font-semibold text-gray-900">{change.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          change.impact === 'high' ? 'bg-red-100 text-red-800' :
                          change.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {change.impact} impact
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{change.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Effective Date:</span>
                          <div className="font-semibold">{new Date(change.effectiveDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Affected Transactions:</span>
                          <div className="font-semibold">{change.affectedTransactions.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Estimated Impact:</span>
                          <div className="font-semibold text-green-600">{change.estimatedImpact}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                      Track Progress
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeView === 'deadlines' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Compliance Deadlines</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Urgent Deadlines</h3>
              {complianceDeadlines.filter(d => d.daysLeft <= 30).map((deadline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${getPriorityColor(deadline.priority)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{deadline.flag}</span>
                      <span className="font-semibold">{deadline.country}</span>
                    </div>
                    <span className="font-bold text-lg">{deadline.daysLeft} days</span>
                  </div>
                  <h4 className="font-semibold mb-1">{deadline.task}</h4>
                  <p className="text-sm">Deadline: {new Date(deadline.deadline).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Compliance Calendar</h3>
              <div className="space-y-3">
                {complianceDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{deadline.task}</div>
                        <div className="text-sm text-gray-500">{deadline.country}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{new Date(deadline.deadline).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{deadline.daysLeft} days left</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeView === 'impact' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Regulatory Impact Analysis</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Financial Impact Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span className="font-medium">Implementation Costs</span>
                  <span className="font-bold text-red-600">$125,000</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Training & Resources</span>
                  <span className="font-bold text-yellow-600">$45,000</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Compliance Savings</span>
                  <span className="font-bold text-green-600">$89,000</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <span className="font-bold">Net Impact (Annual)</span>
                  <span className="font-bold text-2xl text-blue-600">-$81,000</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                {[
                  { risk: 'Non-compliance Penalties', level: 'High', impact: '$250,000' },
                  { risk: 'System Integration Delays', level: 'Medium', impact: '$50,000' },
                  { risk: 'Training Gaps', level: 'Low', impact: '$15,000' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.risk}</div>
                      <div className={`text-sm ${
                        item.level === 'High' ? 'text-red-600' :
                        item.level === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.level} Risk
                      </div>
                    </div>
                    <span className="font-semibold">{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegulatoryManagement;
