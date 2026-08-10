-- PRSPCT production schema (multi-tenant SaaS)
create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.org_role as enum ('OWNER', 'ADMIN', 'MANAGER', 'SALES_REP', 'VIEWER');
create type public.lead_status as enum (
  'NEW', 'CONTACTED', 'ENGAGED', 'QUALIFIED', 'UNQUALIFIED', 'NURTURE', 'CONVERTED', 'LOST'
);
create type public.lead_temperature as enum ('HOT', 'WARM', 'COLD');
create type public.task_type as enum (
  'CALL', 'EMAIL', 'WHATSAPP', 'MEETING', 'FOLLOW_UP', 'RESEARCH', 'OTHER'
);
create type public.task_status as enum ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
create type public.task_priority as enum ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
create type public.note_entity_type as enum ('PROSPECT', 'COMPANY', 'DEAL');
create type public.activity_type as enum (
  'PROSPECT_CREATED', 'PROSPECT_UPDATED', 'STATUS_CHANGED', 'SCORE_CHANGED',
  'NOTE_ADDED', 'TASK_CREATED', 'TASK_COMPLETED', 'DEAL_CREATED', 'DEAL_STAGE_CHANGED',
  'EMAIL_ACTION', 'CALL_ACTION', 'WHATSAPP_ACTION', 'LIST_ADDED', 'LIST_REMOVED',
  'ASSIGNMENT_CHANGED', 'IMPORT_COMPLETED', 'OTHER'
);
create type public.import_status as enum (
  'PENDING', 'MAPPING', 'VALIDATING', 'READY', 'IMPORTING', 'COMPLETED', 'FAILED'
);
create type public.import_row_status as enum ('VALID', 'DUPLICATE', 'INVALID', 'IMPORTED', 'SKIPPED');
create type public.notification_type as enum (
  'TASK_DUE', 'TASK_OVERDUE', 'LEAD_ASSIGNED', 'DEAL_ASSIGNED', 'STAGE_CHANGED', 'MENTION', 'AUTOMATION', 'SYSTEM'
);
create type public.plan_tier as enum ('FREE', 'PRO', 'TEAM', 'BUSINESS');
create type public.custom_field_type as enum ('TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT', 'MULTI_SELECT', 'URL');
create type public.custom_field_entity as enum ('PROSPECT', 'COMPANY', 'DEAL');

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_org_member(p_org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_org_id and m.user_id = auth.uid() and m.deleted_at is null
  );
$$;

create or replace function public.has_org_role(p_org_id uuid, p_roles public.org_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_org_id and m.user_id = auth.uid()
      and m.deleted_at is null and m.role = any (p_roles)
  );
$$;

grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, public.org_role[]) to authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext,
  full_name text,
  avatar_url text,
  job_title text,
  phone text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  industry text,
  team_size text,
  primary_sales_goal text,
  logo_url text,
  retention_days integer check (retention_days is null or retention_days > 0),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);
create trigger organizations_updated_at before update on public.organizations
for each row execute function public.set_updated_at();

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.org_role not null default 'SALES_REP',
  invited_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (organization_id, user_id)
);
create index organization_members_user_idx on public.organization_members(user_id) where deleted_at is null;
create trigger organization_members_updated_at before update on public.organization_members
for each row execute function public.set_updated_at();

create table public.icp_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null default 'Default ICP',
  target_industries text[] not null default '{}',
  target_countries text[] not null default '{}',
  target_cities text[] not null default '{}',
  company_sizes text[] not null default '{}',
  revenue_ranges text[] not null default '{}',
  job_titles text[] not null default '{}',
  seniorities text[] not null default '{}',
  departments text[] not null default '{}',
  keywords text[] not null default '{}',
  technologies text[] not null default '{}',
  is_default boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  domain text,
  website text,
  industry text,
  description text,
  employee_count integer check (employee_count is null or employee_count >= 0),
  revenue_range text,
  country text,
  state text,
  city text,
  address text,
  linkedin_url text,
  technologies text[] not null default '{}',
  founded_year integer,
  owner_id uuid references public.profiles(id),
  source text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);
