"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden section-pad">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.12),transparent_55%)]" />
        <div className="grid-fade absolute inset-0 opacity-40" />
      </div>

      <div className="container-page relative z-10 text-center">
        <Reveal>
          <h2 className="heading-lg mx-auto max-w-[16ch]">
            Your next investment decision deserves more than a pitch.
          </h2>
          <p className="body-lg mx-auto mt-5">
            Join a network built around better opportunities, better information
            and better decisions.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              href="#contact"
              size="lg"
              showArrow
              onClick={() =>
                trackEvent("final_cta_click", { cta: "join_investors_circle" })
              }
            >
              Join Investors Circle
            </Button>
            <Button
              href="#opportunities"
              variant="secondary"
              size="lg"
              onClick={() =>
                trackEvent("final_cta_click", { cta: "explore_opportunities" })
              }
            >
              Explore Opportunities
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
