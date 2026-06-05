// ──────────────────────────────────────────────
// Shipments — Allocations, Shipments, Items, Delivery Proofs
// ──────────────────────────────────────────────
import { z } from 'zod';
import type { Event } from './events.types';
import type { Campaign } from './campaigns.types';
import type { Profile } from './profiles.types';
import type { Product } from './inventory.types';

// ── Shipment Status ───────────────────────────
export const SHIPMENT_STATUSES = [
  'PREPARING',
  'IN_DELIVERY',
  'DELIVERED',
  'PROBLEM',
  'CANCELLED',
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  PREPARING: 'En préparation',
  IN_DELIVERY: 'En livraison',
  DELIVERED: 'Livré',
  PROBLEM: 'Problème',
  CANCELLED: 'Annulé',
};

export const SHIPMENT_STATUS_COLORS: Record<ShipmentStatus, string> = {
  PREPARING: '#F59E0B',
  IN_DELIVERY: '#3B82F6',
  DELIVERED: '#22C55E',
  PROBLEM: '#EF4444',
  CANCELLED: '#6B7280',
};

// ── Allocation ────────────────────────────────
export interface AllocationRow {
  id: string;
  event_id: string;
  campaign_id: string;
  approved_by: string | null;
  allocated_quantity: number;
  created_at: string;
}

export interface AllocationInsert {
  id?: string;
  event_id: string;
  campaign_id: string;
  approved_by?: string | null;
  allocated_quantity: number;
  created_at?: string;
}

export interface AllocationUpdate {
  campaign_id?: string;
  approved_by?: string | null;
  allocated_quantity?: number;
}

export interface Allocation extends AllocationRow {
  event?: Event;
  campaign?: Campaign;
  approved_by_user?: Profile;
}

// ── Shipment ──────────────────────────────────
export interface ShipmentRow {
  id: string;
  event_id: string;
  allocation_id: string | null;
  tracking_code: string;
  status: ShipmentStatus;
  problem_description: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface ShipmentInsert {
  id?: string;
  event_id: string;
  allocation_id?: string | null;
  tracking_code: string;
  status?: ShipmentStatus;
  problem_description?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  created_at?: string;
}

export interface ShipmentUpdate {
  allocation_id?: string | null;
  tracking_code?: string;
  status?: ShipmentStatus;
  problem_description?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
}

export interface Shipment extends ShipmentRow {
  event?: Event;
  allocation?: Allocation;
  items?: ShipmentItem[];
  delivery_proofs?: DeliveryProof[];
}

// ── Shipment Item ─────────────────────────────
export interface ShipmentItemRow {
  id: string;
  shipment_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface ShipmentItemInsert {
  id?: string;
  shipment_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
}

export interface ShipmentItemUpdate {
  product_id?: string;
  quantity?: number;
}

export interface ShipmentItem extends ShipmentItemRow {
  shipment?: Shipment;
  product?: Product;
}

// ── Delivery Proof ────────────────────────────
export interface DeliveryProofRow {
  id: string;
  shipment_id: string;
  file_url: string;
  description: string | null;
  created_at: string;
}

export interface DeliveryProofInsert {
  id?: string;
  shipment_id: string;
  file_url: string;
  description?: string | null;
  created_at?: string;
}

export interface DeliveryProofUpdate {
  file_url?: string;
  description?: string | null;
}

export interface DeliveryProof extends DeliveryProofRow {
  shipment?: Shipment;
}

// ── Zod schemas ───────────────────────────────
export const allocationSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  approved_by: z.string().uuid().nullable().optional(),
  allocated_quantity: z.number().int().nonnegative(),
  created_at: z.string().datetime().optional(),
});

export const shipmentSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  allocation_id: z.string().uuid().nullable().optional(),
  tracking_code: z.string().min(1, 'Le code de suivi est requis'),
  status: z.enum(SHIPMENT_STATUSES).default('PREPARING'),
  problem_description: z.string().nullable().optional(),
  shipped_at: z.string().datetime().nullable().optional(),
  delivered_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const shipmentItemSchema = z.object({
  id: z.string().uuid(),
  shipment_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  created_at: z.string().datetime().optional(),
});

export const deliveryProofSchema = z.object({
  id: z.string().uuid(),
  shipment_id: z.string().uuid(),
  file_url: z.string().url('URL du fichier invalide'),
  description: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export type AllocationSchemaType = z.infer<typeof allocationSchema>;
export type ShipmentSchemaType = z.infer<typeof shipmentSchema>;
export type ShipmentItemSchemaType = z.infer<typeof shipmentItemSchema>;
export type DeliveryProofSchemaType = z.infer<typeof deliveryProofSchema>;