create index companies_org_created_idx on public.companies(organization_id, created_at desc) where deleted_at is null;
create index companies_org_name_idx on public.companies(organization_id, lower(name)) where deleted_at is null;

create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  owner_id uuid references public.profiles(id),
  first_name text,
  last_name text,
  full_name text not null,
  job_title text,
  seniority text,
  department text,
  email citext,
  phone text,
  linkedin_url text,
  website text,
  location text,
  city text,
  state text,
  country text,
  industry text,
  source text,
  status public.lead_status not null default 'NEW',
  lead_score integer not null default 0 check (lead_score between 0 and 100),
  lead_temperature public.lead_temperature not null default 'COLD',
  last_contacted_at timestamptz,
  next_followup_at timestamptz,
  enrichment_status text not null default 'NOT_ENRICHED',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);
create index prospects_org_created_idx on public.prospects(organization_id, created_at desc) where deleted_at is null;
create index prospects_org_email_idx on public.prospects(organization_id, email) where deleted_at is null and email is not null;
create index prospects_org_phone_idx on public.prospects(organization_id, phone) where deleted_at is null and phone is not null;
create index prospects_org_status_idx on public.prospects(organization_id, status) where deleted_at is null;

create table public.prospect_lists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  color text,
  is_archived boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique(organization_id, name)
);

create table public.prospect_list_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  list_id uuid not null references public.prospect_lists(id) on delete cascade,
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  added_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  unique(list_id, prospect_id)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(organization_id, name)
);

create table public.prospect_tags (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (prospect_id, tag_id)
);

create table public.pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null default 'Default Pipeline',
  is_default boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  name text not null,
  position integer not null,
  probability integer not null default 0 check (probability between 0 and 100),
  is_won boolean not null default false,
  is_lost boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(pipeline_id, position),
  unique(pipeline_id, name)
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id),
  stage_id uuid not null references public.pipeline_stages(id),
  prospect_id uuid references public.prospects(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  owner_id uuid references public.profiles(id),
  name text not null,
  value_cents bigint not null default 0 check (value_cents >= 0),
  currency text not null default 'USD',
  probability integer check (probability is null or probability between 0 and 100),
  expected_close_date date,
  status text not null default 'OPEN',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);
