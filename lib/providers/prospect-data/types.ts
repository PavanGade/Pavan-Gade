import type { Prospect } from '@/types/database';

export type ProspectSearchQuery = {
  organizationId: string;
  q?: string;
  jobTitle?: string;
  seniority?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  keywords?: string[];
  limit?: number;
  cursor?: string;
};

export type ProspectSearchHit = Pick<
  Prospect,
  | 'id'
  | 'full_name'
  | 'job_title'
  | 'industry'
  | 'location'
  | 'city'
  | 'country'
  | 'email'
  | 'phone'
  | 'lead_score'
  | 'lead_status'
  | 'avatar_url'
  | 'company_id'
> & {
  company_name?: string | null;
};

export type ProspectSearchResult = {
  items: ProspectSearchHit[];
  nextCursor?: string;
  provider: string;
};

/**
 * Abstraction for licensed third-party prospect data sources.
 * UI must depend on this interface — never on a specific vendor SDK.
 */
export interface ProspectDataProvider {
  readonly name: string;
  search(query: ProspectSearchQuery): Promise<ProspectSearchResult>;
}
