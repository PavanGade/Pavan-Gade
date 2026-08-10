-- PRSPCT Phase 1 schema: multi-tenant CRM foundation
-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Enums
create type public.org_role as enum (
  'OWNER', 'ADMIN', 'MANAGER', 'SALES_REP', 'VIEWER'
);

create type public.lead_status as enum (
  'NEW', 'CONTACTED', 'ENGAGED', 'QUALIFIED', 'UNQUALIFIED', 'NURTURING'
);

create type public.task_type as enum (
  'CALL', 'EMAIL', 'WHATSAPP', 'MEETING', 'FOLLOW_UP', 'CUSTOM'
);

create type public.task_status as enum (
  'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);

create type public.task_priority as enum (
  'LOW', 'MEDIUM', 'HIGH', 'URGENT'
);

create type public.note_entity_type as enum (
  'PROSPECT', 'COMPANY', 'DEAL'
);

create type public.activity_type as enum (
  'PROSPECT_CREATED',
  'STATUS_CHANGED',
  'NOTE_ADDED',
  'TASK_CREATED',
  'TASK_COMPLETED',
  'EMAIL_ACTION',
  'CALL_ACTION',
  'WHATSAPP_ACTION',
  'DEAL_CREATED',
  'PIPELINE_MOVED',
  'LIST_ADDED',
  'IMPORT_COMPLETED',
  'OTHER'
);

create type public.import_status as enum (
  'PENDING', 'MAPPING', 'VALIDATING', 'READY', 'IMPORTING', 'COMPLETED', 'FAILED'
);

create type public.import_row_status as enum (
  'VALID', 'DUPLICATE', 'INVALID', 'IMPORTED', 'SKIPPED'
);

create type public.notification_type as enum (
  'TASK_DUE', 'FOLLOW_UP_OVERDUE', 'PROSPECT_ASSIGNED', 'DEAL_STAGE_CHANGED', 'MENTION', 'SYSTEM'
);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Membership helpers for RLS
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = p_org_id
      and m.user_id = auth.uid()
      and m.deleted_at is null
  );
$$;

create or replace function public.has_org_role(p_org_id uuid, p_roles public.org_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = p_org_id
      and m.user_id = auth.uid()
      and m.deleted_at is null
      and m.role = any (p_roles)
  );
$$;

revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.has_org_role(uuid, public.org_role[]) from public;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, public.org_role[]) to authenticated;

-- Profiles (1:1 auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email citext,
  full_name text,
  avatar_url text,
  job_title text,
  phone text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  industry text,
  team_size text,
  primary_sales_goal text,
  logo_url text,
  retention_days integer check (retention_days is null or retention_days > 0),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.org_role not null default 'SALES_REP',
  invited_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (organization_id, user_id)
);

create index organization_members_user_idx on public.organization_members (user_id)
  where deleted_at is null;
create index organization_members_org_idx on public.organization_members (organization_id)
  where deleted_at is null;

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function public.set_updated_at();

-- ICP
create table public.icp_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null default 'Default ICP',
  target_industries text[] not null default '{}',
  target_geographies text[] not null default '{}',
  company_sizes text[] not null default '{}',
  revenue_ranges text[] not null default '{}',
  job_titles text[] not null default '{}',
  seniorities text[] not null default '{}',
  keywords text[] not null default '{}',
  is_default boolean not null default true,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index icp_profiles_org_idx on public.icp_profiles (organization_id);
create trigger icp_profiles_set_updated_at
before update on public.icp_profiles
for each row execute function public.set_updated_at();

-- Companies
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  logo_url text,
  website text,
  industry text,
  headquarters text,
  employee_count integer check (employee_count is null or employee_count >= 0),
  revenue_range text,
  description text,
  technologies text[] not null default '{}',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create index companies_org_created_idx on public.companies (organization_id, created_at desc)
  where deleted_at is null;
create index companies_org_name_idx on public.companies (organization_id, lower(name))
  where deleted_at is null;

create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

-- Prospects
create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  company_id uuid references public.companies (id) on delete set null,
  owner_id uuid references public.profiles (id),
  first_name text,
  last_name text,
  full_name text not null,
  job_title text,
  seniority text,
  department text,
  email citext,
  phone text,
  location text,
  city text,
  state text,
  country text,
  industry text,
  linkedin_url text,
  avatar_url text,
  source text,
  lead_status public.lead_status not null default 'NEW',
  lead_score integer not null default 0 check (lead_score between 0 and 100),
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create index prospects_org_created_idx on public.prospects (organization_id, created_at desc)
  where deleted_at is null;
create index prospects_org_email_idx on public.prospects (organization_id, email)
  where deleted_at is null and email is not null;
create index prospects_org_phone_idx on public.prospects (organization_id, phone)
  where deleted_at is null and phone is not null;
create index prospects_org_status_idx on public.prospects (organization_id, lead_status)
  where deleted_at is null;
create index prospects_company_idx on public.prospects (company_id)
  where deleted_at is null;
