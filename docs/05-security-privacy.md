# PRSPCT — Security & Privacy

## Threat model (condensed)

| Asset | Threat | Control |
|-------|--------|---------|
| Org CRM data | Cross-tenant access | RLS on every table; org membership checks |
| Auth sessions | Token theft | Supabase Auth secure storage; short-lived JWTs |
| Secrets | Client exposure | Anon key only in app; service/AI keys in Edge Functions |
| Imports | Malicious CSV | Size limits, Zod validation, typed columns, sanitize |
| File uploads | Path traversal / malware | Storage policies, MIME allowlist, size caps |
| AI payloads | Sensitive overshare | Minimize fields; redact phones/emails unless required; audit `ai_generations` |
| Roles | Privilege escalation | Server-side role checks; only OWNER transfers ownership |

## Row Level Security

- Enabled on all public business tables
- Helper: `is_org_member(org_id)`, `has_org_role(org_id, roles[])`
- VIEWER: SELECT only
- Mutations: SALES_REP+
- Org/billing settings: ADMIN+
- Delete org / transfer ownership: OWNER

## Authorization matrix (MVP)

| Action | Owner | Admin | Manager | Sales Rep | Viewer |
|--------|:-----:|:-----:|:-------:|:---------:|:------:|
| Read org data | ✓ | ✓ | ✓ | ✓ | ✓ |
| CRUD prospects/tasks/deals | ✓ | ✓ | ✓ | ✓ | |
| Manage lists | ✓ | ✓ | ✓ | ✓ | |
| Import CSV | ✓ | ✓ | ✓ | ✓ | |
| Invite/remove members | ✓ | ✓ | | | |
| Change roles | ✓ | ✓* | | | |
| Delete workspace | ✓ | | | | |

\*Admin cannot promote to OWNER or demote OWNER.

## Privacy controls

- Delete prospect / bulk delete (soft delete → hard purge job)
- Export workspace (Edge Function, OWNER/ADMIN)
- Delete account (Edge Function cascades memberships; last OWNER blocked until transfer)
- Data retention settings stub on org (`retention_days`)
- No scraping; no fabricated PII; demo seed uses fictional contacts

## Rate limiting strategy

- Auth: Supabase built-in
- Edge Functions: per-user + per-org token bucket (Phase 2 AI/search)
- Client: disable spam taps; Query mutation debouncing

## Audit

`activities` table records sensitive mutations. Phase 2: append-only `audit_logs` for admin actions (role changes, exports, deletes).

## Safe errors

Never leak SQL, stack traces, or existence of other orgs’ resources. Map to typed `AppError` codes for UI.
