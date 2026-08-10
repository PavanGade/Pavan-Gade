import { describe, expect, it } from "vitest";
import { createDemoSeed } from "@/lib/demo/seed";

describe("demo seed", () => {
  it("creates a full demo workspace", () => {
    const seed = createDemoSeed();
    expect(seed.organization.name).toBe("PRSPCT Demo");
    expect(seed.prospects.length).toBeGreaterThanOrEqual(100);
    expect(seed.companies.length).toBeGreaterThanOrEqual(30);
    expect(seed.deals.length).toBeGreaterThanOrEqual(15);
    expect(seed.tasks.length).toBeGreaterThanOrEqual(20);
    expect(seed.activities.length).toBeGreaterThanOrEqual(50);
    expect(seed.users.some((user) => user.email === "admin@prspct.demo")).toBe(true);
  });
});
