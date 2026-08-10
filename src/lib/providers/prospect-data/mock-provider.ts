import { LeadStatus, LeadTemperature, type Company, type Prospect } from "@/types/domain";
import type { CompanySearchFilters, ProspectProvider, ProspectSearchFilters } from "./types";

const now = "2026-01-01T00:00:00.000Z";

const mockCompanies: Company[] = [
  {
    id: "mock-company-acme",
    name: "Acme Analytics",
    domain: "acme.example",
    website: "https://acme.example",
    linkedinUrl: "https://www.linkedin.com/company/acme-analytics",
    industry: "Software",
    employeeCount: 180,
    country: "United States",
    region: "CA",
    city: "San Francisco",
    description: "DEMO: A sample software company used by the mock prospect data provider.",
    technologies: ["Next.js", "PostgreSQL", "Stripe"],
    metadata: { demo: true },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mock-company-northstar",
    name: "Northstar Manufacturing",
    domain: "northstar.example",
    website: "https://northstar.example",
    linkedinUrl: "https://www.linkedin.com/company/northstar-manufacturing",
    industry: "Manufacturing",
    employeeCount: 850,
    country: "United States",
    region: "IL",
    city: "Chicago",
    description: "DEMO: A sample manufacturing company for search and enrichment flows.",
    technologies: ["Salesforce", "NetSuite"],
    metadata: { demo: true },
    createdAt: now,
    updatedAt: now,
  },
];

const mockProspects: Prospect[] = [
  {
    id: "mock-prospect-jordan-lee",
    companyId: "mock-company-acme",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan.lee@acme.example",
    phone: "14155550100",
    linkedinUrl: "https://www.linkedin.com/in/jordan-lee-demo",
    title: "VP of Revenue",
    department: "Sales",
    seniority: "Executive",
    location: "San Francisco, CA",
    leadStatus: LeadStatus.NEW,
    temperature: LeadTemperature.WARM,
    score: 74,
    source: "mock-provider",
    company: mockCompanies[0],
    metadata: { demo: true },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mock-prospect-morgan-patel",
    companyId: "mock-company-northstar",
    firstName: "Morgan",
    lastName: "Patel",
    email: "morgan.patel@northstar.example",
    linkedinUrl: "https://www.linkedin.com/in/morgan-patel-demo",
    title: "Director of Operations",
    department: "Operations",
    seniority: "Director",
    location: "Chicago, IL",
    leadStatus: LeadStatus.NEW,
    temperature: LeadTemperature.COLD,
    score: 58,
    source: "mock-provider",
    company: mockCompanies[1],
    metadata: { demo: true },
    createdAt: now,
    updatedAt: now,
  },
];

export class MockProspectProvider implements ProspectProvider {
  async searchProspects(filters: ProspectSearchFilters): Promise<Prospect[]> {
    return filterProspects(mockProspects, filters).slice(0, filters.limit ?? 25);
  }

  async getProspect(id: string): Promise<Prospect | null> {
    return mockProspects.find((prospect) => prospect.id === id) ?? null;
  }

  async searchCompanies(filters: CompanySearchFilters): Promise<Company[]> {
    return filterCompanies(mockCompanies, filters).slice(0, filters.limit ?? 25);
  }

  async getCompany(id: string): Promise<Company | null> {
    return mockCompanies.find((company) => company.id === id) ?? null;
  }

  async enrichProspect(prospect: Prospect): Promise<Prospect> {
    return {
      ...prospect,
      metadata: {
        ...(prospect.metadata ?? {}),
        demoEnriched: true,
      },
      enrichedAt: now,
      updatedAt: now,
    };
  }

  async enrichCompany(company: Company): Promise<Company> {
    return {
      ...company,
      metadata: {
        ...(company.metadata ?? {}),
        demoEnriched: true,
      },
      enrichedAt: now,
      updatedAt: now,
    };
  }
}

function filterProspects(prospects: Prospect[], filters: ProspectSearchFilters): Prospect[] {
  return prospects.filter((prospect) => {
    const company = prospect.company;
    const searchable = normalize(
      [prospect.firstName, prospect.lastName, prospect.email, prospect.title, company?.name].join(" "),
    );

    return (
      matchesQuery(searchable, filters.query) &&
      matchesAnyFilter(prospect.title, filters.titles) &&
      matchesAnyFilter(company?.industry, filters.industries) &&
      matchesAnyFilter(prospect.location, filters.locations) &&
      matchesNumberRange(company?.employeeCount, filters.companySizeMin, filters.companySizeMax)
    );
  });
}

function filterCompanies(companies: Company[], filters: CompanySearchFilters): Company[] {
  return companies.filter((company) => {
    const searchable = normalize([company.name, company.domain, company.industry, company.city].join(" "));

    return (
      matchesQuery(searchable, filters.query) &&
      matchesAnyFilter(company.industry, filters.industries) &&
      matchesAnyFilter([company.city, company.region, company.country].filter(Boolean).join(" "), filters.locations) &&
      matchesNumberRange(company.employeeCount, filters.employeeCountMin, filters.employeeCountMax)
    );
  });
}

function matchesQuery(searchable: string, query: string | undefined): boolean {
  return !query || searchable.includes(normalize(query));
}

function matchesAnyFilter(value: string | undefined, filters: string[] | undefined): boolean {
  if (!filters || filters.length === 0) {
    return true;
  }

  const normalizedValue = normalize(value ?? "");

  return filters.some((filter) => normalizedValue.includes(normalize(filter)));
}

function matchesNumberRange(value: number | undefined, min: number | undefined, max: number | undefined): boolean {
  if (typeof value !== "number") {
    return min === undefined && max === undefined;
  }

  return (min === undefined || value >= min) && (max === undefined || value <= max);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
