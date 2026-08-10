export type PushPermissionState = NotificationPermission | "unsupported";

export interface PushPermissionResult {
  permission: PushPermissionState;
  demo: boolean;
}

export interface SendPushInput {
  title: string;
  body: string;
  url?: string;
}

export interface SendPushResult {
  notificationId: string;
  status: string;
  demo: boolean;
}

export interface PushProvider {
  requestPermission(): Promise<PushPermissionResult>;
  send(input: SendPushInput): Promise<SendPushResult>;
}
