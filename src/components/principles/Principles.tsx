"use client";

import { Reveal } from "@/components/ui/Reveal";
import { principles } from "@/data/opportunities";

export function Principles() {
  return (
    <section id="why" className="section-pad">
      <div className="container-page">
        <Reveal className="mb-14 max-w-2xl">
          <p className="eyebrow mb-5">Why Investors Circle</p>
          <h2 className="heading-lg">Principles over promotion.</h2>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {principles.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <p className="font-mono text-xs text-text-muted">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-3xl tracking-tight md:text-4xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-sm text-text-secondary">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
