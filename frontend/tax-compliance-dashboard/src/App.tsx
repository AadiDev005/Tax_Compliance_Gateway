import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Globe } from 'lucide-react';
import SystemStatus from './components/SystemStatus';
import TaxCalculator from './components/TaxCalculator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center space-x-3">
            <Globe className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-800">Tax Compliance Gateway</h1>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TaxCalculator />
          </div>
          <div>
            <SystemStatus />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
