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
  };
}
