# PRSPCT — Requirements Analysis

## Product summary

PRSPCT is a mobile-first B2B sales prospecting SaaS that unifies prospect discovery, qualification, CRM, pipeline, follow-ups, and (later) AI assistance into one fast workflow:

**DISCOVER → QUALIFY → SAVE → CONTACT → FOLLOW UP → CLOSE**

## Core user jobs

| Job | MVP (Phase 1) | Later |
|-----|---------------|-------|
| Authenticate & create workspace | Yes | OAuth, SSO |
| Define ICP during onboarding | Yes | Auto-recommendations |
| Add / edit / delete prospects & companies | Yes | Provider-backed discovery |
| Organize into lists | Yes | Smart lists |
| Manage tasks & follow-ups | Yes | Push reminders |
| Notes on prospect/company/deal | Yes | Rich text |
| Basic Kanban pipeline | Yes | Custom stages |
| CSV import with mapping & dedupe | Yes | Enrichment |
| Global search | Yes | Instant/vector |
| Dashboard metrics (local data) | Yes | Advanced analytics |
| AI assistant | Interface only | Edge Function providers |
| External prospect data | `ProspectDataProvider` mock | Licensed providers |

## Non-goals for Phase 1

- Real AI model calls (provider interface + mock only)
- Unauthorized scraping or messaging automation
- Billing, webhooks, public API, custom fields
- Push notifications (architecture stubs only)
- Fabricated contact emails/phones

## Success criteria (Phase 1)

1. Multi-tenant org isolation via RLS — no cross-org reads/writes
2. Critical path works: register → workspace → prospect → task → deal → complete task
3. Mobile-first UI with light/dark tokens, empty/loading/error states
4. Secrets never in client; env validated with Zod
5. TypeScript strict; feature-based modules; no giant screens

## Domain entities (MVP)

`profiles`, `organizations`, `organization_members`, `icp_profiles`, `companies`, `prospects`, `prospect_lists`, `prospect_list_members`, `tags`, `prospect_tags`, `notes`, `tasks`, `pipelines`, `pipeline_stages`, `deals`, `activities`, `imports`, `import_rows`, `notifications`, `integrations`, `ai_generations`

## Constraints

- Expo + React Native + Expo Router
- Supabase (Auth, Postgres, Storage, Edge Functions, Realtime where useful)
- TanStack Query + Zustand + Zod + RHF
- Fictional demo data only
