import type { EmailProvider, SendEmailInput, SendEmailResult } from "./types";

export class DemoEmailProvider implements EmailProvider {
  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    validateEmailInput(input);

    return {
      id: `demo-email-${stableHash(`${input.subject}:${normalizeRecipients(input.to).join(",")}`)}`,
      provider: "demo",
      status: "demo",
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

function stableHash(value: string): string {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16);
}
