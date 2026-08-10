"use client";

import { Parallax, Reveal, TextReveal } from "@/components/ui/Reveal";
import { philosophyPoints } from "@/data/opportunities";

export function Philosophy() {
  return (
    <section id="philosophy" className="section-pad relative overflow-hidden">
      <div className="atmosphere" aria-hidden>
        <div className="atmosphere-orb left-1/2 top-0 h-[40vw] w-[40vw] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)]" />
      </div>

      <div className="container-page relative z-10">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Investment philosophy</p>
            </Reveal>
            <TextReveal
              as="h2"
              className="heading-lg max-w-[11ch]"
              text="Capital deserves a better framework."
            />
          </div>

          <Parallax offset={40}>
            <Reveal delay={0.1}>
              <p className="body-lg">
                Discovery, research and risk assessment before urgency. Capital
                performs better when conviction is earned — not sold.
              </p>
            </Reveal>
          </Parallax>
        </div>

        <div className="mt-16 grid gap-0 border-t border-border sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {philosophyPoints.map((point, i) => (
            <Reveal
              key={point}
              delay={0.05 + i * 0.04}
              className="border-b border-border px-0 py-6 sm:border-r sm:px-6 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <p className="font-mono text-[11px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-lg tracking-tight text-text-primary md:text-xl">
                {point}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
