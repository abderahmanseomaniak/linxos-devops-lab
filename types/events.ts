


export type EventStatus = 'Pending' | 'Accepted' | 'Rejected';

export type DeliveryStatus = 'Livrée' | 'Non livrée';

export interface Step1Data {
  nomClub: string
  sport: string
  ville: string
  email: string
  telephone: string
}

export interface Step2Data {
  nomResponsable: string
  fonction: string
  emailResponsable: string
  telephoneResponsable: string
}

export interface Step3Data {
  nomEvenement: string
  dateDebut: string
  dateFin: string
  lieu: string
  description: string
  hasUGC: boolean
}

export interface Creator {
  id: string
  nom: string
  instagram: string
  tiktok: string
  followersInstagram: string
  followersTikTok: string
  available: boolean
}

export interface Step4Data {
  creators: Creator[]
}

export interface Step5Data {
  selectedContentTypes: string[]
  files: Record<string, unknown>
}

export interface Step6Data {
  visibilite: string
  mentions: string
  autresConditions: string
}

export interface EventApplication {
  id: number
  priority: number
  reference?: string
  eventName: string
  organization: string
  organizationLogo?: string
  date: string
  product?: string
  quantity?: number
  status: EventStatus
  deliveryStatus: DeliveryStatus
  isRealized?: boolean
  step1?: Step1Data
  step2?: Step2Data
  step3?: Step3Data
  step4?: Step4Data
  step5?: Step5Data
  step6?: Step6Data
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
  onSave?: (event: EventApplication) => void
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

export interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  variant?: "default" | "success" | "warning" | "destructive"
}

export interface DashboardStatsData {
  total: number
  accepted: number
  pending: number
  rejected: number
}

export interface DashboardStatsProps {
  data: DashboardStatsData
}