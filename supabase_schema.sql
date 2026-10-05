-- ==============================================================================
-- PROJECT UNLEASH: SUPABASE DATABASE SCHEMA
-- Project Ref: buhkbqyoligheglutrlc
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/buhkbqyoligheglutrlc/sql/new
-- ==============================================================================

-- 1. STUDIO CONTENT TABLE (Stores Studio Profile, Games, Team, Stats in JSON)
CREATE TABLE IF NOT EXISTS public.studio_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.studio_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the studio content (Public Website)
CREATE POLICY "Allow public read on studio_content"
  ON public.studio_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow upsert/update (Admin or configured anon with project key)
CREATE POLICY "Allow update on studio_content"
  ON public.studio_content
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------

-- 2. VISITOR ANALYTICS TABLE (Tracks anonymous visitors without login/reg)
CREATE TABLE IF NOT EXISTS public.site_visitors (
  visitor_code TEXT PRIMARY KEY,
  visit_count INT DEFAULT 1 NOT NULL,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

-- Allow public upsert/select for tracking
CREATE POLICY "Allow public upsert on site_visitors"
  ON public.site_visitors
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------

-- 3. VISITOR PAGEVIEWS LOG TABLE
CREATE TABLE IF NOT EXISTS public.site_pageviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  visitor_code TEXT NOT NULL,
  path TEXT DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_pageviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on site_pageviews"
  ON public.site_pageviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public select on site_pageviews"
  ON public.site_pageviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ------------------------------------------------------------------------------

-- 4. STORAGE BUCKET FOR ASSETS (Optional: Run in Supabase Storage or via Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('studio-assets', 'studio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access studio-assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'studio-assets');

CREATE POLICY "Public Upload studio-assets"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'studio-assets');
