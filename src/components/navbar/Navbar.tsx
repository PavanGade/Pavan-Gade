"use client";

import { Button } from "@/components/ui/Button";
import { navItems } from "@/data/opportunities";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/70 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between">
        <Link
          href="/"
          className="group flex items-baseline gap-2 tracking-tight"
          aria-label="Investors Circle home"
        >
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-text-secondary transition group-hover:text-text-primary">
            Investors
          </span>
          <span className="text-sm font-medium tracking-[0.12em] text-text-primary">
            Circle
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-3.5 py-2 text-[0.8125rem] text-text-secondary transition hover:text-text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            href="/#contact"
            size="md"
            onClick={() => trackEvent("nav_cta_click", { location: "navbar" })}
          >
            Join Investors Circle
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-text-primary lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-white/[0.06] bg-[#050505]/95 backdrop-blur-2xl lg:hidden"
          >
            <nav
              className="container-page flex flex-col gap-1 py-8"
              aria-label="Mobile"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="py-3 text-2xl tracking-tight text-text-primary"
                  onClick={() => setOpen(false)}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="mt-6">
                <Button
                  href="/#contact"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    trackEvent("nav_cta_click", { location: "mobile_nav" });
                  }}
                >
                  Join Investors Circle
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
