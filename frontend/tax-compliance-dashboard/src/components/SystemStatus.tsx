import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle, AlertCircle, Activity, Zap } from 'lucide-react';
import { api } from '../lib/api';

const SystemStatus: React.FC = () => {
  const { data: taxEngineHealth, isLoading: taxEngineLoading } = useQuery({
    queryKey: ['taxEngineHealth'],
    queryFn: api.getTaxEngineHealth,
    refetchInterval: 30000,
  });

  const { data: documentServiceHealth, isLoading: documentLoading } = useQuery({
    queryKey: ['documentServiceHealth'],
    queryFn: api.getDocumentServiceHealth,
    refetchInterval: 30000,
  });

  const { data: cacheStats } = useQuery({
    queryKey: ['cacheStats'],
    queryFn: api.getCacheStats,
    refetchInterval: 10000,
  });

  const services = [
    {
      name: 'Tax Engine',
      status: taxEngineHealth?.data,
      loading: taxEngineLoading,
      port: '8082',
      description: 'Multi-country tax calculations',
    },
    {
      name: 'Document Service',
      status: documentServiceHealth?.data,
      loading: documentLoading,
      port: '8083',
      description: 'Document processing & storage',
    },
  ];

  const getStatusIcon = (service: any) => {
    if (service.loading) return <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />;
    if (service.status?.status === 'healthy') return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = (service: any) => {
    if (service.loading) return 'Checking...';
    if (service.status?.status === 'healthy') return 'Online';
    return 'Offline';
  };

  const getStatusBadgeClass = (service: any) => {
    if (service.loading) return 'status-badge-online';
    if (service.status?.status === 'healthy') return 'status-badge-online';
    return 'status-badge-offline';
  };

  return (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service)}
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">{service.description}</p>
                  <p className="text-xs text-gray-400">Port {service.port}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={getStatusBadgeClass(service)}>
                  {getStatusText(service)}
                </span>
                {service.status?.timestamp && (
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(service.status.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tax Engine Features */}
        {taxEngineHealth?.data?.features && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 text-blue-600 mr-1" />
              <p className="text-sm font-medium text-blue-900">Tax Engine Features:</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {taxEngineHealth.data.features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cache Performance */}
      {cacheStats?.data && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Performance</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Hit Rate</div>
              <div className="text-xl font-bold text-green-900">
                {cacheStats.data.cache_statistics?.hit_rate_percent || '0'}%
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Performance</div>
              <div className="text-sm font-bold text-blue-900">
                {cacheStats.data.performance_summary?.performance_rating || 'Good'}
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div className="text-sm text-purple-600 font-medium">L1 Hits</div>
              <div className="text-lg font-bold text-purple-900">
                {cacheStats.data.cache_statistics?.l1_hits || 0}
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              <div className="text-sm text-orange-600 font-medium">Cache Misses</div>
              <div className="text-lg font-bold text-orange-900">
                {cacheStats.data.cache_statistics?.cache_misses || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemStatus;
