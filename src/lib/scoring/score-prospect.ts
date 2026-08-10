import { LeadTemperature } from "@/types/domain";

export type ScoreCategory =
  | "icpMatch"
  | "jobTitle"
  | "industry"
  | "companySize"
  | "location"
  | "engagement";

export type ScoreWeights = Record<ScoreCategory, number>;
export type ScoreBand = "hot" | "warm" | "cold";

export interface ScoreBreakdownItem {
  category: ScoreCategory;
  label: string;
  score: number;
  maxScore: number;
  matched: boolean;
  reason: string;
}

export interface ScoreResult {
  score: number;
  band: LeadTemperature;
  leadScore: number;
  leadTemperature: ScoreBand;
  breakdown: ScoreBreakdownItem[];
}

export interface ScoreCompanyInput {
  name?: string;
  industry?: string;
  employeeCount?: number;
  revenue?: number;
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  description?: string;
}

export interface ScoreEngagementInput {
  emailOpens?: number;
  emailClicks?: number;
  replies?: number;
  meetingsBooked?: number;
  websiteVisits?: number;
}

export interface ScoreProspectInput {
  title?: string;
  jobTitle?: string;
  department?: string;
  seniority?: string;
  location?: string;
  country?: string;
  source?: string;
  status?: string;
  tagIds?: string[];
  company?: ScoreCompanyInput;
  engagement?: ScoreEngagementInput;
  icpFit?: number;
}

export interface CompanySizeRangeInput {
  min?: number;
  max?: number;
}

export interface ScoreIcpInput {
  targetTitles?: string[];
  targetIndustries?: string[];
  targetCompanySizes?: CompanySizeRangeInput[];
  targetLocations?: string[];
  keywords?: string[];
  excludedTitles?: string[];
  excludedIndustries?: string[];
}

export interface ScoreOptions {
  icp?: ScoreIcpInput;
  weights?: Partial<ScoreWeights>;
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  icpMatch: 25,
  jobTitle: 20,
  industry: 15,
  companySize: 10,
  location: 10,
  engagement: 20,
};

const LABELS: Record<ScoreCategory, string> = {
  icpMatch: "ICP Match",
  jobTitle: "Job Title",
  industry: "Industry",
  companySize: "Company Size",
  location: "Location",
  engagement: "Engagement",
};

export function bandForScore(score: number): LeadTemperature {
  if (score >= 80) {
    return LeadTemperature.HOT;
  }

  if (score >= 50) {
    return LeadTemperature.WARM;
  }

  return LeadTemperature.COLD;
}

export function scoreProspect(prospect: ScoreProspectInput, options: ScoreOptions = {}): ScoreResult {
  const weights = { ...DEFAULT_SCORE_WEIGHTS, ...options.weights };
  const icp = normalizeIcp(options.icp);

  const breakdown: ScoreBreakdownItem[] = [
    buildBreakdown("icpMatch", weights.icpMatch, scoreIcpMatch(prospect, icp)),
    buildBreakdown("jobTitle", weights.jobTitle, scoreJobTitle(prospect, icp)),
    buildBreakdown("industry", weights.industry, scoreIndustry(prospect, icp)),
    buildBreakdown("companySize", weights.companySize, scoreCompanySize(prospect, icp)),
    buildBreakdown("location", weights.location, scoreLocation(prospect, icp)),
    buildBreakdown("engagement", weights.engagement, scoreEngagement(prospect)),
  ];

  const score = clamp(
    Math.round(breakdown.reduce((total, item) => total + item.score, 0)),
    0,
    100,
  );

  return {
    score,
    band: bandForScore(score),
    leadScore: score,
    leadTemperature: legacyBandForScore(score),
    breakdown,
  };
}

interface FactorScore {
  ratio: number;
  reason: string;
}

interface NormalizedIcp {
  targetTitles: string[];
  targetIndustries: string[];
  targetCompanySizes: CompanySizeRangeInput[];
  targetLocations: string[];
  keywords: string[];
  excludedTitles: string[];
  excludedIndustries: string[];
}

