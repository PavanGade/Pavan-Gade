import { Redirect, Stack } from 'expo-router';

import { useSessionStore } from '@/stores/session';

export default function AppLayout() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const onboardingComplete = useSessionStore((s) => s.onboardingComplete);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/profile" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
