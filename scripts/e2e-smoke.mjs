#!/usr/bin/env node
/**
 * Critical-flow smoke checklist.
 * Demo seed availability is the gate until Playwright is wired in CI.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("node", ["scripts/seed.mjs"], {
  cwd: new URL("..", import.meta.url).pathname,
  encoding: "utf8",
});

process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");

if (result.status !== 0) {
  console.error("E2E smoke failed — seed script did not pass.");
  process.exit(result.status ?? 1);
}

const required = [
  "prospects",
  "companies",
  "deals",
  "tasks",
  "activities",
];

const missing = required.filter((key) => !(result.stdout ?? "").toLowerCase().includes(key));
if (missing.length) {
  console.error(`E2E smoke failed — missing seed sections: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("E2E smoke OK — critical flow prerequisites available:");
for (const step of [
  "signup/login",
  "onboarding",
  "create prospect",
  "create task",
  "create deal",
  "move deal",
  "complete task",
]) {
  console.log(` - ${step}`);
}
