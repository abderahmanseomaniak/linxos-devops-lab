// ──────────────────────────────────────────────
// Workflow — States & History
// ──────────────────────────────────────────────
import { z } from 'zod';
import type { Event } from './events.types';
import type { Profile } from './profiles.types';

// ── Workflow Codes ────────────────────────────
export const WORKFLOW_CODES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'CONFIRMED',
  'SHIPPED',
  'COMPLETED',
  'REJECTED',
] as const;

export type WorkflowCode = (typeof WORKFLOW_CODES)[number];

// ── Constants ─────────────────────────────────
export const WORKFLOW_STAGES: WorkflowCode[] = [...WORKFLOW_CODES];

export const WORKFLOW_LABELS: Record<WorkflowCode, string> = {
  SUBMITTED: 'Soumis',
  UNDER_REVIEW: 'En révision',
  APPROVED: 'Approuvé',
  CONFIRMED: 'Confirmé',
  SHIPPED: 'Expédié',
  COMPLETED: 'Terminé',
  REJECTED: 'Rejeté',
};

export const WORKFLOW_COLORS: Record<WorkflowCode, string> = {
  SUBMITTED: '#3B82F6',
  UNDER_REVIEW: '#F59E0B',
  APPROVED: '#10B981',
  CONFIRMED: '#6366F1',
  SHIPPED: '#8B5CF6',
  COMPLETED: '#22C55E',
  REJECTED: '#EF4444',
};

// ── Workflow State ────────────────────────────
export interface WorkflowStateRow {
  id: string;
  code: WorkflowCode;
  label: string;
  description: string | null;
}

export interface WorkflowStateInsert {
  id?: string;
  code: WorkflowCode;
  label: string;
  description?: string | null;
}

export interface WorkflowStateUpdate {
  code?: WorkflowCode;
  label?: string;
  description?: string | null;
}

export type WorkflowState = WorkflowStateRow

// ── Workflow History ──────────────────────────
export interface WorkflowHistoryRow {
  id: string;
  event_id: string;
  old_state_id: string | null;
  new_state_id: string | null;
  changed_by: string | null;
  comment: string | null;
  created_at: string;
}

export interface WorkflowHistoryInsert {
  id?: string;
  event_id: string;
  old_state_id?: string | null;
  new_state_id?: string | null;
  changed_by?: string | null;
  comment?: string | null;
  created_at?: string;
}

export interface WorkflowHistoryUpdate {
  event_id?: string;
  old_state_id?: string | null;
  new_state_id?: string | null;
  changed_by?: string | null;
  comment?: string | null;
}

export interface WorkflowHistory extends WorkflowHistoryRow {
  event?: Event;
  old_state?: WorkflowState;
  new_state?: WorkflowState;
  changed_by_user?: Profile;
}

// ── Zod schemas ───────────────────────────────
export const workflowStateSchema = z.object({
  id: z.string().uuid(),
  code: z.enum(WORKFLOW_CODES),
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().nullable().optional(),
});

export const workflowHistorySchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  old_state_id: z.string().uuid().nullable().optional(),
  new_state_id: z.string().uuid().nullable().optional(),
  changed_by: z.string().uuid().nullable().optional(),
  comment: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export type WorkflowStateSchemaType = z.infer<typeof workflowStateSchema>;
export type WorkflowHistorySchemaType = z.infer<typeof workflowHistorySchema>;
