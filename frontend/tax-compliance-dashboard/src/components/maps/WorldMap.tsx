import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const WorldMap: React.FC = () => {
  const countries = [
    { name: "Germany", code: "DE", status: "active", flag: "🇩🇪", x: 52, y: 45 },
    { name: "Italy", code: "IT", status: "active", flag: "🇮🇹", x: 55, y: 52 },
    { name: "Mexico", code: "MX", status: "active", flag: "🇲🇽", x: 25, y: 65 },
    { name: "United States", code: "US", status: "active", flag: "🇺🇸", x: 25, y: 45 },
    { name: "Poland", code: "PL", status: "active", flag: "🇵🇱", x: 58, y: 40 },
    { name: "Spain", code: "ES", status: "pending", flag: "🇪🇸", x: 45, y: 52 },
    { name: "Brazil", code: "BR", status: "pending", flag: "🇧🇷", x: 35, y: 75 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Global Tax Jurisdiction Map
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
        {/* Simplified World Map Background */}
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="60" fill="url(#grid)" />
          
          {/* Country markers */}
          {countries.map((country, index) => (
            <g key={country.code}>
              <circle
                cx={country.x}
                cy={country.y}
                r="3"
                fill={country.status === 'active' ? '#10B981' : '#F59E0B'}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer hover:r-4 transition-all duration-200"
              />
              <text
                x={country.x}
                y={country.y + 8}
                textAnchor="middle"
                fontSize="4"
                fill="#374151"
                className="font-medium"
              >
                {country.flag}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Country Status Cards */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="grid grid-cols-4 gap-2">
            {countries.slice(0, 4).map((country) => (
              <div key={country.code} className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center border border-gray-200">
                <div className="text-lg">{country.flag}</div>
                <div className="text-xs font-medium text-gray-700">{country.code}</div>
                <div className={`w-2 h-2 mx-auto mt-1 rounded-full ${
                  country.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
