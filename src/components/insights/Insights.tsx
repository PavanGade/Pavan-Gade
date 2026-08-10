"use client";

import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { insights } from "@/data/opportunities";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Insights() {
  return (
    <section id="insights" className="section-pad bg-bg-secondary">
      <div className="container-page">
        <div className="mb-14 max-w-3xl md:mb-16">
          <Reveal>
            <p className="eyebrow mb-6">Market insights</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="heading-lg"
            text="Perspective beyond the headline."
          />
        </div>

        <div className="border-t border-border">
          {insights.map((insight, i) => (
            <Reveal key={insight.id} delay={i * 0.05}>
              <Link
                href={insight.href}
                onClick={() =>
                  trackEvent("insight_click", {
                    insight_id: insight.id,
                    category: insight.category,
                  })
                }
                className="group surface-row grid gap-4 py-8 md:grid-cols-[0.35fr_1fr_auto] md:items-center md:gap-10 md:py-10"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent">
                  {insight.category}
                </p>
                <div>
                  <h3 className="text-xl tracking-tight text-text-primary transition duration-300 group-hover:translate-x-1 md:text-2xl">
                    {insight.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-text-secondary">
                    {insight.summary}
                  </p>
                </div>
                <span className="link-underline text-sm text-text-primary">
                  Read insight
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
