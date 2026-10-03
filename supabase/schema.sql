-- ==============================================================================
-- PROJECT #5: COFFEE SHOP FINDER - SUPABASE DATABASE SCHEMA
-- Note: All tables are explicitly prefixed with `cafe_*` so they can safely
-- coexist inside a shared Supabase database without conflicting with other projects.
-- ==============================================================================

-- 1. Coffee Shop Spots Table
CREATE TABLE IF NOT EXISTS cafe_spots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  work_vibe TEXT NOT NULL, -- 'sanctuary' | 'balanced' | 'social-buzz'
  wifi_speed_mbps INT DEFAULT 50,
  wifi_rating TEXT DEFAULT 'solid',
  outlet_density TEXT NOT NULL, -- 'every-seat' | 'plentiful' | 'limited' | 'none'
  noise_level TEXT NOT NULL, -- 'quiet' | 'moderate' | 'lively'
  seating_capacity TEXT NOT NULL,
  has_outdoor_patio BOOLEAN DEFAULT false,
  has_food_menu BOOLEAN DEFAULT false,
  has_vegan_options BOOLEAN DEFAULT false,
  coffee_specialties JSONB DEFAULT '[]'::jsonb,
  price_tier TEXT DEFAULT '$$',
  hours JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC DEFAULT 4.5,
  review_count INT DEFAULT 0,
  live_busyness TEXT DEFAULT 'seats-available',
  busyness_score INT DEFAULT 40,
  last_reported_minutes_ago INT DEFAULT 0,
  insider_tip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Nomad Community Reviews
CREATE TABLE IF NOT EXISTS cafe_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id TEXT REFERENCES cafe_spots(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT,
  rating NUMERIC NOT NULL,
  wifi_rating NUMERIC NOT NULL,
  outlet_rating NUMERIC NOT NULL,
  comment TEXT NOT NULL,
  tip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Live Desk & Wi-Fi Check-ins
CREATE TABLE IF NOT EXISTS cafe_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id TEXT REFERENCES cafe_spots(id) ON DELETE CASCADE,
  busyness TEXT NOT NULL,
  reported_wifi_mbps INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Bookmarked / Favorite Cafés
CREATE TABLE IF NOT EXISTS cafe_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id TEXT REFERENCES cafe_spots(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE cafe_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_favorites ENABLE ROW LEVEL SECURITY;

-- Anonymous public access policies
CREATE POLICY "Public read cafe spots" ON cafe_spots FOR SELECT USING (true);
CREATE POLICY "Public read cafe reviews" ON cafe_reviews FOR SELECT USING (true);
CREATE POLICY "Public insert cafe reviews" ON cafe_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read cafe checkins" ON cafe_checkins FOR SELECT USING (true);
CREATE POLICY "Public insert cafe checkins" ON cafe_checkins FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read cafe favorites" ON cafe_favorites FOR SELECT USING (true);
CREATE POLICY "Public insert cafe favorites" ON cafe_favorites FOR INSERT WITH CHECK (true);
