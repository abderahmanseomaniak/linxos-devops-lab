-- ──────────────────────────────────────────────
-- AI Scoring Integration — Part 1
-- Add new enum values FIRST (must be its own
-- transaction before INSERT can use them)
-- ──────────────────────────────────────────────

-- 1. Enrich ai_analyses table
ALTER TABLE ai_analyses
  ADD COLUMN IF NOT EXISTS risk_level text CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  ADD COLUMN IF NOT EXISTS strengths jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS weaknesses jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS suggested_allocation jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS raw_response jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  ADD COLUMN IF NOT EXISTS error_message text;

-- 2. Add missing enum values to workflow_code
ALTER TYPE workflow_code ADD VALUE IF NOT EXISTS 'AI_PROCESSING';
ALTER TYPE workflow_code ADD VALUE IF NOT EXISTS 'SCORED';
