import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Globe, CheckCircle, Clock } from 'lucide-react';
import { api } from '../lib/api';

const CountryGrid: React.FC = () => {
  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: api.getSupportedCountries,
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="w-5 h-5 text-blue-600 mr-2" />
          Global Compliance Status
        </h3>
        <span className="text-sm text-gray-500">
          {countries?.data?.filter(c => c.active).length || 0} active jurisdictions
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {countries?.data?.map((country) => (
          <div 
            key={country.code}
            className={`p-3 rounded-lg border transition-all hover:shadow-md ${
              country.active 
                ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{country.flag}</span>
              {country.active ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="text-sm font-medium text-gray-900">{country.name}</div>
            <div className="text-xs text-gray-600">{country.rate}% • {country.currency}</div>
            <div className={`text-xs mt-1 ${country.active ? 'text-green-600' : 'text-gray-500'}`}>
              {country.active ? 'Active' : 'Coming Soon'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryGrid;
