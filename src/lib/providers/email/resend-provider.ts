import { z } from "zod";
import { serverEnv } from "@/lib/env";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "./types";

export interface ResendProviderOptions {
  apiKey?: string;
}

const resendSendResponseSchema = z.object({
  id: z.string(),
});

const resendErrorSchema = z.object({
  message: z.string().optional(),
  name: z.string().optional(),
});

export class ResendEmailProvider implements EmailProvider {
  private readonly apiKey?: string;

  constructor(options: ResendProviderOptions = {}) {
    this.apiKey = options.apiKey ?? serverEnv.RESEND_API_KEY;
  }

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    if (!this.apiKey) {
      throw new Error("RESEND_API_KEY is required to use the Resend email provider.");
    }

    validateEmailInput(input);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: normalizeRecipients(input.to),
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo ? normalizeRecipients(input.replyTo) : undefined,
        cc: input.cc ? normalizeRecipients(input.cc) : undefined,
        bcc: input.bcc ? normalizeRecipients(input.bcc) : undefined,
      }),
    });
    const responseJson = await parseJsonResponse(response);

    if (!response.ok) {
      const parsedError = resendErrorSchema.safeParse(responseJson);
      const message = parsedError.success
        ? parsedError.data.message ?? parsedError.data.name
        : `Resend request failed with status ${response.status}`;

      throw new Error(message ?? `Resend request failed with status ${response.status}`);
    }

    const result = resendSendResponseSchema.parse(responseJson);

    return {
      id: result.id,
      provider: "resend",
      status: "queued",
      delivered: false,
    };
  }
}

function validateEmailInput(input: SendEmailInput): void {
  if (!input.from.trim()) {
    throw new Error("Email sender is required.");
  }

  if (normalizeRecipients(input.to).length === 0) {
    throw new Error("At least one email recipient is required.");
  }

  if (!input.subject.trim()) {
    throw new Error("Email subject is required.");
  }

  if (!input.html && !input.text) {
    throw new Error("Email html or text content is required.");
  }
}

function normalizeRecipients(value: string | string[]): string[] {
  return (Array.isArray(value) ? value : [value]).map((recipient) => recipient.trim()).filter(Boolean);
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Resend returned a non-JSON response with status ${response.status}.`);
  }
}
