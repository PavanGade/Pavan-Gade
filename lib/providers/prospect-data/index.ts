import { MockProspectDataProvider } from '@/lib/providers/prospect-data/mock-provider';
import type { ProspectDataProvider } from '@/lib/providers/prospect-data/types';

let provider: ProspectDataProvider | null = null;

export function getProspectDataProvider(): ProspectDataProvider {
  if (!provider) {
    // Phase 2: swap for Edge-Function-backed licensed providers.
    provider = new MockProspectDataProvider();
  }
  return provider;
}

export type { ProspectDataProvider, ProspectSearchQuery, ProspectSearchResult } from '@/lib/providers/prospect-data/types';
