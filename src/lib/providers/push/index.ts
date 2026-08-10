import { DemoPushProvider } from "./demo-provider";
import type { PushProvider } from "./types";

export type {
  PushPermissionResult,
  PushPermissionState,
  PushProvider,
  SendPushInput,
  SendPushResult,
} from "./types";
export { DemoPushProvider } from "./demo-provider";

export function createPushProvider(): PushProvider {
  return new DemoPushProvider();
}

export function getPushProvider(): PushProvider {
  return createPushProvider();
}
