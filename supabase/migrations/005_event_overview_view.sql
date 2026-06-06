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
  ai.score AS ai_score,
  ai.recommendation AS ai_recommendation,
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
