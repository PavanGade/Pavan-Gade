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
    const onScroll = () => setScrolled(window.scrollY > 24);
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-bg-primary/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between">
        <Link
          href="/"
          className="group flex flex-col leading-none tracking-tight"
          aria-label="Investors Circle home"
        >
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-text-secondary transition group-hover:text-text-primary">
            Investors
          </span>
          <span className="text-base font-semibold tracking-[0.08em] text-text-primary">
            Circle
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-text-secondary transition hover:text-text-primary"
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
          className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text-primary lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 top-[var(--header-h)] border-b border-border bg-bg-primary/95 backdrop-blur-xl lg:hidden"
          >
            <nav
              className="container-page flex flex-col gap-1 py-6"
              aria-label="Mobile"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-lg text-text-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-4 px-1">
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
