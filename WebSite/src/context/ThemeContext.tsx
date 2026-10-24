import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeOption {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  lightBg: string;
  badgeBg: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'theme-2', name: 'Cyan / Teal (Varsayılan)', color: '#0d9488', hoverColor: '#0f766e', lightBg: '#f0fdfa', badgeBg: '#ccfbf1' },
  { id: 'theme-1', name: 'Yeşil', color: '#16a34a', hoverColor: '#15803d', lightBg: '#f0fdf4', badgeBg: '#dcfce7' },
  { id: 'theme-3', name: 'Mavi', color: '#2563eb', hoverColor: '#1d4ed8', lightBg: '#eff6ff', badgeBg: '#dbeafe' },
  { id: 'theme-4', name: 'Zümrüt', color: '#059669', hoverColor: '#047857', lightBg: '#ecfdf5', badgeBg: '#d1fae5' },
  { id: 'theme-5', name: 'Kehribar', color: '#d97706', hoverColor: '#b45309', lightBg: '#fffbeb', badgeBg: '#fef3c7' },
  { id: 'theme-6', name: 'İndigo', color: '#4f46e5', hoverColor: '#4338ca', lightBg: '#eef2ff', badgeBg: '#e0e7ff' },
  { id: 'theme-7', name: 'Arduvaz Gri', color: '#475569', hoverColor: '#334155', lightBg: '#f8fafc', badgeBg: '#f1f5f9' },
  { id: 'theme-8', name: 'Mor', color: '#7c3aed', hoverColor: '#6d28d9', lightBg: '#faf5ff', badgeBg: '#f3e8ff' },
];

interface ThemeContextType {
  currentTheme: ThemeOption;
  setTheme: (themeId: string) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES[0],
  setTheme: () => {},
  themes: THEMES,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState('theme-2');
  const [loaded, setLoaded] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  useEffect(() => {
    try { setThemeId(localStorage.getItem('devblog_theme') || 'theme-2'); } catch { /* Storage may be disabled. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem('devblog_theme', currentTheme.id); } catch { /* Keep the in-memory preference. */ }
    document.documentElement.style.setProperty('--accent-color', currentTheme.color);
    document.documentElement.style.setProperty('--accent-hover', currentTheme.hoverColor);
    document.documentElement.style.setProperty('--accent-light', currentTheme.lightBg);
  }, [currentTheme, loaded]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: (id) => setThemeId(id),
        themes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
