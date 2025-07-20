import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Globe, Zap, Clock, CheckCircle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { api } from '../lib/api';

const LiveMetrics: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  const { data: systemMetrics } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: api.getSystemMetrics,
    refetchInterval: 2000,
  });

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: api.getSupportedCountries,
  });

  useEffect(() => {
    if (systemMetrics) {
      const newDataPoint = {
        time: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        processed: systemMetrics.documents_processed,
        responseTime: systemMetrics.response_time_ms,
        speed: systemMetrics.processing_speed
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-15);
      });
    }
  }, [systemMetrics]);

  const metricCards = [
    {
      label: 'Documents Processed',
      value: systemMetrics?.documents_processed?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      label: 'Countries Active',
      value: countries?.data?.filter(c => c.active).length || 0,
      icon: Globe,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: `${countries?.data?.length || 0} total`,
      changeColor: 'text-gray-500'
    },
    {
      label: 'Processing Speed',
      value: `${Math.round(systemMetrics?.processing_speed || 0)}/min`,
      icon: Zap,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: '+5%',
      changeColor: 'text-green-600'
    },
    {
      label: 'Response Time',
      value: `${Math.round(systemMetrics?.response_time_ms || 0)}ms`,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      change: '-2ms',
      changeColor: 'text-green-600'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Live System Metrics
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Live Updates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${metric.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                      <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${metric.changeColor}`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="speed"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorProcessed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Jurisdiction Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {countries?.data?.slice(0, 6).map((country, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <span className="text-sm font-medium text-gray-700">{country.name}</span>
                  <div className="text-xs text-gray-500">{country.rate}% Tax Rate</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${country.active ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className={`text-xs font-medium ${country.active ? 'text-green-600' : 'text-gray-500'}`}>
                  {country.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;
