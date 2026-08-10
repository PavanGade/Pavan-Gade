"use client";

import { Reveal } from "@/components/ui/Reveal";

const items = [
  "Real Estate",
  "Private Businesses",
  "Startups",
  "Alternatives",
  "Research-led",
  "Risk-aware",
  "Long-term capital",
  "Independent thinking",
];

export function Marquee() {
  const loop = [...items, ...items];

  return (
    <section aria-hidden className="overflow-hidden border-y border-border py-5">
      <Reveal>
        <div className="marquee-track text-sm tracking-[0.08em] text-text-muted uppercase">
          {loop.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-3">
              <span className="size-1 rounded-full bg-accent" />
              {item}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
