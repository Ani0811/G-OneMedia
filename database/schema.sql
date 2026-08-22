-- ============================================================
-- G-One Media — Unified Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 0. Cleanup / Drop Unused & Deprecated Tables
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS chat_refund_requests CASCADE;

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- 1. HERO CONTENT (Dynamic Hero section)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_content (
  id SERIAL PRIMARY KEY,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  tagline TEXT,
  image_url TEXT,
  extra_fields JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ─────────────────────────────────────────────────────────────
-- 2. PRICING PACKAGES (Dynamic Tiered Pricing)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_packages (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  original_price_inr TEXT,
  original_price_usd TEXT,
  original_price_eur TEXT,
  price_inr TEXT NOT NULL,
  price_usd TEXT NOT NULL,
  price_eur TEXT NOT NULL,
  period TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ─────────────────────────────────────────────────────────────
-- 3. SERVICES (Individual Services)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  original_price_inr TEXT,
  original_price_usd TEXT,
  original_price_eur TEXT,
  price_inr TEXT NOT NULL,
  price_usd TEXT NOT NULL,
  price_eur TEXT NOT NULL,
  duration TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ─────────────────────────────────────────────────────────────
-- 4. PORTFOLIO PROJECTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT,
  case_study_slug TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 4.1 CLIENT PROJECTS (Dedicated Table)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_name TEXT,
  category TEXT NOT NULL DEFAULT 'Web Application',
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  live_url TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 5. CASE STUDIES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 6. REVIEWS & TESTIMONIALS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  image_url TEXT,
  is_approved BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────────────
-- 7. BOOKINGS & LEADS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  budget TEXT,
  details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT,
  budget TEXT,
  description TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discovery_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  date TEXT,
  time TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 10. TEAM MEMBERS & FOUNDERS (Dynamic Team Management)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  image TEXT,
  bg_image TEXT,
  accent_color TEXT DEFAULT 'cyan',
  email TEXT,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  socials JSONB NOT NULL DEFAULT '[]'::jsonb,
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ─────────────────────────────────────────────────────────────
-- 11. ADMIN USERS & PERMISSION SETTINGS (RBAC)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB NOT NULL DEFAULT '["*"]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public READ
DO $$ BEGIN
  CREATE POLICY "Public Read hero_content" ON hero_content FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Read pricing_packages" ON pricing_packages FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Read services" ON services FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Read portfolio_projects" ON portfolio_projects FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Read client_projects" ON client_projects FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Read case_studies" ON case_studies FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Read team_members" ON team_members FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Public INSERT for contact forms
DO $$ BEGIN
  CREATE POLICY "Public Insert bookings" ON bookings FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Insert leads" ON leads FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Insert discovery_calls" ON discovery_calls FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public Insert reviews" ON reviews FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Authenticated Admin Full Access
DO $$ BEGIN
  CREATE POLICY "Admin All hero_content" ON hero_content FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All pricing_packages" ON pricing_packages FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All services" ON services FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All portfolio_projects" ON portfolio_projects FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All client_projects" ON client_projects FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All case_studies" ON case_studies FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All leads" ON leads FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All discovery_calls" ON discovery_calls FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin All admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────
-- SEED INITIAL HERO CONTENT
-- ─────────────────────────────────────────────────────────────
INSERT INTO hero_content (headline, subheadline, cta_text)
SELECT 'We Help Businesses Grow with High-Converting Websites',
       'G-One Media bridges the gap between Sophisticated Engineering and Compelling Visual Narratives. We design and build elite Digital Ecosystems engineered to capture attention, command authority, and accelerate business growth.',
       'Get Started'
WHERE NOT EXISTS (SELECT 1 FROM hero_content LIMIT 1);
