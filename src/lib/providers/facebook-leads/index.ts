import { DemoFacebookLeadProvider } from "./demo-provider";
import type { FacebookLeadProvider } from "./types";

export type {
  ConnectedFacebookPage,
  FacebookLead,
  FacebookLeadProvider,
  SyncFacebookLeadsInput,
  SyncFacebookLeadsResult,
} from "./types";
export { DemoFacebookLeadProvider } from "./demo-provider";

export function createFacebookLeadProvider(): FacebookLeadProvider {
  return new DemoFacebookLeadProvider();
}

export function getFacebookLeadProvider(): FacebookLeadProvider {
  return createFacebookLeadProvider();
}
