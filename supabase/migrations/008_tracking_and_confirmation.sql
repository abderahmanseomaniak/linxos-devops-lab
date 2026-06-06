-- ── Email logs table ─────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id),
  recipient_email text NOT NULL,
  recipient_type text NOT NULL DEFAULT 'APPLICANT',
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- RPC: Track application by code + email
-- Returns all data needed for the applicant tracking page
CREATE OR REPLACE FUNCTION track_application(
  p_code text,
  p_email text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_event_id uuid;
BEGIN
  SELECT e.id INTO v_event_id
  FROM events e
  WHERE e.tracking_code = p_code
    AND (p_email IS NULL OR e.applicant_email = p_email);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  SELECT jsonb_build_object(
    'found', true,
    'event', jsonb_build_object(
      'id', e.id,
      'title', e.title,
      'city', e.city,
      'tracking_code', e.tracking_code,
      'applicant_email', e.applicant_email,
      'start_date', e.start_date,
      'end_date', e.end_date,
      'created_at', e.created_at
    ),
    'club', CASE WHEN c.id IS NOT NULL THEN
      jsonb_build_object('name', c.name, 'city', c.city, 'university', c.university, 'instagram', c.instagram)
    ELSE NULL END,
    'campaign', CASE WHEN camp.id IS NOT NULL THEN
      jsonb_build_object('name', camp.name)
    ELSE NULL END,
    'state', CASE WHEN ws.id IS NOT NULL THEN
      jsonb_build_object('code', ws.code, 'label', ws.label)
    ELSE NULL END,
    'confirmation_form', CASE WHEN cf.id IS NOT NULL THEN
      jsonb_build_object('id', cf.id, 'confirmed_cans', cf.confirmed_cans, 'main_contact_name', cf.main_contact_name)
    ELSE NULL END,
    'shipment_status', s.status,
    'drive_submitted', df.drive_url IS NOT NULL,
    'workflow_history', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', wh.id,
            'old_state', CASE WHEN ws_old.id IS NOT NULL THEN jsonb_build_object('code', ws_old.code, 'label', ws_old.label) ELSE NULL END,
            'new_state', CASE WHEN ws_new.id IS NOT NULL THEN jsonb_build_object('code', ws_new.code, 'label', ws_new.label) ELSE NULL END,
            'comment', wh.comment,
            'created_at', wh.created_at
          )
          ORDER BY wh.created_at ASC
        )
        FROM workflow_history wh
        LEFT JOIN workflow_states ws_old ON ws_old.id = wh.old_state_id
        LEFT JOIN workflow_states ws_new ON ws_new.id = wh.new_state_id
        WHERE wh.event_id = e.id
      ),
      '[]'::jsonb
    )
  )
  FROM events e
  LEFT JOIN clubs c ON c.id = e.club_id
  LEFT JOIN campaigns camp ON camp.id = e.campaign_id
  LEFT JOIN workflow_states ws ON ws.id = e.state_id
  LEFT JOIN confirmation_forms cf ON cf.event_id = e.id
  LEFT JOIN LATERAL (
    SELECT status FROM shipments WHERE event_id = e.id ORDER BY created_at DESC LIMIT 1
  ) s ON true
  LEFT JOIN drive_folders df ON df.event_id = e.id
  WHERE e.id = v_event_id
  INTO v_result;

  RETURN v_result;
END;
$$;

-- RPC: Submit confirmation form (SECURITY DEFINER so anon can use it)
CREATE OR REPLACE FUNCTION submit_confirmation_form(
  p_tracking_code text,
  p_official_instagram text,
  p_confirmed_cans integer,
  p_main_contact_name text,
  p_main_contact_phone text,
  p_main_contact_email text DEFAULT NULL,
  p_logistics_contact_name text DEFAULT NULL,
  p_logistics_contact_phone text DEFAULT NULL,
  p_delivery_address text DEFAULT NULL,
  p_delivery_date date DEFAULT NULL,
  p_reception_time text DEFAULT NULL,
  p_commitment boolean DEFAULT false,
  p_comment text DEFAULT NULL,
  p_drive_url text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id uuid;
  v_confirmation_id uuid;
BEGIN
  SELECT id INTO v_event_id
  FROM events
  WHERE tracking_code = p_tracking_code;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Événement introuvable avec ce code de suivi' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO confirmation_forms (
    event_id, official_instagram, confirmed_cans,
    main_contact_name, main_contact_phone, main_contact_email,
    logistics_contact_name, logistics_contact_phone,
    delivery_address, delivery_date, reception_time,
    commitment, comment
  ) VALUES (
    v_event_id, p_official_instagram, p_confirmed_cans,
    p_main_contact_name, p_main_contact_phone, p_main_contact_email,
    p_logistics_contact_name, p_logistics_contact_phone,
    p_delivery_address, p_delivery_date, p_reception_time,
    p_commitment, p_comment
  )
  RETURNING id INTO v_confirmation_id;

  IF p_drive_url IS NOT NULL THEN
    INSERT INTO drive_folders (event_id, drive_url, drive_complete)
    VALUES (v_event_id, p_drive_url, false);
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'confirmation_id', v_confirmation_id,
    'event_id', v_event_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION track_application TO anon;
GRANT EXECUTE ON FUNCTION submit_confirmation_form TO anon;