function buildBreakdown(category: ScoreCategory, maxScore: number, factor: FactorScore): ScoreBreakdownItem {
  const score = Math.round(maxScore * clamp(factor.ratio, 0, 1));

  return {
    category,
    label: LABELS[category],
    score,
    maxScore,
    matched: score > 0,
    reason: factor.reason,
  };
}

function scoreIcpMatch(prospect: ScoreProspectInput, icp: NormalizedIcp): FactorScore {
  if (typeof prospect.icpFit === "number") {
    return {
      ratio: percentageToRatio(prospect.icpFit),
      reason: "Used explicit ICP fit signal.",
    };
  }

  const signals = [
    scoreJobTitle(prospect, icp).ratio,
    scoreIndustry(prospect, icp).ratio,
    scoreCompanySize(prospect, icp).ratio,
    scoreLocation(prospect, icp).ratio,
    scoreKeywordFit(prospect, icp).ratio,
  ];

  const configuredSignals = signals.filter((ratio) => ratio >= 0);

  if (configuredSignals.length === 0) {
    return { ratio: 0.4, reason: "No ICP profile supplied; assigned conservative baseline fit." };
  }

  const ratio =
    configuredSignals.reduce((total, signal) => total + signal, 0) / configuredSignals.length;

  return {
    ratio,
    reason: ratio >= 0.7 ? "Prospect aligns with the configured ICP." : "Prospect has partial ICP alignment.",
  };
}

function scoreJobTitle(prospect: ScoreProspectInput, icp: NormalizedIcp): FactorScore {
  const title = normalizeText(prospect.title ?? prospect.jobTitle);

  if (!title) {
    return { ratio: 0, reason: "No job title available." };
  }

  if (matchesAny(title, icp.excludedTitles)) {
    return { ratio: 0, reason: "Job title matches an excluded ICP title." };
  }

  if (icp.targetTitles.length > 0) {
    if (matchesAny(title, icp.targetTitles)) {
      return { ratio: 1, reason: "Job title matches a target ICP title." };
    }

    return { ratio: 0.25, reason: "Job title is present but does not match target titles." };
  }

  const seniorBuyerTerms = [
    "founder",
    "owner",
    "chief",
    "vp",
    "vice president",
    "head",
    "director",
    "manager",
    "lead",
  ];

  return {
    ratio: matchesAny(title, seniorBuyerTerms) ? 0.8 : 0.45,
    reason: "No target titles configured; scored title seniority heuristically.",
  };
}

function scoreIndustry(prospect: ScoreProspectInput, icp: NormalizedIcp): FactorScore {
  const industry = normalizeText(prospect.company?.industry);

  if (!industry) {
    return { ratio: 0, reason: "No company industry available." };
  }

  if (matchesAny(industry, icp.excludedIndustries)) {
    return { ratio: 0, reason: "Industry matches an excluded ICP industry." };
  }

  if (icp.targetIndustries.length > 0) {
    return matchesAny(industry, icp.targetIndustries)
      ? { ratio: 1, reason: "Industry matches the ICP." }
      : { ratio: 0.2, reason: "Industry is present but outside ICP targets." };
  }

  return { ratio: 0.6, reason: "Industry is available; no target industries configured." };
}

function scoreCompanySize(prospect: ScoreProspectInput, icp: NormalizedIcp): FactorScore {
  const employeeCount = prospect.company?.employeeCount;

  if (typeof employeeCount !== "number" || employeeCount <= 0) {
    return { ratio: 0, reason: "No valid company size available." };
  }

  if (icp.targetCompanySizes.length > 0) {
    return icp.targetCompanySizes.some((range) => isInRange(employeeCount, range))
      ? { ratio: 1, reason: "Company size is within the ICP range." }
      : { ratio: 0.25, reason: "Company size is outside the ICP range." };
  }

  if (employeeCount >= 10 && employeeCount <= 5000) {
    return { ratio: 0.8, reason: "Company size is in a typical B2B selling range." };
  }

  return { ratio: 0.45, reason: "Company size is available but outside the typical range." };
}

