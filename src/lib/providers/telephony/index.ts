import { DemoTelephonyProvider } from "./demo-provider";
import type { TelephonyProvider } from "./types";

export type {
  CallRecordingResult,
  ClickToCallInput,
  ClickToCallResult,
  GetRecordingInput,
  StartAutodialQueueInput,
  StartAutodialQueueResult,
  TelephonyProvider,
} from "./types";
export { DemoTelephonyProvider } from "./demo-provider";

export function createTelephonyProvider(): TelephonyProvider {
  return new DemoTelephonyProvider();
}

export function getTelephonyProvider(): TelephonyProvider {
  return createTelephonyProvider();
}
