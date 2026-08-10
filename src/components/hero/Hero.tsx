"use client";

import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

function HeroAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div className="atmosphere" aria-hidden>
      <div
        className={`atmosphere-orb -left-[10%] top-[-20%] h-[55vw] w-[55vw] max-h-[720px] max-w-[720px] bg-[radial-gradient(circle,rgba(201,169,110,0.18),transparent_68%)] ${reduce ? "" : "animate-drift"}`}
      />
      <div
        className={`atmosphere-orb right-[-15%] top-[10%] h-[48vw] w-[48vw] max-h-[640px] max-w-[640px] bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_70%)] ${reduce ? "" : "animate-drift-alt"}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,#050505_100%)]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.55]"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M-40 620 C180 540, 320 380, 520 360 C760 335, 860 500, 1080 455 C1220 425, 1320 300, 1500 240"
          stroke="rgba(245,245,245,0.14)"
          strokeWidth="1.25"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        />
        <motion.path
          d="M-20 700 C220 640, 380 470, 580 450 C820 425, 920 580, 1140 540 C1280 515, 1360 400, 1520 350"
          stroke="rgba(201,169,110,0.35)"
          strokeWidth="1.25"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        />
        {[
          [520, 360],
          [860, 480],
          [1080, 455],
          [580, 450],
          [1140, 540],
          [320, 500],
          [980, 320],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={i % 2 === 0 ? 3.5 : 2.5}
            fill={i % 3 === 0 ? "#C9A96E" : "rgba(245,245,245,0.85)"}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            animate={
              reduce
                ? { opacity: 0.85 }
                : { opacity: [0.35, 0.95, 0.35], scale: [1, 1.2, 1] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 4 + i * 0.3,
                    repeat: Infinity,
                    delay: 0.9 + i * 0.12,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </svg>
      <div className="noise-overlay" />
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const rise = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const line = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { y: "110%" },
          animate: { y: "0%" },
          transition: {
            duration: 1.05,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-[calc(var(--header-h)+2.5rem)] md:items-center md:pb-24 md:pt-[var(--header-h)]"
    >
      <HeroAtmosphere />

      <motion.div
        style={reduce ? undefined : { opacity: fade, y: rise }}
        className="container-page relative z-10 w-full"
      >
        <div className="max-w-5xl">
          <div className="overflow-hidden">
            <motion.p
              className="heading-brand mb-8 text-text-primary/90"
              {...line(0.05)}
            >
              Investors Circle
            </motion.p>
          </div>

          <h1 className="heading-display">
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" {...line(0.18)}>
                Invest With
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" {...line(0.28)}>
                Intelligence.
              </motion.span>
            </span>
            <span className="mt-1 block overflow-hidden pb-1 text-text-secondary/80">
              <motion.span className="block" {...line(0.38)}>
                Build With Conviction.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="body-lg mt-8 max-w-xl"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            Carefully evaluated opportunities across real estate, businesses and
            emerging markets — for investors who think in decades, not days.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button
              href="#contact"
              size="lg"
              showArrow
              onClick={() =>
                trackEvent("hero_cta_click", { cta: "join_investors_circle" })
              }
            >
              Join Investors Circle
            </Button>
            <Button
              href="#opportunities"
              variant="secondary"
              size="lg"
              onClick={() =>
                trackEvent("hero_cta_click", { cta: "explore_opportunities" })
              }
            >
              Explore Opportunities
            </Button>
          </motion.div>

          <motion.p
            className="mt-8 text-sm tracking-wide text-text-muted"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Curated opportunities. Independent thinking. Long-term perspective.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
