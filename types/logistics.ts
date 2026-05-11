export type LogisticsStatus = string;

export type IssueType = "not_delivered" | "returned" | "damaged" | "wrong_address" | "other";

export interface Note {
  id: number;
  content: string;
  createdAt: string;
  author: string;
}

export interface Delivery {
  id: number;
  eventName: string;
  clubName: string;
  city: string;
  address: string;
  contactName: string;
  phone: string;
  date: string;
  quantity: number;
  status: LogisticsStatus;
  issueType?: IssueType;
  issueDescription?: string;
  notes: Note[];
  receiptUrl?: string;
  receiptFile?: File | null;
  deliveryStartedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export const IssueTypeLabels: Record<IssueType, string> = {
  not_delivered: "Not delivered",
  returned: "Returned",
  damaged: "Damaged",
  wrong_address: "Wrong address",
  other: "Other",
};

export const StatusLabels: Record<LogisticsStatus, string> = {
  Ready: "Ready",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Issue: "Issue",
};

export interface DeliveryCardProps {
  delivery: Delivery
  onStatusChange: (id: number, newStatus: LogisticsStatus, issueType?: Delivery["issueType"], issueDescription?: string) => void
  onViewDetails: (delivery: Delivery) => void
  onAddNote: (id: number, note: string) => void
  onUploadReceipt: (id: number, file: File) => void
  onContactWhatsApp: (phone: string) => void
}

export interface DeliveryDetailsModalProps {
  delivery: Delivery | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactWhatsApp: (phone: string) => void
}

export interface StatusBadgeProps {
  status: LogisticsStatus
}

export interface FiltersBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  cityFilter: string
  onCityFilterChange: (value: string) => void
  cities: string[]
}