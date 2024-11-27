import path from 'path';
import React, { createContext, useContext, useState, useEffect } from 'react';
import fs from 'fs';

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
  rtl: boolean;
};

type ThemeContextValues = {
  themeColors?: ColorValues;
  lang: LangValues;
  translationsMap: Map<string, any>; // Add translationsMap to context
  fetchTranslations: () => Promise<void>; // Method to fetch translations
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

  const [rtl, setRtl] = useState(lang === 'AR');
  const [translationsMap, setTranslationsMap] = useState<Map<string, any>>(new Map());
  const fetchTranslations = async () => {
    let translations: Record<string, unknown> = {};
    try {
      const response = await fetch(`/assets/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      translations = await response.json();
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
    const newTranslationsMap = new Map<string, any>();
    Object.entries(translations).forEach(([key, value]) => {
      newTranslationsMap.set(key, value);
    });

    setTranslationsMap(newTranslationsMap);
  };

  useEffect(() => {
    fetchTranslations();
  }, [lang]);

  const value = {
    themeColors: colorValues,
    lang: { rtl },
    translationsMap,
    fetchTranslations,
  };

  return <themeContext.Provider value={value}>{children}</themeContext.Provider>;
}

export default themeContext;