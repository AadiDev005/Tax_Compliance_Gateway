import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const WorldMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countries = [
    { code: 'DE', name: 'Germany', flag: '🇩🇪', status: 'active', compliance: 98, position: { top: '25%', left: '52%' } },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', status: 'active', compliance: 95, position: { top: '35%', left: '52%' } },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', status: 'active', compliance: 92, position: { top: '45%', left: '15%' } },
    { code: 'US', name: 'United States', flag: '🇺🇸', status: 'active', compliance: 90, position: { top: '35%', left: '20%' } },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', status: 'pending', compliance: 85, position: { top: '65%', left: '30%' } },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', status: 'active', compliance: 94, position: { top: '22%', left: '55%' } },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', status: 'pending', compliance: 88, position: { top: '40%', left: '48%' } },
    { code: 'FR', name: 'France', flag: '🇫🇷', status: 'active', compliance: 96, position: { top: '30%', left: '50%' } },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Global Jurisdiction Map</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Active ({countries.filter(c => c.status === 'active').length})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Pending ({countries.filter(c => c.status === 'pending').length})</span>
          </div>
        </div>
      </div>

      {/* Simplified World Map with Country Markers */}
      <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg h-80 overflow-hidden">
        {/* World Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-green-50 to-blue-100 opacity-50"></div>
        
        {/* Country Markers */}
        {countries.map((country) => (
          <div
            key={country.code}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ top: country.position.top, left: country.position.left }}
            onClick={() => setSelectedCountry(selectedCountry === country.code ? null : country.code)}
          >
            {/* Country Marker */}
            <div className={`w-4 h-4 ${getStatusColor(country.status)} rounded-full border-2 border-white shadow-lg animate-pulse group-hover:scale-125 transition-transform duration-200`}></div>
            
            {/* Country Label */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {country.flag} {country.name}
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <div className="font-semibold text-gray-700 mb-2">Tax Jurisdictions</div>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Compliant & Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span>Implementation Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Details */}
      {selectedCountry && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {(() => {
            const country = countries.find(c => c.code === selectedCountry);
            if (!country) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{country.name}</h4>
                    <p className="text-sm text-gray-600">Compliance Score: {country.compliance}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(country.status)}
                  <span className={`text-sm font-medium ${
                    country.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {country.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Country Grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {countries.map((country) => (
          <div key={country.code} className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
            country.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{country.flag}</span>
              {getStatusIcon(country.status)}
            </div>
            <div className="text-sm font-medium text-gray-900">{country.name}</div>
            <div className="text-xs text-gray-600">{country.compliance}% Compliant</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldMap;