create index deals_org_stage_idx on public.deals(organization_id, stage_id) where deleted_at is null;

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type public.note_entity_type not null,
  prospect_id uuid references public.prospects(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete cascade,
  body text not null,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid references public.prospects(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  assignee_id uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  task_type public.task_type not null default 'FOLLOW_UP',
  title text not null,
  notes text,
  due_at timestamptz,
  priority public.task_priority not null default 'MEDIUM',
  status public.task_status not null default 'OPEN',
  recurrence_rule text,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);
create index tasks_org_due_idx on public.tasks(organization_id, due_at) where deleted_at is null;

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid references public.prospects(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  actor_id uuid references public.profiles(id),
  activity_type public.activity_type not null,
  title text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);
create index activities_org_created_idx on public.activities(organization_id, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.imports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
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
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.import_rows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  import_id uuid not null references public.imports(id) on delete cascade,
  row_number integer not null,
  raw jsonb not null default '{}'::jsonb,
  normalized jsonb not null default '{}'::jsonb,
  status public.import_row_status not null default 'VALID',
  error_message text,
  prospect_id uuid references public.prospects(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique(import_id, row_number)
);

create table public.custom_fields (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type public.custom_field_entity not null,
  key text not null,
  label text not null,
  field_type public.custom_field_type not null,
  options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(organization_id, entity_type, key)
);

create table public.custom_field_values (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  field_id uuid not null references public.custom_fields(id) on delete cascade,
  prospect_id uuid references public.prospects(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete cascade,
  value jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.automations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  is_active boolean not null default true,
  trigger jsonb not null,
  conditions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  automation_id uuid not null references public.automations(id) on delete cascade,
  status text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id),
  provider text not null,
  purpose text not null,
  input_redacted jsonb not null default '{}'::jsonb,
  output jsonb,
  model text,
  tokens_used integer,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null,
  status text not null default 'disconnected',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(organization_id, provider)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade unique,
  plan public.plan_tier not null default 'FREE',
  status text not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.usage_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric text not null,
  quantity integer not null default 0,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'user'), '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.bootstrap_organization(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_pipeline_id uuid;
begin
  insert into public.pipelines (organization_id, name, is_default)
  values (p_org_id, 'Default Pipeline', true) returning id into v_pipeline_id;
  insert into public.pipeline_stages (organization_id, pipeline_id, name, position, probability, is_won, is_lost) values
    (p_org_id, v_pipeline_id, 'New', 0, 10, false, false),
    (p_org_id, v_pipeline_id, 'Contacted', 1, 20, false, false),
    (p_org_id, v_pipeline_id, 'Engaged', 2, 30, false, false),
    (p_org_id, v_pipeline_id, 'Qualified', 3, 45, false, false),
    (p_org_id, v_pipeline_id, 'Meeting', 4, 55, false, false),
    (p_org_id, v_pipeline_id, 'Proposal', 5, 70, false, false),
    (p_org_id, v_pipeline_id, 'Negotiation', 6, 85, false, false),
    (p_org_id, v_pipeline_id, 'Won', 7, 100, true, false),
    (p_org_id, v_pipeline_id, 'Lost', 8, 0, false, true);
  insert into public.subscriptions (organization_id, plan, status) values (p_org_id, 'FREE', 'active');
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
alter table public.notifications enable row level security;
alter table public.imports enable row level security;
alter table public.import_rows enable row level security;
alter table public.custom_fields enable row level security;
alter table public.custom_field_values enable row level security;
alter table public.automations enable row level security;
alter table public.automation_runs enable row level security;
alter table public.ai_generations enable row level security;
alter table public.integrations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_records enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select on public.profiles for select to authenticated using (
  id = auth.uid() or exists (
    select 1 from public.organization_members me
    join public.organization_members them on them.organization_id = me.organization_id
    where me.user_id = auth.uid() and me.deleted_at is null
      and them.user_id = profiles.id and them.deleted_at is null
  )
);
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy organizations_select on public.organizations for select to authenticated
using (deleted_at is null and public.is_org_member(id));
create policy organizations_insert on public.organizations for insert to authenticated with check (created_by = auth.uid());
create policy organizations_update on public.organizations for update to authenticated
using (public.has_org_role(id, array['OWNER','ADMIN']::public.org_role[]))
with check (public.has_org_role(id, array['OWNER','ADMIN']::public.org_role[]));

create policy organization_members_select on public.organization_members for select to authenticated
using (public.is_org_member(organization_id));
create policy organization_members_insert on public.organization_members for insert to authenticated
with check (user_id = auth.uid() or public.has_org_role(organization_id, array['OWNER','ADMIN']::public.org_role[]));
create policy organization_members_update on public.organization_members for update to authenticated
using (public.has_org_role(organization_id, array['OWNER','ADMIN']::public.org_role[]))
with check (public.has_org_role(organization_id, array['OWNER','ADMIN']::public.org_role[]));

create policy notifications_select on public.notifications for select to authenticated
using (user_id = auth.uid() and public.is_org_member(organization_id));
create policy notifications_update on public.notifications for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array[
    'icp_profiles','companies','prospects','prospect_lists','prospect_list_members','tags','prospect_tags',
    'pipelines','pipeline_stages','deals','notes','tasks','activities','imports','import_rows',
    'custom_fields','custom_field_values','automations','automation_runs','ai_generations','integrations',
    'subscriptions','usage_records','audit_logs'
  ]
  loop
    execute format('create policy %I_select on public.%I for select to authenticated using (public.is_org_member(organization_id))', t, t);
    execute format('create policy %I_insert on public.%I for insert to authenticated with check (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[]))', t, t);
    execute format('create policy %I_update on public.%I for update to authenticated using (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[])) with check (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[]))', t, t);
    execute format('create policy %I_delete on public.%I for delete to authenticated using (public.has_org_role(organization_id, array[''OWNER'',''ADMIN'',''MANAGER'',''SALES_REP'']::public.org_role[]))', t, t);
  end loop;
end $$;
