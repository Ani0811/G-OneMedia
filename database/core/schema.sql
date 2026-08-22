-- ============================================================
-- G-One Media — Full Database Schema
-- Run this FIRST on a fresh Supabase project
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- TABLE: portfolio_projects
-- Stores the portfolio cards shown in the Portfolio section
-- ─────────────────────────────────────────────────────────────
create table if not exists portfolio_projects (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  type          text not null,         -- 'Websites' | 'AI Agents' | 'Reels' | 'YT Videos' | 'Vlogs'
  category      text not null,         -- e.g. 'Food SaaS • Full Stack'
  description   text not null,
  image         text not null,         -- URL or relative path
  link          text,                  -- External link (videos)
  case_study_slug text,               -- Slug for /portfolio/:slug route
  sort_order    int default 0,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: case_studies
-- Stores detailed case study content for /portfolio/:slug
-- ─────────────────────────────────────────────────────────────
create table if not exists case_studies (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,  -- matches case_study_slug in portfolio_projects
  title         text not null,
  category      text not null,
  hero_image    text not null,
  description   text not null,
  challenge     text not null,
  solution      text not null,
  tech_stack    text[] not null,       -- array of tech names
  metrics       jsonb not null,        -- [{label, value}]
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: bookings
-- Stores Schedule a Call form submissions
-- ─────────────────────────────────────────────────────────────
create table if not exists bookings (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  email         text not null,
  service       text not null,
  budget        text,
  details       text,
  status        text default 'pending',  -- 'pending' | 'confirmed' | 'cancelled'
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: leads
-- Stores Get Started form submissions
-- ─────────────────────────────────────────────────────────────
create table if not exists leads (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  company     text,
  service     text,
  budget      text,
  description text,
  status      text default 'new',  -- 'new' | 'contacted' | 'converted'
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security (RLS) — basic setup
-- ─────────────────────────────────────────────────────────────
alter table portfolio_projects enable row level security;
alter table case_studies enable row level security;
alter table bookings enable row level security;
alter table leads enable row level security;

-- Allow public READ on portfolio and case studies (they are public content)
create policy "Public can read portfolio_projects"
  on portfolio_projects for select using (true);

create policy "Public can read case_studies"
  on case_studies for select using (true);

-- Allow anonymous INSERT for bookings and leads (frontend forms)
create policy "Anyone can insert bookings"
  on bookings for insert with check (true);

create policy "Anyone can insert leads"
  on leads for insert with check (true);

