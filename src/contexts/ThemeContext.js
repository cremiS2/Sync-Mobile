import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const LightColors = {
  primary: '#1e3a8a',        // Professional deep blue
  secondary: '#64748b',      // Slate gray
  success: '#059669',        // Professional green
  danger: '#dc2626',         // Professional red
  warning: '#d97706',        // Professional amber
  info: '#0284c7',          // Professional sky blue
  light: '#ffffff',
  dark: '#1e293b',          // Dark slate
  background: '#f8fafc',    // Light blue-gray background
  text: '#1e293b',          // Dark slate text
  error: '#dc2626',         // Professional red for errors
  cardBg: '#ffffff',
  border: '#e2e8f0',        // Light slate border
  shadow: 'rgba(30, 58, 138, 0.1)' // Blue-tinted shadow
};

export const DarkColors = {
  primary: '#3b82f6',        // Bright blue for dark mode
  secondary: '#94a3b8',      // Light slate
  success: '#10b981',        // Emerald green
  danger: '#ef4444',         // Red for dark mode
  warning: '#f59e0b',        // Amber for dark mode
  info: '#06b6d4',          // Cyan for dark mode
  light: '#1e1e1e',
  dark: '#000000',
  background: '#0f172a',     // Dark slate background
  text: '#f1f5f9',          // Light slate text
  error: '#ef4444',         // Red for errors
  cardBg: '#1e293b',        // Dark slate cards
  border: '#334155',        // Slate border
  shadow: 'rgba(59, 130, 246, 0.3)' // Blue-tinted shadow
};

const ThemeContext = createContext({
  isDark: false,
  colors: LightColors,
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const systemScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });
    return () => sub.remove();
  }, []);

  const colors = useMemo(() => (isDark ? DarkColors : LightColors), [isDark]);

  const value = useMemo(() => ({
    isDark,
    colors,
    toggleTheme: () => setIsDark((prev) => !prev)
  }), [isDark, colors]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}


