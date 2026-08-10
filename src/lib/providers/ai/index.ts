import { isAiConfigured } from "@/lib/env";
import { DemoAIProvider } from "./demo-provider";
import { OpenAIProvider } from "./openai-provider";
import type { AIProvider } from "./types";

export type {
  AIProvider,
  AnalyzeProspectInput,
  AssistantMessage,
  ChatAssistantInput,
  GenerateOutreachInput,
  OutreachGeneration,
  ProspectAnalysis,
} from "./types";
export { DemoAIProvider } from "./demo-provider";
export { OpenAIProvider } from "./openai-provider";
export {
  assistantMessageSchema,
  outreachGenerationSchema,
  prospectAnalysisSchema,
} from "./schemas";

export function createAIProvider(): AIProvider {
  return isAiConfigured() ? new OpenAIProvider() : new DemoAIProvider();
}
