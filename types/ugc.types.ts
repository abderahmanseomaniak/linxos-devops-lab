// ──────────────────────────────────────────────
// UGC — Contents, Verifications, Drive Folders, Event Metrics
// ──────────────────────────────────────────────
import { z } from 'zod';
import type { Event } from './events.types';
import type { Profile } from './profiles.types';

// ── UGC Content ───────────────────────────────
export interface UGCContentRow {
  id: string;
  event_id: string;
  platform: string | null;
  content_type: string | null;
  url: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  created_at: string;
}

export interface UGCContentInsert {
  id?: string;
  event_id: string;
  platform?: string | null;
  content_type?: string | null;
  url?: string | null;
  views?: number | null;
  likes?: number | null;
  comments?: number | null;
  created_at?: string;
}

export interface UGCContentUpdate {
  platform?: string | null;
  content_type?: string | null;
  url?: string | null;
  views?: number | null;
  likes?: number | null;
  comments?: number | null;
}

export interface UGCContent extends UGCContentRow {
  event?: Event;
  verification?: ContentVerification;
}

// ── Content Verification ──────────────────────
export interface ContentVerificationRow {
  id: string;
  ugc_content_id: string;
  verified_by: string | null;
  visibility_score: number | null;
  quality_score: number | null;
  engagement_score: number | null;
  global_score: number | null;
  comment: string | null;
  created_at: string;
}

export interface ContentVerificationInsert {
  id?: string;
  ugc_content_id: string;
  verified_by?: string | null;
  visibility_score?: number | null;
  quality_score?: number | null;
  engagement_score?: number | null;
  global_score?: number | null;
  comment?: string | null;
  created_at?: string;
}

export interface ContentVerificationUpdate {
  verified_by?: string | null;
  visibility_score?: number | null;
  quality_score?: number | null;
  engagement_score?: number | null;
  global_score?: number | null;
  comment?: string | null;
}

export interface ContentVerification extends ContentVerificationRow {
  ugc_content?: UGCContent;
  verified_by_user?: Profile;
}

// ── Drive Folder ──────────────────────────────
export interface DriveFolderRow {
  id: string;
  event_id: string;
  drive_url: string | null;
  drive_complete: boolean | null;
  content_edited: boolean | null;
  content_published: boolean | null;
  created_at: string;
}

export interface DriveFolderInsert {
  id?: string;
  event_id: string;
  drive_url?: string | null;
  drive_complete?: boolean | null;
  content_edited?: boolean | null;
  content_published?: boolean | null;
  created_at?: string;
}

export interface DriveFolderUpdate {
  drive_url?: string | null;
  drive_complete?: boolean | null;
  content_edited?: boolean | null;
  content_published?: boolean | null;
}

export interface DriveFolder extends DriveFolderRow {
  event?: Event;
}

// ── Event Metric ──────────────────────────────
export interface EventMetricRow {
  id: string;
  event_id: string;
  total_views: number | null;
  total_likes: number | null;
  total_comments: number | null;
  content_count: number | null;
  engagement_rate: number | null;
  created_at: string;
}

export interface EventMetricInsert {
  id?: string;
  event_id: string;
  total_views?: number | null;
  total_likes?: number | null;
  total_comments?: number | null;
  content_count?: number | null;
  engagement_rate?: number | null;
  created_at?: string;
}
// ── Zod schemas ───────────────────────────────
export const ugcContentSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  platform: z.string().nullable().optional(),
  content_type: z.string().nullable().optional(),
  url: z.string().url('URL invalide').nullable().optional(),
  views: z.number().int().nonnegative().nullable().optional(),
  likes: z.number().int().nonnegative().nullable().optional(),
  comments: z.number().int().nonnegative().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const contentVerificationSchema = z.object({
  id: z.string().uuid(),
  ugc_content_id: z.string().uuid(),
  verified_by: z.string().uuid().nullable().optional(),
  visibility_score: z.number().min(0).max(10).nullable().optional(),
  quality_score: z.number().min(0).max(10).nullable().optional(),
  engagement_score: z.number().min(0).max(10).nullable().optional(),
  global_score: z.number().min(0).max(10).nullable().optional(),
  comment: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const driveFolderSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  drive_url: z.string().url('URL Drive invalide').nullable().optional(),
  drive_complete: z.boolean().nullable().optional(),
  content_edited: z.boolean().nullable().optional(),
  content_published: z.boolean().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const eventMetricSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  total_views: z.number().int().nonnegative().nullable().optional(),
  total_likes: z.number().int().nonnegative().nullable().optional(),
  total_comments: z.number().int().nonnegative().nullable().optional(),
  content_count: z.number().int().nonnegative().nullable().optional(),
  engagement_rate: z.number().min(0).max(100).nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export type UGCContentSchemaType = z.infer<typeof ugcContentSchema>;
export type ContentVerificationSchemaType = z.infer<typeof contentVerificationSchema>;
export type DriveFolderSchemaType = z.infer<typeof driveFolderSchema>;
export type EventMetricSchemaType = z.infer<typeof eventMetricSchema>;


export interface EventMetricUpdate {
  total_views?: number | null;
  total_likes?: number | null;
  total_comments?: number | null;
  content_count?: number | null;
  engagement_rate?: number | null;
}

export interface EventMetric extends EventMetricRow {
  event?: Event;
}
