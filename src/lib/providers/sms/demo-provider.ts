import type { SendSmsInput, SendSmsResult, SmsProvider } from "./types";

export class DemoSmsProvider implements SmsProvider {
  async sendSms(input: SendSmsInput): Promise<SendSmsResult> {
    assertNonEmpty(input.to, "An SMS recipient phone number is required.");
    assertNonEmpty(input.body, "An SMS body is required.");
    assertNonEmpty(input.prospectId, "A prospectId is required for demo SMS sends.");

    return {
      messageId: `demo-sms-${stableHash(`${input.to}:${input.prospectId}:${input.body}`)}`,
      status: "DEMO_SMS_NOT_SENT",
      demo: true,
    };
  }
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
