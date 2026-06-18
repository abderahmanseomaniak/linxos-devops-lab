-- Allocations, Confirmation Forms, Confirmation UGC Profiles
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE SET NULL,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  allocated_quantity INT NOT NULL CHECK (allocated_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS confirmation_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  official_instagram TEXT,
  confirmed_cans INT CHECK (confirmed_cans >= 0),
  main_contact_name TEXT,
  main_contact_phone TEXT,
  main_contact_email TEXT,
  logistics_contact_name TEXT,
  logistics_contact_phone TEXT,
  delivery_address TEXT,
  delivery_date DATE,
  reception_time TEXT,
  commitment BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS confirmation_ugc_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_form_id uuid NOT NULL REFERENCES confirmation_forms(id) ON DELETE CASCADE,
  instagram_url TEXT,
  tiktok_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RPC: create allocation & transition event state
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
  v_state_id uuid;
  v_old_state_id uuid;
BEGIN
  -- Check if event already has an allocation
  SELECT id INTO v_allocation_id FROM allocations WHERE event_id = p_event_id;
  IF FOUND THEN
    RAISE EXCEPTION 'Cet événement a déjà une allocation';
  END IF;

  -- Get ALLOCATED state ID
  SELECT id INTO v_state_id FROM workflow_states WHERE code = 'ALLOCATED';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'État ALLOCATED introuvable';
  END IF;

  -- Insert allocation
  INSERT INTO allocations (event_id, campaign_id, allocated_quantity, approved_by)
  VALUES (p_event_id, p_campaign_id, p_quantity, p_user_id)
  RETURNING id INTO v_allocation_id;

  -- Transition event to ALLOCATED
  SELECT state_id INTO v_old_state_id FROM events WHERE id = p_event_id;

  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment)
  VALUES (p_event_id, v_old_state_id, v_state_id, p_user_id, 'Allocation créée');

  UPDATE events SET state_id = v_state_id WHERE id = p_event_id;

  RETURN jsonb_build_object('allocation_id', v_allocation_id, 'event_id', p_event_id);
END;
$$;
