"use client";

import dynamic from "next/dynamic";

const Intelligence = dynamic(
  () =>
    import("@/components/intelligence/Intelligence").then(
      (m) => m.Intelligence,
    ),
  {
    loading: () => (
      <section className="section-pad" aria-hidden>
        <div className="container-page">
          <div className="surface-card h-[420px] animate-pulse bg-bg-card" />
        </div>
      </section>
    ),
    ssr: false,
  },
);

export function IntelligenceLazy() {
  return <Intelligence />;
}
