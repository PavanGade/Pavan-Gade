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
): { matched: boolean; actions: string[] } {
  if (!automation.enabled) {
    return { matched: false, actions: [] };
  }

  const trigger = automation.trigger.trim().toLowerCase();
  const event = context.event.trim().toLowerCase();
  const matched =
    !trigger ||
    trigger === "any" ||
    trigger === event ||
    trigger.includes(event) ||
    event.includes(trigger);

  return { matched, actions: matched ? [...automation.actions] : [] };
}
