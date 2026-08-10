# PRSPCT — System Architecture

## High-level topology

```
┌─────────────────────────────────────────────┐
│  Expo App (React Native + Expo Router)      │
│  features/*  ·  components/*  ·  stores/*   │
│  TanStack Query · Zustand · Zod · RHF       │
└───────────────────┬─────────────────────────┘
                    │ HTTPS (anon key only)
┌───────────────────▼─────────────────────────┐
│  Supabase                                    │
│  Auth · Postgres+RLS · Storage · Realtime    │
│  Edge Functions (AI, providers, imports)     │
└───────────────────┬─────────────────────────┘
                    │ service role (server only)
┌───────────────────▼─────────────────────────┐
│  External providers (Phase 2+)               │
│  AIProvider · ProspectDataProvider           │
└─────────────────────────────────────────────┘
```

## Multi-tenancy model

- Every business row carries `organization_id`.
- Access is mediated by `organization_members` membership + `role`.
- RLS policies use `auth.uid()` → member check → org filter.
- Role hierarchy: `OWNER > ADMIN > MANAGER > SALES_REP > VIEWER`.

## Client architecture

### Feature-based modules

Each feature owns: screens, components, hooks, schemas, API queries. Shared UI lives in `components/ui`. Domain types in `types/`.

### State

| Concern | Tool |
|---------|------|
| Server/cache (prospects, tasks…) | TanStack Query |
| Session, active org, theme, UI chrome | Zustand |
| Forms | React Hook Form + Zod |

### Navigation (Expo Router)

```
app/
  (auth)/          login, signup, forgot, reset, verify
  (onboarding)/    profile, company, icp
  (app)/           tabs + stack screens
    (tabs)/        home, prospects, pipeline, tasks, more
    prospects/[id]
    companies/[id]
    lists/[id]
    deals/[id]
    import/
    search/
    settings/
```

## Provider abstractions (Phase 1 stubs)

```ts
interface ProspectDataProvider {
  search(query: ProspectSearchQuery): Promise<ProspectSearchResult>;
}

interface AIProvider {
  generate(request: AIGenerationRequest): Promise<AIGenerationResult>;
}
```

MVP adapters: `MockProspectDataProvider`, `NoopAIProvider`. Real adapters live in Edge Functions only.

## Styling

Design-token ThemeProvider (light/dark) + StyleSheet. Tokens: colors, spacing, typography, radius, shadows, animation, breakpoints. Icons: `lucide-react-native`. Charts (Phase 2 analytics): `react-native-gifted-charts`.

## Realtime usage (selective)

- Task due badges / notification inbox (Phase 2)
- Pipeline board presence (Phase 3)

Phase 1: polling/invalidation via TanStack Query is sufficient.

## Edge Functions (planned)

| Function | Phase | Purpose |
|----------|-------|---------|
| `ai-generate` | 2 | Proxied AI calls |
| `prospect-search` | 2 | Provider-backed discovery |
| `import-process` | 1/2 | Heavy CSV processing |
| `export-workspace` | 1 | GDPR export |
| `delete-account` | 1 | Cascading account deletion |

## Environment

Client: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`  
Server only: `SUPABASE_SERVICE_ROLE_KEY`, AI/provider secrets
