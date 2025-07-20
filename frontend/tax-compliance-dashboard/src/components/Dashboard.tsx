import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calculator, FileText, Activity, BarChart3, Globe, Bell, Shield } from 'lucide-react';
import { api } from '../lib/api';
import TaxCalculator from './TaxCalculator';
import SystemStatus from './SystemStatus';
import DocumentProcessor from './DocumentProcessor';
import LiveMetrics from './LiveMetrics';
import CountryGrid from './CountryGrid';
import ProcessingPipeline from './visualizations/ProcessingPipeline';
import ComprehensiveAnalytics from './analytics/ComprehensiveAnalytics';
import RegulatoryManagement from './regulatory/RegulatoryManagement';
import AdminPanel from './admin/AdminPanel';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const { data: cacheStats } = useQuery({
    queryKey: ['cacheStats'],
    queryFn: api.getCacheStats,
    refetchInterval: 10000,
  });

  const tabs = [
    { 
      id: 'calculator', 
      name: 'Tax Calculator', 
      icon: Calculator, 
      description: 'Multi-jurisdiction calculations',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30'
    },
    { 
      id: 'documents', 
      name: 'Documents', 
      icon: FileText, 
      description: 'Document processing',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      description: 'Advanced reporting',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30'
    },
    { 
      id: 'regulatory', 
      name: 'Regulatory', 
      icon: Bell, 
      description: 'Compliance management',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30'
    },
    { 
      id: 'admin', 
      name: 'Administration', 
      icon: Shield, 
      description: 'System management',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/30'
    },
    { 
      id: 'monitoring', 
      name: 'System Status', 
      icon: Activity, 
      description: 'Service monitoring',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/30'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-colors duration-200">
      {/* Full-width Header */}
      <div className="w-full bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50 transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-200">
                  Tax Compliance Gateway
                </h1>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 transition-colors duration-200">
                  Enterprise-grade multi-jurisdiction tax processing platform
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              {cacheStats?.data?.cache_statistics && (
                <div className="bg-white dark:bg-dark-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-dark-600 shadow-sm transition-colors duration-200">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Cache Hit: {cacheStats.data.cache_statistics.hit_rate_percent}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {cacheStats.data.performance_summary?.performance_rating || 'Good'} Performance
                  </div>
                </div>
              )}
              
              <div className="flex items-center bg-green-50 dark:bg-green-900/30 rounded-xl px-4 py-3 border border-green-200 dark:border-green-800 transition-colors duration-200">
                <div className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-800 dark:text-green-300">All Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="w-full bg-white dark:bg-dark-800 shadow-sm border-b border-gray-100 dark:border-dark-700 transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? `${tab.color} ${tab.bgColor} border-blue-500 dark:border-blue-400`
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 border-transparent'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div>{tab.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Full-width Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            <TaxCalculator />
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
        )}
        
        {activeTab === 'documents' && <DocumentProcessor />}
        
        {activeTab === 'analytics' && <ComprehensiveAnalytics />}
        
        {activeTab === 'regulatory' && <RegulatoryManagement />}
        
        {activeTab === 'admin' && <AdminPanel />}
        
        {activeTab === 'monitoring' && <SystemStatus />}
      </div>
    </div>
  );
};

export default Dashboard;
