export const colors = {
  light: {
    bg: '#F5F7FA',
    bgElevated: '#FFFFFF',
    bgMuted: '#EEF2F7',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#0F766E',
    primaryMuted: '#CCFBF1',
    primaryText: '#FFFFFF',
    accent: '#0369A1',
    danger: '#DC2626',
    dangerMuted: '#FEE2E2',
    warning: '#D97706',
    warningMuted: '#FEF3C7',
    success: '#059669',
    successMuted: '#D1FAE5',
    hot: '#DC2626',
    warm: '#D97706',
    cold: '#64748B',
    overlay: 'rgba(15, 23, 42, 0.45)',
  },
  dark: {
    bg: '#0B1220',
    bgElevated: '#121A2B',
    bgMuted: '#1A2438',
    border: '#243044',
    borderStrong: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    primary: '#2DD4BF',
    primaryMuted: '#134E4A',
    primaryText: '#042F2E',
    accent: '#38BDF8',
    danger: '#F87171',
    dangerMuted: '#7F1D1D',
    warning: '#FBBF24',
    warningMuted: '#78350F',
    success: '#34D399',
    successMuted: '#064E3B',
    hot: '#F87171',
    warm: '#FBBF24',
    cold: '#94A3B8',
    overlay: 'rgba(0, 0, 0, 0.55)',
  },
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const, letterSpacing: -0.6 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: -0.4 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: '500' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const, letterSpacing: 0.4 },
  mono: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

export const animation = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export const breakpoints = {
  sm: 375,
  md: 768,
  lg: 1024,
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = (typeof colors)[ColorScheme];
