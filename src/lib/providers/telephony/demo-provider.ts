import type {
  CallRecordingResult,
  ClickToCallInput,
  ClickToCallResult,
  GetRecordingInput,
  StartAutodialQueueInput,
  StartAutodialQueueResult,
  TelephonyProvider,
} from "./types";

export class DemoTelephonyProvider implements TelephonyProvider {
  name = "DEMO Telephony Provider";

  async clickToCall(input: ClickToCallInput): Promise<ClickToCallResult> {
    assertNonEmpty(input.phone, "A phone number is required to start a demo call.");
    assertNonEmpty(input.prospectId, "A prospectId is required to start a demo call.");
    assertNonEmpty(input.userId, "A userId is required to start a demo call.");

    return {
      callId: `demo-call-${stableHash(`${input.phone}:${input.prospectId}:${input.userId}`)}`,
      status: "DEMO_CLICK_TO_CALL_READY",
      demo: true,
    };
  }

  async startAutodialQueue(input: StartAutodialQueueInput): Promise<StartAutodialQueueResult> {
    assertNonEmpty(input.userId, "A userId is required to start a demo autodial queue.");

    const prospectIds = input.prospectIds.map((prospectId) => prospectId.trim()).filter(Boolean);

    if (prospectIds.length === 0) {
      throw new Error("At least one prospectId is required to start a demo autodial queue.");
    }

    return {
      queueId: `demo-autodial-queue-${stableHash(`${input.userId}:${prospectIds.join(",")}`)}`,
      size: prospectIds.length,
      demo: true,
    };
  }

  async getRecording(input: GetRecordingInput): Promise<CallRecordingResult> {
    assertNonEmpty(input.callId, "A callId is required to check a demo recording.");

    return {
      url: null,
      available: false,
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
