"use client";

import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function FinalCta() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} className="relative overflow-hidden section-pad">
      <div className="atmosphere" aria-hidden>
        <motion.div
          style={reduce ? undefined : { y: orbY }}
          className="atmosphere-orb left-1/2 top-1/2 h-[70vw] w-[70vw] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(201,169,110,0.16),transparent_65%)]"
        />
        <div className="noise-overlay" />
      </div>

      <div className="container-page relative z-10 text-center">
        <TextReveal
          as="h2"
          className="heading-lg mx-auto max-w-[14ch] justify-center"
          text="Your next investment decision deserves more than a pitch."
        />
        <motion.p
          className="body-lg mx-auto mt-6"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Join a network built around better opportunities, better information
          and better decisions.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
