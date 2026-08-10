"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { journeySteps } from "@/data/opportunities";
import { ChevronDown } from "lucide-react";

export function InvestorJourney() {
  return (
    <section id="journey" className="section-pad">
      <div className="container-page">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-5">Investor journey</p>
          <h2 className="heading-lg">A clear path into the Circle.</h2>
        </Reveal>

        {/* Desktop horizontal */}
        <Reveal className="mb-10 hidden lg:block">
          <ol className="grid grid-cols-6 gap-3">
            {journeySteps.map((step, index) => (
              <li key={step.id} className="relative">
                <div className="rounded-[var(--radius)] border border-border bg-bg-card p-4">
                  <p className="font-mono text-[11px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-base tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
                {index < journeySteps.length - 1 ? (
                  <span
                    className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-border xl:block"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Mobile / tablet vertical */}
        <ol className="mb-10 space-y-0 lg:hidden">
          {journeySteps.map((step, index) => (
            <li key={step.id} className="flex flex-col items-stretch">
              <div className="rounded-[var(--radius)] border border-border bg-bg-card p-5">
                <p className="font-mono text-[11px] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
              {index < journeySteps.length - 1 ? (
                <div className="flex justify-center py-2 text-text-muted">
                  <ChevronDown className="size-4" aria-hidden />
                </div>
              ) : null}
            </li>
          ))}
        </ol>

        <Reveal>
          <Button href="#contact" size="lg" showArrow>
            Start Your Investor Journey
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
