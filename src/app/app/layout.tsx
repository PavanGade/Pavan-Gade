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
    setHydrated(useDemoStore.persist.hasHydrated());
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
import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  ["Dashboard", "/app/dashboard"],
  ["Prospects", "/app/prospects"],
  ["Companies", "/app/companies"],
  ["Lists", "/app/lists"],
  ["Pipeline", "/app/pipeline"],
  ["Tasks", "/app/tasks"],
  ["Analytics", "/app/analytics"],
  ["AI", "/app/ai"],
  ["Automations", "/app/automations"],
  ["Inbox", "/app/inbox"],
  ["Integrations", "/app/integrations"],
  ["Team", "/app/team"],
  ["Settings", "/app/settings"],
  ["Billing", "/app/billing"],
  ["Search", "/app/search"],
] as const;

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white p-5 lg:block">
        <Link href="/app/dashboard" className="text-xl font-bold tracking-tight">
          PRSPCT
        </Link>
        <nav className="mt-8 grid gap-1">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 p-4 backdrop-blur lg:hidden">
          <Link href="/app/dashboard" className="font-bold">PRSPCT</Link>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {navItems.slice(0, 8).map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full border border-zinc-200 px-3 py-1 text-xs">
                {label}
              </Link>
            ))}
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
