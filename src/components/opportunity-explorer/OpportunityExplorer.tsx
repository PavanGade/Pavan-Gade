"use client";

import { Reveal } from "@/components/ui/Reveal";
import { explorerCategories } from "@/data/opportunities";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { OpportunityCategory } from "@/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export function OpportunityExplorer() {
  const [active, setActive] = useState<OpportunityCategory>("real-estate");
  const reduce = useReducedMotion();
  const current =
    explorerCategories.find((c) => c.id === active) || explorerCategories[0];

  return (
    <section id="explorer" className="section-pad">
      <div className="container-page">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-5">Opportunity explorer</p>
          <h2 className="heading-lg">Examine the thesis behind each category.</h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          <Reveal>
            <div
              role="tablist"
              aria-label="Opportunity categories"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {explorerCategories.map((cat) => {
                const selected = cat.id === active;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setActive(cat.id);
                      trackEvent("opportunity_category_select", {
                        category: cat.id,
                      });
                    }}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-4 py-3 text-left text-sm transition lg:w-full lg:rounded-xl",
                      selected
                        ? "border-accent/40 bg-accent-soft text-text-primary"
                        : "border-border bg-transparent text-text-secondary hover:border-border-strong hover:text-text-primary",
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="surface-card relative min-h-[420px] overflow-hidden p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  role="tabpanel"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-accent">
                    Investment thesis
                  </p>
                  <h3 className="heading-md mt-3">{current.label}</h3>
                  <p className="mt-4 max-w-2xl text-text-secondary">
                    {current.thesis}
                  </p>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">
                        Characteristics
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {current.characteristics.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-medium text-text-primary">
                          Typical horizon
                        </h4>
                        <p className="mt-2 text-sm text-text-secondary">
                          {current.typicalHorizon}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-text-primary">
                          Risk considerations
                        </h4>
                        <p className="mt-2 text-sm text-text-secondary">
                          {current.riskConsiderations}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-text-primary">
                          Why it matters
                        </h4>
                        <p className="mt-2 text-sm text-text-secondary">
                          {current.whyItMatters}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
