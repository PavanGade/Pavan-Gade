export interface SendSmsInput {
  to: string;
  body: string;
  prospectId: string;
}

export interface SendSmsResult {
  messageId: string;
  status: string;
  demo: boolean;
}

export interface SmsProvider {
  sendSms(input: SendSmsInput): Promise<SendSmsResult>;
}
