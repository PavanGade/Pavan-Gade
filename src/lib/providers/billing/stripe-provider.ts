import { z } from "zod";
import { serverEnv } from "@/lib/env";
import type {
  BillingProvider,
  BillingSessionResult,
  CreateCheckoutSessionInput,
  CreatePortalSessionInput,
} from "./types";

export interface StripeProviderOptions {
  secretKey?: string;
}

const stripeSessionSchema = z.object({
  id: z.string(),
  url: z.string().url().nullable(),
});

const stripeErrorSchema = z.object({
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

export class StripeBillingProvider implements BillingProvider {
  private readonly secretKey?: string;

  constructor(options: StripeProviderOptions = {}) {
    this.secretKey = options.secretKey ?? serverEnv.STRIPE_SECRET_KEY;
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<BillingSessionResult> {
    if (!this.secretKey) {
      throw new Error("STRIPE_SECRET_KEY is required to use the Stripe billing provider.");
    }

    if (!input.priceId.trim()) {
      throw new Error("A Stripe priceId is required to start checkout.");
    }

    const body = new URLSearchParams({
      mode: "subscription",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      "line_items[0][price]": input.priceId,
      "line_items[0][quantity]": "1",
    });

    if (input.customerId) {
      body.set("customer", input.customerId);
    }

    if (input.customerEmail) {
      body.set("customer_email", input.customerEmail);
    }

    if (input.planTier) {
      body.set("metadata[planTier]", input.planTier);
    }

    Object.entries(input.metadata ?? {}).forEach(([key, value]) => {
      body.set(`metadata[${key}]`, value);
    });

    return this.createStripeSession("https://api.stripe.com/v1/checkout/sessions", body);
  }

  async createCustomerPortalSession(input: CreatePortalSessionInput): Promise<BillingSessionResult> {
    if (!this.secretKey) {
      throw new Error("STRIPE_SECRET_KEY is required to use the Stripe billing provider.");
    }

    if (!input.customerId.trim()) {
      throw new Error("A customerId is required to open the billing portal.");
    }

    const body = new URLSearchParams({
      customer: input.customerId,
      return_url: input.returnUrl,
    });

    return this.createStripeSession("https://api.stripe.com/v1/billing_portal/sessions", body);
  }

  private async createStripeSession(endpoint: string, body: URLSearchParams): Promise<BillingSessionResult> {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const responseJson = await parseJsonResponse(response);

    if (!response.ok) {
      const parsedError = stripeErrorSchema.safeParse(responseJson);
      const message = parsedError.success
        ? parsedError.data.error?.message
        : `Stripe request failed with status ${response.status}`;

      throw new Error(message ?? `Stripe request failed with status ${response.status}`);
    }

    const session = stripeSessionSchema.parse(responseJson);

    if (!session.url) {
      throw new Error("Stripe created a session without a redirect URL.");
    }

    return {
      id: session.id,
      url: session.url,
      provider: "stripe",
      status: "created",
    };
  }
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Stripe returned a non-JSON response with status ${response.status}.`);
  }
}
