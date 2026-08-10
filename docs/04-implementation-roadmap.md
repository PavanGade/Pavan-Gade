# PRSPCT — Implementation Roadmap

## Phase 0 — Foundations (this PR)

1. Architecture & security docs
2. Expo app scaffold (Router, TS strict, tokens, UI primitives)
3. Supabase migrations + seed (Acme Growth)
4. Env validation, Supabase client, types
5. Provider interfaces (`ProspectDataProvider`, `AIProvider`)
6. Loading / Empty / Error states

## Phase 1 — MVP modules (order)

| # | Module | Deliverable |
|---|--------|-------------|
| 1 | Auth | Signup, login, forgot/reset, verify, logout, session |
| 2 | Workspace | Org create, membership, role gates |
| 3 | Onboarding | Profile, company, ICP capture |
| 4 | Dashboard | Metrics, tasks due, recent prospects, quick actions |
| 5 | Prospects | CRUD, profile, filters (local), status |
| 6 | Companies | CRUD, employees list |
| 7 | Lists | CRUD, archive, add/remove members, bulk |
| 8 | Notes | Attach to prospect/company/deal |
| 9 | Tasks | Types, Today/Upcoming/Overdue/Completed |
| 10 | Pipeline | Default stages, deals CRUD, stage moves |
| 11 | Activity | Timeline writers on mutations |
| 12 | CSV Import | Map → validate → dedupe → commit |
| 13 | Global search | Prospects, companies, lists, deals |
| 14 | Settings | Profile, org, theme, privacy (export/delete stubs) |
| 15 | Lead score | Rules engine + HOT/WARM/COLD (no AI claim) |

## Phase 2

AI Edge Function + AIProvider, scoring improvements, notifications + push design, advanced analytics, licensed prospect providers, advanced filters, team management UI.

## Phase 3

Official messaging integrations, automations, custom fields/pipelines, workflow builder, webhooks, public API, billing, enterprise.

## Quality gates (every module)

1. `tsc --noEmit`
2. Lint
3. Unit tests for business logic
4. Manual/critical path coverage toward E2E: register → workspace → prospect → task → deal → move → complete
