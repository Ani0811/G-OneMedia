-- ============================================================
-- G-One Media — Database Explorer Queries
-- Handy inspection queries to understand your database schema and data
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. LIST ALL TABLES in the public schema
-- ─────────────────────────────────────────────────────────────
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;


-- ─────────────────────────────────────────────────────────────
-- 2. ROW COUNTS for every table
-- ─────────────────────────────────────────────────────────────
select
  'portfolio_projects' as table_name, count(*) as rows from portfolio_projects
union all
select 'case_studies', count(*) from case_studies
union all
select 'bookings', count(*) from bookings
union all
select 'leads', count(*) from leads
union all
select 'reviews', count(*) from reviews
union all
select 'chat_leads', count(*) from chat_leads
union all
select 'chat_contacts', count(*) from chat_contacts
union all
select 'chat_refund_requests', count(*) from chat_refund_requests
union all
select 'documents', count(*) from documents;


-- ─────────────────────────────────────────────────────────────
-- 3. COLUMN INFO for a specific table
--    Change 'portfolio_projects' to inspect a different table
-- ─────────────────────────────────────────────────────────────
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'portfolio_projects'
order by ordinal_position;


-- ─────────────────────────────────────────────────────────────
-- 4. LIST ALL RLS POLICIES
-- ─────────────────────────────────────────────────────────────
select
  tablename,
  policyname,
  cmd,
  qual
from pg_policies
where schemaname = 'public'
order by tablename, policyname;


-- ─────────────────────────────────────────────────────────────
-- 5. QUICK DATA PREVIEW
-- ─────────────────────────────────────────────────────────────

-- Portfolio projects
select id, title, type, case_study_slug, is_active, sort_order
from portfolio_projects
order by sort_order;

-- Case studies
select id, slug, title, category
from case_studies
order by created_at;

-- Recent client reviews (last 10)
select name, role, rating, is_approved, created_at
from reviews
order by created_at desc
limit 10;

-- Recent bookings (last 10)
select name, email, service, status, created_at
from bookings
order by created_at desc
limit 10;

-- Recent leads (last 10)
select name, email, service, status, created_at
from leads
order by created_at desc
limit 10;


-- Recent AI chat agent leads (last 10)
select name, email, service, type, created_at
from chat_leads
order by created_at desc
limit 10;


-- ─────────────────────────────────────────────────────────────
-- 6. DATABASE SIZE
-- ─────────────────────────────────────────────────────────────
select
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size
from pg_tables
where schemaname = 'public'
order by pg_total_relation_size(schemaname||'.'||tablename) desc;
