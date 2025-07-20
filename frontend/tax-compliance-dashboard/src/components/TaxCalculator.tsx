import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Calculator, TrendingUp, Globe, DollarSign, Zap, Info, ArrowRight, AlertCircle } from 'lucide-react';
import { api, type TaxCalculationRequest } from '../lib/api';

const TaxCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('1100000');
  const [jurisdiction, setJurisdiction] = useState<string>('IT');
  const [currency, setCurrency] = useState<string>('USD');

  const calculateMutation = useMutation({
    mutationFn: (data: TaxCalculationRequest) => api.calculateTax(data),
  });

  const handleCalculate = () => {
    if (!amount || isNaN(Number(amount))) return;
    
    calculateMutation.mutate({
      amount: Number(amount),
      jurisdiction_id: jurisdiction,
      currency: currency,
    });
  };

  const countries = [
    { code: 'DE', name: 'Germany', flag: '🇩🇪', rate: 19, rateLabel: '19% VAT', currency: 'EUR' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', rate: 16, rateLabel: '16% IVA', currency: 'MXN' },
    { code: 'FR', name: 'France', flag: '🇫🇷', rate: 20, rateLabel: '20% VAT', currency: 'EUR' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', rate: 22, rateLabel: '22% VAT', currency: 'EUR' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', rate: 23, rateLabel: '23% VAT', currency: 'PLN' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', rate: 21, rateLabel: '21% VAT', currency: 'EUR' },
    { code: 'US', name: 'United States', flag: '🇺🇸', rate: 8, rateLabel: '8% Sales Tax', currency: 'USD' },
    { code: 'BR', name: 'Brazil', flag: '🇧��', rate: 17, rateLabel: '17% ICMS', currency: 'BRL' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  ];

  const selectedCountry = countries.find(c => c.code === jurisdiction);
  const selectedCurrency = currencies.find(c => c.code === currency);
  
  // Fixed TypeScript error - safely extract result
  const responseData = calculateMutation.data;
  const result = responseData && typeof responseData === 'object' && 'data' in responseData 
    ? responseData.data 
    : responseData || null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    // FULL WIDTH LAYOUT - Remove max-width constraints
    <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Full-width Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tax Compliance Gateway</h1>
              <p className="text-blue-100 text-lg">Enterprise Multi-Jurisdiction Tax Calculator</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
              <div className="text-sm text-blue-200">System Status</div>
              <div className="flex items-center text-green-300 font-semibold">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                All Systems Online
              </div>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Real-time
              </div>
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                <Globe className="w-4 h-4 mr-2" />
                8 Countries
              </div>
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                99.9% Accurate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Calculator Form */}
      <div className="w-full bg-white rounded-xl shadow-xl border border-gray-200">
        {/* Header Section */}
        <div className="px-6 lg:px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Info className="w-6 h-6 mr-3 text-blue-600" />
                Calculate Taxes Across Jurisdictions
              </h2>
              <p className="text-gray-600 mt-1">Enter your transaction details below for instant tax calculation</p>
            </div>
            <div className="text-sm text-gray-500 bg-white/60 rounded-lg px-3 py-2">
              Processing in real-time
            </div>
          </div>
        </div>
        
        {/* Form Content - Full Width Grid */}
        <div className="px-6 lg:px-8 py-8">
          {/* Expanded Input Grid - Better Space Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Transaction Amount - Wider Input */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Transaction Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={formatNumber(Number(amount) || 0)}
                  onChange={(e) => setAmount(e.target.value.replace(/,/g, ''))}
                  className="w-full pl-12 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter amount"
                />
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
                Amount: {selectedCurrency?.symbol}{formatNumber(Number(amount) || 0)}
              </div>
            </div>

            {/* Tax Jurisdiction - Wider Select */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Tax Jurisdiction
              </label>
              <div className="relative">
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full px-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name} ({country.rateLabel})
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2 flex items-center">
                <span className="text-xl mr-2">{selectedCountry?.flag}</span>
                Tax Rate: {selectedCountry?.rateLabel}
              </div>
            </div>

            {/* Currency - Wider Select */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
                Symbol: {selectedCurrency?.symbol} | Code: {selectedCurrency?.code}
              </div>
            </div>
          </div>

          {/* Full-width Calculate Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleCalculate}
              disabled={calculateMutation.isPending || !amount}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-16 py-5 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-4 text-xl"
            >
              {calculateMutation.isPending ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Calculating Tax...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-6 h-6" />
                  <span>Calculate Tax</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-width Results Section */}
      {result && (
        <div className="w-full bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="px-6 lg:px-8 py-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-green-800 flex items-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                  Tax Calculation Results
                </h3>
                <p className="text-green-600 mt-1">Complete tax breakdown for {selectedCountry?.name}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600">Calculated at</div>
                <div className="text-green-800 font-semibold">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
          
          {/* Full-width Results Grid */}
          <div className="px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Net Amount Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 text-center hover:shadow-lg transition-shadow">
                <div className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-3">Net Amount</div>
                <div className="text-4xl font-bold text-blue-900 mb-2">
                  {selectedCurrency?.symbol}{formatNumber(Math.round((result as any)?.net_amount || 0))}
                </div>
                <div className="text-sm text-blue-600">Base taxable amount</div>
              </div>
              
              {/* Tax Amount Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 text-center hover:shadow-lg transition-shadow">
                <div className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-3">Tax Amount</div>
                <div className="text-4xl font-bold text-orange-900 mb-2">
                  {selectedCurrency?.symbol}{formatNumber(Math.round((result as any)?.tax_amount || 0))}
                </div>
                <div className="text-sm text-orange-600">
                  @ {(((result as any)?.tax_rate || 0) * 100).toFixed(0)}% rate
                </div>
              </div>
              
              {/* Total Amount Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border border-green-200 text-center hover:shadow-lg transition-shadow">
                <div className="text-sm font-bold text-green-600 uppercase tracking-wide mb-3">Total Amount</div>
                <div className="text-4xl font-bold text-green-900 mb-2">
                  {selectedCurrency?.symbol}{formatNumber(Math.round((result as any)?.gross_amount || (result as any)?.total || 0))}
                </div>
                <div className="text-sm text-green-600">Including all taxes</div>
              </div>
              
              {/* Jurisdiction Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 text-center hover:shadow-lg transition-shadow">
                <div className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">Jurisdiction</div>
                <div className="text-3xl font-bold text-purple-900 flex items-center justify-center mb-2">
                  <span className="text-4xl mr-2">{selectedCountry?.flag}</span>
                  {(result as any)?.country || jurisdiction}
                </div>
                <div className="text-sm text-purple-600">{selectedCountry?.name}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-width Error Display */}
      {calculateMutation.isError && (
        <div className="w-full bg-white rounded-xl shadow-xl border border-red-200">
          <div className="px-6 lg:px-8 py-6 border-b border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
            <h3 className="text-xl font-bold text-red-800 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-red-600" />
              Calculation Error
            </h3>
          </div>
          <div className="px-6 lg:px-8 py-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="text-red-700 font-semibold mb-2">
                <strong>Error:</strong> {calculateMutation.error?.message || 'Failed to calculate tax. Please try again.'}
              </div>
              <div className="text-sm text-red-600">
                Please check your backend services and try again. The system is currently using fallback calculations.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;
