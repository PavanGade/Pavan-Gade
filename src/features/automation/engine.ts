import type { DemoAutomation, DemoDatabase, DemoProspect } from "@/lib/demo/types";

export type AutomationContext = {
  db: DemoDatabase;
  prospect?: DemoProspect;
  event: string;
};

/**
 * Minimal deterministic automation evaluator for demo mode.
 * External email side-effects require a configured EmailProvider.
 */
export function evaluateAutomation(
  automation: DemoAutomation,
  context: AutomationContext,
): { matched: boolean; actions: DemoAutomation["actions"] } {
  if (!automation.isActive) {
    return { matched: false, actions: [] };
  }

  const triggerType =
    typeof automation.trigger === "object" && automation.trigger && "type" in automation.trigger
      ? String((automation.trigger as { type?: string }).type ?? "")
      : String(automation.trigger ?? "");

  const matched = !triggerType || triggerType === context.event || triggerType === "any";
  return { matched, actions: matched ? automation.actions : [] };
}
