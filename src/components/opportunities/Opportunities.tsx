"use client";

import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { opportunities } from "@/data/opportunities";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function Opportunities() {
  const reduce = useReducedMotion();

  return (
    <section id="opportunities" className="section-pad relative bg-bg-secondary">
      <div className="container-page">
        <div className="mb-14 max-w-3xl md:mb-20">
          <Reveal>
            <p className="eyebrow mb-6">Opportunities</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="heading-lg"
            text="Where capital meets opportunity."
          />
          <Reveal delay={0.15}>
            <p className="body-lg mt-5">
              Four categories. One standard: thoughtful underwriting before any
              allocation conversation.
            </p>
          </Reveal>
        </div>

        <div className="border-t border-border">
          {opportunities.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <a
                href={item.href || "#explorer"}
                onClick={() =>
                  trackEvent("opportunity_view", {
                    opportunity_id: item.id,
                    category: item.category,
                  })
                }
                className="group surface-row relative block py-8 md:py-10"
              >
                <div className="grid items-start gap-6 md:grid-cols-[0.18fr_1.15fr_1fr_auto] md:gap-8">
                  <p className="font-mono text-sm text-text-muted transition group-hover:text-accent">
                    {item.number}
                  </p>

                  <div>
                    <h3 className="heading-md transition duration-300 group-hover:translate-x-1">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary md:text-[0.95rem]">
                      {item.description}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs md:pt-1">
                    <div>
                      <dt className="text-text-muted">Risk</dt>
                      <dd className="mt-1 text-text-primary">{item.riskLevel}</dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">Horizon</dt>
                      <dd className="mt-1 text-text-primary">
                        {item.investmentHorizon}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">Type</dt>
                      <dd className="mt-1 text-text-primary">
                        {item.opportunityType}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-muted">Status</dt>
                      <dd className="mt-1 capitalize text-text-primary">
                        {item.status.replace("-", " ")}
                      </dd>
                    </div>
                  </dl>

                  <motion.span
                    className={cn(
                      "inline-flex size-11 items-center justify-center rounded-full border border-border text-text-muted transition duration-300 group-hover:border-accent/40 group-hover:text-accent md:mt-1",
                    )}
                    whileHover={reduce ? undefined : { scale: 1.06 }}
                  >
                    <ArrowUpRight className="size-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
