-- RPC functions for Events workflow actions
-- Run in Supabase SQL Editor
-- Requires: workflow_states, events, workflow_history, allocations, shipments, shipment_items, content_verifications

-- ── Ensure new workflow states exist ─────────────
INSERT INTO workflow_states (code, label, description) VALUES
  ('UNDER_REVIEW', 'En révision', 'En cours de révision par le sponsoring'),
  ('CONFIRMED', 'Confirmé', 'Formulaire de confirmation soumis'),
  ('SHIPPED', 'Expédié', 'Colis expédié'),
  ('COMPLETED', 'Terminé', 'Événement terminé')
ON CONFLICT (code) DO NOTHING;

-- ── Helper: transition event state ────────────────
CREATE OR REPLACE FUNCTION transition_event_state(
  p_event_id uuid,
  p_target_code text,
  p_user_id uuid,
  p_comment text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_state_id uuid;
  v_new_state_id uuid;
BEGIN
  SELECT state_id INTO v_old_state_id
  FROM events WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT id INTO v_new_state_id
  FROM workflow_states WHERE code = p_target_code;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workflow state "%" not found', p_target_code USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment)
  VALUES (p_event_id, v_old_state_id, v_new_state_id, p_user_id, p_comment);

  UPDATE events SET state_id = v_new_state_id WHERE id = p_event_id;

  RETURN jsonb_build_object(
    'event_id', p_event_id,
    'old_state_id', v_old_state_id,
    'new_state_id', v_new_state_id
  );
END;
$$;

-- ── 1. Accept event (UNDER_REVIEW → APPROVED) ────
CREATE OR REPLACE FUNCTION accept_event(
  p_event_id uuid,
  p_user_id uuid,
  p_comment text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN transition_event_state(p_event_id, 'APPROVED', p_user_id, p_comment);
END;
$$;

-- ── 2. Reject event (any → REJECTED) ─────────────
CREATE OR REPLACE FUNCTION reject_event(
  p_event_id uuid,
  p_user_id uuid,
  p_comment text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN transition_event_state(p_event_id, 'REJECTED', p_user_id, p_comment);
END;
$$;

-- ── 3. Ask clarification (any → SUBMITTED) ────────
CREATE OR REPLACE FUNCTION ask_clarification(
  p_event_id uuid,
  p_user_id uuid,
  p_comment text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN transition_event_state(p_event_id, 'SUBMITTED', p_user_id, p_comment);
END;
$$;

-- ── 4. Create allocation (APPROVED → CONFIRMED) ───
CREATE OR REPLACE FUNCTION create_allocation(
  p_event_id uuid,
  p_campaign_id uuid,
  p_quantity integer,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_allocation_id uuid;
  v_result jsonb;
BEGIN
  -- Insert allocation
  INSERT INTO allocations (event_id, campaign_id, allocated_quantity, approved_by)
  VALUES (p_event_id, p_campaign_id, p_quantity, p_user_id)
  RETURNING id INTO v_allocation_id;

  -- Transition event state to CONFIRMED
  PERFORM transition_event_state(p_event_id, 'CONFIRMED', p_user_id, 'Allocation créée');

  v_result = jsonb_build_object(
    'allocation_id', v_allocation_id,
    'event_id', p_event_id
  );
  RETURN v_result;
END;
$$;

-- ── 5. Create shipment (CONFIRMED → SHIPPED) ─────
CREATE OR REPLACE FUNCTION create_shipment(
  p_event_id uuid,
  p_allocation_id uuid DEFAULT NULL,
  p_tracking_code text,
  p_items jsonb DEFAULT '[]'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_shipment_id uuid;
  v_item jsonb;
BEGIN
  -- Create shipment
  INSERT INTO shipments (event_id, allocation_id, tracking_code, status)
  VALUES (p_event_id, p_allocation_id, p_tracking_code, 'PREPARING')
  RETURNING id INTO v_shipment_id;

  -- Insert items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO shipment_items (shipment_id, product_id, quantity)
    VALUES (
      v_shipment_id,
      (v_item->>'product_id')::uuid,
      (v_item->>'quantity')::integer
    );
  END LOOP;

  RETURN jsonb_build_object(
    'shipment_id', v_shipment_id,
    'event_id', p_event_id
  );
END;
$$;

-- ── 6. Update shipment status ────────────────────
CREATE OR REPLACE FUNCTION update_shipment_status(
  p_shipment_id uuid,
  p_status text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE shipments SET
    status = p_status,
    shipped_at = CASE WHEN p_status IN ('SHIPPED', 'IN_DELIVERY') THEN now() ELSE shipped_at END,
    delivered_at = CASE WHEN p_status = 'DELIVERED' THEN now() ELSE delivered_at END
  WHERE id = p_shipment_id;

  RETURN jsonb_build_object('shipment_id', p_shipment_id, 'status', p_status);
END;
$$;

-- ── 7. Deliver shipment ─────────────────────────
CREATE OR REPLACE FUNCTION deliver_shipment(
  p_shipment_id uuid,
  p_event_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM update_shipment_status(p_shipment_id, 'DELIVERED');

  IF p_event_id IS NOT NULL THEN
    PERFORM transition_event_state(p_event_id, 'COMPLETED', NULL, 'Livraison terminée');
  END IF;

  RETURN jsonb_build_object('shipment_id', p_shipment_id, 'status', 'DELIVERED');
END;
$$;

-- ── 8. Report problem ───────────────────────────
CREATE OR REPLACE FUNCTION report_problem(
  p_shipment_id uuid,
  p_description text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE shipments
  SET status = 'PROBLEM', problem_description = p_description
  WHERE id = p_shipment_id;

  RETURN jsonb_build_object('shipment_id', p_shipment_id, 'status', 'PROBLEM');
END;
$$;

-- ── 9. Verify content (create or update) ──────────
CREATE OR REPLACE FUNCTION verify_content(
  p_ugc_content_id uuid,
  p_user_id uuid,
  p_visibility_score numeric DEFAULT NULL,
  p_quality_score numeric DEFAULT NULL,
  p_engagement_score numeric DEFAULT NULL,
  p_global_score numeric DEFAULT NULL,
  p_comment text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_verification_id uuid;
BEGIN
  INSERT INTO content_verifications (
    ugc_content_id, verified_by,
    visibility_score, quality_score, engagement_score, global_score,
    comment
  ) VALUES (
    p_ugc_content_id, p_user_id,
    p_visibility_score, p_quality_score, p_engagement_score, p_global_score,
    p_comment
  )
  ON CONFLICT (ugc_content_id)
  DO UPDATE SET
    verified_by = EXCLUDED.verified_by,
    visibility_score = EXCLUDED.visibility_score,
    quality_score = EXCLUDED.quality_score,
    engagement_score = EXCLUDED.engagement_score,
    global_score = EXCLUDED.global_score,
    comment = EXCLUDED.comment
  RETURNING id INTO v_verification_id;

  RETURN jsonb_build_object('verification_id', v_verification_id, 'ugc_content_id', p_ugc_content_id);
END;
$$;

-- ── Track application ────────────────────────────
CREATE OR REPLACE FUNCTION get_event_by_tracking_code(
  p_code text
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'id', e.id,
    'title', e.title,
    'city', e.city,
    'tracking_code', e.tracking_code,
    'start_date', e.start_date,
    'end_date', e.end_date,
    'applicant_email', e.applicant_email,
    'created_at', e.created_at,
    'club', row_to_json(c.*),
    'campaign', row_to_json(camp.*),
    'state', row_to_json(ws.*),
    'application_form', row_to_json(af.*)
  )
  FROM events e
  LEFT JOIN clubs c ON c.id = e.club_id
  LEFT JOIN campaigns camp ON camp.id = e.campaign_id
  LEFT JOIN workflow_states ws ON ws.id = e.state_id
  LEFT JOIN application_forms af ON af.event_id = e.id
  WHERE e.tracking_code = p_code
  INTO v_result;

  RETURN v_result;
END;
$$;

-- ── Public: submit sponsorship application ─────────
-- SECURITY DEFINER so anon users can create records via this single entry point
CREATE OR REPLACE FUNCTION submit_application(
  p_club_name text,
  p_club_city text,
  p_club_university text DEFAULT NULL,
  p_club_instagram text DEFAULT NULL,
  p_contact_name text,
  p_contact_position text DEFAULT NULL,
  p_contact_phone text,
  p_contact_email text,
  p_campaign_id uuid DEFAULT NULL,
  p_event_title text,
  p_event_city text,
  p_event_start_date date,
  p_event_end_date date DEFAULT NULL,
  p_partnership_type text,
  p_event_type text DEFAULT NULL,
  p_expected_attendance integer DEFAULT NULL,
  p_target_audience text DEFAULT NULL,
  p_visibility_counterparts text DEFAULT NULL,
  p_has_ugc boolean DEFAULT false,
  p_ugc_content_types text DEFAULT NULL,
  p_image_authorization boolean DEFAULT false,
  p_first_collaboration boolean DEFAULT NULL,
  p_comment text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_club_id uuid;
  v_event_id uuid;
  v_state_id uuid;
  v_tracking_code text;
  v_application_form_id uuid;
BEGIN
  -- Generate tracking code: LYNX-YYYYMMDD-RRRR
  v_tracking_code := 'LYNX-'
    || to_char(now(), 'YYYYMMDD') || '-'
    || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));

  -- Create club
  INSERT INTO clubs (name, city, university, instagram)
  VALUES (p_club_name, p_club_city, p_club_university, p_club_instagram)
  RETURNING id INTO v_club_id;

  -- Create primary contact
  INSERT INTO club_contacts (club_id, full_name, position, phone, email, is_primary)
  VALUES (v_club_id, p_contact_name, p_contact_position, p_contact_phone, p_contact_email, true);

  -- Get SUBMITTED workflow state
  SELECT id INTO v_state_id FROM workflow_states WHERE code = 'SUBMITTED';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workflow state SUBMITTED not found';
  END IF;

  -- Create event
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code)
  VALUES (v_club_id, p_campaign_id, v_state_id, p_event_title, p_event_city, p_event_start_date, p_event_end_date, p_contact_email, v_tracking_code)
  RETURNING id INTO v_event_id;

  -- Create application form
  INSERT INTO application_forms (
    event_id, partnership_type, event_type, expected_attendance,
    target_audience, visibility_counterparts, has_ugc,
    ugc_content_types, image_authorization, first_collaboration, comment
  )
  VALUES (
    v_event_id, p_partnership_type, p_event_type, p_expected_attendance,
    p_target_audience, p_visibility_counterparts, p_has_ugc,
    p_ugc_content_types, p_image_authorization, p_first_collaboration, p_comment
  )
  RETURNING id INTO v_application_form_id;

  -- Record workflow history
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment)
  VALUES (v_event_id, NULL, v_state_id, NULL, 'Création via le formulaire public');

  RETURN jsonb_build_object(
    'success', true,
    'tracking_code', v_tracking_code,
    'event_id', v_event_id,
    'club_id', v_club_id,
    'application_form_id', v_application_form_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION submit_application TO anon;

-- ── Get event phases ─────────────────────────────
CREATE OR REPLACE FUNCTION get_event_phases(
  p_event_id uuid
)
RETURNS jsonb[]
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_phases jsonb[];
BEGIN
  SELECT array_agg(
    jsonb_build_object(
      'id', wh.id,
      'old_state', jsonb_build_object('code', ws_old.code, 'label', ws_old.label),
      'new_state', jsonb_build_object('code', ws_new.code, 'label', ws_new.label),
      'changed_by', wh.changed_by,
      'comment', wh.comment,
      'created_at', wh.created_at
    )
    ORDER BY wh.created_at ASC
  )
  FROM workflow_history wh
  LEFT JOIN workflow_states ws_old ON ws_old.id = wh.old_state_id
  LEFT JOIN workflow_states ws_new ON ws_new.id = wh.new_state_id
  WHERE wh.event_id = p_event_id
  INTO v_phases;

  RETURN COALESCE(v_phases, ARRAY[]::jsonb[]);
END;
$$;
