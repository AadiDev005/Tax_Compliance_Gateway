import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navigation />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
