import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, DollarSign, Activity, Globe, Wifi, WifiOff } from 'lucide-react';

const RealTimeCharts: React.FC = () => {
  const [liveData, setLiveData] = useState<any[]>([]);
  const [isConnected] = useState(true);

  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 30000).toLocaleTimeString(),
      transactions: Math.floor(Math.random() * 1000) + 500,
      compliance: 95 + Math.random() * 5,
      processing_speed: Math.floor(Math.random() * 500) + 800,
      revenue: Math.floor(Math.random() * 50000) + 25000
    }));
    
    setLiveData(initialData);
    
    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        transactions: Math.floor(Math.random() * 1000) + 500,
        compliance: 95 + Math.random() * 5,
        processing_speed: Math.floor(Math.random() * 500) + 800,
        revenue: Math.floor(Math.random() * 50000) + 25000
      };
      
      setLiveData(prev => [...prev.slice(-19), newPoint]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const monthlyData = [
    { month: 'Jan', revenue: 180000, transactions: 1200, compliance: 94 },
    { month: 'Feb', revenue: 270000, transactions: 1800, compliance: 96 },
    { month: 'Mar', revenue: 315000, transactions: 2100, compliance: 98 },
    { month: 'Apr', revenue: 292500, transactions: 1950, compliance: 97 },
    { month: 'May', revenue: 360000, transactions: 2400, compliance: 99 },
    { month: 'Jun', revenue: 420000, transactions: 2800, compliance: 98 }
  ];

  const countryData = [
    { name: 'Germany', value: 35, transactions: 2400, color: '#0088FE' },
    { name: 'Italy', value: 25, transactions: 1800, color: '#00C49F' },
    { name: 'Mexico', value: 20, transactions: 1200, color: '#FFBB28' },
    { name: 'France', value: 12, transactions: 800, color: '#FF8042' },
    { name: 'Poland', value: 8, transactions: 600, color: '#8884d8' }
  ];

  return (
    <div className="space-y-8">
      {/* Status Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-lg border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Real-time Analytics Dashboard</h2>
          <div className="flex items-center space-x-2">
            {isConnected ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-sm font-medium text-gray-600">
              {isConnected ? 'Live Data Stream' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Transaction Volume */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Live Transaction Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={liveData}>
              <defs>
                <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="transactions" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#transactionGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Compliance Score Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[90, 100]} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Compliance']} />
              <Line 
                type="monotone" 
                dataKey="compliance" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Monthly Revenue Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Country Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-purple-600" />
            Transaction Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCharts;
