import { isStripeConfigured } from "@/lib/env";
import { DemoBillingProvider } from "./demo-provider";
import { StripeBillingProvider } from "./stripe-provider";
import type { BillingProvider } from "./types";

export type {
  BillingProvider,
  BillingSessionResult,
  CreateCheckoutSessionInput,
  CreatePortalSessionInput,
} from "./types";
export { DemoBillingProvider } from "./demo-provider";
export { StripeBillingProvider } from "./stripe-provider";

export function createBillingProvider(): BillingProvider {
  return isStripeConfigured() ? new StripeBillingProvider() : new DemoBillingProvider();
}
