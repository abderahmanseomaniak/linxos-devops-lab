export type EventStatus = 'Pending' | 'Accepted' | 'Rejected';

export type DeliveryStatus = 'Livrée' | 'Non livrée';

export interface EventApplication {
  id: number;
  priority: number;
  eventName: string;
  organization: string;
  organizationLogo?: string;
  date: string; // YYYY-MM-DD
  product: string;
  quantity: number;
  status: EventStatus;
  deliveryStatus: DeliveryStatus;
}

export interface FilterCounts {
  all: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export type FilterType = 'all' | 'pending' | 'accepted' | 'rejected';