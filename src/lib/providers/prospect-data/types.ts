import type { Company, Prospect } from "@/types/domain";

export interface ProspectSearchFilters {
  query?: string;
  titles?: string[];
  industries?: string[];
  locations?: string[];
  companySizeMin?: number;
  companySizeMax?: number;
  limit?: number;
}

export interface CompanySearchFilters {
  query?: string;
  industries?: string[];
  locations?: string[];
  employeeCountMin?: number;
  employeeCountMax?: number;
  limit?: number;
}

export interface ProspectProvider {
  searchProspects(filters: ProspectSearchFilters): Promise<Prospect[]>;
  getProspect(id: string): Promise<Prospect | null>;
  searchCompanies(filters: CompanySearchFilters): Promise<Company[]>;
  getCompany(id: string): Promise<Company | null>;
  enrichProspect(prospect: Prospect): Promise<Prospect>;
  enrichCompany(company: Company): Promise<Company>;
}
