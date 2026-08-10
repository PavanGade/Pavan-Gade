import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { LoadingState } from '@/components/ui/States';
import { Screen } from '@/components/layout/Screen';
import { useSessionStore } from '@/stores/session';

export default function Index() {
  const isHydrated = useSessionStore((s) => s.isHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const onboardingComplete = useSessionStore((s) => s.onboardingComplete);
  const setHydrated = useSessionStore((s) => s.setHydrated);

  useEffect(() => {
    // Persist middleware may already hydrate; ensure UI unblocks.
    const t = setTimeout(() => {
      if (!useSessionStore.getState().isHydrated) setHydrated(true);
    }, 50);
    return () => clearTimeout(t);
  }, [setHydrated]);

  if (!isHydrated) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Starting PRSPCT…" />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/profile" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
