import {
  bandForScore,
  scoreProspect,
} from '@/features/scoring/score-prospect';

describe('scoreProspect', () => {
  const icp = {
    targetIndustries: ['SaaS'],
    targetGeographies: ['Bengaluru', 'IN'],
    jobTitles: ['Founder', 'CEO'],
    seniorities: ['C-Level'],
    keywords: ['saas'],
    companySizes: ['50-200'],
  };

  it('scores ICP matches higher and labels HOT', () => {
    const result = scoreProspect({
      jobTitle: 'Founder & CEO',
      industry: 'SaaS',
      location: 'Bengaluru, IN',
      seniority: 'C-Level',
      leadStatus: 'QUALIFIED',
      lastContactedAt: new Date().toISOString(),
      icp,
    });
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.band).toBe('HOT');
    expect(result.reasons.some((r) => r.includes('Job title'))).toBe(true);
  });

  it('marks low scores as COLD', () => {
    const result = scoreProspect({
      jobTitle: 'Intern',
      industry: 'Agriculture',
      leadStatus: 'UNQUALIFIED',
      icp,
    });
    expect(result.band).toBe('COLD');
    expect(bandForScore(result.score)).toBe('COLD');
  });
});
