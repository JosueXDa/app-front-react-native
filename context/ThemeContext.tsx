import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { ResolvedTheme, ThemeContextType, ThemeMode, ThemeProviderProps } from './interface/ThemeContext';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app:theme';

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

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
