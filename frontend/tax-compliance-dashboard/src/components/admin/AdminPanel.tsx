import React, { useState } from 'react';
import { Users, Settings, Activity, Database, Shield, Bell, Download, Upload, Key, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const systemUsers = [
    { id: '1', name: 'John Smith', email: 'john@company.com', role: 'Administrator', status: 'active', lastLogin: '2025-07-20' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Tax Manager', status: 'active', lastLogin: '2025-07-19' },
    { id: '3', name: 'Mike Chen', email: 'mike@company.com', role: 'Auditor', status: 'inactive', lastLogin: '2025-07-15' },
    { id: '4', name: 'Lisa Brown', email: 'lisa@company.com', role: 'Compliance Officer', status: 'active', lastLogin: '2025-07-20' }
  ];

  const systemSettings = [
    { category: 'Tax Engine', setting: 'Auto-calculation', value: 'Enabled', status: 'healthy' },
    { category: 'Document Service', setting: 'File Processing', value: 'Active', status: 'healthy' },
    { category: 'Regulatory Service', setting: 'Change Monitoring', value: 'Active', status: 'healthy' },
    { category: 'Notifications', setting: 'Email Alerts', value: 'Enabled', status: 'warning' },
    { category: 'Backup', setting: 'Auto Backup', value: 'Daily', status: 'healthy' },
    { category: 'Security', setting: 'API Authentication', value: 'JWT', status: 'healthy' }
  ];

  const auditLogs = [
    { timestamp: '2025-07-20 15:30:22', user: 'john@company.com', action: 'Tax calculation performed', details: 'Italy - €1,100,000', severity: 'info' },
    { timestamp: '2025-07-20 14:45:18', user: 'sarah@company.com', action: 'Document uploaded', details: 'invoice_DE_001.xml', severity: 'info' },
    { timestamp: '2025-07-20 13:22:14', user: 'admin@company.com', action: 'User permissions modified', details: 'Updated Mike Chen role', severity: 'warning' },
    { timestamp: '2025-07-20 12:15:33', user: 'system', action: 'Backup completed', details: 'Database backup successful', severity: 'success' },
    { timestamp: '2025-07-20 11:08:45', user: 'lisa@company.com', action: 'Compliance report generated', details: 'Q2 2025 report', severity: 'info' }
  ];

  const apiUsageStats = [
    { endpoint: '/api/tax/calculate', calls: 15847, avgResponse: '15ms', errorRate: '0.1%', status: 'excellent' },
    { endpoint: '/api/documents/upload', calls: 3421, avgResponse: '245ms', errorRate: '0.3%', status: 'good' },
    { endpoint: '/api/regulatory/changes', calls: 892, avgResponse: '32ms', errorRate: '0.0%', status: 'excellent' },
    { endpoint: '/api/system/health', calls: 45123, avgResponse: '8ms', errorRate: '0.0%', status: 'excellent' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-3">System Administration</h1>
            <p className="text-gray-200 text-xl">User management, system configuration, and audit controls</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Users', value: '24', icon: Users },
              { label: 'API Calls Today', value: '15.2K', icon: Activity },
              { label: 'System Uptime', value: '99.9%', icon: Shield },
              { label: 'Data Stored', value: '2.4TB', icon: Database }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: 'overview', name: 'Overview', icon: Activity },
            { id: 'users', name: 'User Management', icon: Users },
            { id: 'settings', name: 'System Settings', icon: Settings },
            { id: 'audit', name: 'Audit Logs', icon: Shield },
            { id: 'api', name: 'API Analytics', icon: Globe }
          ].map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeSection === section.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Content Sections */}
      {activeSection === 'users' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {systemUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeSection === 'settings' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Configuration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemSettings.map((setting, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{setting.category}</h3>
                      <p className="text-sm text-gray-600">{setting.setting}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{setting.value}</div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(setting.status)}`}>
                        {setting.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Backup & Export</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Download className="w-5 h-5 mr-2" />
                  Export System Data
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Import Configuration
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                  <Shield className="w-5 h-5 mr-2" />
                  Create Backup
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Two-Factor Authentication</span>
                  <button className="px-3 py-1 bg-green-100 text-green-600 rounded">Enabled</button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>API Rate Limiting</span>
                  <button className="px-3 py-1 bg-green-100 text-green-600 rounded">Active</button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Session Timeout</span>
                  <span className="text-sm text-gray-600">30 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeSection === 'audit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Audit Trail</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                Filter
              </button>
              <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                Export
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {auditLogs.map((log, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`font-medium ${getSeverityColor(log.severity)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm text-gray-500">{log.user}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  </div>
                  <span className="text-xs text-gray-400">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeSection === 'api' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Usage Analytics</h2>
          <div className="space-y-4">
            {apiUsageStats.map((api, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-mono font-semibold text-gray-900">{api.endpoint}</h3>
                    <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                      <span>{api.calls.toLocaleString()} calls</span>
                      <span>Avg: {api.avgResponse}</span>
                      <span>Error: {api.errorRate}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(api.status)}`}>
                    {api.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;
