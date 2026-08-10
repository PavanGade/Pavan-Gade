import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ColorScheme } from '@/constants/tokens';
import type { OrgRole } from '@/constants/domain';
import { DEMO_ORG_ID, DEMO_USER_ID } from '@/lib/mock/demo-data';
import { getClientEnv } from '@/lib/env';

type SessionState = {
  isHydrated: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  organizationId: string | null;
  organizationName: string | null;
  role: OrgRole | null;
  onboardingComplete: boolean;
  setHydrated: (value: boolean) => void;
  signInMock: (input: { email: string; fullName?: string }) => void;
  completeOnboarding: (input: {
    fullName: string;
    organizationName: string;
    roleTitle?: string;
  }) => void;
  signOut: () => void;
  setOrganization: (input: {
    organizationId: string;
    organizationName: string;
    role: OrgRole;
  }) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isHydrated: false,
      isAuthenticated: false,
      userId: null,
      email: null,
      fullName: null,
      organizationId: null,
      organizationName: null,
      role: null,
      onboardingComplete: false,
      setHydrated: (value) => set({ isHydrated: value }),
      signInMock: ({ email, fullName }) =>
        set({
          isAuthenticated: true,
          userId: DEMO_USER_ID,
          email,
          fullName: fullName ?? email.split('@')[0] ?? 'Rep',
          organizationId: getClientEnv().useMockData ? DEMO_ORG_ID : null,
          organizationName: getClientEnv().useMockData ? 'Acme Growth' : null,
          role: getClientEnv().useMockData ? 'OWNER' : null,
          onboardingComplete: getClientEnv().useMockData,
        }),
      completeOnboarding: ({ fullName, organizationName }) =>
        set({
          fullName,
          organizationName,
          organizationId: DEMO_ORG_ID,
          role: 'OWNER',
          onboardingComplete: true,
        }),
      signOut: () =>
        set({
          isAuthenticated: false,
          userId: null,
          email: null,
          fullName: null,
          organizationId: null,
          organizationName: null,
          role: null,
          onboardingComplete: false,
        }),
      setOrganization: ({ organizationId, organizationName, role }) =>
        set({ organizationId, organizationName, role }),
    }),
    {
      name: 'prspct-session',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        userId: s.userId,
        email: s.email,
        fullName: s.fullName,
        organizationId: s.organizationId,
        organizationName: s.organizationName,
        role: s.role,
        onboardingComplete: s.onboardingComplete,
      }),
    },
  ),
);

type ThemeState = {
  preference: ColorScheme | 'system';
  setPreference: (preference: ColorScheme | 'system') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'prspct-theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
