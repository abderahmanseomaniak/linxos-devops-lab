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
  VIEWER: [
    "dashboard", "evenements", "notifications", "profil",
  ],
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrateur",
  SPONSORING_MANAGER: "Sponsoring Manager",
  VIEWER: "Lecteur",
}

export function hasRole(userRole: string | undefined, ...roles: string[]): boolean {
  if (!userRole) return false
  return roles.includes(userRole)
}
