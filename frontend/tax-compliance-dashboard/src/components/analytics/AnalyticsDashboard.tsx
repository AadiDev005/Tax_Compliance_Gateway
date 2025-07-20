import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Globe, Users } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const taxDataByCountry = [
    { country: 'Germany', amount: 250000, taxes: 47500, flag: '🇩🇪' },
    { country: 'Italy', amount: 1100000, taxes: 242000, flag: '🇮🇹' },
    { country: 'Mexico', amount: 180000, taxes: 28800, flag: '🇲🇽' },
    { country: 'Poland', amount: 95000, taxes: 21850, flag: '🇵🇱' },
    { country: 'Spain', amount: 320000, taxes: 67200, flag: '🇪🇸' },
  ];

  const processingData = [
    { name: 'Jan', processed: 1200, failed: 45 },
    { name: 'Feb', processed: 1800, failed: 32 },
    { name: 'Mar', processed: 2400, failed: 28 },
    { name: 'Apr', processed: 2100, failed: 19 },
    { name: 'May', processed: 2800, failed: 15 },
    { name: 'Jun', processed: 3200, failed: 12 },
  ];

  const complianceData = [
    { name: 'Compliant', value: 95, color: '#10B981' },
    { name: 'Warning', value: 4, color: '#F59E0B' },
    { name: 'Error', value: 1, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-purple-100">Comprehensive tax processing insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Processed</p>
              <p className="text-3xl font-bold text-gray-900">15,847</p>
              <p className="text-green-600 text-sm">+12% from last month</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tax Collected</p>
              <p className="text-3xl font-bold text-gray-900">$407,350</p>
              <p className="text-green-600 text-sm">+8% from last month</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Countries</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
              <p className="text-blue-600 text-sm">2 more coming soon</p>
            </div>
            <Globe className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">99.2%</p>
              <p className="text-green-600 text-sm">+0.3% improvement</p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Tax by Country */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Tax Collection by Country</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taxDataByCountry}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Tax Amount']} />
              <Bar dataKey="taxes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Processing Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Processing Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="processed" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-4">
            {complianceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-2xl font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
