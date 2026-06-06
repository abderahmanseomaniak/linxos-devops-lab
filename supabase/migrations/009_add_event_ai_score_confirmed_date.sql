-- Add score_ai and date_confirme to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS score_ai numeric DEFAULT NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS date_confirme timestamp with time zone DEFAULT NULL;

-- Update accept_event RPC to set date_confirme
CREATE OR REPLACE FUNCTION accept_event(
  p_event_id uuid,
  p_user_id uuid,
  p_comment text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_result jsonb;
BEGIN
  v_result := transition_event_state(p_event_id, 'APPROVED', p_user_id, p_comment);

  UPDATE events SET date_confirme = now() WHERE id = p_event_id;

  RETURN v_result;
END;
$$;

-- Update event_overview_view to include score_ai and date_confirme
CREATE OR REPLACE VIEW event_overview_view AS
SELECT
  e.id,
  e.title AS event_title,
  c.name AS club_name,
  c.id AS club_id,
  e.city,
  camp.name AS campaign_name,
  camp.id AS campaign_id,
  ws.label AS workflow_label,
  ws.code AS workflow_code,
  ws.id AS state_id,
  e.score_ai,
  ai.score AS ai_score,
  ai.recommendation AS ai_recommendation,
  e.date_confirme,
  alloc.allocated_quantity,
  cf.id IS NOT NULL AS confirmation_completed,
  s.status AS shipment_status,
  df.drive_url IS NOT NULL AS drive_submitted,
  (SELECT count(*) FROM ugc_contents uc WHERE uc.event_id = e.id) AS ugc_count,
  e.created_at,
  e.tracking_code,
  e.start_date,
  e.end_date,
  e.applicant_email
FROM events e
LEFT JOIN clubs c ON c.id = e.club_id
LEFT JOIN campaigns camp ON camp.id = e.campaign_id
LEFT JOIN workflow_states ws ON ws.id = e.state_id
LEFT JOIN LATERAL (
  SELECT ai_analyses.score, ai_analyses.recommendation
  FROM ai_analyses
  WHERE ai_analyses.event_id = e.id
  ORDER BY ai_analyses.created_at DESC
  LIMIT 1
) ai ON true
LEFT JOIN LATERAL (
  SELECT allocated_quantity
  FROM allocations
  WHERE allocations.event_id = e.id
  ORDER BY allocations.created_at DESC
  LIMIT 1
) alloc ON true
LEFT JOIN LATERAL (
  SELECT status
  FROM shipments
  WHERE shipments.event_id = e.id
  ORDER BY shipments.created_at DESC
  LIMIT 1
) s ON true
LEFT JOIN confirmation_forms cf ON cf.event_id = e.id
LEFT JOIN drive_folders df ON df.event_id = e.id;

COMMENT ON VIEW event_overview_view IS 'Vue agrégée des événements avec données du workflow, scoring, logistique et UGC.';

-- Auto-update events.score_ai when AI analysis is created
CREATE OR REPLACE FUNCTION update_event_score_ai()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE events SET score_ai = NEW.score WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_event_score_ai ON ai_analyses;
CREATE TRIGGER trg_update_event_score_ai
  AFTER INSERT ON ai_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_event_score_ai();
