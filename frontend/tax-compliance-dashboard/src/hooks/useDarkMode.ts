import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useDarkMode = () => {
  const { theme, toggleTheme, setTheme } = useAppStore();

  useEffect(() => {
    // Check system preference on first load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('tax-compliance-storage');
      
      if (!savedTheme) {
        // If no saved preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }
  }, [setTheme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };
};
