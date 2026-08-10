"use client";

import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  const number = siteConfig.whatsapp;
  if (!number) return null;

  const href = `https://wa.me/${number.replace(/[^\d]/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card/90 px-3.5 py-3 text-sm font-medium text-text-primary shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-border-strong hover:scale-[1.02] md:bottom-8 md:right-8 md:px-4"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-4 text-accent" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
