import { describe, expect, it } from "vitest";
import { evaluateAutomation } from "@/features/automation/engine";
import { createDemoSeed } from "@/lib/demo/seed";

describe("automation engine", () => {
  it("matches active automations by trigger event", () => {
    const seed = createDemoSeed();
    const automation = seed.automations[0];
    if (!automation) throw new Error("expected automation");

    const result = evaluateAutomation(
      { ...automation, isActive: true, trigger: { type: "prospect_created" } },
      { db: seed, event: "prospect_created" },
    );
    expect(result.matched).toBe(true);
    expect(result.actions.length).toBeGreaterThanOrEqual(0);
  });

  it("ignores inactive automations", () => {
    const seed = createDemoSeed();
    const automation = seed.automations[0];
    if (!automation) throw new Error("expected automation");
    const result = evaluateAutomation(
      { ...automation, isActive: false },
      { db: seed, event: "any" },
    );
    expect(result.matched).toBe(false);
  });
});
