import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // User preferences
  currency: string;
  setCurrency: (currency: string) => void;
  
  // Application state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Tax calculation state
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  
  // Document processing state
  uploadedDocuments: any[];
  addDocument: (doc: any) => void;
  removeDocument: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          if (newTheme === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          if (theme === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
      
      // User preferences
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
      
      // Application state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Tax calculation state
      selectedCountry: 'IT',
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      
      // Document processing state
      uploadedDocuments: [],
      addDocument: (doc) => set((state) => ({ 
        uploadedDocuments: [...state.uploadedDocuments, doc] 
      })),
      removeDocument: (id) => set((state) => ({ 
        uploadedDocuments: state.uploadedDocuments.filter(doc => doc.id !== id) 
      })),
    }),
    {
      name: 'tax-compliance-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state && typeof window !== 'undefined') {
          const root = window.document.documentElement;
          if (state.theme === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
    }
  )
);
