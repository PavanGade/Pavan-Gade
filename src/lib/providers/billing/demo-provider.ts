import { clientEnv } from "@/lib/env";
import type {
  BillingProvider,
  BillingSessionResult,
  CreateCheckoutSessionInput,
  CreatePortalSessionInput,
} from "./types";

export class DemoBillingProvider implements BillingProvider {
  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<BillingSessionResult> {
    if (!input.priceId.trim()) {
      throw new Error("A Stripe priceId is required to start checkout.");
    }

    return {
      id: `demo-checkout-${stableHash(input.priceId)}`,
      url: billingUrl("demo-billing-checkout", input.planTier),
      provider: "demo",
      status: "requires_configuration",
    };
  }

  async createCustomerPortalSession(input: CreatePortalSessionInput): Promise<BillingSessionResult> {
    if (!input.customerId.trim()) {
      throw new Error("A customerId is required to open the billing portal.");
    }

    return {
      id: `demo-portal-${stableHash(input.customerId)}`,
      url: billingUrl("demo-billing-portal"),
      provider: "demo",
      status: "requires_configuration",
    };
  }
}

function billingUrl(message: string, planTier: string | undefined = undefined): string {
  const params = new URLSearchParams({ message });

  if (planTier) {
    params.set("plan", planTier);
  }

  const path = `/billing?${params.toString()}`;

  if (!clientEnv.NEXT_PUBLIC_APP_URL) {
    return path;
  }

  return new URL(path, clientEnv.NEXT_PUBLIC_APP_URL).toString();
}

function stableHash(value: string): string {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16);
}
