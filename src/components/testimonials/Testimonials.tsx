"use client";

import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/opportunities";

export function Testimonials() {
  return (
    <section id="testimonials" className="section-pad bg-bg-secondary">
      <div className="container-page">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-5">Social proof</p>
          <h2 className="heading-lg">Voices from the Circle.</h2>
          <p className="body-lg mt-4">
            Testimonials will appear here once approved. No fabricated quotes.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-[var(--radius)] border border-dashed border-border bg-bg-card/60 p-6 md:p-7">
                <blockquote className="flex-1 text-lg tracking-tight text-text-secondary">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-8 border-t border-border pt-5">
                  <p className="text-sm text-text-primary">{item.name}</p>
                  <p className="mt-1 text-xs text-text-muted">{item.role}</p>
                  {item.isPlaceholder ? (
                    <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-text-muted">
                      Placeholder
                    </p>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
