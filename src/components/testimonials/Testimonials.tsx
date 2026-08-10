"use client";

import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/opportunities";

export function Testimonials() {
  return (
    <section id="testimonials" className="section-pad bg-bg-secondary">
      <div className="container-page">
        <div className="mb-14 max-w-3xl md:mb-16">
          <Reveal>
            <p className="eyebrow mb-6">Social proof</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="heading-lg"
            text="Voices from the Circle."
          />
          <Reveal delay={0.1}>
            <p className="body-lg mt-5">
              Testimonials appear here once approved. No fabricated quotes.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-0 border-t border-border md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.06}
              className="border-b border-border px-0 py-10 md:border-r md:px-8 md:py-12 md:last:border-r-0"
            >
              <blockquote className="text-xl leading-snug tracking-tight text-text-secondary md:text-2xl">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-10">
                <p className="text-sm text-text-primary">{item.name}</p>
                <p className="mt-1 text-xs text-text-muted">{item.role}</p>
                {item.isPlaceholder ? (
                  <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                    Placeholder
                  </p>
                ) : null}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
