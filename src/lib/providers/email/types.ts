export interface SendEmailInput {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
}

export interface SendEmailResult {
  id: string;
  provider: "resend" | "demo";
  status: "queued" | "demo";
  delivered: boolean;
}

export interface EmailProvider {
  sendEmail(input: SendEmailInput): Promise<SendEmailResult>;
}
