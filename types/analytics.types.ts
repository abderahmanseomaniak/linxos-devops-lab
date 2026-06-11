// ──────────────────────────────────────────────
// Analytics — Scoring Profiles, Rules & AI Analyses
// ──────────────────────────────────────────────
import { z } from 'zod';
import type { Campaign } from './campaigns.types';
import type { Event } from './events.types';

// ── Scoring Profile ───────────────────────────
export interface ScoringProfileRow {
  id: string;
  campaign_id: string;
  score_minimum: number | null;
  acceptance_threshold: number | null;
  escalation_threshold: number | null;
  rejection_threshold: number | null;
  created_at: string;
}

export interface ScoringProfileInsert {
  id?: string;
  campaign_id: string;
  score_minimum?: number | null;
  acceptance_threshold?: number | null;
  escalation_threshold?: number | null;
  rejection_threshold?: number | null;
  created_at?: string;
}

export interface ScoringProfileUpdate {
  score_minimum?: number | null;
  acceptance_threshold?: number | null;
  escalation_threshold?: number | null;
  rejection_threshold?: number | null;
}

export interface ScoringProfile extends ScoringProfileRow {
  campaign?: Campaign;
  rules?: ScoringRule[];
}

// ── Scoring Rule ──────────────────────────────
export interface ScoringRuleRow {
  id: string;
  scoring_profile_id: string;
  name: string;
  weight: number;
  is_active: boolean;
  created_at: string;
}

export interface ScoringRuleInsert {
  id?: string;
  scoring_profile_id: string;
  name: string;
  weight: number;
  is_active?: boolean;
  created_at?: string;
}

export interface ScoringRuleUpdate {
  name?: string;
  weight?: number;
  is_active?: boolean;
}

export interface ScoringRule extends ScoringRuleRow {
  scoring_profile?: ScoringProfile;
}

// ── AI Analysis ───────────────────────────────
export interface AIAnalysisRow {
  id: string;
  event_id: string;
  scoring_profile_id: string | null;
  score: number | null;
  recommendation: string | null;
  justification: string | null;
  model_used: string | null;
  created_at: string;
}

export interface AIAnalysisInsert {
  id?: string;
  event_id: string;
  scoring_profile_id?: string | null;
  score?: number | null;
  recommendation?: string | null;
  justification?: string | null;
  model_used?: string | null;
  created_at?: string;
}

export interface AIAnalysisUpdate {
  score?: number | null;
  recommendation?: string | null;
  justification?: string | null;
  model_used?: string | null;
}

export interface AIAnalysis extends AIAnalysisRow {
  event?: Event;
  scoring_profile?: ScoringProfile;
}

// ── Zod schemas ───────────────────────────────
export const scoringProfileSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  score_minimum: z.number().min(0).max(100).nullable().optional(),
  acceptance_threshold: z.number().min(0).max(100).nullable().optional(),
  escalation_threshold: z.number().min(0).max(100).nullable().optional(),
  rejection_threshold: z.number().min(0).max(100).nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const scoringRuleSchema = z.object({
  id: z.string().uuid(),
  scoring_profile_id: z.string().uuid(),
  name: z.string().min(1, 'Le nom de la règle est requis'),
  weight: z.number().min(0).max(100),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
});

export const aiAnalysisSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  scoring_profile_id: z.string().uuid().nullable().optional(),
  score: z.number().min(0).max(100).nullable().optional(),
  recommendation: z.string().nullable().optional(),
  justification: z.string().nullable().optional(),
  model_used: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export type ScoringProfileSchemaType = z.infer<typeof scoringProfileSchema>;
export type ScoringRuleSchemaType = z.infer<typeof scoringRuleSchema>;
export type AIAnalysisSchemaType = z.infer<typeof aiAnalysisSchema>;
