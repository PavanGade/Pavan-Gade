import { z } from "zod";
import { serverEnv } from "@/lib/env";
import {
  assistantMessageSchema,
  outreachGenerationSchema,
  prospectAnalysisSchema,
} from "./schemas";
import type {
  AIProvider,
  AnalyzeProspectInput,
  AssistantMessage,
  ChatAssistantInput,
  GenerateOutreachInput,
  OutreachGeneration,
  ProspectAnalysis,
} from "./types";

type OpenAIRole = "system" | "user" | "assistant";

interface OpenAIMessage {
  role: OpenAIRole;
  content: string;
}

export interface OpenAIProviderOptions {
  model?: string;
  apiKey?: string;
}

const openAIChatCompletionSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string().nullable(),
        }),
      }),
    )
    .min(1),
});

const openAIErrorSchema = z.object({
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

export class OpenAIProvider implements AIProvider {
  private readonly model: string;
  private readonly apiKey?: string;

  constructor(options: OpenAIProviderOptions = {}) {
    this.model = options.model ?? "gpt-4o-mini";
    this.apiKey = options.apiKey ?? serverEnv.OPENAI_API_KEY;
  }

  async analyzeProspect(input: AnalyzeProspectInput): Promise<ProspectAnalysis> {
    return this.callJsonModel(
      [
        {
          role: "system",
          content:
            "Analyze the B2B sales prospect. Return only JSON with summary, fitScore, buyingSignals, risks, recommendedNextSteps, and confidence.",
        },
        {
          role: "user",
          content: JSON.stringify(input, null, 2),
        },
      ],
      prospectAnalysisSchema,
    );
  }

  async generateOutreach(input: GenerateOutreachInput): Promise<OutreachGeneration> {
    return this.callJsonModel(
      [
        {
          role: "system",
          content:
            "Generate concise B2B outbound copy. Return only JSON with subject, body, callToAction, and personalizationNotes.",
        },
        {
          role: "user",
          content: JSON.stringify(input, null, 2),
        },
      ],
      outreachGenerationSchema,
    );
  }

  async chatAssistant(input: ChatAssistantInput): Promise<AssistantMessage> {
    return this.callJsonModel(
      [
        {
          role: "system",
          content:
            "You are PRSPCT's sales workflow assistant. Return only JSON with message, suggestedActions, and citations.",
        },
        ...input.messages.map<OpenAIMessage>((message) => ({
          role: message.role,
          content: message.content,
        })),
        ...(input.context
          ? [
              {
                role: "user" as const,
                content: `Additional context:\n${JSON.stringify(input.context, null, 2)}`,
              },
            ]
          : []),
      ],
      assistantMessageSchema,
    );
  }

  private async callJsonModel<T>(messages: OpenAIMessage[], schema: z.ZodType<T>): Promise<T> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is required to use the OpenAI AI provider.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });
    const responseJson = await parseJsonResponse(response);

    if (!response.ok) {
      const parsedError = openAIErrorSchema.safeParse(responseJson);
      const message = parsedError.success
        ? parsedError.data.error?.message
        : `OpenAI request failed with status ${response.status}`;

      throw new Error(message ?? `OpenAI request failed with status ${response.status}`);
    }

    const completion = openAIChatCompletionSchema.parse(responseJson);
    const content = completion.choices[0]?.message.content;

    if (!content) {
      throw new Error("OpenAI returned an empty chat completion.");
    }

    return schema.parse(parseModelJson(content));
  }
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`OpenAI returned a non-JSON response with status ${response.status}.`);
  }
}

function parseModelJson(content: string): unknown {
  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new Error("OpenAI returned content that was not valid JSON.");
  }
}
