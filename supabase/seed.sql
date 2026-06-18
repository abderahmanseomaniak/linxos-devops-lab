-- Seed database with realistic development data
-- Idempotent — safe to run multiple times (uses ON CONFLICT DO NOTHING)
-- Run: psql -f supabase/seed.sql  OR  paste into Supabase SQL Editor

DO $$
DECLARE
  -- Profiles
  v_admin_id UUID; v_sponsoring_id UUID; v_logistics_id UUID; v_content_id UUID;
  v_manager1_id UUID; v_manager2_id UUID; v_manager3_id UUID; v_viewer_id UUID;

  -- Clubs
  v_club_psg UUID; v_club_om UUID; v_club_lyon UUID; v_club_lille UUID;
  v_club_rennes UUID; v_club_bordeaux UUID; v_club_strasbourg UUID; v_club_nice UUID;

  -- Campaigns
  v_camp_ete UUID; v_camp_printemps UUID;

  -- Categories
  v_cat_boissons UUID; v_cat_goodies UUID; v_cat_communication UUID;

  -- Products
  v_prod_canette_33 UUID; v_prod_canette_50 UUID; v_prod_bouteille_1l UUID;
  v_prod_t_shirt UUID; v_prod_casquette UUID; v_prod_rollup UUID; v_prod_stopray UUID;

  -- Workflow states
  v_state_submitted UUID; v_state_validated UUID; v_state_confirmed UUID;
  v_state_allocated UUID; v_state_preparing UUID; v_state_delivered UUID;
  v_state_closed UUID; v_state_rejected UUID; v_state_review UUID;
  v_state_ugc_pending UUID; v_state_content_reviewed UUID;
  v_state_confirmation_sent UUID; v_state_in_delivery UUID;

  -- Events
  v_evt_psg UUID; v_evt_om UUID; v_evt_lyon UUID; v_evt_lille UUID;
  v_evt_rennes UUID; v_evt_bordeaux UUID; v_evt_strasbourg UUID; v_evt_nice UUID;

  -- Application forms
  v_af_psg UUID; v_af_om UUID; v_af_lyon UUID; v_af_lille UUID;
  v_af_rennes UUID; v_af_bordeaux UUID; v_af_strasbourg UUID; v_af_nice UUID;

  -- Allocations
  v_alloc_psg UUID; v_alloc_om UUID; v_alloc_lyon UUID; v_alloc_lille UUID;

  -- Confirmation forms
  v_cf_psg UUID; v_cf_om UUID; v_cf_lyon UUID; v_cf_lille UUID;

  -- Shipments
  v_ship_psg UUID; v_ship_om UUID; v_ship_lyon UUID;

  -- Drive folders
  v_drive_psg UUID; v_drive_om UUID; v_drive_lille UUID;

  -- UGC contents
  v_ugc_psg1 UUID; v_ugc_psg2 UUID; v_ugc_om1 UUID; v_ugc_lille1 UUID;

  -- Scoring
  v_scoring_ete UUID; v_scoring_printemps UUID;

  -- AI analyses
  v_ai_psg UUID; v_ai_om UUID; v_ai_lyon UUID; v_ai_lille UUID;
