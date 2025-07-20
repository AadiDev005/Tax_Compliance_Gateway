import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calculator, FileText, Activity, BarChart3, Globe, Settings, Map } from 'lucide-react';
import { api } from '../lib/api';
import TaxCalculator from './TaxCalculator';
import SystemStatus from './SystemStatus';
import DocumentProcessor from './DocumentProcessor';
import LiveMetrics from './LiveMetrics';
import CountryGrid from './CountryGrid';
import WorldMap from './WorldMap';
import ProcessingPipeline from './ProcessingPipeline';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  // Stable cache stats query with reduced refetching
  const { data: cacheStats } = useQuery({
    queryKey: ['cacheStats'],
    queryFn: api.getCacheStats,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds instead of 10
    refetchOnWindowFocus: false,
  });

  // Memoize tabs to prevent recreation on every render
  const tabs = useMemo(() => [
    { 
      id: 'calculator', 
      name: 'Tax Calculator', 
      icon: Calculator, 
      description: 'Multi-jurisdiction calculations',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'documents', 
      name: 'Documents', 
      icon: FileText, 
      description: 'Document processing',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      description: 'Advanced reporting',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'admin', 
      name: 'Administration', 
      icon: Settings, 
      description: 'System management',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    { 
      id: 'monitoring', 
      name: 'System Status', 
      icon: Activity, 
      description: 'Service monitoring',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      id: 'map', 
      name: 'Global Map', 
      icon: Map, 
      description: 'Jurisdiction overview',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ], []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Stable Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Tax Compliance Gateway
                </h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Enterprise-grade multi-jurisdiction tax processing platform
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              {/* Stable cache stats display */}
              {cacheStats?.data?.cache_statistics && (
                <div className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900">
                    Cache Hit: {cacheStats.data.cache_statistics.hit_rate_percent}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {cacheStats.data.performance_summary?.performance_rating || 'Good'} Performance
                  </div>
                </div>
              )}
              
              <div className="flex items-center bg-green-50 rounded-xl px-4 py-3 border border-green-200">
                <div className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">All Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stable Navigation */}
      <div className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? `${tab.color} ${tab.bgColor} border-blue-500`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div>{tab.name}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Stable Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="transition-opacity duration-200">
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
            </div>
          )}
          
          {activeTab === 'documents' && <DocumentProcessor />}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Comprehensive analytics and reporting features
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-semibold text-blue-800">Performance Metrics</div>
                    <div className="text-blue-600">Real-time processing analytics</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-semibold text-green-800">Compliance Reports</div>
                    <div className="text-green-600">Regulatory compliance tracking</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-semibold text-purple-800">Cost Analysis</div>
                    <div className="text-purple-600">ROI and savings calculations</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'admin' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center">
                <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">System Administration</h2>
                <p className="text-gray-600 mb-6">
                  User management, system configuration, and administrative controls
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'monitoring' && (
            <div className="space-y-8">
              <SystemStatus />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LiveMetrics />
                <ProcessingPipeline />
              </div>
            </div>
          )}
          
          {activeTab === 'map' && (
            <div className="space-y-8">
              <WorldMap />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CountryGrid />
                <LiveMetrics />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
