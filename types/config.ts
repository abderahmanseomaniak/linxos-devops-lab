export interface UGCSettings {
  minUgcCreators: number
}

export interface EventPipeline {
  defaultEventStages: string[]
}

export interface ScoringWeights {
  audienceWeight: number
  engagementWeight: number
  contentQualityWeight: number
}

export interface ScoringSystem {
  scoringWeights: ScoringWeights
}

export interface NotificationSettings {
  emailEnabled: boolean
  inAppEnabled: boolean
  deliveryAlerts: boolean
  contentAlerts: boolean
}

export interface PlatformConfig {
  ugcSettings: UGCSettings
  eventPipeline: EventPipeline
  scoringSystem: ScoringSystem
  notificationSettings: NotificationSettings
}

export interface PlatformConfigData {
  ugcSettings: UGCSettings
  eventPipeline: EventPipeline
  scoringSystem: ScoringSystem
  notificationSettings: NotificationSettings
}