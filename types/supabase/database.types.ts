// ──────────────────────────────────────────────
// Database – Base Supabase generated types
// ──────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: import('../profiles.types').ProfileRow;
        Insert: import('../profiles.types').ProfileInsert;
        Update: import('../profiles.types').ProfileUpdate;
      };
      clubs: {
        Row: import('../clubs.types').ClubRow;
        Insert: import('../clubs.types').ClubInsert;
        Update: import('../clubs.types').ClubUpdate;
      };
      club_contacts: {
        Row: import('../clubs.types').ClubContactRow;
        Insert: import('../clubs.types').ClubContactInsert;
        Update: import('../clubs.types').ClubContactUpdate;
      };
      events: {
        Row: import('../events.types').EventRow;
        Insert: import('../events.types').EventInsert;
        Update: import('../events.types').EventUpdate;
      };
      application_forms: {
        Row: import('../events.types').ApplicationFormRow;
        Insert: import('../events.types').ApplicationFormInsert;
        Update: import('../events.types').ApplicationFormUpdate;
      };
      application_ugc_profiles: {
        Row: import('../events.types').ApplicationUgcProfileRow;
        Insert: import('../events.types').ApplicationUgcProfileInsert;
        Update: import('../events.types').ApplicationUgcProfileUpdate;
      };
      event_attachments: {
        Row: import('../events.types').EventAttachmentRow;
        Insert: import('../events.types').EventAttachmentInsert;
        Update: import('../events.types').EventAttachmentUpdate;
      };
      campaigns: {
        Row: import('../campaigns.types').CampaignRow;
        Insert: import('../campaigns.types').CampaignInsert;
        Update: import('../campaigns.types').CampaignUpdate;
      };

      workflow_states: {
        Row: import('../workflow.types').WorkflowStateRow;
        Insert: import('../workflow.types').WorkflowStateInsert;
        Update: import('../workflow.types').WorkflowStateUpdate;
      };
      workflow_history: {
        Row: import('../workflow.types').WorkflowHistoryRow;
        Insert: import('../workflow.types').WorkflowHistoryInsert;
        Update: import('../workflow.types').WorkflowHistoryUpdate;
      };
      product_categories: {
        Row: import('../inventory.types').ProductCategoryRow;
        Insert: import('../inventory.types').ProductCategoryInsert;
        Update: import('../inventory.types').ProductCategoryUpdate;
      };
      products: {
        Row: import('../inventory.types').ProductRow;
        Insert: import('../inventory.types').ProductInsert;
        Update: import('../inventory.types').ProductUpdate;
      };
      campaign_stocks: {
        Row: import('../inventory.types').CampaignStockRow;
        Insert: import('../inventory.types').CampaignStockInsert;
        Update: import('../inventory.types').CampaignStockUpdate;
      };
      inventory_movements: {
        Row: import('../inventory.types').InventoryMovementRow;
        Insert: import('../inventory.types').InventoryMovementInsert;
        Update: import('../inventory.types').InventoryMovementUpdate;
      };
      allocations: {
        Row: import('../shipments.types').AllocationRow;
        Insert: import('../shipments.types').AllocationInsert;
        Update: import('../shipments.types').AllocationUpdate;
      };
      shipments: {
        Row: import('../shipments.types').ShipmentRow;
        Insert: import('../shipments.types').ShipmentInsert;
        Update: import('../shipments.types').ShipmentUpdate;
      };
      shipment_items: {
        Row: import('../shipments.types').ShipmentItemRow;
        Insert: import('../shipments.types').ShipmentItemInsert;
        Update: import('../shipments.types').ShipmentItemUpdate;
      };
      delivery_proofs: {
        Row: import('../shipments.types').DeliveryProofRow;
        Insert: import('../shipments.types').DeliveryProofInsert;
        Update: import('../shipments.types').DeliveryProofUpdate;
      };
      ugc_contents: {
        Row: import('../ugc.types').UGCContentRow;
        Insert: import('../ugc.types').UGCContentInsert;
        Update: import('../ugc.types').UGCContentUpdate;
      };
      content_verifications: {
        Row: import('../ugc.types').ContentVerificationRow;
        Insert: import('../ugc.types').ContentVerificationInsert;
        Update: import('../ugc.types').ContentVerificationUpdate;
      };
      drive_folders: {
        Row: import('../ugc.types').DriveFolderRow;
        Insert: import('../ugc.types').DriveFolderInsert;
        Update: import('../ugc.types').DriveFolderUpdate;
      };
      event_metrics: {
        Row: import('../ugc.types').EventMetricRow;
        Insert: import('../ugc.types').EventMetricInsert;
        Update: import('../ugc.types').EventMetricUpdate;
      };
      scoring_profiles: {
        Row: import('../analytics.types').ScoringProfileRow;
        Insert: import('../analytics.types').ScoringProfileInsert;
        Update: import('../analytics.types').ScoringProfileUpdate;
      };
      scoring_rules: {
        Row: import('../analytics.types').ScoringRuleRow;
        Insert: import('../analytics.types').ScoringRuleInsert;
        Update: import('../analytics.types').ScoringRuleUpdate;
      };
      ai_analyses: {
        Row: import('../analytics.types').AIAnalysisRow;
        Insert: import('../analytics.types').AIAnalysisInsert;
        Update: import('../analytics.types').AIAnalysisUpdate;
      };
      notifications: {
        Row: import('../notifications.types').NotificationRow;
        Insert: import('../notifications.types').NotificationInsert;
        Update: import('../notifications.types').NotificationUpdate;
      };
      email_logs: {
        Row: import('../notifications.types').EmailLogRow;
        Insert: import('../notifications.types').EmailLogInsert;
        Update: import('../notifications.types').EmailLogUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'ADMIN' | 'SPONSORING_MANAGER' | 'LOGISTICS_MANAGER' | 'CONTENT_MANAGER';
      movement_type: 'IN' | 'OUT' | 'RESERVATION' | 'RETURN' | 'ADJUSTMENT';
      shipment_status: 'PREPARING' | 'IN_DELIVERY' | 'DELIVERED' | 'PROBLEM' | 'CANCELLED';
      recipient_type: 'APPLICANT' | 'INTERNAL';
      email_status: 'PENDING' | 'SENT' | 'FAILED';
      notification_type: string;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
