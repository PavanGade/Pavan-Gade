"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { stats } from "@/data/opportunities";

export function Stats() {
  return (
    <section
      aria-label="Key metrics"
      className="border-y border-border bg-bg-secondary"
    >
      <div className="container-page">
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.id}
              delay={i * 0.05}
              className="bg-bg-secondary px-4 py-10 md:px-6 md:py-12"
            >
              <p className="text-3xl tracking-tight text-text-primary md:text-4xl">
                <AnimatedCounter
                  value={stat.value}
                  numericValue={stat.numericValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isPlaceholder={stat.isPlaceholder}
                />
              </p>
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
              {stat.isPlaceholder ? (
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-text-muted">
                  Placeholder
                </p>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
