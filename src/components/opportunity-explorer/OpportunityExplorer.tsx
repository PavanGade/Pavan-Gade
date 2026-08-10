"use client";

import { Reveal, TextReveal } from "@/components/ui/Reveal";
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
    <section id="explorer" className="section-pad relative overflow-hidden">
      <div className="container-page">
        <div className="mb-14 max-w-3xl md:mb-16">
          <Reveal>
            <p className="eyebrow mb-6">Opportunity explorer</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="heading-lg"
            text="Examine the thesis behind each category."
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
          <Reveal>
            <div
              role="tablist"
              aria-label="Opportunity categories"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
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
                      "relative whitespace-nowrap px-1 py-3 text-left text-sm transition lg:w-full lg:py-3.5",
                      selected
                        ? "text-text-primary"
                        : "text-text-muted hover:text-text-secondary",
                    )}
                  >
                    {selected ? (
                      <motion.span
                        layoutId={reduce ? undefined : "explorer-active"}
                        className="absolute inset-x-0 bottom-0 h-px bg-accent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-px"
                      />
                    ) : null}
                    <span className="lg:pl-4">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative min-h-[400px] overflow-hidden border-t border-border pt-8 lg:border-t-0 lg:pt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  role="tabpanel"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
                    Investment thesis
                  </p>
                  <h3 className="heading-md mt-4">{current.label}</h3>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
                    {current.thesis}
                  </p>

                  <div className="mt-10 grid gap-10 border-t border-border pt-8 md:grid-cols-2">
                    <div>
                      <h4 className="text-xs uppercase tracking-[0.14em] text-text-muted">
                        Characteristics
                      </h4>
                      <ul className="mt-4 space-y-3">
                        {current.characteristics.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm text-text-secondary"
                          >
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <Meta label="Typical horizon" value={current.typicalHorizon} />
                      <Meta
                        label="Risk considerations"
                        value={current.riskConsiderations}
                      />
                      <Meta label="Why it matters" value={current.whyItMatters} />
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

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.14em] text-text-muted">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{value}</p>
    </div>
  );
}