create index prospects_owner_idx on public.prospects (owner_id)
  where deleted_at is null;

create trigger prospects_set_updated_at
before update on public.prospects
for each row execute function public.set_updated_at();

-- Lists
create table public.prospect_lists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  color text,
  is_archived boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (organization_id, name)
);

create index prospect_lists_org_idx on public.prospect_lists (organization_id)
  where deleted_at is null;

create trigger prospect_lists_set_updated_at
before update on public.prospect_lists
for each row execute function public.set_updated_at();

create table public.prospect_list_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  list_id uuid not null references public.prospect_lists (id) on delete cascade,
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  added_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  unique (list_id, prospect_id)
);

create index prospect_list_members_list_idx on public.prospect_list_members (list_id);
create index prospect_list_members_prospect_idx on public.prospect_list_members (prospect_id);

-- Tags
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, name)
);

create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

create table public.prospect_tags (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (prospect_id, tag_id)
);

-- Pipelines
create table public.pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null default 'Default Pipeline',
  is_default boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger pipelines_set_updated_at
before update on public.pipelines
for each row execute function public.set_updated_at();

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pipeline_id uuid not null references public.pipelines (id) on delete cascade,
  name text not null,
  position integer not null,
  probability integer not null default 0 check (probability between 0 and 100),
  is_won boolean not null default false,
  is_lost boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (pipeline_id, position),
  unique (pipeline_id, name)
);

create trigger pipeline_stages_set_updated_at
before update on public.pipeline_stages
for each row execute function public.set_updated_at();

-- Deals
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pipeline_id uuid not null references public.pipelines (id) on delete restrict,
  stage_id uuid not null references public.pipeline_stages (id) on delete restrict,
  prospect_id uuid references public.prospects (id) on delete set null,
  company_id uuid references public.companies (id) on delete set null,
  owner_id uuid references public.profiles (id),
  title text not null,
  value_cents bigint not null default 0 check (value_cents >= 0),
  currency text not null default 'USD',
  probability integer check (probability is null or probability between 0 and 100),
  expected_close_date date,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create index deals_org_stage_idx on public.deals (organization_id, stage_id)
  where deleted_at is null;
create index deals_org_created_idx on public.deals (organization_id, created_at desc)
  where deleted_at is null;

create trigger deals_set_updated_at
before update on public.deals
for each row execute function public.set_updated_at();

-- Notes
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_type public.note_entity_type not null,
  prospect_id uuid references public.prospects (id) on delete cascade,
  company_id uuid references public.companies (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  body text not null,
  author_id uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  constraint notes_entity_chk check (
    (entity_type = 'PROSPECT' and prospect_id is not null)
    or (entity_type = 'COMPANY' and company_id is not null)
    or (entity_type = 'DEAL' and deal_id is not null)
  )
);

create index notes_prospect_idx on public.notes (prospect_id, created_at desc)
  where deleted_at is null;
create index notes_company_idx on public.notes (company_id, created_at desc)
  where deleted_at is null;
create index notes_deal_idx on public.notes (deal_id, created_at desc)
  where deleted_at is null;

create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

-- Tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prospect_id uuid references public.prospects (id) on delete set null,
  company_id uuid references public.companies (id) on delete set null,
  deal_id uuid references public.deals (id) on delete set null,
  assignee_id uuid references public.profiles (id),
  created_by uuid references public.profiles (id),
  task_type public.task_type not null default 'FOLLOW_UP',
  title text not null,
  notes text,
  due_at timestamptz,
  priority public.task_priority not null default 'MEDIUM',
  status public.task_status not null default 'OPEN',
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create index tasks_org_due_idx on public.tasks (organization_id, due_at)
  where deleted_at is null;
create index tasks_org_status_idx on public.tasks (organization_id, status)
  where deleted_at is null;
create index tasks_assignee_idx on public.tasks (assignee_id, due_at)
  where deleted_at is null;

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- Activities
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prospect_id uuid references public.prospects (id) on delete cascade,
  company_id uuid references public.companies (id) on delete set null,
  deal_id uuid references public.deals (id) on delete set null,
  task_id uuid references public.tasks (id) on delete set null,
  actor_id uuid references public.profiles (id),
  activity_type public.activity_type not null,
  title text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index activities_org_created_idx on public.activities (organization_id, created_at desc);
create index activities_prospect_idx on public.activities (prospect_id, created_at desc);

-- Imports
create table public.imports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  file_name text not null,
  storage_path text,
  status public.import_status not null default 'PENDING',
  column_mapping jsonb not null default '{}'::jsonb,
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  duplicate_rows integer not null default 0,
  invalid_rows integer not null default 0,
  imported_rows integer not null default 0,
  error_message text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger imports_set_updated_at
before update on public.imports
for each row execute function public.set_updated_at();

create table public.import_rows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  import_id uuid not null references public.imports (id) on delete cascade,
  row_number integer not null,
  raw jsonb not null default '{}'::jsonb,
  normalized jsonb not null default '{}'::jsonb,
  status public.import_row_status not null default 'VALID',
  error_message text,
  prospect_id uuid references public.prospects (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (import_id, row_number)
);

