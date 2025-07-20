import React, { useState } from 'react';
import { Calculator, FileText, Activity, BarChart3, Globe, Moon, Sun } from 'lucide-react';
import TaxCalculator from './TaxCalculator';
import SystemStatus from './SystemStatus';
import DocumentProcessor from './DocumentProcessor';
import LiveMetrics from './LiveMetrics';
import CountryGrid from './CountryGrid';
import CustomWorldMap from './maps/CustomWorldMap';
import SimpleRealTimeMetrics from './dashboard/SimpleRealTimeMetrics';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'calculator', name: 'Tax Calculator', icon: Calculator },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'monitoring', name: 'System Status', icon: Activity },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Tax Compliance Gateway</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Multi-jurisdiction tax processing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              
              <div className="flex items-center bg-green-50 dark:bg-green-900 rounded-lg px-3 py-2">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-800 dark:text-green-300">All Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            <TaxCalculator />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <SimpleRealTimeMetrics />
              </div>
              <div className="space-y-6">
                <CountryGrid />
                <CustomWorldMap />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'documents' && <DocumentProcessor />}
        {activeTab === 'monitoring' && <SystemStatus />}
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Advanced analytics features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
