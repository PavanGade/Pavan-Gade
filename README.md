# PRSPCT

AI-powered prospecting, sales intelligence, and CRM platform.

**DISCOVER → QUALIFY → ENGAGE → FOLLOW UP → CLOSE**

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- Supabase Auth + PostgreSQL + RLS (production path)
- Demo mode works offline with seeded fictional data (default when Supabase env is unset)
- TanStack Query/Table · Zustand · Zod · React Hook Form · Recharts · dnd-kit · cmdk

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials

| User | Email | Password |
|------|-------|----------|
| Admin | `admin@prspct.demo` | `demo1234` |
| Manager | `manager@prspct.demo` | `demo1234` |
| Sales Rep 1 | `rep1@prspct.demo` | `demo1234` |
| Sales Rep 2 | `rep2@prspct.demo` | `demo1234` |

Any password with length ≥ 6 works for `*@prspct.demo` emails in demo mode.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Critical-flow smoke check |
| `npm run seed` | Print demo seed summary |

## Environment

See `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `OPENAI_API_KEY` (AI live mode)
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `SENTRY_DSN`
- `DATA_PROVIDER_API_KEY`

Never put service-role or provider secrets in client code.

## Architecture highlights

- Multi-tenant org model with RLS migration in `supabase/migrations/`
- Provider adapters: `AIProvider`, `ProspectProvider`, `EmailProvider`, `BillingProvider`
- Rules-based lead scoring with breakdown (not claimed as AI)
- CSV import wizard with mapping, validation, and dedupe
- Command palette (`Cmd/Ctrl+K`)

## Production deployment

1. Create a Supabase project and apply `supabase/migrations/20260326130000_prspct_schema.sql`
2. Set env vars in your host (Vercel recommended)
3. `npm run build && npm run start` (or connect the Git repo to Vercel)
4. Configure Stripe/OpenAI/Resend secrets for live integrations

## Known limitations (demo-first)

- Without Supabase credentials, auth + CRM data persist in browser localStorage via the demo store
- AI/Email/Stripe use clearly labeled demo providers until API keys are set
- Payments never report fake success
- External prospect enrichment uses `MockProspectProvider` until a licensed data provider key is configured
