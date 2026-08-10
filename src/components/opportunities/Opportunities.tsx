"use client";

import { Reveal } from "@/components/ui/Reveal";
import { opportunities } from "@/data/opportunities";
import { trackEvent } from "@/lib/analytics";
import { ArrowUpRight } from "lucide-react";

export function Opportunities() {
  return (
    <section id="opportunities" className="section-pad bg-bg-secondary">
      <div className="container-page">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-5">Opportunities</p>
          <h2 className="heading-lg">Where capital meets opportunity.</h2>
          <p className="body-lg mt-4">
            Four categories. One standard: thoughtful underwriting before any
            allocation conversation.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <a
                href={item.href || "#explorer"}
                onClick={() =>
                  trackEvent("opportunity_view", {
                    opportunity_id: item.id,
                    category: item.category,
                  })
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-bg-card p-6 transition duration-300 hover:scale-[1.015] hover:border-border-strong md:p-8"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/0 blur-3xl transition duration-500 group-hover:bg-accent/[0.08]" />

                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-sm text-text-muted">
                    {item.number}
                  </span>
                  <ArrowUpRight className="size-5 text-text-muted transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>

                <h3 className="heading-md mt-8">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-5 text-xs">
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

                <span className="link-underline mt-6 text-sm">
                  Explore category
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
