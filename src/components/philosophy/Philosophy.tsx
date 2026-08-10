"use client";

import { Reveal } from "@/components/ui/Reveal";
import { philosophyPoints } from "@/data/opportunities";

export function Philosophy() {
  return (
    <section id="philosophy" className="section-pad">
      <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-5">Investment philosophy</p>
          <h2 className="heading-lg max-w-[12ch]">
            Capital deserves a better framework.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="body-lg">
            Investors Circle is built around a simple belief: capital performs
            better when discovery, research and risk assessment come before
            urgency.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {philosophyPoints.map((point) => (
              <li
                key={point}
                className="border-l border-accent/40 pl-4 text-sm text-text-secondary"
              >
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
