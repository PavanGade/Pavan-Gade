import type { LeadStatus } from '@/constants/domain';

export type IcpSignals = {
  targetIndustries: string[];
  targetGeographies: string[];
  jobTitles: string[];
  seniorities: string[];
  keywords: string[];
  companySizes: string[];
};

export type ScoringInput = {
  jobTitle?: string | null;
  industry?: string | null;
  location?: string | null;
  city?: string | null;
  country?: string | null;
  seniority?: string | null;
  leadStatus?: LeadStatus | null;
  lastContactedAt?: string | null;
  companyEmployeeCount?: number | null;
  manualBonus?: number;
  icp?: IcpSignals;
};

export type ScoreBand = 'HOT' | 'WARM' | 'COLD';

export type ScoreResult = {
  score: number;
  band: ScoreBand;
  reasons: string[];
};

function includesLoose(values: string[], candidate?: string | null): boolean {
  if (!candidate) return false;
  const c = candidate.toLowerCase();
  return values.some((v) => c.includes(v.toLowerCase()) || v.toLowerCase().includes(c));
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function bandForScore(score: number): ScoreBand {
  if (score >= 70) return 'HOT';
  if (score >= 40) return 'WARM';
  return 'COLD';
}

/**
 * Rules-based lead scoring (0–100). Not an AI model.
 */
export function scoreProspect(input: ScoringInput): ScoreResult {
  let score = 10;
  const reasons: string[] = ['Base score'];

  const icp = input.icp;

  if (icp && includesLoose(icp.jobTitles, input.jobTitle)) {
    score += 20;
    reasons.push('Job title matches ICP');
  }
  if (icp && includesLoose(icp.seniorities, input.seniority)) {
    score += 10;
    reasons.push('Seniority matches ICP');
  }
  if (icp && includesLoose(icp.targetIndustries, input.industry)) {
    score += 15;
    reasons.push('Industry matches ICP');
  }
  if (
    icp &&
    (includesLoose(icp.targetGeographies, input.location) ||
      includesLoose(icp.targetGeographies, input.city) ||
      includesLoose(icp.targetGeographies, input.country))
  ) {
    score += 10;
    reasons.push('Location matches ICP');
  }

  if (input.companyEmployeeCount != null && icp?.companySizes.length) {
    // Soft signal only — size bands are free-text in MVP ICP.
    score += 5;
    reasons.push('Company size considered');
  }

  switch (input.leadStatus) {
    case 'QUALIFIED':
      score += 15;
      reasons.push('Manually qualified');
      break;
    case 'ENGAGED':
      score += 10;
      reasons.push('Engaged');
      break;
    case 'CONTACTED':
      score += 5;
      reasons.push('Contacted');
      break;
    case 'UNQUALIFIED':
      score -= 20;
      reasons.push('Marked unqualified');
      break;
    default:
      break;
  }

  if (input.lastContactedAt) {
    const days =
      (Date.now() - new Date(input.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days <= 7) {
      score += 8;
      reasons.push('Recent engagement');
    } else if (days > 60) {
      score -= 5;
      reasons.push('Stale contact');
    }
  }

  if (input.manualBonus) {
    score += input.manualBonus;
    reasons.push('Manual adjustment');
  }

  const finalScore = clamp(score);
  return { score: finalScore, band: bandForScore(finalScore), reasons };
}
