import { describe, expect, it } from "vitest";
import { LeadTemperature } from "@/types/domain";
import { bandForScore, scoreProspect } from "@/lib/scoring/score-prospect";

describe("scoreProspect", () => {
  it("scores strong ICP matches as HOT", () => {
    const result = scoreProspect(
      {
        jobTitle: "Founder & CEO",
        seniority: "C-Level",
        location: "Bengaluru",
        country: "IN",
        company: { industry: "SaaS", employeeCount: 120 },
        engagement: { emailOpens: 5, replies: 2, meetingsBooked: 1 },
        icpFit: 90,
      },
      {
        icp: {
          targetTitles: ["Founder", "CEO"],
          targetIndustries: ["SaaS"],
          targetLocations: ["Bengaluru", "IN"],
          targetCompanySizes: [{ min: 50, max: 200 }],
          keywords: ["saas"],
        },
      },
    );

    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.band).toBe(LeadTemperature.HOT);
    expect(result.breakdown.length).toBeGreaterThan(0);
  });

  it("bands low scores as COLD", () => {
    const result = scoreProspect({
      jobTitle: "Intern",
      company: { industry: "Agriculture", employeeCount: 5 },
    });
    expect(bandForScore(result.score)).toBe(LeadTemperature.COLD);
  });
});
