import { useEffect, useCallback } from 'react';

export const useTheme = () => {
  const applyTheme = useCallback((themeId: string) => {
    const themes = [
      {
        id: "theme1",
        name: "Red, Black and White",
        cssVars: {
          "--primary": "0 0% 9%",
          "--red-muted": "0 47% 45%",
          "--red-accent": "0 35% 55%",
          "--red-accent-light": "0 25% 65%",
          "--chart-red-primary": "0 72% 51%",
          "--chart-red-secondary": "0 84% 60%",
          "--chart-red-dark": "0 77% 38%",
          "--chart-red-darker": "0 76% 35%",
          "--error": "0 84% 60%"
        }
      },
      {
        id: "theme2", 
        name: "Blue & Orange",
        cssVars: {
          "--primary": "212 48% 25%",
          "--red-muted": "24 78% 56%",
          "--red-accent": "24 78% 56%", 
          "--red-accent-light": "24 78% 66%",
          "--background": "60 100% 99%",
          "--sidebar-background": "60 100% 99%",
          "--chart-red-primary": "24 78% 56%",
          "--chart-red-secondary": "24 78% 66%", 
          "--chart-red-dark": "212 48% 25%",
          "--chart-red-darker": "212 58% 20%",
          "--error": "24 78% 56%"
        }
      },
      {
        id: "theme3",
        name: "Black & Green",
        cssVars: {
          "--primary": "0 0% 18%",
          "--red-muted": "174 87% 29%",
          "--red-accent": "174 87% 29%",
          "--red-accent-light": "174 87% 39%",
          "--chart-red-primary": "174 87% 29%",
          "--chart-red-secondary": "174 87% 39%",
          "--chart-red-dark": "0 0% 18%",
          "--chart-red-darker": "0 0% 12%",
          "--error": "174 87% 29%"
        }
      }
    ];

    const themeData = themes.find(t => t.id === themeId);
    if (themeData) {
      const root = document.documentElement;
      Object.entries(themeData.cssVars).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }
  }, []);

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      applyTheme(savedTheme);
    }

    // Listen for theme changes
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.theme) {
        applyTheme(customEvent.detail.theme);
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [applyTheme]);

  return { applyTheme };
};