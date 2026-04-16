export interface Step1FormData {
  nomClub: string
  sport: string
  ville: string
  email: string
  telephone: string
}

export interface Step2FormData {
  nomResponsable: string
  fonction: string
  emailResponsable: string
  telephoneResponsable: string
}

export interface Step3FormData {
  nomEvenement: string
  type: string
  dateDebut: string
  dateFin: string
  lieu: string
  participants: string
  targetAudience: string
  hasUGC: boolean
}

export interface Creator {
  id: string
  name: string
  instagram: string
  tiktok: string
  followersInstagram: string
  followersTikTok: string
  available: boolean
  contentTypes: string[]
}

export interface Step4FormData {
  creators: Creator[]
}

export interface ContentFiles {
  [key: string]: File | File[] | null
}

export interface Step5FormData {
  selectedContentTypes: string[]
  files: ContentFiles
}

export interface Step6FormData {
  visibilite: string
  logistique: string[]
}

export interface SponsorshipFormData {
  step1?: Step1FormData
  step2?: Step2FormData
  step3?: Step3FormData
  step4?: Step4FormData
  step5?: Step5FormData
  step6?: Step6FormData
}

export interface FormOption {
  id: string
  label: string
}

export interface FormOptionsData {
  contentTypes: FormOption[]
  creatorContentTypes: FormOption[]
  eventTypes: FormOption[]
  logisticOptions: FormOption[]
  avatarColors: string[]
  userAvatarColors: string[]
}

export interface Step {
  id: number
  title: string
}

export interface WizardState {
  activeStepIndex: number
  hasUGC: boolean
  creators: Creator[]
  contentData: {
    selectedContentTypes: string[]
    files: ContentFiles
  }
}

export interface Step3FormProps {
  hasUGC: boolean
  onHasUGCChange: (value: boolean) => void
}

export interface Step4FormProps {
  creators: Creator[]
  onAddCreator: () => void
  onRemoveCreator: (id: string) => void
  onUpdateCreator: (id: string, field: keyof Creator, value: unknown) => void
}

export interface Step5FormProps {
  selectedContentTypes?: string[]
  files?: ContentFiles
  onChange?: (data: { selectedContentTypes: string[]; files: ContentFiles }) => void
}

export interface Step7FormProps {
  summaryStep: number
  onEdit: (step: number) => void
}