"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { stats } from "@/data/opportunities";

export function Stats() {
  return (
    <section aria-label="Key metrics" className="relative overflow-hidden">
      <div className="hairline" />
      <div className="container-page">
        <div className="grid grid-cols-2 gap-px md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.id}
              delay={i * 0.06}
              className="relative px-2 py-12 md:px-4 md:py-16"
            >
              <p className="text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.04em] text-text-primary">
                <AnimatedCounter
                  value={stat.value}
                  numericValue={stat.numericValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isPlaceholder={stat.isPlaceholder}
                />
              </p>
              <p className="mt-3 text-sm text-text-secondary">{stat.label}</p>
              {stat.isPlaceholder ? (
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                  Placeholder
                </p>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
      <div className="hairline" />
    </section>
  );
}
