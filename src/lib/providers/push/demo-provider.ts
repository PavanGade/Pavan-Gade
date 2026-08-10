import type { PushPermissionResult, PushProvider, SendPushInput, SendPushResult } from "./types";

export class DemoPushProvider implements PushProvider {
  async requestPermission(): Promise<PushPermissionResult> {
    if (!supportsBrowserNotifications()) {
      return {
        permission: "unsupported",
        demo: true,
      };
    }

    const permission =
      window.Notification.permission === "default"
        ? await window.Notification.requestPermission()
        : window.Notification.permission;

    return {
      permission,
      demo: true,
    };
  }

  async send(input: SendPushInput): Promise<SendPushResult> {
    assertNonEmpty(input.title, "A push notification title is required.");
    assertNonEmpty(input.body, "A push notification body is required.");

    const notificationId = `demo-push-${stableHash(`${input.title}:${input.body}:${input.url ?? ""}`)}`;

    if (supportsBrowserNotifications() && window.Notification.permission === "granted") {
      const notification = new window.Notification(input.title, {
        body: input.body,
        tag: notificationId,
      });

      if (input.url) {
        notification.onclick = () => {
          window.open(input.url, "_blank", "noopener,noreferrer");
        };
      }

      return {
        notificationId,
        status: "DEMO_BROWSER_NOTIFICATION_SHOWN",
        demo: true,
      };
    }

    console.info("DEMO_PUSH_NOTIFICATION", {
      title: input.title,
      body: input.body,
      url: input.url,
    });

    return {
      notificationId,
      status: "DEMO_PUSH_LOGGED",
      demo: true,
    };
  }
}

function supportsBrowserNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
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
