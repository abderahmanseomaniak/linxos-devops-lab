-- ──────────────────────────────────────────────
-- AI Scoring Integration — Part 2
-- Insert workflow states (separate transaction
-- so the new enum values are already committed)
-- ──────────────────────────────────────────────

INSERT INTO workflow_states (code, label, description)
VALUES
  ('AI_PROCESSING', 'Analyse IA en cours', 'Analyse par intelligence artificielle en cours'),
  ('SCORED', 'Noté par IA', 'Analyse IA terminée')
ON CONFLICT (code) DO NOTHING;
