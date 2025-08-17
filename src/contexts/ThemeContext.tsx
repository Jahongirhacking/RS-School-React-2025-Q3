'use client';

import { createContext, ReactNode, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import localStorageKeys from '../utils/localStorageKeys';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

const DEFAULT_THEME: Theme = 'dark';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { storedValue, setValue } = useLocalStorage<Theme>(
    localStorageKeys.theme,
    DEFAULT_THEME
  );

  const [theme, setTheme] = useState<Theme>(storedValue);

  const toggleTheme = () => {
    setTheme((prev) => {
      const value: Theme = prev === 'dark' ? 'light' : 'dark';
      setValue(value);
      return value;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-container ${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
