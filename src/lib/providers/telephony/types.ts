export interface ClickToCallInput {
  phone: string;
  prospectId: string;
  userId: string;
}

export interface ClickToCallResult {
  callId: string;
  status: string;
  demo: boolean;
}

export interface StartAutodialQueueInput {
  prospectIds: readonly string[];
  userId: string;
}

export interface StartAutodialQueueResult {
  queueId: string;
  size: number;
  demo: boolean;
}

export interface GetRecordingInput {
  callId: string;
}

export interface CallRecordingResult {
  url: string | null;
  available: boolean;
  demo: boolean;
}

export interface TelephonyProvider {
  name: string;
  clickToCall(input: ClickToCallInput): Promise<ClickToCallResult>;
  startAutodialQueue(input: StartAutodialQueueInput): Promise<StartAutodialQueueResult>;
  getRecording(input: GetRecordingInput): Promise<CallRecordingResult>;
}
