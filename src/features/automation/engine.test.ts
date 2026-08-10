import { describe, expect, it } from "vitest";
import { evaluateAutomation } from "@/features/automation/engine";
import { createDemoSeed } from "@/lib/demo/seed";

describe("automation engine", () => {
  it("matches active automations by trigger event", () => {
    const seed = createDemoSeed();
    const automation = seed.automations[0];
    if (!automation) throw new Error("expected automation");

    const result = evaluateAutomation(
      { ...automation, enabled: true, trigger: "prospect created" },
      { db: seed, event: "prospect created" },
    );
    expect(result.matched).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
  });

  it("ignores inactive automations", () => {
    const seed = createDemoSeed();
    const automation = seed.automations[0];
    if (!automation) throw new Error("expected automation");
    const result = evaluateAutomation(
      { ...automation, enabled: false },
      { db: seed, event: "any" },
    );
    expect(result.matched).toBe(false);
  });
});
