export type EventStatus = 'Pending' | 'Accepted' | 'Rejected' | 'In Logistics' | 'Delivered';

export interface EventApplication {
  id: number;
  priority: number;
  eventName: string;
  organization: string;
  date: string; // YYYY-MM-DD
  product: string;
  quantity: number;
  status: EventStatus;
}

export interface FilterCounts {
  all: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export type FilterType = 'all' | 'pending' | 'accepted' | 'rejected';