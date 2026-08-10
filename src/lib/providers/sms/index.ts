import { DemoSmsProvider } from "./demo-provider";
import type { SmsProvider } from "./types";

export type { SendSmsInput, SendSmsResult, SmsProvider } from "./types";
export { DemoSmsProvider } from "./demo-provider";

export function buildSmsDeepLink(phone: string, body: string): string {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone) {
    throw new Error("A phone number is required to build an SMS deep link.");
  }

  return `sms:${encodeURIComponent(trimmedPhone)}?body=${encodeURIComponent(body)}`;
}

export function createSmsProvider(): SmsProvider {
  return new DemoSmsProvider();
}

export function getSmsProvider(): SmsProvider {
  return createSmsProvider();
}
