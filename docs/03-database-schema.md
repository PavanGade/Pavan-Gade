# PRSPCT — Database Schema

## Conventions

- PK: `uuid` default `gen_random_uuid()`
- Tenancy: `organization_id uuid not null` on all business tables
- Timestamps: `created_at`, `updated_at` (trigger-maintained)
- Soft delete where retention matters: `deleted_at` on prospects, companies, lists
- Enums as Postgres enums for status/role fields

## ER overview

```
auth.users 1─1 profiles
profiles ─M─ organization_members ─M─ organizations
organizations 1─1 pipelines 1─N pipeline_stages
organizations 1─N companies 1─N prospects
organizations 1─N prospect_lists N─M prospects
prospects / companies / deals 1─N notes, tasks, activities
organizations 1─N deals → pipeline_stages, prospects, companies
organizations 1─N icp_profiles, imports, notifications, tags
```

## Role enum

`OWNER | ADMIN | MANAGER | SALES_REP | VIEWER`

## Lead status / score band

Status: `NEW | CONTACTED | ENGAGED | QUALIFIED | UNQUALIFIED | NURTURING`  
Score band (derived): HOT (≥70), WARM (40–69), COLD (<40)

## Pipeline default stages

New → Contacted → Engaged → Qualified → Meeting → Proposal → Negotiation → Won → Lost

## RLS pattern

```sql
create policy "org_select" on prospects for select using (
  organization_id in (
    select organization_id from organization_members
    where user_id = auth.uid() and deleted_at is null
  )
);
```

Mutations additionally check role ∈ {OWNER, ADMIN, MANAGER, SALES_REP} (VIEWER read-only).

## Indexes (critical)

- `(organization_id, created_at desc)` on prospects, activities, tasks
- `(organization_id, email)`, `(organization_id, phone)` for dedupe
- `(organization_id, stage_id)` on deals
- `(organization_id, due_at)` on tasks
- GIN/trigram on name/company for search (Phase 1: `ilike` + indexes)

## Migrations layout

See `supabase/migrations/` — numbered, idempotent-friendly, RLS enabled on every public table.
