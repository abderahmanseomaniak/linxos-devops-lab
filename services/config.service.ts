import { analyticsService } from "@/services/analytics.service"
import { campaignsService } from "@/services/campaigns.service"
import type { Campaign } from "@/types/campaigns.types"
import type {
  ScoringProfile,
  ScoringProfileInsert,
  ScoringProfileUpdate,
  ScoringRule,
  ScoringRuleInsert,
  ScoringRuleUpdate,
} from "@/types/analytics.types"

async function listCampaigns(): Promise<Campaign[]> {
  const result = await campaignsService.list({ pageSize: 100 })
  return result.data
}

async function listScoringProfiles(): Promise<ScoringProfile[]> {
  return analyticsService.listScoringProfiles()
}

async function getScoringProfileById(id: string): Promise<ScoringProfile | null> {
  return analyticsService.getScoringProfileById(id)
}

async function createScoringProfile(data: ScoringProfileInsert): Promise<ScoringProfile> {
  return analyticsService.createScoringProfile(data)
}

async function updateScoringProfile(id: string, data: ScoringProfileUpdate): Promise<ScoringProfile> {
  return analyticsService.updateScoringProfile(id, data)
}

async function removeScoringProfile(id: string): Promise<void> {
  return analyticsService.removeScoringProfile(id)
}

async function listRulesByProfile(profileId: string): Promise<ScoringRule[]> {
  return analyticsService.listScoringRulesByProfile(profileId)
}

async function createRule(data: ScoringRuleInsert): Promise<ScoringRule> {
  return analyticsService.createScoringRule(data)
}

async function updateRule(id: string, data: ScoringRuleUpdate): Promise<ScoringRule> {
  return analyticsService.updateScoringRule(id, data)
}

async function removeRule(id: string): Promise<void> {
  return analyticsService.removeScoringRule(id)
}

export const configService = {
  listCampaigns,
  listScoringProfiles,
  getScoringProfileById,
  createScoringProfile,
  updateScoringProfile,
  removeScoringProfile,
  listRulesByProfile,
  createRule,
  updateRule,
  removeRule,
}
