import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import {
  animation,
  breakpoints,
  colors,
  radius,
  shadows,
  spacing,
  typography,
  type ThemeColors,
} from '@/constants/tokens';
import { useThemeStore } from '@/stores/session';

export type Theme = {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
  animation: typeof animation;
  breakpoints: typeof breakpoints;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const preference = useThemeStore((s) => s.preference);
  const mode = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  const theme = useMemo<Theme>(
    () => ({
      mode,
      colors: colors[mode],
      spacing,
      radius,
      typography,
      shadows,
      animation,
      breakpoints,
    }),
    [mode],
  );

  return createElement(ThemeContext.Provider, { value: theme }, children);
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
