import type { AnalyticsEventName } from "@/types";

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
  }
}

function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackEvent(
  event: AnalyticsEventName,
  props: EventProps = {},
) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    ...props,
    timestamp: new Date().toISOString(),
  };

  pushToDataLayer(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }

  if (typeof window.fbq === "function") {
    const metaMap: Partial<Record<AnalyticsEventName, string>> = {
      form_submit: "Lead",
      form_success: "CompleteRegistration",
      page_view: "PageView",
    };
    const mapped = metaMap[event];
    if (mapped) window.fbq("track", mapped, props);
    else window.fbq("trackCustom", event, props);
  }

  if (typeof window.lintrk === "function" && event === "form_success") {
    window.lintrk("track", { conversion_id: undefined });
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }
}

export const analyticsIds = {
  gtm: process.env.NEXT_PUBLIC_GTM_ID || "",
  ga4: process.env.NEXT_PUBLIC_GA4_ID || "",
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "",
};
