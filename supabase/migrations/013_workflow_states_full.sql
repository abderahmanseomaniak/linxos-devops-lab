-- Insert all workflow states for the new workflow
INSERT INTO workflow_states (code, label, description) VALUES
  ('SUBMITTED', 'Soumis', 'Formulaire de demande soumis par le club'),
  ('NEEDS_CLARIFICATION', 'Demande de clarification', 'Le sponsoring demande des précisions'),
  ('VALIDATED', 'Validé', 'Demande validée par le sponsoring'),
  ('CONFIRMATION_SENT', 'Confirmation envoyée', 'Email de confirmation envoyé au club'),
  ('CONFIRMED', 'Confirmé', 'Formulaire de confirmation soumis par le club'),
  ('ALLOCATED', 'Alloué', 'Stock alloué à l\'événement'),
  ('PREPARING_SHIPMENT', 'Préparation expédition', 'Expédition en cours de préparation'),
  ('IN_DELIVERY', 'En livraison', 'Colis en cours de livraison'),
  ('DELIVERED', 'Livré', 'Colis livré'),
  ('UGC_PENDING', 'UGC en attente', 'En attente de contenu UGC'),
  ('CONTENT_REVIEWED', 'Contenu vérifié', 'Contenu UGC vérifié'),
  ('CLOSED', 'Clôturé', 'Processus terminé'),
  ('REPORTED', 'Signalé', 'Problème signalé'),
  ('REJECTED', 'Rejeté', 'Demande rejetée')
ON CONFLICT (code) DO NOTHING;
