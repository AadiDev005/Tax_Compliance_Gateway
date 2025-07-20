import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Users, FileText, Download, Calendar, Filter, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ComprehensiveAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [liveData, setLiveData] = useState<any[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        revenue: 50000 + Math.random() * 20000,
        transactions: 800 + Math.random() * 200,
        compliance: 95 + Math.random() * 4,
        cost_savings: 15000 + Math.random() * 5000
      };
      setLiveData(prev => [...prev.slice(-19), newPoint]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const monthlyTrends = [
    { month: 'Jan', revenue: 180000, transactions: 1200, compliance: 94, cost_savings: 45000 },
    { month: 'Feb', revenue: 270000, transactions: 1800, compliance: 96, cost_savings: 67000 },
    { month: 'Mar', revenue: 315000, transactions: 2100, compliance: 98, cost_savings: 78000 },
    { month: 'Apr', revenue: 292500, transactions: 1950, compliance: 97, cost_savings: 72000 },
    { month: 'May', revenue: 360000, transactions: 2400, compliance: 99, cost_savings: 89000 },
    { month: 'Jun', revenue: 420000, transactions: 2800, compliance: 98, cost_savings: 104000 }
  ];

  const countryPerformance = [
    { name: 'Germany', transactions: 2400, revenue: 850000, compliance: 98.5, color: '#0088FE' },
    { name: 'Italy', transactions: 1800, revenue: 650000, compliance: 96.8, color: '#00C49F' },
    { name: 'Mexico', transactions: 1200, revenue: 420000, compliance: 94.2, color: '#FFBB28' },
    { name: 'France', transactions: 1600, revenue: 580000, compliance: 97.1, color: '#FF8042' },
    { name: 'Poland', transactions: 800, revenue: 280000, compliance: 95.6, color: '#8884d8' }
  ];

  const complianceMetrics = [
    { category: 'Tax Calculations', current: 98.5, target: 99.0, improvement: '+2.1%' },
    { category: 'Document Processing', current: 97.2, target: 98.0, improvement: '+1.8%' },
    { category: 'Regulatory Compliance', current: 99.1, target: 99.5, improvement: '+0.5%' },
    { category: 'Data Accuracy', current: 96.8, target: 98.0, improvement: '+3.2%' }
  ];

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting comprehensive analytics report as ${format}`);
    // Simulate export process
    setTimeout(() => {
      alert(`✅ Analytics report exported as ${format.toUpperCase()}!\n\nReport includes:\n• Revenue trends and forecasts\n• Country-wise performance metrics\n• Compliance scoring details\n• Cost savings analysis\n• ROI calculations`);
    }, 1000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Enhanced Header with Export Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-3">Advanced Analytics Dashboard</h1>
            <p className="text-purple-100 text-xl">Comprehensive insights, ROI analysis, and performance metrics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white font-semibold"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
            
            <div className="flex space-x-2">
              {['pdf', 'excel', 'csv'].map(format => (
                <button 
                  key={format}
                  onClick={() => exportReport(format as any)}
                  className="flex items-center px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Live Revenue', value: '$2.45M', change: '+18.2%', icon: DollarSign },
            { label: 'Active Countries', value: '8', change: '+2 this month', icon: Users },
            { label: 'Documents Today', value: '1,247', change: '+12.5%', icon: FileText },
            { label: 'Compliance Score', value: '98.1%', change: '+1.2%', icon: Activity }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-8 h-8 text-white/80" />
                  <span className="text-green-300 text-sm font-semibold">{metric.change}</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-white/70">{metric.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Real-time Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Trends with Forecasting */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl border"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Revenue & Cost Savings Analysis</h3>
              <p className="text-gray-600">Monthly trends with ROI projections</p>
            </div>
            <div className="flex space-x-2">
              {['revenue', 'transactions', 'compliance', 'cost_savings'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedMetric === metric
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, selectedMetric]} />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#colorGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Country Performance Matrix */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl border"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Country Performance Matrix</h3>
          <div className="space-y-4">
            {countryPerformance.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">{country.name}</h4>
                  <span className="text-green-600 font-bold">
                    {country.compliance.toFixed(1)}% Compliance
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Transactions:</span>
                    <div className="font-bold">{country.transactions.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <div className="font-bold">${country.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Growth:</span>
                    <div className="font-bold text-green-600">+{(Math.random() * 20 + 5).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${country.compliance}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ROI and Cost Savings Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-xl border"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
          ROI & Cost Savings Analysis
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Implementation Cost Savings</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Manual Processing Elimination</span>
                <span className="font-bold text-green-600">$125,000/year</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">Compliance Error Reduction</span>
                <span className="font-bold text-blue-600">$89,000/year</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="font-medium">Audit Preparation Time</span>
                <span className="font-bold text-purple-600">$45,000/year</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <span className="font-bold">Total Annual Savings</span>
                <span className="font-bold text-2xl text-orange-600">$259,000</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">ROI Projections</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[
                { month: 'Month 1', roi: -50000, breakeven: 0 },
                { month: 'Month 3', roi: -25000, breakeven: 0 },
                { month: 'Month 6', roi: 25000, breakeven: 0 },
                { month: 'Month 9', roi: 85000, breakeven: 0 },
                { month: 'Month 12', roi: 159000, breakeven: 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'ROI']} />
                <Line type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="breakeven" stroke="#6B7280" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <span className="text-green-600 font-bold text-xl">Break-even: Month 5</span>
              <br />
              <span className="text-gray-600">12-month ROI: 318%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compliance Performance Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-xl border"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <AlertCircle className="w-6 h-6 mr-3 text-blue-600" />
          Compliance Performance Metrics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {complianceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{metric.category}</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{metric.current}%</span>
                    <span className="text-sm text-green-600 ml-2">{metric.improvement}</span>
                  </div>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.current}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-4 rounded-full ${
                      metric.current >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  <div 
                    className="absolute top-0 w-1 h-4 bg-red-500 rounded-full"
                    style={{ left: `${metric.target}%` }}
                    title={`Target: ${metric.target}%`}
                  />
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Current: {metric.current}%</span>
                  <span>Target: {metric.target}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-blue-900">Compliance Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800">Overall Score:</span>
                <span className="font-bold text-2xl text-blue-900">97.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Risk Level:</span>
                <span className="font-semibold text-green-600">LOW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Next Audit:</span>
                <span className="font-semibold text-blue-900">Q4 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Recommendations:</span>
                <span className="font-semibold text-orange-600">3 pending</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComprehensiveAnalytics;
