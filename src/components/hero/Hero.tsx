"use client";

import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { motion, useReducedMotion } from "framer-motion";

function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[520px] lg:mx-0"
      aria-hidden
    >
      <div className="absolute inset-[8%] rounded-full border border-border" />
      <div className="absolute inset-[18%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[28%] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.16),transparent_65%)]" />

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <motion.path
          d="M40 280 C90 250, 120 180, 170 170 C230 155, 250 220, 300 200 C340 185, 360 140, 380 110"
          stroke="rgba(245,245,245,0.35)"
          strokeWidth="1.5"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
        <motion.path
          d="M50 320 C110 300, 140 240, 190 230 C250 215, 270 270, 320 255 C350 245, 365 210, 385 190"
          stroke="rgba(201,169,110,0.55)"
          strokeWidth="1.25"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        />

        {[
          [170, 170],
          [300, 200],
          [190, 230],
          [320, 255],
          [250, 140],
          [120, 210],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={i % 2 === 0 ? 4 : 3}
            fill={i % 3 === 0 ? "#C9A96E" : "#F5F5F5"}
            initial={reduce ? false : { opacity: 0, scale: 0.5 }}
            animate={
              reduce
                ? { opacity: 0.9, scale: 1 }
                : {
                    opacity: [0.45, 0.95, 0.45],
                    scale: [1, 1.15, 1],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 3.5 + i * 0.25,
                    repeat: Infinity,
                    delay: 0.8 + i * 0.15,
                    ease: "easeInOut",
                  }
            }
          />
        ))}

        <motion.g
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <line
            x1="80"
            y1="90"
            x2="140"
            y2="90"
            stroke="rgba(255,255,255,0.12)"
          />
          <line
            x1="260"
            y1="320"
            x2="330"
            y2="320"
            stroke="rgba(255,255,255,0.12)"
          />
        </motion.g>
      </svg>

      <motion.div
        className="absolute left-[6%] top-[18%] rounded-lg border border-border bg-bg-card/80 px-3 py-2 backdrop-blur-sm"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted">
          Allocation
        </p>
        <p className="text-sm text-text-primary">Signal map</p>
      </motion.div>

      <motion.div
        className="absolute bottom-[16%] right-[4%] rounded-lg border border-border bg-bg-card/80 px-3 py-2 backdrop-blur-sm"
        animate={reduce ? undefined : { y: [0, 10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted">
          Network
        </p>
        <p className="text-sm text-text-primary">Opportunity graph</p>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-[var(--header-h)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(201,169,110,0.08),transparent_45%),radial-gradient(ellipse_at_90%_20%,rgba(255,255,255,0.04),transparent_40%)]" />
        <div className="grid-fade absolute inset-0 opacity-60" />
        <div className="noise-overlay" />
      </div>

      <div className="container-page relative z-10 grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20">
        <div>
          <motion.p className="eyebrow mb-6" {...fadeUp(0.05)}>
            Investment intelligence platform
          </motion.p>

          <motion.h1
            className="heading-display max-w-[11ch]"
            {...fadeUp(0.15)}
          >
            Invest With Intelligence.
            <span className="mt-1 block text-text-secondary">
              Build With Conviction.
            </span>
          </motion.h1>

          <motion.p className="body-lg mt-6" {...fadeUp(0.28)}>
            Investors Circle connects ambitious investors with carefully
            evaluated opportunities across real estate, businesses and emerging
            markets.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            {...fadeUp(0.4)}
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
            className="mt-6 text-sm text-text-muted"
            {...fadeUp(0.5)}
          >
            Curated opportunities. Independent thinking. Long-term perspective.
          </motion.p>
        </div>

        <motion.div {...fadeUp(0.35)}>
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
