import type { UserRole } from "@/types/profiles.types"

export const ROLE_MENU_ACCESS: Record<string, string[]> = {
  ADMIN: [
    "dashboard", "evenements", "campagnes", "categories", "produits",
    "stocks", "allocations", "livraison", "ugc", "reporting",
    "notifications", "journalisation", "configuration", "utilisateurs", "profil",
  ],
  SPONSORING_MANAGER: [
    "dashboard", "evenements", "allocations", "campagnes", "categories",
    "produits", "stocks", "notifications", "profil",
  ],
  LOGISTICS_MANAGER: [
    "dashboard", "stocks", "produits", "categories", "allocations",
    "livraison", "evenements", "notifications", "profil",
  ],
  CONTENT_MANAGER: [
    "dashboard", "evenements", "ugc", "campagnes", "notifications", "profil",
  ],
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrateur",
  SPONSORING_MANAGER: "Sponsoring Manager",
  LOGISTICS_MANAGER: "Logistics Manager",
  CONTENT_MANAGER: "Content Manager",
}

export function hasRole(userRole: string | undefined, ...roles: string[]): boolean {
  if (!userRole) return false
  return roles.includes(userRole)
}
