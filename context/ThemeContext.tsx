import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  /**
   * Current theme mode setting ('light', 'dark', or 'system')
   */
  themeMode: ThemeMode;
  
  /**
   * Resolved theme ('light' or 'dark') after considering system preference if mode is 'system'
   */
  resolvedTheme: ResolvedTheme;
  
  /**
   * Set the theme mode
   */
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme: () => Promise<void>;
  
  /**
   * Whether the theme is currently loading from storage
   */
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app:theme';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages theme state and persistence
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate resolved theme based on mode and device preference
  const resolvedTheme: ResolvedTheme = 
    themeMode === 'system' 
      ? (deviceColorScheme ?? 'light')
      : themeMode;

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update when device color scheme changes (if in system mode)
  useEffect(() => {
    if (themeMode === 'system') {
      // Force re-render when device theme changes
    }
  }, [deviceColorScheme, themeMode]);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system')) {
        setThemeModeState(storedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    await setThemeMode(newMode);
  };

  const value: ThemeContextType = {
    themeMode,
    resolvedTheme,
    setThemeMode,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * 
 * @throws Error if used outside of ThemeProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { resolvedTheme, toggleTheme } = useTheme();
 *   
 *   return (
 *     <Button onPress={toggleTheme}>
 *       Current theme: {resolvedTheme}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
