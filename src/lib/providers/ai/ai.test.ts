import { describe, expect, it } from "vitest";
import { DemoAIProvider } from "@/lib/providers/ai/demo-provider";
import { outreachGenerationSchema, prospectAnalysisSchema } from "@/lib/providers/ai/schemas";

describe("AI providers", () => {
  it("returns Zod-valid demo prospect analysis", async () => {
    const provider = new DemoAIProvider();
    const analysis = await provider.analyzeProspect({
      prospect: {
        fullName: "Ada Example",
        jobTitle: "CEO",
        companyName: "Example Co",
        industry: "SaaS",
        location: "Austin",
      },
      icp: { targetIndustries: ["SaaS"], jobTitles: ["CEO"] },
    });

    expect(prospectAnalysisSchema.parse(analysis).summary.toLowerCase()).toContain("demo");
  });

  it("returns Zod-valid demo outreach", async () => {
    const provider = new DemoAIProvider();
    const outreach = await provider.generateOutreach({
      channel: "email",
      tone: "professional",
      goal: "introduction",
      prospect: { fullName: "Ada Example", jobTitle: "CEO", companyName: "Example Co" },
    });

    expect(outreachGenerationSchema.parse(outreach).subject.toLowerCase()).toContain("demo");
  });
});
