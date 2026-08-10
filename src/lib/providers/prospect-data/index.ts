import { MockProspectProvider } from "./mock-provider";
import type { ProspectProvider } from "./types";

export type { CompanySearchFilters, ProspectProvider, ProspectSearchFilters } from "./types";
export { MockProspectProvider } from "./mock-provider";

export function createProspectProvider(): ProspectProvider {
  return new MockProspectProvider();
}
