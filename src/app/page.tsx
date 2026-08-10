"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/loading-state";
import { useDemoStore } from "@/stores/demo-store";

export default function Home() {
  const router = useRouter();
  const session = useDemoStore((state) => state.session);
  const [hydrated, setHydrated] = React.useState(() => useDemoStore.persist.hasHydrated());

  React.useEffect(() => {
    const unsubscribe = useDemoStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useDemoStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    router.replace(session ? (session.onboardingComplete ? "/app/dashboard" : "/onboarding") : "/login");
  }, [hydrated, router, session]);

  return <LoadingState label="Routing to PRSPCT..." className="min-h-screen" />;
}
