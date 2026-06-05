// ──────────────────────────────────────────────
// Inventory — Categories, Products, Campaign Stocks, Movements
// ──────────────────────────────────────────────
import { z } from 'zod';
import type { Campaign } from './campaigns.types';
import type { Event } from './events.types';

// ── Movement Types ────────────────────────────
export const MOVEMENT_TYPES = [
  'IN',
  'OUT',
  'RESERVATION',
  'RETURN',
  'ADJUSTMENT',
] as const;

export type MovementType = (typeof MOVEMENT_TYPES)[number];

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  IN: 'Entrée',
  OUT: 'Sortie',
  RESERVATION: 'Réservation',
  RETURN: 'Retour',
  ADJUSTMENT: 'Ajustement',
};

// ── Product Category ──────────────────────────
export interface ProductCategoryRow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductCategoryInsert {
  id?: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface ProductCategoryUpdate {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface ProductCategory extends ProductCategoryRow {
  products?: Product[];
}

// ── Product ───────────────────────────────────
export interface ProductRow {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductInsert {
  id?: string;
  category_id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface ProductUpdate {
  category_id?: string;
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface Product extends ProductRow {
  category?: ProductCategory;
}

// ── Campaign Stock ────────────────────────────
export interface CampaignStockRow {
  id: string;
  campaign_id: string;
  product_id: string;
  total_quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  created_at: string;
}

export interface CampaignStockInsert {
  id?: string;
  campaign_id: string;
  product_id: string;
  total_quantity: number;
  available_quantity: number;
  reserved_quantity?: number;
  created_at?: string;
}

export interface CampaignStockUpdate {
  total_quantity?: number;
  available_quantity?: number;
  reserved_quantity?: number;
}

export interface CampaignStock extends CampaignStockRow {
  campaign?: Campaign;
  product?: Product;
}

// ── Inventory Movement ────────────────────────
export interface InventoryMovementRow {
  id: string;
  campaign_id: string;
  product_id: string;
  event_id: string | null;
  movement_type: MovementType;
  quantity: number;
  note: string | null;
  created_at: string;
}

export interface InventoryMovementInsert {
  id?: string;
  campaign_id?: string | null;
  product_id: string;
  event_id?: string | null;
  movement_type: MovementType;
  quantity: number;
  note?: string | null;
  created_at?: string;
}

export interface InventoryMovementUpdate {
  movement_type?: MovementType;
  quantity?: number;
  note?: string | null;
}

export interface InventoryMovement extends InventoryMovementRow {
  campaign?: Campaign;
  product?: Product;
  event?: Event;
}

// ── Zod schemas ───────────────────────────────
export const productCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Le nom de la catégorie est requis'),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string().min(1, 'Le nom du produit est requis'),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
});

export const campaignStockSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  product_id: z.string().uuid(),
  total_quantity: z.number().int().nonnegative(),
  available_quantity: z.number().int().nonnegative(),
  reserved_quantity: z.number().int().nonnegative().default(0),
  created_at: z.string().datetime().optional(),
});

export const inventoryMovementSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  product_id: z.string().uuid(),
  event_id: z.string().uuid().nullable().optional(),
  movement_type: z.enum(MOVEMENT_TYPES),
  quantity: z.number().int().nonnegative(),
  note: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export type ProductCategorySchemaType = z.infer<typeof productCategorySchema>;
export type ProductSchemaType = z.infer<typeof productSchema>;
export type CampaignStockSchemaType = z.infer<typeof campaignStockSchema>;
export type InventoryMovementSchemaType = z.infer<typeof inventoryMovementSchema>;
