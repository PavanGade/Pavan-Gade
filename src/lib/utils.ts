import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Investors Circle",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://investorscircle.in",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "",
  description:
    "Investors Circle connects investors with carefully evaluated investment opportunities, market insights and a curated investment ecosystem.",
};