BEGIN

  -- =========================================================================
  -- PROFILES
  -- =========================================================================
  INSERT INTO profiles (id, full_name, email, role, is_active, created_at) VALUES
    (gen_random_uuid(), 'Amine Benali', 'amine.benali@linxenergy.com', 'ADMIN', true, NOW() - INTERVAL '180 days'),
    (gen_random_uuid(), 'Sarah Kone', 'sarah.kone@linxenergy.com', 'SPONSORING_MANAGER', true, NOW() - INTERVAL '160 days'),
    (gen_random_uuid(), 'Mehdi Zidane', 'mehdi.zidane@linxenergy.com', 'LOGISTICS_MANAGER', true, NOW() - INTERVAL '150 days'),
    (gen_random_uuid(), 'Lea Moreau', 'lea.moreau@linxenergy.com', 'CONTENT_MANAGER', true, NOW() - INTERVAL '140 days'),
    (gen_random_uuid(), 'Karim Diallo', 'karim.diallo@linxenergy.com', 'SPONSORING_MANAGER', true, NOW() - INTERVAL '130 days'),
    (gen_random_uuid(), 'Camille Roux', 'camille.roux@linxenergy.com', 'LOGISTICS_MANAGER', true, NOW() - INTERVAL '120 days'),
    (gen_random_uuid(), 'Hugo Blanc', 'hugo.blanc@linxenergy.com', 'CONTENT_MANAGER', true, NOW() - INTERVAL '110 days'),
    (gen_random_uuid(), 'Emma Petit', 'emma.petit@linxenergy.com', 'SPONSORING_MANAGER', false, NOW() - INTERVAL '100 days')
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO v_admin_id FROM profiles WHERE email = 'amine.benali@linxenergy.com';
  SELECT id INTO v_sponsoring_id FROM profiles WHERE email = 'sarah.kone@linxenergy.com';
  SELECT id INTO v_logistics_id FROM profiles WHERE email = 'mehdi.zidane@linxenergy.com';
  SELECT id INTO v_content_id FROM profiles WHERE email = 'lea.moreau@linxenergy.com';
  SELECT id INTO v_manager1_id FROM profiles WHERE email = 'karim.diallo@linxenergy.com';
  SELECT id INTO v_manager2_id FROM profiles WHERE email = 'camille.roux@linxenergy.com';
  SELECT id INTO v_manager3_id FROM profiles WHERE email = 'hugo.blanc@linxenergy.com';
  SELECT id INTO v_viewer_id FROM profiles WHERE email = 'emma.petit@linxenergy.com';

  -- =========================================================================
  -- WORKFLOW STATES (already seeded in migrations, just fetch)
  -- =========================================================================
  SELECT id INTO v_state_submitted FROM workflow_states WHERE code = 'SUBMITTED';
  SELECT id INTO v_state_validated FROM workflow_states WHERE code = 'VALIDATED';
  SELECT id INTO v_state_confirmed FROM workflow_states WHERE code = 'CONFIRMED';
  SELECT id INTO v_state_allocated FROM workflow_states WHERE code = 'ALLOCATED';
  SELECT id INTO v_state_preparing FROM workflow_states WHERE code = 'PREPARING_SHIPMENT';
  SELECT id INTO v_state_delivered FROM workflow_states WHERE code = 'DELIVERED';
  SELECT id INTO v_state_closed FROM workflow_states WHERE code = 'CLOSED';
  SELECT id INTO v_state_rejected FROM workflow_states WHERE code = 'REJECTED';
  SELECT id INTO v_state_review FROM workflow_states WHERE code = 'UNDER_REVIEW';
  SELECT id INTO v_state_ugc_pending FROM workflow_states WHERE code = 'UGC_PENDING';
  SELECT id INTO v_state_content_reviewed FROM workflow_states WHERE code = 'CONTENT_REVIEWED';
  SELECT id INTO v_state_confirmation_sent FROM workflow_states WHERE code = 'CONFIRMATION_SENT';
  SELECT id INTO v_state_in_delivery FROM workflow_states WHERE code = 'IN_DELIVERY';

  -- =========================================================================
  -- CLUBS
  -- =========================================================================
  INSERT INTO clubs (name, type, city, university, instagram, description) VALUES
    ('Paris Saint-Germain', 'Sport', 'Paris', NULL, '@psg', 'Club de football professionnel parisien'),
    ('Olympique de Marseille', 'Sport', 'Marseille', NULL, '@om', 'Club de football marseillais'),
    ('Olympique Lyonnais', 'Sport', 'Lyon', NULL, '@ol', 'Club de football lyonnais'),
    ('LOSC Lille', 'Sport', 'Lille', NULL, '@losclille', 'Club de football lillois'),
    ('Stade Rennais', 'Sport', 'Rennes', NULL, '@staderennais', 'Club de football rennais'),
    ('Girondins de Bordeaux', 'Sport', 'Bordeaux', NULL, '@girondins', 'Club de football bordelais'),
    ('RC Strasbourg', 'Sport', 'Strasbourg', NULL, '@rcstrasbourg', 'Club de football strasbourgeois'),
    ('OGC Nice', 'Sport', 'Nice', NULL, '@ogcnice', 'Club de football niçois')
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_club_psg FROM clubs WHERE name = 'Paris Saint-Germain';
  SELECT id INTO v_club_om FROM clubs WHERE name = 'Olympique de Marseille';
  SELECT id INTO v_club_lyon FROM clubs WHERE name = 'Olympique Lyonnais';
  SELECT id INTO v_club_lille FROM clubs WHERE name = 'LOSC Lille';
  SELECT id INTO v_club_rennes FROM clubs WHERE name = 'Stade Rennais';
  SELECT id INTO v_club_bordeaux FROM clubs WHERE name = 'Girondins de Bordeaux';
  SELECT id INTO v_club_strasbourg FROM clubs WHERE name = 'RC Strasbourg';
  SELECT id INTO v_club_nice FROM clubs WHERE name = 'OGC Nice';

  -- =========================================================================
  -- CLUB CONTACTS
  -- =========================================================================
  INSERT INTO club_contacts (club_id, full_name, position, phone, email, is_primary) VALUES
    (v_club_psg, 'Marie Dubois', 'Responsable communication', '+33 6 23 45 67 89', 'marie.dubois@psg.fr', true),
    (v_club_om, 'Jean Dupont', 'Directeur sportif', '+33 6 12 34 56 78', 'jean.dupont@om.fr', true),
    (v_club_lyon, 'Pierre Martin', 'Entraineur', '+33 6 45 67 89 01', 'pierre.martin@ol.fr', true),
    (v_club_lille, 'Catherine Moreau', 'Directrice marketing', '+33 6 99 88 77 66', 'c.moreau@lille.fr', true),
    (v_club_rennes, 'Sophie Leblanc', 'Responsable evenementiel', '+33 6 11 22 33 44', 's.leblanc@staderennais.fr', true),
    (v_club_bordeaux, 'Francois Levy', 'Responsable partenariats', '+33 6 12 23 34 45', 'f.levy@girondins.com', true),
    (v_club_strasbourg, 'Julie Wagner', 'Responsable communication', '+33 6 78 90 11 22', 'j.wagner@rcstrasbourg.fr', true),
    (v_club_nice, 'Philippe Garnier', 'President adjoint', '+33 6 33 44 55 66', 'p.garnier@ogcnice.com', true)
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- CAMPAIGNS
  -- =========================================================================
  INSERT INTO campaigns (name, type, description, start_date, end_date, status) VALUES
    ('Campagne Ete 2026', 'Saisonniere', 'Campagne de sponsoring estivale - mai a aout 2026', '2026-05-01', '2026-08-31', 'ACTIVE'),
    ('Campagne Printemps 2026', 'Saisonniere', 'Campagne de sponsoring printaniere - mars a mai 2026', '2026-03-01', '2026-05-31', 'CLOSED')
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_camp_ete FROM campaigns WHERE name = 'Campagne Ete 2026';
  SELECT id INTO v_camp_printemps FROM campaigns WHERE name = 'Campagne Printemps 2026';

  -- =========================================================================
  -- PRODUCT CATEGORIES
  -- =========================================================================
  INSERT INTO product_categories (name, description) VALUES
    ('Boissons energisantes', 'Canettes et bouteilles LINX Energy'),
    ('Goodies', 'Articles promotionnels et vetements'),
    ('Communication', 'Supports de communication et signaletique')
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_cat_boissons FROM product_categories WHERE name = 'Boissons energisantes';
  SELECT id INTO v_cat_goodies FROM product_categories WHERE name = 'Goodies';
  SELECT id INTO v_cat_communication FROM product_categories WHERE name = 'Communication';

  -- =========================================================================
  -- PRODUCTS
  -- =========================================================================
  INSERT INTO products (category_id, name, description) VALUES
    (v_cat_boissons, 'LINX Canette 33cL', 'Canette LINX Energy original 33cL - lot de 24'),
    (v_cat_boissons, 'LINX Canette 50cL', 'Canette LINX Energy max 50cL - lot de 24'),
    (v_cat_boissons, 'LINX Bouteille 1L', 'Bouteille LINX Energy 1L - lot de 12'),
    (v_cat_goodies, 'T-shirt LINX Blanc', 'T-shirt coton logo LINX - taille M/L/XL'),
    (v_cat_goodies, 'Casquette LINX Noire', 'Casquette ajustable logo LINX brode'),
    (v_cat_communication, 'Roll-up LINX', 'Roll-up publicitaire 85x200cm'),
    (v_cat_boissons, 'LINX StopRay 33cL', 'LINX StopRay sans cafeine 33cL - lot de 24')
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_prod_canette_33 FROM products WHERE name = 'LINX Canette 33cL' LIMIT 1;
  SELECT id INTO v_prod_canette_50 FROM products WHERE name = 'LINX Canette 50cL' LIMIT 1;
  SELECT id INTO v_prod_bouteille_1l FROM products WHERE name = 'LINX Bouteille 1L' LIMIT 1;
  SELECT id INTO v_prod_t_shirt FROM products WHERE name = 'T-shirt LINX Blanc' LIMIT 1;
  SELECT id INTO v_prod_casquette FROM products WHERE name = 'Casquette LINX Noire' LIMIT 1;
  SELECT id INTO v_prod_rollup FROM products WHERE name = 'Roll-up LINX' LIMIT 1;
  SELECT id INTO v_prod_stopray FROM products WHERE name = 'LINX StopRay 33cL' LIMIT 1;

  -- =========================================================================
  -- CAMPAIGN STOCKS
  -- =========================================================================
  INSERT INTO campaign_stocks (campaign_id, product_id, total_quantity, available_quantity, reserved_quantity) VALUES
    (v_camp_ete, v_prod_canette_33, 5000, 3200, 800),
    (v_camp_ete, v_prod_canette_50, 3000, 2000, 500),
    (v_camp_ete, v_prod_bouteille_1l, 1000, 700, 150),
    (v_camp_ete, v_prod_t_shirt, 500, 300, 100),
    (v_camp_ete, v_prod_casquette, 400, 250, 80),
    (v_camp_ete, v_prod_rollup, 50, 30, 10),
    (v_camp_ete, v_prod_stopray, 2000, 1500, 200),
    (v_camp_printemps, v_prod_canette_33, 3000, 0, 0),
    (v_camp_printemps, v_prod_canette_50, 2000, 0, 0),
    (v_camp_printemps, v_prod_t_shirt, 300, 0, 0)
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- SCORING PROFILES & RULES
  -- =========================================================================
  INSERT INTO scoring_profiles (campaign_id, score_minimum, acceptance_threshold, escalation_threshold, rejection_threshold) VALUES
    (v_camp_ete, 10, 80, 60, 40),
    (v_camp_printemps, 5, 75, 50, 30)
  ON CONFLICT (campaign_id) DO NOTHING;

  SELECT id INTO v_scoring_ete FROM scoring_profiles WHERE campaign_id = v_camp_ete;
  SELECT id INTO v_scoring_printemps FROM scoring_profiles WHERE campaign_id = v_camp_printemps;

  INSERT INTO scoring_rules (scoring_profile_id, name, weight, is_active) VALUES
    (v_scoring_ete, 'Pertinence evenement', 3.0, true),
    (v_scoring_ete, 'Audience attendue', 2.5, true),
    (v_scoring_ete, 'Visibilite sponsor', 2.0, true),
    (v_scoring_ete, 'Qualite dossier UGC', 1.5, true),
    (v_scoring_ete, 'Premiere collaboration', 1.0, true),
    (v_scoring_printemps, 'Pertinence evenement', 3.0, true),
    (v_scoring_printemps, 'Audience attendue', 2.0, true),
    (v_scoring_printemps, 'Visibilite sponsor', 2.0, true),
    (v_scoring_printemps, 'Qualite dossier UGC', 1.0, true)
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- EVENTS (8 events at various workflow stages)
  -- =========================================================================
  -- 1. PSG -- fully completed (CLOSED)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, score_ai, date_confirme, created_at)
  VALUES (v_club_psg, v_camp_printemps, v_state_closed, 'Lancement Produit LINX au Parc', 'Paris', '2026-04-15', '2026-04-16', 'marie.dubois@psg.fr', 'LYNX-20260415-A3F2', 85, NOW() - INTERVAL '60 days', NOW() - INTERVAL '90 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_psg FROM events WHERE tracking_code = 'LYNX-20260415-A3F2';

  -- 2. OM -- delivered, awaiting UGC (UGC_PENDING)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, score_ai, date_confirme, created_at)
  VALUES (v_club_om, v_camp_ete, v_state_ugc_pending, 'Tournoi International de Marseille', 'Marseille', '2026-06-15', '2026-06-20', 'jean.dupont@om.fr', 'LYNX-20260615-B4E7', 72, NOW() - INTERVAL '20 days', NOW() - INTERVAL '45 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_om FROM events WHERE tracking_code = 'LYNX-20260615-B4E7';

  -- 3. Lyon -- delivery completed (DELIVERED)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, score_ai, date_confirme, created_at)
  VALUES (v_club_lyon, v_camp_ete, v_state_delivered, 'Stage equipes jeunes OL', 'Lyon', '2026-06-25', '2026-06-28', 'pierre.martin@ol.fr', 'LYNX-20260625-C9F1', 68, NOW() - INTERVAL '15 days', NOW() - INTERVAL '35 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_lyon FROM events WHERE tracking_code = 'LYNX-20260625-C9F1';

  -- 4. Lille -- allocated, awaiting shipment (ALLOCATED)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, score_ai, date_confirme, created_at)
  VALUES (v_club_lille, v_camp_ete, v_state_allocated, 'Salon professionnel B2B Lille', 'Lille', '2026-07-05', '2026-07-07', 'c.moreau@lille.fr', 'LYNX-20260705-D2A4', 55, NOW() - INTERVAL '10 days', NOW() - INTERVAL '25 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_lille FROM events WHERE tracking_code = 'LYNX-20260705-D2A4';

  -- 5. Rennes -- confirmed, awaiting allocation (CONFIRMED)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, created_at)
  VALUES (v_club_rennes, v_camp_ete, v_state_confirmed, 'Journee du sport a Rennes', 'Rennes', '2026-07-12', '2026-07-13', 's.leblanc@staderennais.fr', 'LYNX-20260712-E5B8', NOW() - INTERVAL '20 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_rennes FROM events WHERE tracking_code = 'LYNX-20260712-E5B8';

  -- 6. Bordeaux -- validation sent (CONFIRMATION_SENT)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, created_at)
  VALUES (v_club_bordeaux, v_camp_ete, v_state_confirmation_sent, 'Evenement communautaire Bordeaux', 'Bordeaux', '2026-07-20', '2026-07-21', 'f.levy@girondins.com', 'LYNX-20260720-F6C1', NOW() - INTERVAL '15 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_bordeaux FROM events WHERE tracking_code = 'LYNX-20260720-F6C1';

  -- 7. Strasbourg -- validated, awaiting confirmation (VALIDATED)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, created_at)
  VALUES (v_club_strasbourg, v_camp_ete, v_state_validated, 'Festival ete Strasbourg', 'Strasbourg', '2026-08-01', '2026-08-03', 'j.wagner@rcstrasbourg.fr', 'LYNX-20260801-G7D3', NOW() - INTERVAL '10 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_strasbourg FROM events WHERE tracking_code = 'LYNX-20260801-G7D3';

  -- 8. Nice -- just submitted (SUBMITTED)
  INSERT INTO events (club_id, campaign_id, state_id, title, city, start_date, end_date, applicant_email, tracking_code, created_at)
  VALUES (v_club_nice, v_camp_ete, v_state_submitted, 'Gala ete OGC Nice', 'Nice', '2026-08-15', '2026-08-15', 'p.garnier@ogcnice.com', 'LYNX-20260815-H8E4', NOW() - INTERVAL '3 days')
  ON CONFLICT (tracking_code) DO NOTHING;
  SELECT id INTO v_evt_nice FROM events WHERE tracking_code = 'LYNX-20260815-H8E4';

  -- =========================================================================
  -- APPLICATION FORMS
  -- =========================================================================
  INSERT INTO application_forms (event_id, partnership_type, event_type, expected_attendance, target_audience, visibility_counterparts, has_ugc, ugc_content_types, image_authorization, first_collaboration, comment) VALUES
    (v_evt_psg, 'Evenementiel', 'sport', 5000, 'Supports et grand public', 'Logo sur affiches + reseaux sociaux + mention orale', true, 'reels,stories', true, false, 'Evenement de lancement avec presence presse'),
    (v_evt_om, 'Evenementiel', 'sport', 8000, 'Grand public 18-35 ans', 'Logo sur maillots + panneaux + reseaux sociaux', true, 'reels,tiktok,stories', true, true, 'Tournoi international - forte visibilite medias'),
    (v_evt_lyon, 'Evenementiel', 'sport', 300, 'Jeunes footballeurs 14-18 ans', 'Logo sur tenues + banderoles terrain', false, NULL, true, false, 'Stage de perfectionnement encadre par educateurs'),
    (v_evt_lille, 'Evenementiel', 'autre', 1500, 'Professionnels B2B', 'Stand dedie + logo site web + programme', true, 'reels,interviews', true, true, 'Salon professionnel regional'),
    (v_evt_rennes, 'Evenementiel', 'sport', 2000, 'Familles et jeunes', 'Banderole + reseaux sociaux + 3 stories', true, 'stories,tiktok', true, false, 'Journee portes ouvertes avec animations'),
    (v_evt_bordeaux, 'Evenementiel', 'sport', 1000, 'Jeunes 12-20 ans', 'Logo sur flyers + reseaux sociaux', false, NULL, false, true, 'Journee de sensibilisation jeunesse'),
    (v_evt_strasbourg, 'Evenementiel', 'culturel', 5000, 'Grand public tous ages', 'Affichage urbain + digital + stories quotidiennes', true, 'reels,tiktok,facebook', true, false, 'Festival musical estival en plein air'),
    (v_evt_nice, 'Evenementiel', 'sport', 400, 'Sponsors et partenaires', 'Logo sur invitations + remerciements oraux', false, NULL, false, true, 'Gala annuel des partenaires du club')
  ON CONFLICT (event_id) DO NOTHING;

  SELECT id INTO v_af_psg FROM application_forms WHERE event_id = v_evt_psg;
  SELECT id INTO v_af_om FROM application_forms WHERE event_id = v_evt_om;
  SELECT id INTO v_af_lyon FROM application_forms WHERE event_id = v_evt_lyon;
  SELECT id INTO v_af_lille FROM application_forms WHERE event_id = v_evt_lille;
  SELECT id INTO v_af_rennes FROM application_forms WHERE event_id = v_evt_rennes;
  SELECT id INTO v_af_bordeaux FROM application_forms WHERE event_id = v_evt_bordeaux;
  SELECT id INTO v_af_strasbourg FROM application_forms WHERE event_id = v_evt_strasbourg;
  SELECT id INTO v_af_nice FROM application_forms WHERE event_id = v_evt_nice;

  -- =========================================================================
  -- APPLICATION UGC PROFILES
  -- =========================================================================
  INSERT INTO application_ugc_profiles (application_form_id, full_name, instagram_url, tiktok_url, followers_count, content_type, available_for_shooting) VALUES
    (v_af_psg, 'Sophie Martin', 'https://instagram.com/sophiemartin', 'https://tiktok.com/@sophiemartin_tiktok', 150000, 'reels,stories', true),
    (v_af_om, 'Lucas Bernard', 'https://instagram.com/lucasb', 'https://tiktok.com/@lucasbernard', 85000, 'reels,tiktok', true),
    (v_af_lille, 'Antoine Blanc', 'https://instagram.com/antoineb', 'https://tiktok.com/@antoineblanc', 120000, 'reels,interviews', true),
    (v_af_rennes, 'Emma Dubois', 'https://instagram.com/emmad', 'https://tiktok.com/@emmadubois', 200000, 'stories,tiktok', true),
    (v_af_rennes, 'Thomas Roche', 'https://instagram.com/thomasr', 'https://tiktok.com/@thomasroche', 95000, 'stories', false),
    (v_af_strasbourg, 'Marie Petit', 'https://instagram.com/mariep', 'https://tiktok.com/@mariepetit', 180000, 'reels,tiktok,facebook', true)
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- EVENT ATTACHMENTS
  -- =========================================================================
  INSERT INTO event_attachments (event_id, file_type, file_url, file_name) VALUES
    (v_evt_psg, 'application/pdf', 'https://storage.linxenergy.com/attachments/psg-contrat.pdf', 'Contrat_sponsoring_PSG.pdf'),
    (v_evt_psg, 'image/jpeg', 'https://storage.linxenergy.com/attachments/psg-affiche.jpg', 'Affiche_lancement_PSG.jpg'),
    (v_evt_om, 'application/pdf', 'https://storage.linxenergy.com/attachments/om-dossier.pdf', 'Dossier_sponsoring_OM.pdf'),
    (v_evt_om, 'image/jpeg', 'https://storage.linxenergy.com/attachments/om-photo1.jpg', 'Photo_stade_velodrome.jpg'),
    (v_evt_lyon, 'application/pdf', 'https://storage.linxenergy.com/attachments/ol-contrat.pdf', 'Convention_OL.pdf')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- AI ANALYSES
  -- =========================================================================
  INSERT INTO ai_analyses (event_id, scoring_profile_id, score, recommendation, justification, model_used, risk_level, strengths, weaknesses, suggested_allocation, status) VALUES
    (v_evt_psg, v_scoring_printemps, 85, 'APPROVED', 'Evenement a fort potentiel de visibilite avec une audience large et engagee. Partenariat historique.', 'gpt-4o', 'LOW', '["Forte notoriete du club","Audience large 5000+","Historique de collaboration reussi"]'::jsonb, '["Cout eleve","Contraintes de calendrier"]'::jsonb, '{"canette_33": 500, "t_shirt": 50, "rollup": 2}'::jsonb, 'COMPLETED'),
    (v_evt_om, v_scoring_ete, 72, 'APPROVED', 'Bon potentiel de visibilite mediatique. Tournoi international avec forte couverture presse.', 'gpt-4o', 'LOW', '["Evenement international","Audience etudiant 8000+","Fort engagement UGC"]'::jsonb, '["Premiere collaboration","Logistique complexe"]'::jsonb, '{"canette_33": 800, "canette_50": 400, "stopray": 200}'::jsonb, 'COMPLETED'),
    (v_evt_lyon, v_scoring_ete, 68, 'APPROVED', 'Evenement de taille modeste mais bien cible. Public jeune pertinent pour la marque.', 'gpt-4o', 'MEDIUM', '["Public cible 14-18 ans","Encadrement professionnel","Sans UGC"]'::jsonb, '["Audience limitee 300 pers.","Pas de UGC"]'::jsonb, '{"canette_33": 200, "canette_50": 100}'::jsonb, 'COMPLETED'),
    (v_evt_lille, v_scoring_ete, 55, 'ESCALATED', 'Dossier correct mais necessite validation superieure. Marque peu connue en B2B.', 'gpt-4o', 'MEDIUM', '["Creneau B2B original","UGC prevu","Stand dedie"]'::jsonb, '["Audience moderee","Secteur non sportif"]'::jsonb, '{"canette_33": 300, "rollup": 1}'::jsonb, 'COMPLETED')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- WORKFLOW HISTORY
  -- =========================================================================
  -- PSG: SUBMITTED -> VALIDATED -> CONFIRMED -> ALLOCATED -> PREPARING -> DELIVERED -> UGC_PENDING -> CONTENT_REVIEWED -> CLOSED
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_psg, NULL, v_state_submitted, v_sponsoring_id, 'Creation via le formulaire public', NOW() - INTERVAL '90 days'),
    (v_evt_psg, v_state_submitted, v_state_validated, v_sponsoring_id, 'Validation de la demande', NOW() - INTERVAL '85 days'),
    (v_evt_psg, v_state_validated, v_state_confirmed, v_sponsoring_id, 'Confirmation recue du club', NOW() - INTERVAL '80 days'),
    (v_evt_psg, v_state_confirmed, v_state_allocated, v_admin_id, 'Allocation validee par admin', NOW() - INTERVAL '75 days'),
    (v_evt_psg, v_state_allocated, v_state_preparing, v_logistics_id, 'Preparation en cours', NOW() - INTERVAL '70 days'),
    (v_evt_psg, v_state_preparing, v_state_delivered, v_logistics_id, 'Livraison effectuee', NOW() - INTERVAL '65 days'),
    (v_evt_psg, v_state_delivered, v_state_ugc_pending, v_content_id, 'En attente de contenu UGC', NOW() - INTERVAL '60 days'),
    (v_evt_psg, v_state_ugc_pending, v_state_content_reviewed, v_content_id, 'Contenu UGC verifie', NOW() - INTERVAL '55 days'),
    (v_evt_psg, v_state_content_reviewed, v_state_closed, v_admin_id, 'Processus clos', NOW() - INTERVAL '50 days')
  ON CONFLICT DO NOTHING;

  -- OM: SUBMITTED -> VALIDATED -> CONFIRMED -> ALLOCATED -> PREPARING -> DELIVERED -> UGC_PENDING
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_om, NULL, v_state_submitted, v_sponsoring_id, 'Creation via le formulaire public', NOW() - INTERVAL '45 days'),
    (v_evt_om, v_state_submitted, v_state_validated, v_sponsoring_id, 'Validation apres verification', NOW() - INTERVAL '40 days'),
    (v_evt_om, v_state_validated, v_state_confirmed, v_sponsoring_id, 'Club confirme les modalites', NOW() - INTERVAL '35 days'),
    (v_evt_om, v_state_confirmed, v_state_allocated, v_admin_id, 'Allocation approuvee', NOW() - INTERVAL '30 days'),
    (v_evt_om, v_state_allocated, v_state_preparing, v_logistics_id, 'Preparation logistique', NOW() - INTERVAL '25 days'),
    (v_evt_om, v_state_preparing, v_state_delivered, v_logistics_id, 'Colis livre au club', NOW() - INTERVAL '21 days'),
    (v_evt_om, v_state_delivered, v_state_ugc_pending, v_content_id, 'En attente de contenu UGC', NOW() - INTERVAL '20 days')
  ON CONFLICT DO NOTHING;

  -- Lyon: SUBMITTED -> VALIDATED -> CONFIRMED -> ALLOCATED -> PREPARING -> DELIVERED
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_lyon, NULL, v_state_submitted, v_sponsoring_id, 'Creation via le formulaire public', NOW() - INTERVAL '35 days'),
    (v_evt_lyon, v_state_submitted, v_state_validated, v_sponsoring_id, 'Validation rapide', NOW() - INTERVAL '32 days'),
    (v_evt_lyon, v_state_validated, v_state_confirmed, v_sponsoring_id, 'Club confirme', NOW() - INTERVAL '28 days'),
    (v_evt_lyon, v_state_confirmed, v_state_allocated, v_admin_id, 'Allocation effectuee', NOW() - INTERVAL '25 days'),
    (v_evt_lyon, v_state_allocated, v_state_preparing, v_logistics_id, 'Preparation en cours', NOW() - INTERVAL '20 days'),
    (v_evt_lyon, v_state_preparing, v_state_delivered, v_logistics_id, 'Livraison effectuee', NOW() - INTERVAL '16 days')
  ON CONFLICT DO NOTHING;

  -- Lille: SUBMITTED -> VALIDATED -> CONFIRMED -> ALLOCATED
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_lille, NULL, v_state_submitted, v_sponsoring_id, 'Creation via le formulaire public', NOW() - INTERVAL '25 days'),
    (v_evt_lille, v_state_submitted, v_state_validated, v_sponsoring_id, 'Validation avec commentaires', NOW() - INTERVAL '22 days'),
    (v_evt_lille, v_state_validated, v_state_confirmed, v_sponsoring_id, 'Modalites confirmees', NOW() - INTERVAL '18 days'),
    (v_evt_lille, v_state_confirmed, v_state_allocated, v_admin_id, 'Allocation validee', NOW() - INTERVAL '10 days')
  ON CONFLICT DO NOTHING;

  -- Rennes: SUBMITTED -> VALIDATED -> CONFIRMED
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_rennes, NULL, v_state_submitted, v_sponsoring_id, 'Creation via le formulaire public', NOW() - INTERVAL '20 days'),
    (v_evt_rennes, v_state_submitted, v_state_validated, v_sponsoring_id, 'Demande validee', NOW() - INTERVAL '17 days'),
    (v_evt_rennes, v_state_validated, v_state_confirmed, v_sponsoring_id, 'Club a confirme sa participation', NOW() - INTERVAL '14 days')
  ON CONFLICT DO NOTHING;

  -- Bordeaux: SUBMITTED -> VALIDATED -> CONFIRMATION_SENT
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_bordeaux, NULL, v_state_submitted, v_sponsoring_id, 'Creation via le formulaire public', NOW() - INTERVAL '15 days'),
    (v_evt_bordeaux, v_state_submitted, v_state_validated, v_sponsoring_id, 'Validation de la demande', NOW() - INTERVAL '12 days'),
    (v_evt_bordeaux, v_state_validated, v_state_confirmation_sent, v_admin_id, 'Email de confirmation envoye au club', NOW() - INTERVAL '10 days')
  ON CONFLICT DO NOTHING;

  -- Strasbourg: SUBMITTED -> VALIDATED
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_strasbourg, NULL, v_state_submitted, v_sponsoring_id, 'Creation via le formulaire public', NOW() - INTERVAL '10 days'),
    (v_evt_strasbourg, v_state_submitted, v_state_validated, v_sponsoring_id, 'Demande pre-validee', NOW() - INTERVAL '7 days')
  ON CONFLICT DO NOTHING;

  -- Nice: SUBMITTED (just submitted, no transitions yet)
  INSERT INTO workflow_history (event_id, old_state_id, new_state_id, changed_by, comment, created_at) VALUES
    (v_evt_nice, NULL, v_state_submitted, NULL, 'Creation via le formulaire public', NOW() - INTERVAL '3 days')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- ALLOCATIONS
  -- =========================================================================
  INSERT INTO allocations (event_id, campaign_id, approved_by, allocated_quantity) VALUES
    (v_evt_psg, v_camp_printemps, v_admin_id, 550),
    (v_evt_om, v_camp_ete, v_admin_id, 1400),
    (v_evt_lyon, v_camp_ete, v_admin_id, 300),
    (v_evt_lille, v_camp_ete, v_admin_id, 300)
  ON CONFLICT (event_id) DO NOTHING;

  SELECT id INTO v_alloc_psg FROM allocations WHERE event_id = v_evt_psg;
  SELECT id INTO v_alloc_om FROM allocations WHERE event_id = v_evt_om;
  SELECT id INTO v_alloc_lyon FROM allocations WHERE event_id = v_evt_lyon;
  SELECT id INTO v_alloc_lille FROM allocations WHERE event_id = v_evt_lille;

  -- =========================================================================
  -- CONFIRMATION FORMS
  -- =========================================================================
  INSERT INTO confirmation_forms (event_id, official_instagram, confirmed_cans, main_contact_name, main_contact_phone, main_contact_email, logistics_contact_name, logistics_contact_phone, delivery_address, delivery_date, reception_time, commitment) VALUES
    (v_evt_psg, '@psg', 500, 'Marie Dubois', '+33 6 23 45 67 89', 'marie.dubois@psg.fr', 'Jean-Pierre Lacroix', '+33 6 11 22 33 44', 'Parc des Princes, 24 Rue du Commandant Guilbaud, 75016 Paris', '2026-04-14', '08:00-12:00', true),
    (v_evt_om, '@om', 1200, 'Jean Dupont', '+33 6 12 34 56 78', 'jean.dupont@om.fr', 'Marc Olivier', '+33 6 44 55 66 77', 'Stade Velodrome, 3 Boulevard Michelet, 13008 Marseille', '2026-06-14', '09:00-14:00', true),
    (v_evt_lyon, '@ol', 250, 'Pierre Martin', '+33 6 45 67 89 01', 'pierre.martin@ol.fr', 'Lucas Perrin', '+33 6 77 88 99 00', 'Groupama Stadium, 10 Avenue Simone Veil, 69150 Decines-Charpieu', '2026-06-24', '10:00-16:00', true),
    (v_evt_lille, '@losclille', 250, 'Catherine Moreau', '+33 6 99 88 77 66', 'c.moreau@lille.fr', 'Antoine Dubois', '+33 6 55 66 77 88', 'Stade Pierre-Mauroy, 261 Boulevard de Tournai, 59650 Villeneuve d Ascq', '2026-07-04', '08:00-12:00', true),
    (v_evt_rennes, '@staderennais', 350, 'Sophie Leblanc', '+33 6 11 22 33 44', 's.leblanc@staderennais.fr', NULL, NULL, 'Roazhon Park, 111 Route de Lorient, 35000 Rennes', '2026-07-11', '09:00-13:00', true)
  ON CONFLICT (event_id) DO NOTHING;

  SELECT id INTO v_cf_psg FROM confirmation_forms WHERE event_id = v_evt_psg;
  SELECT id INTO v_cf_om FROM confirmation_forms WHERE event_id = v_evt_om;
  SELECT id INTO v_cf_lyon FROM confirmation_forms WHERE event_id = v_evt_lyon;
  SELECT id INTO v_cf_lille FROM confirmation_forms WHERE event_id = v_evt_lille;

  -- =========================================================================
  -- CONFIRMATION UGC PROFILES
  -- =========================================================================
  INSERT INTO confirmation_ugc_profiles (confirmation_form_id, instagram_url, tiktok_url) VALUES
    (v_cf_psg, 'https://instagram.com/sophiemartin', 'https://tiktok.com/@sophiemartin_tiktok'),
    (v_cf_om, 'https://instagram.com/lucasb', 'https://tiktok.com/@lucasbernard'),
    (v_cf_lille, 'https://instagram.com/antoineb', 'https://tiktok.com/@antoineblanc')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- SHIPMENTS
  -- =========================================================================
  INSERT INTO shipments (event_id, allocation_id, tracking_code, status, shipped_at, delivered_at) VALUES
    (v_evt_psg, v_alloc_psg, 'LINX-SHIP-A3F2-001', 'DELIVERED', NOW() - INTERVAL '66 days', NOW() - INTERVAL '65 days'),
    (v_evt_om, v_alloc_om, 'LINX-SHIP-B4E7-001', 'DELIVERED', NOW() - INTERVAL '22 days', NOW() - INTERVAL '21 days'),
    (v_evt_lyon, v_alloc_lyon, 'LINX-SHIP-C9F1-001', 'DELIVERED', NOW() - INTERVAL '17 days', NOW() - INTERVAL '16 days')
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_ship_psg FROM shipments WHERE tracking_code = 'LINX-SHIP-A3F2-001';
  SELECT id INTO v_ship_om FROM shipments WHERE tracking_code = 'LINX-SHIP-B4E7-001';
  SELECT id INTO v_ship_lyon FROM shipments WHERE tracking_code = 'LINX-SHIP-C9F1-001';

  -- =========================================================================
  -- SHIPMENT ITEMS
  -- =========================================================================
  INSERT INTO shipment_items (shipment_id, product_id, quantity) VALUES
    (v_ship_psg, v_prod_canette_33, 500),
    (v_ship_psg, v_prod_t_shirt, 50),
    (v_ship_psg, v_prod_rollup, 2),
    (v_ship_om, v_prod_canette_33, 800),
    (v_ship_om, v_prod_canette_50, 400),
    (v_ship_om, v_prod_stopray, 200),
    (v_ship_lyon, v_prod_canette_33, 200),
    (v_ship_lyon, v_prod_canette_50, 100)
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- DELIVERY PROOFS
  -- =========================================================================
  INSERT INTO delivery_proofs (shipment_id, file_url, description) VALUES
    (v_ship_psg, 'https://storage.linxenergy.com/proofs/psg-livraison.jpg', 'Photo du colis livre au Parc des Princes'),
    (v_ship_om, 'https://storage.linxenergy.com/proofs/om-livraison.jpg', 'Bon de livraison signe par le club'),
    (v_ship_lyon, 'https://storage.linxenergy.com/proofs/lyon-livraison.jpg', 'Confirmation de reception OL')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- DRIVE FOLDERS
  -- =========================================================================
  INSERT INTO drive_folders (event_id, drive_url, drive_complete, content_edited, content_published) VALUES
    (v_evt_psg, 'https://drive.google.com/drive/folders/1ABCpsgLinx', true, true, true),
    (v_evt_om, 'https://drive.google.com/drive/folders/1DEFomLinx', false, false, false),
    (v_evt_lille, 'https://drive.google.com/drive/folders/1GHIlilleLinx', false, false, false)
  ON CONFLICT (event_id) DO NOTHING;

  SELECT id INTO v_drive_psg FROM drive_folders WHERE event_id = v_evt_psg;
  SELECT id INTO v_drive_om FROM drive_folders WHERE event_id = v_evt_om;
  SELECT id INTO v_drive_lille FROM drive_folders WHERE event_id = v_evt_lille;

  -- =========================================================================
  -- UGC CONTENTS
  -- =========================================================================
  INSERT INTO ugc_contents (event_id, platform, content_type, url, views, likes, comments) VALUES
    (v_evt_psg, 'Instagram', 'reels', 'https://instagram.com/p/psg-linx-reel1', 45000, 5200, 340),
    (v_evt_psg, 'TikTok', 'video', 'https://tiktok.com/@psg/video/linx1', 89000, 12000, 890),
    (v_evt_om, 'Instagram', 'story', 'https://instagram.com/p/om-linx-story1', 12000, 1500, 120)
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_ugc_psg1 FROM ugc_contents WHERE url = 'https://instagram.com/p/psg-linx-reel1';
  SELECT id INTO v_ugc_psg2 FROM ugc_contents WHERE url = 'https://tiktok.com/@psg/video/linx1';
  SELECT id INTO v_ugc_om1 FROM ugc_contents WHERE url = 'https://instagram.com/p/om-linx-story1';

  -- =========================================================================
  -- CONTENT VERIFICATIONS
  -- =========================================================================
  INSERT INTO content_verifications (ugc_content_id, verified_by, visibility_score, quality_score, engagement_score, global_score, comment) VALUES
    (v_ugc_psg1, v_content_id, 8.5, 9.0, 7.5, 8.3, 'Excellent reel, forte visibilite du logo'),
    (v_ugc_psg2, v_content_id, 9.0, 8.5, 8.0, 8.5, 'Tres bon engagement sur TikTok'),
    (v_ugc_om1, v_content_id, 6.0, 7.0, 5.5, 6.2, 'Contenu correct mais portee limitee')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- EVENT METRICS
  -- =========================================================================
  INSERT INTO event_metrics (event_id, total_views, total_likes, total_comments, content_count, engagement_rate) VALUES
    (v_evt_psg, 134000, 17200, 1230, 10, 13.72),
    (v_evt_om, 12000, 1500, 120, 1, 13.50),
    (v_evt_lyon, 0, 0, 0, 0, 0),
    (v_evt_lille, 0, 0, 0, 0, 0),
    (v_evt_rennes, 0, 0, 0, 0, 0),
    (v_evt_bordeaux, 0, 0, 0, 0, 0),
    (v_evt_strasbourg, 0, 0, 0, 0, 0),
    (v_evt_nice, 0, 0, 0, 0, 0)
  ON CONFLICT (event_id) DO NOTHING;

  -- =========================================================================
  -- INVENTORY MOVEMENTS
  -- =========================================================================
  INSERT INTO inventory_movements (campaign_id, product_id, event_id, movement_type, quantity, note) VALUES
    (v_camp_printemps, v_prod_canette_33, v_evt_psg, 'OUT', 500, 'Sortie pour evenement PSG'),
    (v_camp_printemps, v_prod_t_shirt, v_evt_psg, 'OUT', 50, 'Sortie goodies PSG'),
    (v_camp_printemps, v_prod_rollup, v_evt_psg, 'OUT', 2, 'Roll-up pour stand PSG'),
    (v_camp_ete, v_prod_canette_33, v_evt_om, 'OUT', 800, 'Sortie pour tournoi OM'),
    (v_camp_ete, v_prod_canette_50, v_evt_om, 'OUT', 400, 'Sortie canettes 50cL OM'),
    (v_camp_ete, v_prod_stopray, v_evt_om, 'OUT', 200, 'StopRay pour OM'),
    (v_camp_ete, v_prod_canette_33, v_evt_lyon, 'OUT', 200, 'Sortie pour stage OL'),
    (v_camp_ete, v_prod_canette_50, v_evt_lyon, 'OUT', 100, 'Canettes 50cL pour OL'),
    (v_camp_ete, v_prod_canette_33, NULL, 'IN', 5000, 'Reception stock campagne ete'),
    (v_camp_ete, v_prod_canette_50, NULL, 'IN', 3000, 'Reception stock campagne ete'),
    (v_camp_ete, v_prod_t_shirt, NULL, 'IN', 500, 'Reception T-shirts'),
    (v_camp_printemps, v_prod_canette_33, NULL, 'ADJUSTMENT', 100, 'Ajustement inventaire fin campagne')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- NOTIFICATIONS
  -- =========================================================================
  INSERT INTO notifications (user_id, title, message, is_read, related_event_id, notification_type) VALUES
    (v_admin_id, 'Nouvel evenement soumis', 'Un club a soumis une demande de sponsoring', true, v_evt_nice, 'event_submitted'),
    (v_sponsoring_id, 'Evenement valide', 'Le tournoi OM a ete valide avec succes', true, v_evt_om, 'event_validated'),
    (v_logistics_id, 'Nouvelle allocation', 'Allocation creee pour evenement Lille', false, v_evt_lille, 'allocation_created'),
    (v_content_id, 'UGC en attente', 'Contenu UGC en attente pour evenement OM', false, v_evt_om, 'ugc_pending'),
    (v_admin_id, 'Confirmation recue', 'Le club a confirme sa participation Rennes', true, v_evt_rennes, 'event_confirmed'),
    (v_sponsoring_id, 'Rappel confirmation', 'Evenement Strasbourg en attente de confirmation', false, v_evt_strasbourg, 'confirmation_reminder'),
    (v_admin_id, 'Livraison effectuee', 'Livraison Lyon marquee comme livree', true, v_evt_lyon, 'delivery_completed')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- EMAIL LOGS
  -- =========================================================================
  INSERT INTO email_logs (event_id, recipient_email, recipient_type, subject, body, status, sent_at) VALUES
    (v_evt_psg, 'marie.dubois@psg.fr', 'APPLICANT', 'Votre demande de sponsoring a ete approuvee', 'Votre evenement Lancement Produit LINX au Parc a ete approuve.', 'SENT', NOW() - INTERVAL '75 days'),
    (v_evt_psg, 'amine.benali@linxenergy.com', 'INTERNAL', 'Nouvelle demande de sponsoring recue', 'Club: Paris Saint-Germain. Evenement: Lancement Produit LINX au Parc', 'SENT', NOW() - INTERVAL '90 days'),
    (v_evt_om, 'jean.dupont@om.fr', 'APPLICANT', 'Confirmation de votre dossier OM', 'Votre Tournoi International de Marseille a ete confirme.', 'SENT', NOW() - INTERVAL '35 days'),
    (v_evt_om, 'sarah.kone@linxenergy.com', 'INTERNAL', 'Nouvelle demande - OM', 'Le club OM a soumis une demande pour le tournoi international.', 'SENT', NOW() - INTERVAL '45 days'),
    (v_evt_lyon, 'pierre.martin@ol.fr', 'APPLICANT', 'Livraison effectuee - Stage OL', 'Votre commande a ete livree au Groupama Stadium.', 'SENT', NOW() - INTERVAL '16 days'),
    (v_evt_lille, 'c.moreau@lille.fr', 'APPLICANT', 'Allocation validee - Salon Lille', 'Votre allocation de 300 produits a ete validee.', 'SENT', NOW() - INTERVAL '10 days'),
    (v_evt_rennes, 's.leblanc@staderennais.fr', 'APPLICANT', 'Votre demande est en cours', 'Votre Journee du sport a bien ete recue.', 'SENT', NOW() - INTERVAL '20 days'),
    (v_evt_bordeaux, 'f.levy@girondins.com', 'APPLICANT', 'Demande de confirmation', 'Veuillez confirmer les modalites de votre evenement.', 'SENT', NOW() - INTERVAL '10 days'),
    (v_evt_nice, 'p.garnier@ogcnice.com', 'APPLICANT', 'Accuse de reception', 'Votre demande pour le Gala ete OGC Nice a bien ete recue.', 'PENDING', NOW() - INTERVAL '3 days')
  ON CONFLICT DO NOTHING;

  -- =========================================================================
  -- EMAIL VERIFICATIONS (for tests)
  -- =========================================================================
  INSERT INTO email_verifications (email, code, expires_at, verified_at) VALUES
    ('test-club@example.com', 'ABC123', NOW() + INTERVAL '10 minutes', NULL),
    ('verified@example.com', 'DEF456', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
    ('expired@example.com', 'GHI789', NOW() - INTERVAL '1 day', NULL)
  ON CONFLICT DO NOTHING;

END $$;
