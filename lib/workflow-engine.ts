export const WORKFLOW_STAGES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "KANBAN",
  "LOGISTICS_ASSIGNED",
  "SHIPPED",
  "DELIVERED",
  "CONTENT_PENDING",
  "CONTENT_REVIEW",
  "UGC_APPROVED",
  "PUBLISHED",
  "COMPLETED",
  "ARCHIVED"
] as const

export type WorkflowStage = typeof WORKFLOW_STAGES[number]

export const WORKFLOW_STAGE_LABELS: Record<WorkflowStage, string> = {
  SUBMITTED: "Soumis",
  UNDER_REVIEW: "En révision",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  KANBAN: "Kanban",
  LOGISTICS_ASSIGNED: "Logistique assigné",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  CONTENT_PENDING: "Contenu en attente",
  CONTENT_REVIEW: "Révision du contenu",
  UGC_APPROVED: "UGC approuvé",
  PUBLISHED: "Publié",
  COMPLETED: "Terminé",
  ARCHIVED: "Archivé"
}

export const WORKFLOW_STAGE_COLORS: Record<WorkflowStage, string> = {
  SUBMITTED: "bg-gray-500",
  UNDER_REVIEW: "bg-yellow-500",
  APPROVED: "bg-blue-500",
  REJECTED: "bg-red-500",
  KANBAN: "bg-purple-500",
  LOGISTICS_ASSIGNED: "bg-indigo-500",
  SHIPPED: "bg-orange-500",
  DELIVERED: "bg-cyan-500",
  CONTENT_PENDING: "bg-pink-500",
  CONTENT_REVIEW: "bg-rose-500",
  UGC_APPROVED: "bg-green-500",
  PUBLISHED: "bg-emerald-500",
  COMPLETED: "bg-teal-500",
  ARCHIVED: "bg-slate-500"
}

export const WORKFLOW_TRANSITIONS: Record<WorkflowStage, WorkflowStage[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["KANBAN", "LOGISTICS_ASSIGNED"],
  REJECTED: ["ARCHIVED"],
  KANBAN: ["LOGISTICS_ASSIGNED"],
  LOGISTICS_ASSIGNED: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["CONTENT_PENDING"],
  CONTENT_PENDING: ["CONTENT_REVIEW"],
  CONTENT_REVIEW: ["UGC_APPROVED", "CONTENT_PENDING", "PUBLISHED"],
  UGC_APPROVED: ["PUBLISHED"],
  PUBLISHED: ["COMPLETED"],
  COMPLETED: ["ARCHIVED"],
  ARCHIVED: []
}

export function canTransition(from: WorkflowStage, to: WorkflowStage): boolean {
  return WORKFLOW_TRANSITIONS[from]?.includes(to) ?? false
}

export const ROLE_PERMISSIONS = {
  system_administrator: ["*"],
  sponsorship_manager: ["events", "kanban", "sponsorship", "tracking", "approvals"],
  logistics_manager: ["logistics", "deliveries", "shipments"],
  ugc_content_manager: ["content", "ugc", "creators", "publications"],
  club_partner: ["tracking", "public-form", "my-requests"]
} as const

export type UserRole = keyof typeof ROLE_PERMISSIONS

export function hasPermission(role: UserRole, module: string): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions.includes("*") || permissions.includes(module as any)
}

export const NOTIFICATION_TYPES = {
  EVENT_SUBMITTED: "EVENT_SUBMITTED",
  EVENT_APPROVED: "EVENT_APPROVED",
  EVENT_REJECTED: "EVENT_REJECTED",
  DELIVERY_ASSIGNED: "DELIVERY_ASSIGNED",
  DELIVERY_SHIPPED: "DELIVERY_SHIPPED",
  DELIVERY_COMPLETED: "DELIVERY_COMPLETED",
  CONTENT_UPLOADED: "CONTENT_UPLOADED",
  CONTENT_APPROVED: "CONTENT_APPROVED",
  CONTENT_REVISION: "CONTENT_REVISION",
  CONTENT_PUBLISHED: "CONTENT_PUBLISHED",
  KANBAN_MOVED: "KANBAN_MOVED",
  USER_ASSIGNED: "USER_ASSIGNED"
} as const

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]

export const AUDIT_ACTIONS = {
  CREATE_EVENT: "CREATE_EVENT",
  UPDATE_EVENT: "UPDATE_EVENT",
  DELETE_EVENT: "DELETE_EVENT",
  APPROVE_EVENT: "APPROVE_EVENT",
  REJECT_EVENT: "REJECT_EVENT",
  MOVE_KANBAN: "MOVE_KANBAN",
  ASSIGN_DELIVERY: "ASSIGN_DELIVERY",
  UPDATE_DELIVERY: "UPDATE_DELIVERY",
  UPLOAD_CONTENT: "UPLOAD_CONTENT",
  APPROVE_CONTENT: "APPROVE_CONTENT",
  REVISION_CONTENT: "REVISION_CONTENT",
  PUBLISH_CONTENT: "PUBLISH_CONTENT",
  CREATE_USER: "CREATE_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT"
} as const

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS]

export interface AuditLogEntry {
  id: string
  action: AuditAction
  entityType: "EVENT" | "LOGISTICS" | "CONTENT" | "USER" | "NOTIFICATION"
  entityId: number
  performedBy: {
    id: number
    name: string
    role: UserRole
  }
  previousState?: Record<string, unknown>
  newState?: Record<string, unknown>
  timestamp: string
}

export function generateAuditId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateNotificationId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export interface EntityBase {
  id: number
  createdAt: string
  updatedAt: string
  createdBy?: number
  assignedTo?: number
  status: string
}

export const DEFAULT_PAGINATION = {
  page: 0,
  pageSize: 10,
  totalPages: 0,
  totalItems: 0
}

export function formatDateISO(date: Date | string): string {
  if (typeof date === "string") return date
  return date.toISOString()
}

export function formatDateLocale(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}