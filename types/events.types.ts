// ──────────────────────────────────────────────
// Events, Application Forms, UGC Profiles, Attachments
// ──────────────────────────────────────────────
import { z } from 'zod';
import type { Club } from './clubs.types';
import type { Campaign } from './campaigns.types';
import type { WorkflowState } from './workflow.types';

// ── Event ─────────────────────────────────────
export interface EventRow {
  id: string;
  club_id: string;
  campaign_id: string | null;
  state_id: string | null;
  title: string;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  applicant_email: string;
  tracking_code: string;
  created_at: string;
}

export interface EventInsert {
  id?: string;
  club_id: string;
  campaign_id?: string | null;
  state_id?: string | null;
  title: string;
  city?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  applicant_email: string;
  tracking_code: string;
  created_at?: string;
}

export interface EventUpdate {
  club_id?: string;
  campaign_id?: string | null;
  state_id?: string | null;
  title?: string;
  city?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  applicant_email?: string;
  tracking_code?: string;
}

export interface Event extends EventRow {
  club?: Club;
  campaign?: Campaign;
  state?: WorkflowState;
  application_form?: ApplicationForm;
  attachments?: EventAttachment[];
  ugc_contents?: import('./ugc.types').UGCContent[];
  metrics?: import('./ugc.types').EventMetric;
  drive_folder?: import('./ugc.types').DriveFolder;
}

// ── Application Form ──────────────────────────
export interface ApplicationFormRow {
  id: string;
  event_id: string;
  partnership_type: string | null;
  event_type: string | null;
  expected_attendance: number | null;
  target_audience: string | null;
  visibility_counterparts: string | null;
  has_ugc: boolean;
  ugc_content_types: string | null;
  image_authorization: boolean;
  first_collaboration: boolean | null;
  comment: string | null;
  created_at: string;
}

export interface ApplicationFormInsert {
  id?: string;
  event_id: string;
  partnership_type?: string | null;
  event_type?: string | null;
  expected_attendance?: number | null;
  target_audience?: string | null;
  visibility_counterparts?: string | null;
  has_ugc?: boolean;
  ugc_content_types?: string | null;
  image_authorization?: boolean;
  first_collaboration?: boolean | null;
  comment?: string | null;
  created_at?: string;
}

export interface ApplicationFormUpdate {
  partnership_type?: string | null;
  event_type?: string | null;
  expected_attendance?: number | null;
  target_audience?: string | null;
  visibility_counterparts?: string | null;
  has_ugc?: boolean;
  ugc_content_types?: string | null;
  image_authorization?: boolean;
  first_collaboration?: boolean | null;
  comment?: string | null;
}

export interface ApplicationForm extends ApplicationFormRow {
  event?: Event;
  ugc_profiles?: ApplicationUgcProfile[];
}

// ── Application UGC Profile ───────────────────
// ── Event Attachment ──────────────────────────
export interface EventAttachmentRow {
  id: string;
  event_id: string;
  file_type: string;
  file_url: string;
  file_name: string | null;
  created_at: string;
}

export interface EventAttachmentInsert {
  id?: string;
  event_id: string;
  file_type: string;
  file_url: string;
  file_name?: string | null;
  created_at?: string;
}

export interface EventAttachmentUpdate {
  file_type?: string;
  file_url?: string;
  file_name?: string | null;
}

export interface EventAttachment extends EventAttachmentRow {
  event?: Event;
}

// ── Zod schemas ───────────────────────────────
export const eventSchema = z.object({
  id: z.string().uuid(),
  club_id: z.string().uuid(),
  campaign_id: z.string().uuid().nullable().optional(),
  state_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, 'Le titre est requis'),
  city: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  applicant_email: z.string().email('Email candidat invalide'),
  tracking_code: z.string().min(1, 'Le code de suivi est requis'),
  created_at: z.string().datetime().optional(),
});

export const eventUpdateSchema = eventSchema.partial().omit({ id: true, created_at: true });

export const applicationFormSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  partnership_type: z.string().nullable().optional(),
  event_type: z.string().nullable().optional(),
  expected_attendance: z.number().int().positive().nullable().optional(),
  target_audience: z.string().nullable().optional(),
  visibility_counterparts: z.string().nullable().optional(),
  has_ugc: z.boolean().default(false),
  ugc_content_types: z.string().nullable().optional(),
  image_authorization: z.boolean().default(false),
  first_collaboration: z.boolean().nullable().optional(),
  comment: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const applicationUgcProfileSchema = z.object({
  id: z.string().uuid(),
  application_form_id: z.string().uuid(),
  full_name: z.string().nullable().optional(),
  instagram_url: z.string().url('URL Instagram invalide').nullable().optional(),
  tiktok_url: z.string().url('URL TikTok invalide').nullable().optional(),
  followers_count: z.number().int().nonnegative().nullable().optional(),
  content_type: z.string().nullable().optional(),
  available_for_shooting: z.boolean().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const eventAttachmentSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  file_type: z.string().min(1, 'Le type de fichier est requis'),
  file_url: z.string().url('URL du fichier invalide'),
  file_name: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export type EventSchemaType = z.infer<typeof eventSchema>;
export type ApplicationFormSchemaType = z.infer<typeof applicationFormSchema>;
export type ApplicationUgcProfileSchemaType = z.infer<typeof applicationUgcProfileSchema>;
export type EventAttachmentSchemaType = z.infer<typeof eventAttachmentSchema>;

export interface ApplicationUgcProfileRow {
  id: string;
  application_form_id: string;
  full_name: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  followers_count: number | null;
  content_type: string | null;
  available_for_shooting: boolean | null;
  created_at: string;
}

export interface ApplicationUgcProfileInsert {
  id?: string;
  application_form_id: string;
  full_name?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  followers_count?: number | null;
  content_type?: string | null;
  available_for_shooting?: boolean | null;
  created_at?: string;
}

export interface ApplicationUgcProfileUpdate {
  full_name?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  followers_count?: number | null;
  content_type?: string | null;
  available_for_shooting?: boolean | null;
}

export interface ApplicationUgcProfile extends ApplicationUgcProfileRow {
  application_form?: ApplicationForm;
}
