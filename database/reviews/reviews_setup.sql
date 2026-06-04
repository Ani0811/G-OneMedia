-- ─────────────────────────────────────────────────────────────────────────────
-- G-One Media — Use Case: Client Reviews & Ratings
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT,                        -- Optional: e.g. "CEO, FitFlow"
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  image_url TEXT,                   -- Public URL from Supabase Storage
  is_approved BOOLEAN DEFAULT TRUE  -- Allows moderation; set false to hide
);

-- 2. Index: sort by rating desc, created_at desc (most common query for grid/carousel)
CREATE INDEX IF NOT EXISTS reviews_rating_date_idx
  ON reviews (rating DESC, created_at DESC);

-- 3. Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = TRUE);

-- Anyone can insert a new review (public submission)
CREATE POLICY "Public can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (TRUE);

-- Only authorized admin emails can update reviews
CREATE POLICY "Admins can update reviews"
  ON reviews FOR UPDATE
  USING (auth.jwt() ->> 'email' IN ('anirudha.basuthakur@gmail.com', 'vasudevsharma997@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('anirudha.basuthakur@gmail.com', 'vasudevsharma997@gmail.com'));

-- Only authorized admin emails can delete reviews
CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  USING (auth.jwt() ->> 'email' IN ('anirudha.basuthakur@gmail.com', 'vasudevsharma997@gmail.com'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Storage bucket: review-avatars (run separately in Supabase Storage UI
--    or via this SQL if you have storage schema access)
-- ─────────────────────────────────────────────────────────────────────────────
-- In the Supabase Dashboard → Storage → New Bucket:
--   Name: review-avatars
--   Public: YES
--   File size limit: 2MB
--   Allowed MIME types: image/jpeg, image/png, image/webp
--
-- Then add these Storage policies:
--
-- Policy 1: Allow anyone to upload to review-avatars
--   Operation: INSERT
--   Policy name: "Public can upload review avatars"
--   WITH CHECK: bucket_id = 'review-avatars'
--
-- Policy 2: Allow public read of all files in review-avatars
--   Operation: SELECT
--   Policy name: "Public can view review avatars"
--   USING: bucket_id = 'review-avatars'
-- ─────────────────────────────────────────────────────────────────────────────

-- Seed with a few real-looking starter reviews (optional)
INSERT INTO reviews (name, role, rating, review, image_url) VALUES
  ('Arjun Mehta', 'Founder, NovaTech', 5, 'Our conversions jumped 30% in the 2nd month.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'),
  ('Priya Sharma', 'CEO, FitFlow', 5, 'Professional, fast, and creative. The website and social media content package was exactly what we needed for our launch.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'),
  ('Rahul Verma', 'Director, Luxe Interiors', 5, 'The brand video they created perfectly captures our aesthetic. Clean work, great communication throughout.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150');