function scoreLocation(prospect: ScoreProspectInput, icp: NormalizedIcp): FactorScore {
  const location = normalizeText(
    [
      prospect.location,
      prospect.country,
      prospect.company?.location,
      prospect.company?.city,
      prospect.company?.region,
      prospect.company?.country,
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (!location) {
    return { ratio: 0, reason: "No prospect or company location available." };
  }

  if (icp.targetLocations.length > 0) {
    return matchesAny(location, icp.targetLocations)
      ? { ratio: 1, reason: "Location matches the ICP." }
      : { ratio: 0.2, reason: "Location is present but outside ICP targets." };
  }

  return { ratio: 0.7, reason: "Location is available; no target locations configured." };
}

function scoreKeywordFit(prospect: ScoreProspectInput, icp: NormalizedIcp): FactorScore {
  if (icp.keywords.length === 0) {
    return { ratio: -1, reason: "No ICP keywords configured." };
  }

  const searchableText = normalizeText(
    [
      prospect.title,
      prospect.jobTitle,
      prospect.department,
      prospect.seniority,
      prospect.company?.name,
      prospect.company?.industry,
      prospect.company?.description,
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (!searchableText) {
    return { ratio: 0, reason: "No searchable prospect text available for keyword matching." };
  }

  const matchedKeywords = icp.keywords.filter((keyword) => searchableText.includes(keyword));

  return {
    ratio: matchedKeywords.length / icp.keywords.length,
    reason:
      matchedKeywords.length > 0
        ? `Matched ${matchedKeywords.length} ICP keyword(s).`
        : "No ICP keywords matched.",
  };
}

function scoreEngagement(prospect: ScoreProspectInput): FactorScore {
  const engagement = prospect.engagement;
  const source = normalizeText(prospect.source);
  const status = normalizeText(prospect.status);
  const tagIds = prospect.tagIds ?? [];

  if (!engagement && !source && !status && tagIds.length === 0) {
    return { ratio: 0, reason: "No engagement activity available." };
  }

  const points =
    Math.min(engagement?.emailOpens ?? 0, 5) * 0.06 +
    Math.min(engagement?.emailClicks ?? 0, 3) * 0.1 +
    Math.min(engagement?.websiteVisits ?? 0, 5) * 0.06 +
    Math.min(engagement?.replies ?? 0, 2) * 0.25 +
    Math.min(engagement?.meetingsBooked ?? 0, 1) * 0.4 +
    (["website", "referral", "webinar", "inbound"].includes(source) ? 0.2 : 0) +
    (["engaged", "qualified", "meeting", "proposal", "negotiation"].includes(status) ? 0.2 : 0) +
    (tagIds.includes("tag-high-intent") ? 0.2 : 0);

  return {
    ratio: clamp(points, 0, 1),
    reason: points > 0 ? "Engagement activity indicates buying interest." : "No meaningful engagement recorded.",
  };
}

function normalizeIcp(icp: ScoreIcpInput = {}): NormalizedIcp {
  return {
    targetTitles: normalizeList(icp.targetTitles),
    targetIndustries: normalizeList(icp.targetIndustries),
    targetCompanySizes: icp.targetCompanySizes ?? [],
    targetLocations: normalizeList(icp.targetLocations),
    keywords: normalizeList(icp.keywords),
    excludedTitles: normalizeList(icp.excludedTitles),
    excludedIndustries: normalizeList(icp.excludedIndustries),
  };
}

function normalizeList(values: string[] | undefined): string[] {
  return (values ?? []).map(normalizeText).filter((value) => value.length > 0);
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function matchesAny(value: string, candidates: string[]): boolean {
  return candidates.some((candidate) => value.includes(candidate) || candidate.includes(value));
}

function isInRange(value: number, range: CompanySizeRangeInput): boolean {
  const aboveMinimum = typeof range.min === "number" ? value >= range.min : true;
  const belowMaximum = typeof range.max === "number" ? value <= range.max : true;

  return aboveMinimum && belowMaximum;
}

function percentageToRatio(value: number): number {
  return value > 1 ? clamp(value / 100, 0, 1) : clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function legacyBandForScore(score: number): ScoreBand {
  if (score >= 80) {
    return "hot";
  }

  if (score >= 50) {
    return "warm";
  }

  return "cold";
}
