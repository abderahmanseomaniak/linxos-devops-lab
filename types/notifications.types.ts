// ──────────────────────────────────────────────
// Notifications & Email Logs
// ──────────────────────────────────────────────
import { z } from 'zod';
import type { Profile } from './profiles.types';
import type { Event } from './events.types';

// ── Constants ─────────────────────────────────
export const NOTIFICATION_TYPES = [
  'STATE_CHANGE',
  'NEW_EVENT',
  'SHIPMENT_UPDATE',
  'ALLOCATION',
  'VERIFICATION',
  'SYSTEM',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  STATE_CHANGE: "Changement d'état",
  NEW_EVENT: 'Nouvel événement',
  SHIPMENT_UPDATE: 'Mise à jour expédition',
  ALLOCATION: 'Allocation',
  VERIFICATION: 'Vérification',
  SYSTEM: 'Système',
};

export const RECIPIENT_TYPES = ['APPLICANT', 'INTERNAL'] as const;
export type RecipientType = (typeof RECIPIENT_TYPES)[number];

export const EMAIL_STATUSES = ['PENDING', 'SENT', 'FAILED'] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

// ── Notification ──────────────────────────────
export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  related_event_id: string | null;
  notification_type: string | null;
  created_at: string;
}

export interface NotificationInsert {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  is_read?: boolean;
  related_event_id?: string | null;
  notification_type?: string | null;
  created_at?: string;
}

export interface NotificationUpdate {
  is_read?: boolean;
}

export interface Notification extends NotificationRow {
  user?: Profile;
  related_event?: Event;
}

// ── Email Log ─────────────────────────────────
export interface EmailLogRow {
  id: string;
  event_id: string;
  recipient_email: string;
  recipient_type: RecipientType;
  subject: string;
  body: string;
  status: EmailStatus;
  sent_at: string | null;
  created_at: string;
}

export interface EmailLogInsert {
  id?: string;
  event_id: string;
  recipient_email: string;
  recipient_type: RecipientType;
  subject: string;
  body: string;
  status?: EmailStatus;
  sent_at?: string | null;
  created_at?: string;
}

export interface EmailLogUpdate {
  status?: EmailStatus;
  sent_at?: string | null;
}

export interface EmailLog extends EmailLogRow {
  event?: Event;
}

// ── Zod schemas ───────────────────────────────
export const notificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1, 'Le titre est requis'),
  message: z.string().min(1, 'Le message est requis'),
  is_read: z.boolean().default(false),
  related_event_id: z.string().uuid().nullable().optional(),
  notification_type: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const emailLogSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  recipient_email: z.string().email('Email destinataire invalide'),
  recipient_type: z.enum(RECIPIENT_TYPES),
  subject: z.string().min(1, 'Le sujet est requis'),
  body: z.string().min(1, 'Le corps du message est requis'),
  status: z.enum(EMAIL_STATUSES).default('PENDING'),
  sent_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export type NotificationSchemaType = z.infer<typeof notificationSchema>;
export type EmailLogSchemaType = z.infer<typeof emailLogSchema>;
