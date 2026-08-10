# PRSPCT

Mobile-first B2B sales prospecting SaaS — Discover → Qualify → Save → Contact → Follow up → Close.

## Stack

- Expo (React Native) + Expo Router + TypeScript
- Supabase (Auth, Postgres + RLS, Storage, Edge Functions)
- TanStack Query · Zustand · Zod · React Hook Form

## Documentation

| Doc | Purpose |
|-----|---------|
| [Requirements](docs/01-requirements-analysis.md) | Product analysis & MVP scope |
| [Architecture](docs/02-architecture.md) | System design |
| [Database](docs/03-database-schema.md) | Schema overview |
| [Roadmap](docs/04-implementation-roadmap.md) | Phased delivery |
| [Security](docs/05-security-privacy.md) | Security & privacy |
| [Folder structure](docs/06-folder-structure.md) | Code layout |

## Getting started

```bash
cp .env.example .env
npm install
npm run start
```

Apply migrations with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase db reset   # local
# or link + push for remote
```

## Scripts

- `npm run start` — Expo dev server
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint
- `npm test` — Jest

## Phase 1 MVP

Auth, workspace, onboarding, dashboard, prospects, companies, lists, tasks, notes, basic pipeline, CSV import, global search, settings.

AI and third-party prospect providers ship as interfaces with mock/noop adapters until Phase 2.
