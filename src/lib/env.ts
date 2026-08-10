import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().url().optional(),
);

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalString,
  NEXT_PUBLIC_APP_URL: optionalUrl,
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  OPENAI_API_KEY: optionalString,
  STRIPE_SECRET_KEY: optionalString,
  RESEND_API_KEY: optionalString,
  SENTRY_DSN: optionalUrl,
  DATA_PROVIDER_API_KEY: optionalString,
  WHATSAPP_CLOUD_API_TOKEN: optionalString,
  WHATSAPP_PHONE_NUMBER_ID: optionalString,
  META_FACEBOOK_APP_ID: optionalString,
  META_FACEBOOK_APP_SECRET: optionalString,
  META_FACEBOOK_PAGE_ACCESS_TOKEN: optionalString,
  TELEPHONY_PROVIDER_API_KEY: optionalString,
  SMS_PROVIDER_API_KEY: optionalString,
  VAPID_PUBLIC_KEY: optionalString,
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const clientEnv: ClientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

const rawServerEnv =
  typeof window === "undefined"
    ? {
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        SENTRY_DSN: process.env.SENTRY_DSN,
        DATA_PROVIDER_API_KEY: process.env.DATA_PROVIDER_API_KEY,
        WHATSAPP_CLOUD_API_TOKEN: process.env.WHATSAPP_CLOUD_API_TOKEN,
        WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
        META_FACEBOOK_APP_ID: process.env.META_FACEBOOK_APP_ID,
        META_FACEBOOK_APP_SECRET: process.env.META_FACEBOOK_APP_SECRET,
        META_FACEBOOK_PAGE_ACCESS_TOKEN: process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN,
        TELEPHONY_PROVIDER_API_KEY: process.env.TELEPHONY_PROVIDER_API_KEY,
        SMS_PROVIDER_API_KEY: process.env.SMS_PROVIDER_API_KEY,
        VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
      }
    : {};

export const serverEnv: ServerEnv = serverEnvSchema.parse(rawServerEnv);

export function isDemoMode(): boolean {
  return !clientEnv.NEXT_PUBLIC_SUPABASE_URL || !clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function isAiConfigured(): boolean {
  return Boolean(serverEnv.OPENAI_API_KEY);
}

export function isStripeConfigured(): boolean {
  return Boolean(serverEnv.STRIPE_SECRET_KEY && clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function isEmailConfigured(): boolean {
  return Boolean(serverEnv.RESEND_API_KEY);
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(serverEnv.WHATSAPP_CLOUD_API_TOKEN && serverEnv.WHATSAPP_PHONE_NUMBER_ID);
}

export function isFacebookLeadsConfigured(): boolean {
  return Boolean(
    serverEnv.META_FACEBOOK_APP_ID &&
      serverEnv.META_FACEBOOK_APP_SECRET &&
      serverEnv.META_FACEBOOK_PAGE_ACCESS_TOKEN,
  );
}

export function isTelephonyConfigured(): boolean {
  return Boolean(serverEnv.TELEPHONY_PROVIDER_API_KEY);
}

export function isSmsConfigured(): boolean {
  return Boolean(serverEnv.SMS_PROVIDER_API_KEY);
}

export function getClientIntegrationStatuses() {
  return {
    ai: {
      label: "AI",
      configured: false,
      detail: "Demo provider is used in the browser. Server AI requires OPENAI_API_KEY.",
    },
    email: {
      label: "Email",
      configured: false,
      detail: "Demo email mode is active unless server RESEND_API_KEY is configured.",
    },
    stripe: {
      label: "Stripe",
      configured: Boolean(clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      detail: clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        ? "Publishable key is configured; checkout still requires server Stripe setup."
        : "Demo billing mode is active.",
    },
    data: {
      label: "Data",
      configured: Boolean(clientEnv.NEXT_PUBLIC_SUPABASE_URL && clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      detail: clientEnv.NEXT_PUBLIC_SUPABASE_URL ? "Public Supabase configuration detected." : "Demo Zustand data is active.",
    },
    whatsapp: {
      label: "WhatsApp",
      configured: false,
      detail:
        "Demo WhatsApp mode is active. Server setup requires WHATSAPP_CLOUD_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID for the official Meta Cloud API.",
    },
    facebook: {
      label: "Facebook Leads",
      configured: false,
      detail:
        "Demo Facebook leads are active. Server setup requires META_FACEBOOK_APP_ID, META_FACEBOOK_APP_SECRET, and META_FACEBOOK_PAGE_ACCESS_TOKEN.",
    },
    telephony: {
      label: "Telephony",
      configured: false,
      detail: "Demo telephony mode is active. Server setup requires TELEPHONY_PROVIDER_API_KEY.",
    },
    sms: {
      label: "SMS",
      configured: false,
      detail: "Demo SMS mode is active. Server setup requires SMS_PROVIDER_API_KEY.",
    },
    push: {
      label: "Push",
      configured: false,
      detail: "Demo browser-notification mode is active. Server push setup requires VAPID_PUBLIC_KEY.",
    },
  };
}
