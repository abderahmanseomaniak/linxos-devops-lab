-- Grant REST API access to anon and authenticated roles
-- Required for the Supabase Data API (PostgREST) to serve these tables

-- Schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Table access for all current tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Sequence access (for auto-increment columns)
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
