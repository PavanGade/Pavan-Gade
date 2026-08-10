export type RiskLevel = "Lower" | "Moderate" | "Elevated" | "Variable";

export type OpportunityCategory =
  | "real-estate"
  | "businesses"
  | "startups"
  | "alternatives";

export interface Opportunity {
  id: string;
  number: string;
  title: string;
  category: OpportunityCategory;
  description: string;
  riskLevel: RiskLevel;
  investmentHorizon: string;
  opportunityType: string;
  status: "open" | "coming-soon" | "closed";
  image?: string;
  featured: boolean;
  href?: string;
}

export interface ExplorerCategory {
  id: OpportunityCategory;
  label: string;
  thesis: string;
  characteristics: string[];
  typicalHorizon: string;
  riskConsiderations: string;
  whyItMatters: string;
}

export interface Insight {
  id: string;
  category: string;
  title: string;
  summary: string;
  href: string;
  date?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  isPlaceholder: boolean;
}

export interface StatItem {
  id: string;
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  isPlaceholder: boolean;
}

export interface Principle {
  id: string;
  title: string;
  description: string;
}

export interface ProcessStage {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export type InvestmentInterest =
  | "Real Estate"
  | "Private Businesses"
  | "Startups"
  | "Alternative Investments"
  | "General Investor Network";

export type InvestmentRange =
  | "₹10L–₹25L"
  | "₹25L–₹50L"
  | "₹50L–₹1Cr"
  | "₹1Cr+"
  | "Prefer to discuss";

export interface LeadFormValues {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  investmentInterest: InvestmentInterest | "";
  investmentRange?: InvestmentRange | "";
  message?: string;
}

export type AnalyticsEventName =
  | "page_view"
  | "hero_cta_click"
  | "opportunity_view"
  | "opportunity_category_select"
  | "insight_click"
  | "form_start"
  | "form_submit"
  | "form_success"
  | "phone_click"
  | "whatsapp_click"
  | "nav_cta_click"
  | "final_cta_click";
