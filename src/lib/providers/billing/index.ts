import { DemoBillingProvider } from "./demo-provider";
import type { BillingProvider } from "./types";

export type {
  BillingProvider,
  BillingSessionResult,
  CreateCheckoutSessionInput,
  CreatePortalSessionInput,
} from "./types";
export { DemoBillingProvider } from "./demo-provider";

export function createBillingProvider(): BillingProvider {
  return new DemoBillingProvider();
}

export async function getBillingProvider(): Promise<BillingProvider> {
  if (typeof window !== "undefined") {
    return new DemoBillingProvider();
  }

  const [{ isStripeConfigured }, { StripeBillingProvider }] = await Promise.all([
    import("@/lib/env"),
    import("./stripe-provider"),
  ]);

  return isStripeConfigured() ? new StripeBillingProvider() : new DemoBillingProvider();
}
