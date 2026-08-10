import type { z } from "zod";
import type { JsonObject } from "@/types/domain";
import type {
  assistantMessageSchema,
  outreachGenerationSchema,
  prospectAnalysisSchema,
} from "./schemas";

export type ProspectAnalysis = z.infer<typeof prospectAnalysisSchema>;
export type OutreachGeneration = z.infer<typeof outreachGenerationSchema>;
export type AssistantMessage = z.infer<typeof assistantMessageSchema>;

export interface AnalyzeProspectInput {
  prospect: JsonObject;
  company?: JsonObject;
  icp?: JsonObject;
}

export interface GenerateOutreachInput {
  prospect: JsonObject;
  company?: JsonObject;
  goal: string;
  tone?: "professional" | "friendly" | "concise" | "direct";
  channel?: "email" | "linkedin";
}

export interface ChatAssistantInput {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  context?: JsonObject;
}

export interface AIProvider {
  analyzeProspect(input: AnalyzeProspectInput): Promise<ProspectAnalysis>;
  generateOutreach(input: GenerateOutreachInput): Promise<OutreachGeneration>;
  chatAssistant(input: ChatAssistantInput): Promise<AssistantMessage>;
}
