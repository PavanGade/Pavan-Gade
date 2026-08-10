"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CommandPalette } from "@/components/command/command-palette";
import { LoadingState } from "@/components/ui/loading-state";
import { useDemoStore } from "@/stores/demo-store";

export default function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useDemoStore((state) => state.session);
  const [hydrated, setHydrated] = React.useState(() => useDemoStore.persist.hasHydrated());

  React.useEffect(() => {
    const unsubscribe = useDemoStore.persist.onFinishHydration(() => setHydrated(true));
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!session.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [hydrated, router, session]);

  if (!hydrated || !session || !session.onboardingComplete) {
    return <LoadingState label="Opening PRSPCT..." className="min-h-screen" />;
  }

  return (
    <AppShell>
      {children}
      <CommandPalette />
    </AppShell>
  );
}
