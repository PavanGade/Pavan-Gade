import { DemoWhatsAppProvider } from "./demo-provider";
import type { WhatsAppProvider } from "./types";

export type {
  BulkWhatsAppTemplateResult,
  SendBulkWhatsAppTemplateRecipient,
  SendBulkWhatsAppTemplatesInput,
  SendWhatsAppTemplateInput,
  SendWhatsAppWelcomeMessageInput,
  WhatsAppMessageResult,
  WhatsAppProvider,
  WhatsAppTemplateVariables,
} from "./types";
export { DemoWhatsAppProvider } from "./demo-provider";

export function createWhatsAppProvider(): WhatsAppProvider {
  return new DemoWhatsAppProvider();
}

export function getWhatsAppProvider(): WhatsAppProvider {
  return createWhatsAppProvider();
}
