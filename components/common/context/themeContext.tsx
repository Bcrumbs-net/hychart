import path from 'path';
import React, { createContext, useContext, useState } from 'react';

type ColorValues = {
  text_color: string;
  node_color: string;
  headers_color: string;
  background_color: string;
  child_active_connection_color: string;
  parent_active_connection_color: string;
  connection_color: string;
};

type LangValues = {
  Name: string; // Language name (e.g., "English", "Arabic")
  rtl: boolean; // Indicates if the language is right-to-left
};

type ThemeContextValues = {
  themeColors?: ColorValues;
  lang: LangValues;
};

const themeContext = createContext<ThemeContextValues | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(themeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children, rootContent, lang }: {
  children: React.ReactNode;
  rootContent: { data: Array<{ Key: string; Value: string }> };
  lang: string;
}) {
  const colorValues: ColorValues = rootContent.data.reduce((acc, curr) => {
    acc[curr.Key as keyof ColorValues] = curr.Value;
    return acc;
  }, {} as ColorValues);

  const [rtl] = useState(lang === 'AR');
  const langName = lang === 'AR' ? 'ar' : 'en';

  const value = {
    themeColors: colorValues,
    lang: { rtl, Name: langName },
  };

  return <themeContext.Provider value={value}>{children}</themeContext.Provider>;
}

export default themeContext;