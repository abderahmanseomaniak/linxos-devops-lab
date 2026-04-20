export type LogisticsStatus = "Ready" | "Shipped" | "Delivered" | "Issue";

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