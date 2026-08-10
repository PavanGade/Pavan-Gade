import type {
  ProspectDataProvider,
  ProspectSearchQuery,
  ProspectSearchResult,
} from '@/lib/providers/prospect-data/types';
import { DEMO_PROSPECTS } from '@/lib/mock/demo-data';

function matches(haystack: string | null | undefined, needle?: string): boolean {
  if (!needle) return true;
  return (haystack ?? '').toLowerCase().includes(needle.toLowerCase());
}

/** Local sample/import-backed provider for MVP — not a live data vendor. */
export class MockProspectDataProvider implements ProspectDataProvider {
  readonly name = 'mock';

  async search(query: ProspectSearchQuery): Promise<ProspectSearchResult> {
    const limit = query.limit ?? 20;
    const items = DEMO_PROSPECTS.filter((p) => {
      if (p.organization_id !== query.organizationId && query.organizationId !== 'demo-org') {
        return true; // demo org id alias in mock mode
      }
      const blob = [p.full_name, p.job_title, p.industry, p.location, p.company_name]
        .filter(Boolean)
        .join(' ');
      return (
        matches(blob, query.q) &&
        matches(p.job_title, query.jobTitle) &&
        matches(p.seniority, query.seniority) &&
        matches(p.industry, query.industry) &&
        matches(p.location, query.location)
      );
    }).slice(0, limit);

    return {
      provider: this.name,
      items: items.map((p) => ({
        id: p.id,
        full_name: p.full_name,
        job_title: p.job_title,
        industry: p.industry,
        location: p.location,
        city: p.city,
        country: p.country,
        email: p.email,
        phone: p.phone,
        lead_score: p.lead_score,
        lead_status: p.lead_status,
        avatar_url: p.avatar_url,
        company_id: p.company_id,
        company_name: p.company_name,
      })),
    };
  }
}
