import type { UserRole } from "./users"
import type { WorkflowStage } from "../lib/workflow-engine"

export interface EnterpriseEntity {
  id: number
  createdAt: string
  updatedAt: string
  createdBy?: number
  assignedTo?: number
}

export interface EntityStatus {
  status: string
  statusChangedAt?: string
  statusChangedBy?: number
}

export interface EventEntity extends EnterpriseEntity, EntityStatus {
  reference: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  organization: {
    clubName: string
    city: string
    sport: string
    email: string
    phone: string
  }
  event: {
    name: string
    description: string
    startDate: string
    endDate: string
    location: string
  }
  workflow: {
    currentStage: WorkflowStage
    submittedAt?: string
    approvedAt?: string
    shippedAt?: string
    deliveredAt?: string
    publishedAt?: string
    completedAt?: string
  }
  assignments: {
    sponsorshipManagerId?: number
    logisticsManagerId?: number
    contentManagerId?: number
  }
  kanban: {
    stage: string
    priority: string
  }
}

export interface DeliveryEntity extends EnterpriseEntity {
  eventId: number
  eventName: string
  clubName: string
  city: string
  status: "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "ISSUE"
  shipment: {
    address: string
    contactName: string
    phone: string
    carrier?: string
    trackingNumber?: string
  }
  quantity: number
  issueType?: string
  issueDescription?: string
  timestamps: {
    preparedAt?: string
    shippedAt?: string
    deliveredAt?: string
    createdAt: string
  }
}

export interface ContentEntity extends EnterpriseEntity {
  eventId: number
  eventName: string
  clubName: string
  city: string
  date: string
  status: "PENDING" | "SUBMITTED" | "REVIEW" | "APPROVED" | "REVISION" | "PUBLISHED"
  ugc: {
    requiredCreators: number
    approvedCreators: number
    driveLink?: string
    publishedLinks: string[]
  }
  review: {
    reviewedBy?: number
    reviewedAt?: string
    feedback?: string
    revisionRequested: boolean
  }
}

export interface NotificationEntity {
  id: string
  userId?: number
  type: string
  title: string
  message: string
  read: boolean
  relatedEntity?: {
    type: string
    id: number
  }
  createdAt: string
}

export interface AuditLogEntity {
  id: string
  action: string
  entityType: "EVENT" | "LOGISTICS" | "CONTENT" | "USER" | "NOTIFICATION"
  entityId: number
  performedBy: {
    id: number
    name: string
    role: UserRole
  }
  previousValue?: string
  newValue?: string
  timestamp: string
}

export interface UserEntity extends EnterpriseEntity {
  name: string
  email: string
  phone: string
  cin: string
  role: UserRole
  status: boolean
  avatar?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

export interface FilterParams {
  search?: string
  status?: string
  city?: string
  dateFrom?: string
  dateTo?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}