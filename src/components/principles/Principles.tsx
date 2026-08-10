"use client";

import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { principles } from "@/data/opportunities";

export function Principles() {
  return (
    <section id="why" className="section-pad relative overflow-hidden">
      <div className="container-page">
        <div className="mb-16 max-w-3xl md:mb-24">
          <Reveal>
            <p className="eyebrow mb-6">Why Investors Circle</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="heading-lg"
            text="Principles over promotion."
          />
        </div>

        <div className="grid gap-0 border-t border-border md:grid-cols-2">
          {principles.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.06}
              className="border-b border-border px-0 py-10 md:px-8 md:py-14 md:odd:border-r"
            >
              <p className="font-mono text-xs text-text-muted">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.04em]">
                {item.title}
              </h3>
              <p className="mt-4 max-w-sm text-lg text-text-secondary">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
