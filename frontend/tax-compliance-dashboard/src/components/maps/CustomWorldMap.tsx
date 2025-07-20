import React, { useState } from 'react';

const CustomWorldMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const activeCountries = [
    { 
      code: 'DE', 
      name: 'Germany', 
      x: 520, 
      y: 180, 
      compliance: 98, 
      transactions: 2400, 
      color: '#10B981',
      flag: '🇩🇪'
    },
    { 
      code: 'IT', 
      name: 'Italy', 
      x: 530, 
      y: 220, 
      compliance: 95, 
      transactions: 1800, 
      color: '#3B82F6',
      flag: '🇮🇹'
    },
    { 
      code: 'MX', 
      name: 'Mexico', 
      x: 240, 
      y: 280, 
      compliance: 92, 
      transactions: 1200, 
      color: '#8B5CF6',
      flag: '🇲🇽'
    },
    { 
      code: 'PL', 
      name: 'Poland', 
      x: 540, 
      y: 160, 
      compliance: 97, 
      transactions: 800, 
      color: '#F59E0B',
      flag: '🇵🇱'
    },
    { 
      code: 'ES', 
      name: 'Spain', 
      x: 480, 
      y: 240, 
      compliance: 94, 
      transactions: 950, 
      color: '#EF4444',
      flag: '🇪🇸'
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Global Tax Compliance Coverage</h3>
        <div className="text-sm text-gray-600">
          {activeCountries.length} active jurisdictions
        </div>
      </div>
      
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden border">
        {/* World Map SVG */}
        <svg 
          viewBox="0 0 800 400" 
          className="w-full h-full"
          style={{ background: 'linear-gradient(to bottom, #dbeafe, #bfdbfe)' }}
        >
          {/* Simplified world continents */}
          <g fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1">
            {/* North America */}
            <path d="M100,80 L300,70 L320,120 L280,180 L200,200 L120,160 Z" />
            
            {/* South America */}
            <path d="M200,220 L280,210 L300,320 L250,380 L200,360 L180,280 Z" />
            
            {/* Europe */}
            <path d="M450,120 L580,110 L590,180 L520,200 L460,170 Z" />
            
            {/* Africa */}
            <path d="M480,200 L580,190 L600,320 L520,340 L480,280 Z" />
            
            {/* Asia */}
            <path d="M580,80 L750,90 L740,200 L650,220 L600,140 Z" />
            
            {/* Australia */}
            <ellipse cx="680" cy="320" rx="60" ry="30" />
          </g>

          {/* Country Markers */}
          {activeCountries.map((country) => (
            <g key={country.code}>
              <circle
                cx={country.x}
                cy={country.y}
                r={hoveredCountry === country.code ? 12 : 8}
                fill={country.color}
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 drop-shadow-lg"
                onMouseEnter={() => setHoveredCountry(country.code)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => setSelectedCountry(country.code)}
              >
                <animate
                  attributeName="r"
                  values="8;12;8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* Country Flag */}
              <text
                x={country.x}
                y={country.y - 15}
                textAnchor="middle"
                className="text-lg pointer-events-none"
              >
                {country.flag}
              </text>
              
              {/* Hover Label */}
              {hoveredCountry === country.code && (
                <g>
                  <rect
                    x={country.x - 50}
                    y={country.y + 15}
                    width="100"
                    height="40"
                    fill="rgba(0,0,0,0.8)"
                    rx="4"
                    className="pointer-events-none"
                  />
                  <text
                    x={country.x}
                    y={country.y + 30}
                    textAnchor="middle"
                    fill="white"
                    className="text-xs font-medium pointer-events-none"
                  >
                    {country.name}
                  </text>
                  <text
                    x={country.x}
                    y={country.y + 45}
                    textAnchor="middle"
                    fill="white"
                    className="text-xs pointer-events-none"
                  >
                    {country.compliance}% compliance
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Active ({activeCountries.length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Details Panel */}
      {selectedCountry && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          {(() => {
            const country = activeCountries.find(c => c.code === selectedCountry);
            return country ? (
              <div>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">{country.flag}</span>
                  <h4 className="font-semibold text-lg">{country.name}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded p-3">
                    <span className="text-gray-600 block">Transactions</span>
                    <span className="font-bold text-xl text-blue-600">{country.transactions.toLocaleString()}</span>
                  </div>
                  <div className="bg-white rounded p-3">
                    <span className="text-gray-600 block">Compliance Rate</span>
                    <span className="font-bold text-xl text-green-600">{country.compliance}%</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCountry(null)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Close Details
                </button>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default CustomWorldMap;
