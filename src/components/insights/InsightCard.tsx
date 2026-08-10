"use client";

import { trackEvent } from "@/lib/analytics";
import type { Insight } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius)] border border-border bg-bg-card p-6 transition duration-300 hover:border-border-strong hover:bg-bg-elevated md:p-7">
      <p className="text-xs uppercase tracking-[0.14em] text-accent">
        {insight.category}
      </p>
      <h3 className="mt-4 text-xl tracking-tight text-text-primary">
        {insight.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
        {insight.summary}
      </p>
      <Link
        href={insight.href}
        onClick={() =>
          trackEvent("insight_click", {
            insight_id: insight.id,
            category: insight.category,
          })
        }
        className="link-underline mt-6 text-sm"
      >
        Read insight
        <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
