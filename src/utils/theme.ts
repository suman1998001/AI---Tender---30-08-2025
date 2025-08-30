// Utility functions for theme color conversions

export const getThemeHexColor = (cssVariable: string): string => {
  if (typeof window === 'undefined') return '#000000';
  
  const root = document.documentElement;
  const value = root.style.getPropertyValue(cssVariable) || 
                getComputedStyle(root).getPropertyValue(cssVariable);
  
  if (!value) return '#000000';
  
  // Convert HSL to hex
  const hslMatch = value.trim().match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch.map(Number);
    return hslToHex(h, s, l);
  }
  
  return '#000000';
};

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const getChartColors = () => {
  return {
    primary: getThemeHexColor('--chart-red-primary'),
    secondary: getThemeHexColor('--chart-red-secondary'), 
    dark: getThemeHexColor('--chart-red-dark'),
    darker: getThemeHexColor('--chart-red-darker'),
    error: getThemeHexColor('--error')
  };
};