import { isEmailConfigured } from "@/lib/env";
import { DemoEmailProvider } from "./demo-provider";
import { ResendEmailProvider } from "./resend-provider";
import type { EmailProvider } from "./types";

export type { EmailProvider, SendEmailInput, SendEmailResult } from "./types";
export { DemoEmailProvider } from "./demo-provider";
export { ResendEmailProvider } from "./resend-provider";

export function createEmailProvider(): EmailProvider {
  return isEmailConfigured() ? new ResendEmailProvider() : new DemoEmailProvider();
}
