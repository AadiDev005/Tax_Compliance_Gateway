import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Globe, Zap, Clock, Activity } from 'lucide-react';
import { api } from '../lib/api';

const LiveMetrics: React.FC = () => {
  // Reduce update frequency to prevent flickering
  const { data: systemMetrics } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: api.getSystemMetrics,
    refetchInterval: 5000, // 5 seconds instead of 2
    staleTime: 4000,
    refetchOnWindowFocus: false,
  });

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: api.getSupportedCountries,
    staleTime: 60000, // 1 minute - countries don't change often
    refetchOnWindowFocus: false,
  });

  // Memoize metric cards to prevent recreation
  const metricCards = useMemo(() => [
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
      value: countries?.data?.filter((c: any) => c.active).length || 0,
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
  ], [systemMetrics, countries]);

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
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
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
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Jurisdiction Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {countries?.data?.slice(0, 6).map((country: any, index: number) => (
            <div key={`${country.code}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <span className="text-sm font-medium text-gray-700">{country.name}</span>
                  <div className="text-xs text-gray-500">{country.rate}% Tax Rate</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${country.active ? 'bg-green-400' : 'bg-gray-300'}`}></div>
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
