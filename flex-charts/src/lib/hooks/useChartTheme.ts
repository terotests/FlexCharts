import { useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ChartTheme {
  mode: ThemeMode;
  colors: {
    background: string;
    text: string;
    grid: string;
    primary: string[];
  };
}

const lightTheme: ChartTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    text: '#333333',
    grid: '#e0e0e0',
    primary: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949'],
  },
};

const darkTheme: ChartTheme = {
  mode: 'dark',
  colors: {
    background: '#242424',
    text: '#e0e0e0',
    grid: '#424242',
    primary: ['#5790c2', '#f4a261', '#e76f51', '#8abcb5', '#70bb65', '#f4dc26'],
  },
};

/**
 * Hook to provide theming capabilities for charts
 * 
 * @param initialMode - The initial theme mode (light or dark)
 * @returns Current theme and functions to modify it
 */
export function useChartTheme(initialMode: ThemeMode = 'light') {
  const [theme, setTheme] = useState<ChartTheme>(
    initialMode === 'light' ? lightTheme : darkTheme
  );

  const toggleTheme = () => {
    setTheme(prev => (prev.mode === 'light' ? darkTheme : lightTheme));
  };

  return {
    theme,
    toggleTheme,
    setThemeMode: (mode: ThemeMode) => {
      setTheme(mode === 'light' ? lightTheme : darkTheme);
    },
  };
}
