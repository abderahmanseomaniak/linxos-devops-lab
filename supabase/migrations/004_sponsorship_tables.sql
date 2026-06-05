-- Sponsorship form tables (reference only — already exist in your project)
-- Run in Supabase SQL Editor if tables are missing

CREATE TABLE IF NOT EXISTS workflow_states (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  PRIMARY KEY (id)
);

INSERT INTO workflow_states (code, label, description) VALUES
  ('DRAFT', 'Brouillon', NULL),
  ('SUBMITTED', 'Soumis', NULL),
  ('IN_REVIEW', 'En cours d''examen', NULL),
  ('APPROVED', 'Approuvé', NULL),
  ('REJECTED', 'Rejeté', NULL)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS clubs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  city text,
  university text,
  instagram text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS club_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES clubs(id),
  full_name text NOT NULL,
  position text,
  phone text,
  email text,
  is_primary boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES clubs(id),
  campaign_id uuid,
  state_id uuid REFERENCES workflow_states(id),
  title text NOT NULL,
  city text,
  start_date date,
  end_date date,
  applicant_email text NOT NULL,
  tracking_code text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS application_forms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES events(id),
  partnership_type text,
  event_type text,
  expected_attendance integer CHECK (expected_attendance >= 0),
  target_audience text,
  visibility_counterparts text,
  has_ugc boolean NOT NULL DEFAULT false,
  ugc_content_types text,
  image_authorization boolean NOT NULL DEFAULT false,
  first_collaboration boolean,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS workflow_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id),
  old_state_id uuid REFERENCES workflow_states(id),
  new_state_id uuid REFERENCES workflow_states(id),
  changed_by uuid REFERENCES profiles(id),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
