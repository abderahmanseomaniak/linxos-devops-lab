// ──────────────────────────────────────────────
// Profiles
// ──────────────────────────────────────────────
import { z } from 'zod';

// ── Constants ─────────────────────────────────
export const USER_ROLES = [
  'SPONSORING_MANAGER',
  'ADMIN',
  'VIEWER',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  SPONSORING_MANAGER: 'Sponsoring Manager',
  ADMIN: 'Administrateur',
  VIEWER: 'Lecteur',
};

// ── Row type ──────────────────────────────────
export interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

// ── Insert / Update ───────────────────────────
export interface ProfileInsert {
  id: string;
  full_name: string;
  email: string;
  role?: UserRole;
  is_active?: boolean;
  created_at?: string;
}

export interface ProfileUpdate {
  full_name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

// ── Entity (with relations) ───────────────────
export type Profile = ProfileRow

// ── Zod schemas ───────────────────────────────
export const profileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  role: z.enum(USER_ROLES).default('SPONSORING_MANAGER'),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
});

export const profileUpdateSchema = profileSchema.partial().omit({ id: true, created_at: true });

export type ProfileSchemaType = z.infer<typeof profileSchema>;
