import type {
  BulkWhatsAppTemplateResult,
  SendBulkWhatsAppTemplatesInput,
  SendWhatsAppTemplateInput,
  SendWhatsAppWelcomeMessageInput,
  WhatsAppMessageResult,
  WhatsAppProvider,
} from "./types";

export class DemoWhatsAppProvider implements WhatsAppProvider {
  async sendTemplate(input: SendWhatsAppTemplateInput): Promise<WhatsAppMessageResult> {
    validateTemplateInput(input.to, input.templateName, input.prospectId);

    return {
      messageId: `demo-whatsapp-${stableHash(`${input.to}:${input.templateName}:${input.prospectId}`)}`,
      status: "DEMO_TEMPLATE_QUEUED",
      demo: true,
    };
  }

  async sendBulkTemplates(input: SendBulkWhatsAppTemplatesInput): Promise<BulkWhatsAppTemplateResult> {
    assertNonEmpty(input.templateName, "A WhatsApp templateName is required for a demo bulk send.");

    const recipients = input.recipients.filter(
      (recipient) => recipient.to.trim().length > 0 && recipient.prospectId.trim().length > 0,
    );

    if (recipients.length === 0) {
      throw new Error("At least one WhatsApp recipient is required for a demo bulk send.");
    }

    return {
      queued: recipients.length,
      demo: true,
      note: "DEMO: No WhatsApp messages were sent. Configure the official Meta WhatsApp Cloud API provider for live approved-template delivery.",
    };
  }

  async sendWelcomeMessage(input: SendWhatsAppWelcomeMessageInput): Promise<WhatsAppMessageResult> {
    validateTemplateInput(input.to, "welcome_message", input.prospectId);
    assertNonEmpty(input.name, "A recipient name is required for a demo WhatsApp welcome message.");

    return {
      messageId: `demo-whatsapp-welcome-${stableHash(`${input.to}:${input.prospectId}:${input.name}`)}`,
      status: "DEMO_WELCOME_TEMPLATE_QUEUED",
      demo: true,
    };
  }
}

function validateTemplateInput(to: string, templateName: string, prospectId: string): void {
  assertNonEmpty(to, "A WhatsApp recipient phone number is required.");
  assertNonEmpty(templateName, "A WhatsApp templateName is required.");
  assertNonEmpty(prospectId, "A prospectId is required for WhatsApp template sends.");
}

function assertNonEmpty(value: string, message: string): void {
  if (!value.trim()) {
    throw new Error(message);
  }
}

function stableHash(value: string): string {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16);
}
