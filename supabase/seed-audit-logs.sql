-- Seed audit_logs with realistic historical data
-- Uses subqueries to reference existing profiles, events, campaigns, etc.
-- Safe to run multiple times (idempotent — uses INSERT OR IGNORE pattern via unique check)

DO $$
DECLARE
  admin_user_id UUID;
  sponsoring_user_id UUID;
  logistics_user_id UUID;
  content_user_id UUID;
  sample_event_id UUID;
  sample_campaign_id UUID;
  sample_category_id UUID;
  sample_product_id UUID;
  sample_allocation_id UUID;
  sample_shipment_id UUID;
  sample_user_id UUID;
BEGIN

  -- Get real user IDs from profiles table
  SELECT id INTO admin_user_id FROM profiles WHERE role = 'ADMIN' LIMIT 1;
  SELECT id INTO sponsoring_user_id FROM profiles WHERE role = 'SPONSORING_MANAGER' LIMIT 1;
  SELECT id INTO logistics_user_id FROM profiles WHERE role = 'LOGISTICS_MANAGER' LIMIT 1;
  SELECT id INTO content_user_id FROM profiles WHERE role = 'CONTENT_MANAGER' LIMIT 1;

  -- Fallback: use any profile if specific role not found
  IF admin_user_id IS NULL THEN SELECT id INTO admin_user_id FROM profiles ORDER BY created_at ASC LIMIT 1; END IF;
  IF sponsoring_user_id IS NULL THEN sponsoring_user_id := admin_user_id; END IF;
  IF logistics_user_id IS NULL THEN logistics_user_id := admin_user_id; END IF;
  IF content_user_id IS NULL THEN content_user_id := admin_user_id; END IF;

  -- Get sample entity IDs if they exist
  SELECT id INTO sample_event_id FROM events LIMIT 1;
  SELECT id INTO sample_campaign_id FROM campaigns LIMIT 1;
  SELECT id INTO sample_category_id FROM product_categories LIMIT 1;
  SELECT id INTO sample_product_id FROM products LIMIT 1;
  SELECT id INTO sample_allocation_id FROM allocations LIMIT 1;
  SELECT id INTO sample_shipment_id FROM shipments LIMIT 1;
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;

  -- Events module
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, created_at) VALUES
    (admin_user_id, 'CREATE', 'EVENTS', 'event', sample_event_id, 'Création de l''événement "Soirée de lancement été 2025"', '192.168.1.42', NOW() - INTERVAL '30 days'),
    (sponsoring_user_id, 'UPDATE', 'EVENTS', 'event', sample_event_id, 'Modification des dates de l''événement', '10.0.0.15', NOW() - INTERVAL '28 days'),
    (admin_user_id, 'APPROVE', 'EVENTS', 'event', sample_event_id, 'Approbation de l''événement', '192.168.1.42', NOW() - INTERVAL '27 days'),
    (sponsoring_user_id, 'UPDATE', 'EVENTS', 'event', sample_event_id, 'Ajout d''une pièce jointe (contrat signé)', '10.0.0.15', NOW() - INTERVAL '25 days'),
    (content_user_id, 'UPDATE', 'EVENTS', 'event', sample_event_id, 'Mise à jour du brief créatif', '172.16.0.8', NOW() - INTERVAL '20 days'),
    (logistics_user_id, 'UPDATE', 'EVENTS', 'event', sample_event_id, 'Ajout des besoins logistiques', '172.16.0.9', NOW() - INTERVAL '15 days'),
    (admin_user_id, 'DELETE', 'EVENTS', 'event', NULL, 'Suppression de l''événement "Old Event 2024"', '192.168.1.42', NOW() - INTERVAL '60 days')
  ON CONFLICT DO NOTHING;

  -- Campaigns module
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, created_at) VALUES
    (sponsoring_user_id, 'CREATE', 'CAMPAIGNS', 'campaign', sample_campaign_id, 'Création de la campagne "Campagne Printemps 2025"', '10.0.0.15', NOW() - INTERVAL '35 days'),
    (admin_user_id, 'UPDATE', 'CAMPAIGNS', 'campaign', sample_campaign_id, 'Validation du budget campagne', '192.168.1.42', NOW() - INTERVAL '33 days'),
    (sponsoring_user_id, 'UPDATE', 'CAMPAIGNS', 'campaign', sample_campaign_id, 'Ajout de produits à la campagne', '10.0.0.15', NOW() - INTERVAL '30 days'),
    (admin_user_id, 'DELETE', 'CAMPAIGNS', 'campaign', NULL, 'Suppression de la campagne "Test Q3"', '192.168.1.42', NOW() - INTERVAL '90 days')
  ON CONFLICT DO NOTHING;

  -- Inventory / Products / Categories module
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, created_at) VALUES
    (logistics_user_id, 'CREATE', 'INVENTORY', 'category', sample_category_id, 'Création de la catégorie "Goodies"', '172.16.0.9', NOW() - INTERVAL '60 days'),
    (logistics_user_id, 'CREATE', 'INVENTORY', 'product', sample_product_id, 'Création du produit "T-shirt Logo Blanc"', '172.16.0.9', NOW() - INTERVAL '55 days'),
    (logistics_user_id, 'UPDATE', 'INVENTORY', 'product', sample_product_id, 'Mise à jour du prix du produit', '172.16.0.9', NOW() - INTERVAL '50 days'),
    (admin_user_id, 'UPDATE', 'INVENTORY', 'category', sample_category_id, 'Modification du nom de catégorie', '192.168.1.42', NOW() - INTERVAL '45 days'),
    (logistics_user_id, 'DELETE', 'INVENTORY', 'product', NULL, 'Suppression du produit "Casquette Rouge"', '172.16.0.9', NOW() - INTERVAL '100 days')
  ON CONFLICT DO NOTHING;

  -- Stocks / Movements module
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, created_at) VALUES
    (logistics_user_id, 'UPDATE', 'STOCKS', 'campaign_stock', NULL, 'Ajout de stock : 50 T-shirts Blanc pour Campagne Printemps', '172.16.0.9', NOW() - INTERVAL '40 days'),
    (logistics_user_id, 'UPDATE', 'STOCKS', 'campaign_stock', NULL, 'Ajustement stock : -12 T-shirts (sortie événement)', '172.16.0.9', NOW() - INTERVAL '25 days'),
    (logistics_user_id, 'CREATE', 'STOCKS', 'movement', NULL, 'Mouvement de stock : 30 T-shirts vers événement', '172.16.0.9', NOW() - INTERVAL '20 days'),
    (logistics_user_id, 'UPDATE', 'STOCKS', 'campaign_stock', NULL, 'Réservation de 10 T-shirts pour événement à venir', '172.16.0.9', NOW() - INTERVAL '10 days')
  ON CONFLICT DO NOTHING;

  -- Users module
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, created_at) VALUES
    (admin_user_id, 'CREATE', 'USERS', 'user', sample_user_id, 'Création du compte utilisateur Jean Dupont', '192.168.1.42', NOW() - INTERVAL '120 days'),
    (admin_user_id, 'UPDATE', 'USERS', 'user', sample_user_id, 'Changement de rôle : LOGISTICS_MANAGER', '192.168.1.42', NOW() - INTERVAL '90 days'),
    (admin_user_id, 'INVITE', 'USERS', 'user', NULL, 'Invitation envoyée à marie@example.com', '192.168.1.42', NOW() - INTERVAL '60 days'),
    (admin_user_id, 'UPDATE', 'USERS', 'user', sample_user_id, 'Activation du compte utilisateur', '192.168.1.42', NOW() - INTERVAL '45 days'),
    (admin_user_id, 'DELETE', 'USERS', 'user', NULL, 'Suppression du compte utilisateur invité', '192.168.1.42', NOW() - INTERVAL '30 days')
  ON CONFLICT DO NOTHING;

  -- Shipments / Allocations module
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, created_at) VALUES
    (sponsoring_user_id, 'CREATE', 'SHIPMENTS', 'allocation', sample_allocation_id, 'Création d''une allocation pour événement', '10.0.0.15', NOW() - INTERVAL '22 days'),
    (logistics_user_id, 'CREATE', 'SHIPMENTS', 'shipment', sample_shipment_id, 'Création d''un bon d''expédition', '172.16.0.9', NOW() - INTERVAL '18 days'),
    (logistics_user_id, 'UPDATE', 'SHIPMENTS', 'shipment', sample_shipment_id, 'Expédition marquée comme envoyée', '172.16.0.9', NOW() - INTERVAL '15 days'),
    (logistics_user_id, 'UPDATE', 'SHIPMENTS', 'shipment', sample_shipment_id, 'Confirmation de livraison', '172.16.0.9', NOW() - INTERVAL '12 days'),
    (admin_user_id, 'UPDATE', 'SHIPMENTS', 'shipment', sample_shipment_id, 'Validation de la livraison', '192.168.1.42', NOW() - INTERVAL '10 days')
  ON CONFLICT DO NOTHING;

  -- Content / UGC module
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, created_at) VALUES
    (content_user_id, 'UPDATE', 'CONTENT', 'ugc', NULL, 'Approbation du contenu UGC pour l''événement', '172.16.0.8', NOW() - INTERVAL '8 days'),
    (content_user_id, 'UPDATE', 'CONTENT', 'ugc', NULL, 'Demande de modifications du contenu', '172.16.0.8', NOW() - INTERVAL '5 days'),
    (admin_user_id, 'APPROVE', 'CONTENT', 'ugc', NULL, 'Validation finale du contenu', '192.168.1.42', NOW() - INTERVAL '2 days')
  ON CONFLICT DO NOTHING;

  -- Login / Auth events
  INSERT INTO audit_logs (user_id, action, module, entity_type, entity_id, description, ip_address, user_agent, created_at) VALUES
    (admin_user_id, 'UPDATE', 'AUTH', 'session', NULL, 'Connexion administrateur', '192.168.1.42', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '1 hour'),
    (sponsoring_user_id, 'UPDATE', 'AUTH', 'session', NULL, 'Connexion responsable sponsoring', '10.0.0.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL '2 hours'),
    (logistics_user_id, 'UPDATE', 'AUTH', 'session', NULL, 'Connexion responsable logistique', '172.16.0.9', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', NOW() - INTERVAL '30 minutes'),
    (content_user_id, 'UPDATE', 'AUTH', 'session', NULL, 'Connexion responsable contenu', '172.16.0.8', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15', NOW() - INTERVAL '15 minutes')
  ON CONFLICT DO NOTHING;

END $$;
