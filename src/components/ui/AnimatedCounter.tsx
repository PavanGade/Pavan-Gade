"use client";

import { prefersReducedMotion } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  isPlaceholder?: boolean;
  className?: string;
}

export function AnimatedCounter({
  value,
  numericValue,
  prefix = "",
  suffix = "",
  isPlaceholder = false,
  className,
}: AnimatedCounterProps) {
  const shouldAnimate = !isPlaceholder && numericValue !== undefined;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(
    shouldAnimate ? `${prefix}0${suffix}` : value,
  );

  useEffect(() => {
    if (!shouldAnimate || numericValue === undefined) return;

    const node = ref.current;
    if (!node) return;

    const reduce = prefersReducedMotion();
    let frame = 0;
    let started = false;

    const animate = () => {
      if (reduce) {
        setDisplay(`${prefix}${numericValue}${suffix}`);
        return;
      }
      const duration = 1200;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(numericValue * eased);
        setDisplay(`${prefix}${current}${suffix}`);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [shouldAnimate, numericValue, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {shouldAnimate ? display : value}
    </span>
  );
}
