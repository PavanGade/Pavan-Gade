# Folder structure

```
app/                          # Expo Router screens
  (auth)/                     # Unauthenticated flows
  (onboarding)/               # Post-signup ICP & profile
  (app)/                      # Authenticated shell
    (tabs)/                   # Home, Prospects, Pipeline, Tasks, More
    prospects/ companies/ lists/ deals/ import/ search/ settings/
components/
  ui/                         # Buttons, inputs, states, cards
  layout/                     # Screen, header, tab chrome
constants/                    # Enums, defaults, query keys
features/
  auth/ onboarding/ dashboard/ prospects/ companies/
  lists/ pipeline/ tasks/ notes/ analytics/ settings/
  import/ search/ scoring/ ai/
hooks/                        # Shared hooks
lib/
  supabase/                   # Client, env, typed helpers
  providers/                  # ProspectDataProvider, AIProvider
  errors/ validation/ format/
stores/                       # Zustand (session, theme, ui)
types/                        # Domain + generated DB types
supabase/
  migrations/ seed/ functions/
tests/                        # Unit / integration / e2e stubs
docs/                         # Architecture & product docs
```

## Rules

- Features own screens’ business UI, schemas, and query modules.
- `components/ui` is presentational only — no data fetching.
- Never import Edge Function secrets into `app/` or `features/`.
- Database types live in `types/database.ts` (generated or hand-maintained until CLI codegen is wired).
