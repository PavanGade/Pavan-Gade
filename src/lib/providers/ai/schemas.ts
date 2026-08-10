import { z } from "zod";

export const prospectAnalysisSchema = z.object({
  summary: z.string().min(1),
  fitScore: z.number().min(0).max(100),
  buyingSignals: z.array(z.string()),
  risks: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export const outreachGenerationSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  callToAction: z.string().min(1),
  personalizationNotes: z.array(z.string()),
});

export const assistantMessageSchema = z.object({
  message: z.string().min(1),
  suggestedActions: z.array(z.string()),
  citations: z.array(z.string()),
});
