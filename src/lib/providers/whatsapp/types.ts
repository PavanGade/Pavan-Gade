export type WhatsAppTemplateVariables = Readonly<Record<string, string>>;

export interface SendWhatsAppTemplateInput {
  to: string;
  templateName: string;
  variables: WhatsAppTemplateVariables;
  prospectId: string;
}

export interface WhatsAppMessageResult {
  messageId: string;
  status: string;
  demo: boolean;
}

export interface SendBulkWhatsAppTemplateRecipient {
  to: string;
  prospectId: string;
  variables: WhatsAppTemplateVariables;
}

export interface SendBulkWhatsAppTemplatesInput {
  recipients: readonly SendBulkWhatsAppTemplateRecipient[];
  templateName: string;
}

export interface BulkWhatsAppTemplateResult {
  queued: number;
  demo: boolean;
  note: string;
}

export interface SendWhatsAppWelcomeMessageInput {
  to: string;
  prospectId: string;
  name: string;
}

export interface WhatsAppProvider {
  /**
   * Sends an approved WhatsApp Business template through the official Meta WhatsApp Cloud API
   * when a production provider is configured. Unofficial automation, scraping, or browser control
   * is not supported.
   */
  sendTemplate(input: SendWhatsAppTemplateInput): Promise<WhatsAppMessageResult>;

  /**
   * Queues approved WhatsApp Business templates through the official Meta WhatsApp Cloud API
   * when a production provider is configured. Unofficial automation, scraping, or browser control
   * is not supported.
   */
  sendBulkTemplates(input: SendBulkWhatsAppTemplatesInput): Promise<BulkWhatsAppTemplateResult>;

  /**
   * Sends an approved welcome template through the official Meta WhatsApp Cloud API when a
   * production provider is configured. Unofficial automation, scraping, or browser control is not
   * supported.
   */
  sendWelcomeMessage(input: SendWhatsAppWelcomeMessageInput): Promise<WhatsAppMessageResult>;
}
