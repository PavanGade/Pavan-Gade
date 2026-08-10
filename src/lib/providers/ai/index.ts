import { DemoAIProvider } from "./demo-provider";
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
export {
  assistantMessageSchema,
  outreachGenerationSchema,
  prospectAnalysisSchema,
} from "./schemas";

export function createAIProvider(): AIProvider {
  return new DemoAIProvider();
}

export async function getAIProvider(): Promise<AIProvider> {
  if (typeof window !== "undefined") {
    return new DemoAIProvider();
  }

  const [{ isAiConfigured }, { OpenAIProvider }] = await Promise.all([
    import("@/lib/env"),
    import("./openai-provider"),
  ]);

  return isAiConfigured() ? new OpenAIProvider() : new DemoAIProvider();
}
