import { describe, expect, it } from "vitest";
import { pickNextOwner } from "@/lib/distribution/lead-distribution";

describe("lead distribution", () => {
  it("round-robins owners", () => {
    const agents = ["a", "b", "c"];
    const first = pickNextOwner(agents, -1);
    expect(first.ownerId).toBe("a");
    const second = pickNextOwner(agents, first.nextIndex);
    expect(second.ownerId).toBe("b");
    const third = pickNextOwner(agents, second.nextIndex);
    expect(third.ownerId).toBe("c");
    const wrap = pickNextOwner(agents, third.nextIndex);
    expect(wrap.ownerId).toBe("a");
  });

  it("throws without agents", () => {
    expect(() => pickNextOwner([], 0)).toThrow(/agent/i);
  });
});
