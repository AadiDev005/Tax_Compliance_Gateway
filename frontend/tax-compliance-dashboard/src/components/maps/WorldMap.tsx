import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-50m.json";

const WorldMap: React.FC = () => {
  const markers = [
    { name: "Germany", coordinates: [10.4515, 51.1657] as [number, number], status: "active", flag: "🇩🇪" },
    { name: "Italy", coordinates: [12.5674, 41.8719] as [number, number], status: "active", flag: "🇮🇹" },
    { name: "Mexico", coordinates: [-102.5528, 23.6345] as [number, number], status: "active", flag: "🇲🇽" },
    { name: "United States", coordinates: [-95.7129, 37.0902] as [number, number], status: "active", flag: "🇺🇸" },
    { name: "Poland", coordinates: [19.1343, 51.9194] as [number, number], status: "active", flag: "🇵��" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Tax Compliance Coverage</h3>
      <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E5E7EB"
                  stroke="#FFFFFF"
                  className="hover:fill-blue-200 cursor-pointer transition-colors duration-200"
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, status, flag }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle
                r={8}
                fill={status === "active" ? "#10B981" : "#EF4444"}
                stroke="#fff"
                strokeWidth={2}
                className="animate-pulse cursor-pointer"
              />
              <text
                textAnchor="middle"
                y={-15}
                className="text-xs font-semibold fill-gray-700"
              >
                {flag}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Active ({markers.filter(m => m.status === "active").length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
