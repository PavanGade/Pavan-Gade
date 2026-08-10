-- Demo seed for local Supabase (fictional contacts only)
-- Apply after migration. Requires a real auth user for production; this seed
-- is intended for SQL playground / local bootstrap documentation.

-- Prefer using the in-app mock repository for UI demos without a database.
-- This SQL documents the Acme Growth dataset for when auth.users exists.

-- Example (replace USER_ID with auth.users.id):
-- insert into organizations (id, name, industry, team_size, primary_sales_goal, created_by)
-- values (
--   '00000000-0000-4000-8000-000000000001',
--   'Acme Growth',
--   'SaaS',
--   '6-20',
--   'Book qualified meetings',
--   'USER_ID'
-- );
-- insert into organization_members (organization_id, user_id, role)
-- values ('00000000-0000-4000-8000-000000000001', 'USER_ID', 'OWNER');
-- select public.bootstrap_organization('00000000-0000-4000-8000-000000000001');
