"use client";

import { Reveal } from "@/components/ui/Reveal";
import { processStages } from "@/data/opportunities";
import { prefersReducedMotion } from "@/lib/utils";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const observers: IntersectionObserver[] = [];
      stageRefs.current.forEach((el, index) => {
        if (!el) return;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActive(index);
          },
          { threshold: 0.55, rootMargin: "-20% 0px -35% 0px" },
        );
        observer.observe(el);
        observers.push(observer);
      });
      return () => observers.forEach((o) => o.disconnect());
    }

    const triggers: ScrollTrigger[] = [];

    stageRefs.current.forEach((el, index) => {
      if (!el) return;
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="section-pad bg-bg-secondary"
    >
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-5">How it works</p>
              <h2 className="heading-lg max-w-[12ch]">
                From discovery to conviction.
              </h2>
              <p className="body-lg mt-4">
                A clear path from curiosity to capital commitment — without
                pressure, shortcuts or unsupported claims.
              </p>
            </Reveal>
          </div>

          <div className="hidden space-y-6 md:block">
            {processStages.map((stage, index) => (
              <article
                key={stage.id}
                ref={(el) => {
                  stageRefs.current[index] = el;
                }}
                className={cn(
                  "rounded-[var(--radius)] border p-7 transition duration-500",
                  active === index
                    ? "border-border-strong bg-bg-card"
                    : "border-border/60 bg-transparent opacity-45",
                )}
              >
                <p className="font-mono text-sm text-accent">{stage.number}</p>
                <h3 className="heading-md mt-3">{stage.title}</h3>
                <p className="mt-3 max-w-xl text-text-secondary">
                  {stage.description}
                </p>
              </article>
            ))}
          </div>

          <ol className="relative space-y-0 border-l border-border pl-6 md:hidden">
            {processStages.map((stage) => (
              <li key={stage.id} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[31px] top-1 size-2.5 rounded-full bg-accent" />
                <p className="font-mono text-xs text-accent">{stage.number}</p>
                <h3 className="mt-2 text-xl tracking-tight">{stage.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {stage.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
