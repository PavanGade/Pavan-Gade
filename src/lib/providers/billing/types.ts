import type { PlanTier } from "@/types/domain";

export interface CreateCheckoutSessionInput {
  priceId: string;
  customerEmail?: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  planTier?: PlanTier;
  metadata?: Record<string, string>;
}

export interface BillingSessionResult {
  id: string;
  url: string;
  provider: "stripe" | "demo";
  status: "created" | "requires_configuration";
}

export interface CreatePortalSessionInput {
  customerId: string;
  returnUrl: string;
}

export interface BillingProvider {
  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<BillingSessionResult>;
  createCustomerPortalSession(input: CreatePortalSessionInput): Promise<BillingSessionResult>;
}
