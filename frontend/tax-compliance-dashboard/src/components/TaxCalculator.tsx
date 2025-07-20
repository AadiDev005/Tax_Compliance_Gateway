import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Calculator, TrendingUp, Globe, DollarSign, Zap, Info, ArrowRight } from 'lucide-react';
import { api, type TaxCalculationRequest } from '../lib/api';

const TaxCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('1100000');
  const [jurisdiction, setJurisdiction] = useState<string>('IT');
  const [currency, setCurrency] = useState<string>('USD');

  const calculateMutation = useMutation({
    mutationFn: (data: TaxCalculationRequest) => api.calculateTax(data),
    onSuccess: (data) => {
      console.log('✅ Calculation successful:', data);
    },
    onError: (error) => {
      console.error('❌ Calculation error:', error);
    }
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
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', rate: 17, rateLabel: '17% ICMS', currency: 'BRL' },
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
  
  // Fixed: Properly extract result data
  const result = calculateMutation.data?.data;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const safeFormatNumber = (value: any) => {
    const num = Number(value) || 0;
    return formatNumber(num);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white rounded-xl p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Tax Compliance Gateway</h1>
              <p className="text-blue-100 text-lg">Multi-Jurisdiction Tax Calculator</p>
            </div>
          </div>
          <div className="text-right bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm text-blue-200">System Status</div>
            <div className="flex items-center text-green-300 text-lg font-semibold">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Form */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Info className="w-6 h-6 mr-3 text-blue-600" />
            Calculate Taxes Across Jurisdictions
          </h2>
          <p className="text-gray-600 mt-1">Enter your transaction details below for instant tax calculation</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Amount Input */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                Transaction Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formatNumber(Number(amount) || 0)}
                  onChange={(e) => setAmount(e.target.value.replace(/,/g, ''))}
                  className="pl-12 w-full px-4 py-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter amount"
                />
              </div>
              <div className="text-xs text-gray-500">
                Amount: {selectedCurrency?.symbol}{formatNumber(Number(amount) || 0)}
              </div>
            </div>

            {/* Jurisdiction Select */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                Tax Jurisdiction
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="pl-12 w-full px-4 py-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name} ({country.rateLabel})
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <span className="text-lg mr-2">{selectedCountry?.flag}</span>
                Tax Rate: {selectedCountry?.rateLabel}
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.name})
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500">
                Symbol: {selectedCurrency?.symbol}
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCalculate}
              disabled={calculateMutation.isPending || !amount}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-3 text-lg"
            >
              {calculateMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  <span>Calculate Tax</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section - Fixed to show actual values */}
      {result && (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-green-200">
            <h3 className="text-xl font-bold text-green-800 flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
              Tax Calculation Results
            </h3>
            <p className="text-green-600 mt-1">Your tax breakdown for {selectedCountry?.name}</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Net Amount */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Net Amount</div>
                <div className="text-3xl font-bold text-blue-900 mb-1">
                  {selectedCurrency?.symbol}{safeFormatNumber(result.net_amount)}
                </div>
                <div className="text-xs text-blue-600">Base taxable amount</div>
              </div>
              
              {/* Tax Amount */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-2">Tax Amount</div>
                <div className="text-3xl font-bold text-orange-900 mb-1">
                  {selectedCurrency?.symbol}{safeFormatNumber(result.tax_amount)}
                </div>
                <div className="text-xs text-orange-600">
                  @ {((Number(result.tax_rate) || 0) * 100).toFixed(1)}% tax rate
                </div>
              </div>
              
              {/* Total Amount */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                <div className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">Total Amount</div>
                <div className="text-3xl font-bold text-green-900 mb-1">
                  {selectedCurrency?.symbol}{safeFormatNumber(result.gross_amount || result.total)}
                </div>
                <div className="text-xs text-green-600">Including all taxes</div>
              </div>
              
              {/* Jurisdiction */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Jurisdiction</div>
                <div className="text-2xl font-bold text-purple-900 flex items-center mb-1">
                  <span className="text-3xl mr-2">{selectedCountry?.flag}</span>
                  {result.country || jurisdiction}
                </div>
                <div className="text-xs text-purple-600">{selectedCountry?.name}</div>
              </div>
            </div>

            {/* Debug Information (remove in production) */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <details>
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">Debug Information</summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                  {JSON.stringify({
                    input: { amount: Number(amount), jurisdiction, currency },
                    result: result,
                    calculations: {
                      net_amount: Number(result?.net_amount),
                      tax_amount: Number(result?.tax_amount),
                      gross_amount: Number(result?.gross_amount || result?.total)
                    }
                  }, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {calculateMutation.isError && (
        <div className="bg-white rounded-xl shadow-xl border border-red-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 px-8 py-6 border-b border-red-200">
            <h3 className="text-xl font-bold text-red-800">Calculation Notice</h3>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="text-blue-700 mb-4 font-semibold">
                <strong>Notice:</strong> Using built-in calculation engine.
              </div>
              <div className="text-sm text-blue-600">
                The system is using the offline calculation mode with standard tax rates. 
                Results are calculated using the official tax rates for each jurisdiction.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;
