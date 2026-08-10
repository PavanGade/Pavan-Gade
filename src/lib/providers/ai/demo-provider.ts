import type {
  AIProvider,
  AnalyzeProspectInput,
  AssistantMessage,
  ChatAssistantInput,
  GenerateOutreachInput,
  OutreachGeneration,
  ProspectAnalysis,
} from "./types";
import {
  assistantMessageSchema,
  outreachGenerationSchema,
  prospectAnalysisSchema,
} from "./schemas";

export class DemoAIProvider implements AIProvider {
  async analyzeProspect(input: AnalyzeProspectInput): Promise<ProspectAnalysis> {
    const prospectName = readString(input.prospect, "fullName") ?? readString(input.prospect, "name") ?? "this prospect";

    return prospectAnalysisSchema.parse({
      summary: `DEMO: ${prospectName} appears to be a plausible prospect based on the sample data available in demo mode.`,
      fitScore: 72,
      buyingSignals: [
        "DEMO: Contact has a relevant role for outbound qualification.",
        "DEMO: Company attributes are sufficient for initial prioritization.",
      ],
      risks: ["DEMO: Live enrichment and AI analysis are disabled until OPENAI_API_KEY is configured."],
      recommendedNextSteps: [
        "DEMO: Verify the prospect's current role.",
        "DEMO: Send a short personalized opener and track engagement.",
      ],
      confidence: 0.65,
    });
  }

  async generateOutreach(input: GenerateOutreachInput): Promise<OutreachGeneration> {
    const prospectName =
      readString(input.prospect, "firstName") ?? readString(input.prospect, "fullName") ?? "there";

    return outreachGenerationSchema.parse({
      subject: "DEMO: Quick idea for your team",
      body: `DEMO: Hi ${prospectName},\n\nThis is sample outreach generated in demo mode for the goal: ${input.goal}. Configure OPENAI_API_KEY to generate live personalized copy.\n\nBest,\nPRSPCT`,
      callToAction: "DEMO: Would you be open to a quick conversation?",
      personalizationNotes: [
        "DEMO: Replace this with live company research when AI is configured.",
        `DEMO: Requested channel was ${input.channel ?? "email"}.`,
      ],
    });
  }

  async chatAssistant(input: ChatAssistantInput): Promise<AssistantMessage> {
    const lastUserMessage = [...input.messages].reverse().find((message) => message.role === "user");

    return assistantMessageSchema.parse({
      message: `DEMO: I received your request${lastUserMessage ? `: "${lastUserMessage.content}"` : ""}. Configure OPENAI_API_KEY for live assistant responses.`,
      suggestedActions: [
        "DEMO: Review ICP fit.",
        "DEMO: Draft outreach.",
        "DEMO: Create a follow-up task.",
      ],
      citations: ["DEMO: No external sources are queried in demo mode."],
    });
  }
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];

  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}
