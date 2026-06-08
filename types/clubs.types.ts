// ──────────────────────────────────────────────
// Clubs & Club Contacts
// ──────────────────────────────────────────────
import { z } from 'zod';

// ── Club ──────────────────────────────────────
export interface ClubRow {
  id: string;
  name: string;
  type: string | null;
  city: string | null;
  university: string | null;
  instagram: string | null;
  description: string | null;
  created_at: string;
}

export interface ClubInsert {
  id?: string;
  name: string;
  type?: string | null;
  city?: string | null;
  university?: string | null;
  instagram?: string | null;
  description?: string | null;
  created_at?: string;
}

export interface ClubUpdate {
  name?: string;
  type?: string | null;
  city?: string | null;
  university?: string | null;
  instagram?: string | null;
  description?: string | null;
}

export interface Club extends ClubRow {
  contacts?: ClubContact[];
}

// ── Club Contact ──────────────────────────────
export interface ClubContactRow {
  id: string;
  club_id: string;
  full_name: string;
  position: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface ClubContactInsert {
  id?: string;
  club_id: string;
  full_name: string;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  is_primary?: boolean;
  created_at?: string;
}

export interface ClubContactUpdate {
  club_id?: string;
  full_name?: string;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  is_primary?: boolean;
}

export interface ClubContact extends ClubContactRow {
  club?: Club;
}

// ── Zod schemas ───────────────────────────────
export const clubSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Le nom du club est requis'),
  type: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  university: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const clubUpdateSchema = clubSchema.partial().omit({ id: true, created_at: true });

export const clubContactSchema = z.object({
  id: z.string().uuid(),
  club_id: z.string().uuid(),
  full_name: z.string().min(1, 'Le nom du contact est requis'),
  position: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email('Email invalide').nullable().optional(),
  is_primary: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
});

export const clubContactUpdateSchema = clubContactSchema.partial().omit({ id: true, created_at: true });

export type ClubSchemaType = z.infer<typeof clubSchema>;
export type ClubContactSchemaType = z.infer<typeof clubContactSchema>;
