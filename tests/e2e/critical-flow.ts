/**
 * Critical E2E flow checklist (Phase 1)
 *
 * Register → create workspace → add prospect → create task → create deal → move deal → mark task complete
 *
 * Wire Maestro / Detox once a device lab is available. Until then, exercise via Expo:
 * 1. Sign up (forces onboarding)
 * 2. Complete profile + ICP
 * 3. Home → Add prospect
 * 4. Prospect → Create task
 * 5. Pipeline → New deal → Move stage
 * 6. Tasks → Mark complete
 */
export const CRITICAL_E2E_STEPS = [
  'register',
  'onboarding',
  'add_prospect',
  'create_task',
  'create_deal',
  'move_deal',
  'complete_task',
] as const;
