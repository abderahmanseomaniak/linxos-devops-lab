-- Enable RLS & create policies for all tables
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Helper: enable RLS and add basic CRUD policies for authenticated users
do $$
declare
  tbl text;
  tables text[] := array[
    'profiles', 'clubs', 'club_contacts',
    'campaigns', 'campaign_stocks',
    'products', 'product_categories', 'inventory_movements',
    'events', 'application_forms', 'application_ugc_profiles', 'event_attachments',
    'event_metrics',
    'workflow_states', 'workflow_history',
    'notifications',
    'shipments', 'shipment_items', 'allocations', 'delivery_proofs',
    'confirmation_forms', 'confirmation_ugc_profiles',
    'ugc_contents', 'content_verifications', 'drive_folders',
    'scoring_profiles', 'scoring_rules', 'ai_analyses'
  ];
begin
  foreach tbl in array tables loop
    execute format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);

    -- SELECT for authenticated users
    execute format('
      DROP POLICY IF EXISTS select_authenticated ON %I;
      CREATE POLICY select_authenticated ON %I
        FOR SELECT TO authenticated
        USING (true);
    ', tbl, tbl);

    -- INSERT for authenticated users
    execute format('
      DROP POLICY IF EXISTS insert_authenticated ON %I;
      CREATE POLICY insert_authenticated ON %I
        FOR INSERT TO authenticated
        WITH CHECK (true);
    ', tbl, tbl);

    -- UPDATE for authenticated users
    execute format('
      DROP POLICY IF EXISTS update_authenticated ON %I;
      CREATE POLICY update_authenticated ON %I
        FOR UPDATE TO authenticated
        USING (true)
        WITH CHECK (true);
    ', tbl, tbl);

    -- DELETE for authenticated users
    execute format('
      DROP POLICY IF EXISTS delete_authenticated ON %I;
      CREATE POLICY delete_authenticated ON %I
        FOR DELETE TO authenticated
        USING (true);
    ', tbl, tbl);
  end loop;
end $$;