create index import_rows_import_status_idx on public.import_rows (import_id, status);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- Integrations & AI audit
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider text not null,
  status text not null default 'disconnected',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, provider)
);

create trigger integrations_set_updated_at
before update on public.integrations
for each row execute function public.set_updated_at();

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.profiles (id),
  provider text not null,
  purpose text not null,
  input_redacted jsonb not null default '{}'::jsonb,
  output jsonb,
  model text,
  tokens_used integer,
  created_at timestamptz not null default timezone('utc', now())
);

create index ai_generations_org_idx on public.ai_generations (organization_id, created_at desc);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Bootstrap org: default pipeline + stages
create or replace function public.bootstrap_organization(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pipeline_id uuid;
begin
  insert into public.pipelines (organization_id, name, is_default)
  values (p_org_id, 'Default Pipeline', true)
  returning id into v_pipeline_id;

  insert into public.pipeline_stages (organization_id, pipeline_id, name, position, probability, is_won, is_lost)
  values
    (p_org_id, v_pipeline_id, 'New', 0, 10, false, false),
    (p_org_id, v_pipeline_id, 'Contacted', 1, 20, false, false),
    (p_org_id, v_pipeline_id, 'Engaged', 2, 30, false, false),
    (p_org_id, v_pipeline_id, 'Qualified', 3, 45, false, false),
    (p_org_id, v_pipeline_id, 'Meeting', 4, 55, false, false),
    (p_org_id, v_pipeline_id, 'Proposal', 5, 70, false, false),
    (p_org_id, v_pipeline_id, 'Negotiation', 6, 85, false, false),
    (p_org_id, v_pipeline_id, 'Won', 7, 100, true, false),
    (p_org_id, v_pipeline_id, 'Lost', 8, 0, false, true);
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.icp_profiles enable row level security;
alter table public.companies enable row level security;
alter table public.prospects enable row level security;
alter table public.prospect_lists enable row level security;
alter table public.prospect_list_members enable row level security;
alter table public.tags enable row level security;
alter table public.prospect_tags enable row level security;
alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.deals enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;
alter table public.imports enable row level security;
alter table public.import_rows enable row level security;
alter table public.notifications enable row level security;
alter table public.integrations enable row level security;
alter table public.ai_generations enable row level security;

-- Profiles
create policy profiles_select_self_or_org on public.profiles
for select to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.organization_members me
    join public.organization_members them
      on them.organization_id = me.organization_id
    where me.user_id = auth.uid()
      and me.deleted_at is null
      and them.user_id = profiles.id
      and them.deleted_at is null
  )
);

create policy profiles_update_self on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Organizations
create policy organizations_select on public.organizations
for select to authenticated
using (deleted_at is null and public.is_org_member(id));

create policy organizations_insert on public.organizations
for insert to authenticated
with check (created_by = auth.uid());

create policy organizations_update on public.organizations
for update to authenticated
using (public.has_org_role(id, array['OWNER','ADMIN']::public.org_role[]))
with check (public.has_org_role(id, array['OWNER','ADMIN']::public.org_role[]));

-- Members
create policy organization_members_select on public.organization_members
for select to authenticated
using (public.is_org_member(organization_id));

create policy organization_members_insert on public.organization_members
for insert to authenticated
with check (
  (user_id = auth.uid())
  or public.has_org_role(organization_id, array['OWNER','ADMIN']::public.org_role[])
);

create policy organization_members_update on public.organization_members
for update to authenticated
using (public.has_org_role(organization_id, array['OWNER','ADMIN']::public.org_role[]))
with check (public.has_org_role(organization_id, array['OWNER','ADMIN']::public.org_role[]));

-- Generic org CRUD policies for writable business tables
do $$
declare
  t text;
begin
  foreach t in array array[
    'icp_profiles','companies','prospects','prospect_lists','prospect_list_members',
    'tags','prospect_tags','pipelines','pipeline_stages','deals','notes','tasks',
    'activities','imports','import_rows','integrations','ai_generations'
  ]
  loop
    execute format(
      'create policy %I_select on public.%I for select to authenticated using (public.is_org_member(organization_id))',
      t, t
    );
    execute format(
      'create policy %I_insert on public.%I for insert to authenticated with check (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[]))',
      t, t
    );
    execute format(
      'create policy %I_update on public.%I for update to authenticated using (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[])) with check (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[]))',
      t, t
    );
    execute format(
      'create policy %I_delete on public.%I for delete to authenticated using (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[]))',
      t, t
    );
  end loop;
end $$;

-- Notifications: user-scoped within org
create policy notifications_select on public.notifications
for select to authenticated
using (user_id = auth.uid() and public.is_org_member(organization_id));

create policy notifications_update on public.notifications
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy notifications_insert on public.notifications
for insert to authenticated
with check (public.has_org_role(organization_id, array['OWNER','ADMIN','MANAGER','SALES_REP']::public.org_role[]));
