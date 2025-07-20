import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calculator, FileText, Activity, BarChart3, Globe, Settings, Shield, Sun, Moon, LogOut, User } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from './auth/AuthProvider';

const Navigation: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/calculator', name: 'Tax Calculator', icon: Calculator },
    { to: '/documents', name: 'Documents', icon: FileText },
    { to: '/analytics', name: 'Analytics', icon: BarChart3 },
    { to: '/regulatory', name: 'Regulatory', icon: Shield },
    { to: '/admin', name: 'Admin', icon: Settings },
    { to: '/status', name: 'System Status', icon: Activity }
  ];

  return (
    <nav className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3">
              <Globe className="h-5 w-5 text-white m-1.5" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
              Tax Compliance Gateway
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded">
                {user?.role}
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200 border border-gray-200 dark:border-dark-600"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
          
          {/* Mobile User Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name} ({user?.role})
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
