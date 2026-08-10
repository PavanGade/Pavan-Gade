"use client";

import { InsightCard } from "@/components/insights/InsightCard";
import { Reveal } from "@/components/ui/Reveal";
import { insights } from "@/data/opportunities";

export function Insights() {
  return (
    <section id="insights" className="section-pad bg-bg-secondary">
      <div className="container-page">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-5">Market insights</p>
          <h2 className="heading-lg">Perspective beyond the headline.</h2>
          <p className="body-lg mt-4">
            Editorial notes and frameworks — placeholder content until published
            insights are available.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight, i) => (
            <Reveal key={insight.id} delay={i * 0.06}>
              <InsightCard insight={insight} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
