// ──────────────────────────────────────────────
// Database – Base Supabase generated types
// ──────────────────────────────────────────────
import type { ProfileRow, ProfileInsert, ProfileUpdate } from '../profiles.types'
import type { ClubRow, ClubInsert, ClubUpdate, ClubContactRow, ClubContactInsert, ClubContactUpdate } from '../clubs.types'
import type { EventRow, EventInsert, EventUpdate, ApplicationFormRow, ApplicationFormInsert, ApplicationFormUpdate, ApplicationUgcProfileRow, ApplicationUgcProfileInsert, ApplicationUgcProfileUpdate, EventAttachmentRow, EventAttachmentInsert, EventAttachmentUpdate } from '../events.types'
import type { CampaignRow, CampaignInsert, CampaignUpdate } from '../campaigns.types'
import type { WorkflowStateRow, WorkflowStateInsert, WorkflowStateUpdate, WorkflowHistoryRow, WorkflowHistoryInsert, WorkflowHistoryUpdate } from '../workflow.types'
import type { ProductCategoryRow, ProductCategoryInsert, ProductCategoryUpdate, ProductRow, ProductInsert, ProductUpdate, CampaignStockRow, CampaignStockInsert, CampaignStockUpdate, InventoryMovementRow, InventoryMovementInsert, InventoryMovementUpdate } from '../inventory.types'
import type { AllocationRow, AllocationInsert, AllocationUpdate, ShipmentRow, ShipmentInsert, ShipmentUpdate, ShipmentItemRow, ShipmentItemInsert, ShipmentItemUpdate, DeliveryProofRow, DeliveryProofInsert, DeliveryProofUpdate } from '../shipments.types'
import type { UGCContentRow, UGCContentInsert, UGCContentUpdate, ContentVerificationRow, ContentVerificationInsert, ContentVerificationUpdate, DriveFolderRow, DriveFolderInsert, DriveFolderUpdate, EventMetricRow, EventMetricInsert, EventMetricUpdate } from '../ugc.types'
import type { ScoringProfileRow, ScoringProfileInsert, ScoringProfileUpdate, ScoringRuleRow, ScoringRuleInsert, ScoringRuleUpdate, AIAnalysisRow, AIAnalysisInsert, AIAnalysisUpdate } from '../analytics.types'
import type { NotificationRow, NotificationInsert, NotificationUpdate, EmailLogRow, EmailLogInsert, EmailLogUpdate } from '../notifications.types'

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
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      clubs: {
        Row: ClubRow;
        Insert: ClubInsert;
        Update: ClubUpdate;
        Relationships: [];
      };
      club_contacts: {
        Row: ClubContactRow;
        Insert: ClubContactInsert;
        Update: ClubContactUpdate;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: EventInsert;
        Update: EventUpdate;
        Relationships: [];
      };
      application_forms: {
        Row: ApplicationFormRow;
        Insert: ApplicationFormInsert;
        Update: ApplicationFormUpdate;
        Relationships: [];
      };
      application_ugc_profiles: {
        Row: ApplicationUgcProfileRow;
        Insert: ApplicationUgcProfileInsert;
        Update: ApplicationUgcProfileUpdate;
        Relationships: [];
      };
      event_attachments: {
        Row: EventAttachmentRow;
        Insert: EventAttachmentInsert;
        Update: EventAttachmentUpdate;
        Relationships: [];
      };
      campaigns: {
        Row: CampaignRow;
        Insert: CampaignInsert;
        Update: CampaignUpdate;
        Relationships: [];
      };
      workflow_states: {
        Row: WorkflowStateRow;
        Insert: WorkflowStateInsert;
        Update: WorkflowStateUpdate;
        Relationships: [];
      };
      workflow_history: {
        Row: WorkflowHistoryRow;
        Insert: WorkflowHistoryInsert;
        Update: WorkflowHistoryUpdate;
        Relationships: [];
      };
      product_categories: {
        Row: ProductCategoryRow;
        Insert: ProductCategoryInsert;
        Update: ProductCategoryUpdate;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          module: string | null;
          entity_type: string | null;
          entity_id: string | null;
          description: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          module?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          description?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          module?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          description?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      campaign_stocks: {
        Row: CampaignStockRow;
        Insert: CampaignStockInsert;
        Update: CampaignStockUpdate;
        Relationships: [];
      };
      inventory_movements: {
        Row: InventoryMovementRow;
        Insert: InventoryMovementInsert;
        Update: InventoryMovementUpdate;
        Relationships: [];
      };
      allocations: {
        Row: AllocationRow;
        Insert: AllocationInsert;
        Update: AllocationUpdate;
        Relationships: [];
      };
      shipments: {
        Row: ShipmentRow;
        Insert: ShipmentInsert;
        Update: ShipmentUpdate;
        Relationships: [];
      };
      shipment_items: {
        Row: ShipmentItemRow;
        Insert: ShipmentItemInsert;
        Update: ShipmentItemUpdate;
        Relationships: [];
      };
      delivery_proofs: {
        Row: DeliveryProofRow;
        Insert: DeliveryProofInsert;
        Update: DeliveryProofUpdate;
        Relationships: [];
      };
      ugc_contents: {
        Row: UGCContentRow;
        Insert: UGCContentInsert;
        Update: UGCContentUpdate;
        Relationships: [];
      };
      content_verifications: {
        Row: ContentVerificationRow;
        Insert: ContentVerificationInsert;
        Update: ContentVerificationUpdate;
        Relationships: [];
      };
      drive_folders: {
        Row: DriveFolderRow;
        Insert: DriveFolderInsert;
        Update: DriveFolderUpdate;
        Relationships: [];
      };
      event_metrics: {
        Row: EventMetricRow;
        Insert: EventMetricInsert;
        Update: EventMetricUpdate;
        Relationships: [];
      };
      scoring_profiles: {
        Row: ScoringProfileRow;
        Insert: ScoringProfileInsert;
        Update: ScoringProfileUpdate;
        Relationships: [];
      };
      scoring_rules: {
        Row: ScoringRuleRow;
        Insert: ScoringRuleInsert;
        Update: ScoringRuleUpdate;
        Relationships: [];
      };
      ai_analyses: {
        Row: AIAnalysisRow;
        Insert: AIAnalysisInsert;
        Update: AIAnalysisUpdate;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
        Relationships: [];
      };
      email_logs: {
        Row: EmailLogRow;
        Insert: EmailLogInsert;
        Update: EmailLogUpdate;
        Relationships: [];
      };
      confirmation_forms: {
        Row: {
          id: string;
          event_id: string;
          official_instagram: string | null;
          confirmed_cans: number;
          main_contact_name: string;
          main_contact_phone: string;
          main_contact_email: string | null;
          logistics_contact_name: string | null;
          logistics_contact_phone: string | null;
          delivery_address: string | null;
          delivery_date: string | null;
          reception_time: string | null;
          commitment: boolean;
          comment: string | null;
          created_at?: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          official_instagram?: string | null;
          confirmed_cans: number;
          main_contact_name: string;
          main_contact_phone: string;
          main_contact_email?: string | null;
          logistics_contact_name?: string | null;
          logistics_contact_phone?: string | null;
          delivery_address?: string | null;
          delivery_date?: string | null;
          reception_time?: string | null;
          commitment: boolean;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          official_instagram?: string | null;
          confirmed_cans?: number;
          main_contact_name?: string;
          main_contact_phone?: string;
          main_contact_email?: string | null;
          logistics_contact_name?: string | null;
          logistics_contact_phone?: string | null;
          delivery_address?: string | null;
          delivery_date?: string | null;
          reception_time?: string | null;
          commitment?: boolean;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      confirmation_ugc_profiles: {
        Row: {
          confirmation_form_id: string;
          instagram_url: string | null;
          tiktok_url: string | null;
        };
        Insert: {
          confirmation_form_id: string;
          instagram_url?: string | null;
          tiktok_url?: string | null;
        };
        Update: {
          confirmation_form_id?: string;
          instagram_url?: string | null;
          tiktok_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      event_overview_view: {
        Row: {
          event_id: string;
          event_title: string;
          club_name: string;
          club_id: string;
          city: string | null;
          campaign_name: string | null;
          campaign_id: string | null;
          workflow_label: string | null;
          workflow_code: string | null;
          state_id: string | null;
          score_ai: number | null;
          ai_score: number | null;
          ai_recommendation: string | null;
          date_confirme: string | null;
          allocated_quantity: number | null;
          confirmation_completed: boolean | null;
          shipment_status: string | null;
          drive_submitted: boolean | null;
          ugc_count: number | null;
          created_at: string;
          tracking_code: string;
          start_date: string | null;
          end_date: string | null;
          applicant_email: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Functions: {
      reject_event: {
        Args: {
          p_event_id: string;
          p_user_id: string;
          p_comment: string | null;
        };
        Returns: unknown;
      };
      ask_clarification: {
        Args: {
          p_event_id: string;
          p_user_id: string;
          p_comment: string | null;
        };
        Returns: unknown;
      };
      create_allocation: {
        Args: {
          p_event_id: string;
          p_campaign_id: string;
          p_quantity: number;
          p_user_id: string;
        };
        Returns: unknown;
      };
      create_shipment: {
        Args: {
          p_event_id: string;
          p_allocation_id: string | null;
          p_tracking_code: string;
          p_items: string;
        };
        Returns: unknown;
      };
      update_shipment_status: {
        Args: {
          p_shipment_id: string;
          p_status: string;
        };
        Returns: unknown;
      };
      report_problem: {
        Args: {
          p_shipment_id: string;
          p_description: string;
        };
        Returns: unknown;
      };
      verify_content: {
        Args: {
          p_ugc_content_id: string;
          p_user_id: string;
          p_visibility_score: number | null;
          p_quality_score: number | null;
          p_engagement_score: number | null;
          p_global_score: number | null;
          p_comment: string | null;
        };
        Returns: unknown;
      };
      track_application: {
        Args: {
          p_code: string;
          p_email: string | null;
        };
        Returns: unknown;
      };
      submit_confirmation_form: {
        Args: {
          p_tracking_code: string;
          p_official_instagram: string;
          p_confirmed_cans: number;
          p_main_contact_name: string;
          p_main_contact_phone: string;
          p_main_contact_email: string | null;
          p_logistics_contact_name: string | null;
          p_logistics_contact_phone: string | null;
          p_delivery_address: string | null;
          p_delivery_date: string | null;
          p_reception_time: string | null;
          p_commitment: boolean;
          p_comment: string | null;
          p_drive_url: string | null;
        };
        Returns: unknown;
      };
    };
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
