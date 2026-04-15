


export type EventStatus = 'Pending' | 'Accepted' | 'Rejected';

export type DeliveryStatus = 'Livrée' | 'Non livrée';

export interface EventApplication {
  id: number;
  priority: number;
  reference?: string;
  eventName: string;
  organization: string;
  organizationLogo?: string;
  date: string;
  product?: string;
  quantity?: number;
  status: EventStatus;
  deliveryStatus: DeliveryStatus;
  isRealized?: boolean;
}

export interface FilterCounts {
  all: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export type FilterType = 'all' | 'pending' | 'accepted' | 'rejected';

export interface EventTableProps {
  data: EventApplication[]
  onEdit?: (event: EventApplication) => void
  onDelete?: (event: EventApplication) => void
  onDeleteMultiple?: (ids: number[]) => void
  onAdd?: () => void
  onDetail?: (event: EventApplication) => void
}

export interface EventDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventApplication | null
}

export interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: EventApplication | null
  onSave: (data: EventApplication) => void
}

export interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  eventName?: string
}

export interface DeleteButtonProps {
  onClick: () => void
}