import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import TaxCalculator from '../pages/TaxCalculator';
import Documents from '../pages/Documents';
import Analytics from '../pages/Analytics';
import Regulatory from '../pages/Regulatory';
import Admin from '../pages/Admin';
import SystemStatus from '../pages/SystemStatus';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/calculator" replace />} />
          <Route path="calculator" element={<TaxCalculator />} />
          <Route path="documents" element={<Documents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="regulatory" element={<Regulatory />} />
          <Route path="admin" element={<Admin />} />
          <Route path="status" element={<SystemStatus />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
