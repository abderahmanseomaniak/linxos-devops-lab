


export const DEFAULT_PAGE_SIZE = 20
export const DEFAULT_SORTING = { desc: true, id: "created_at" } as const

export const ACTION_LABELS: Record<string, string> = {
  CREATE: "Création",
  UPDATE: "Modification",
  DELETE: "Suppression",
  APPROVE: "Approbation",
  REJECT: "Rejet",
  INVITE: "Invitation",
  DELIVER: "Livraison",
}

export const actions = Object.keys(ACTION_LABELS)

export const MODULE_LABELS: Record<string, string> = {
  EVENTS: "Événements",
  CAMPAIGNS: "Campagnes",
  INVENTORY: "Inventaire",
  STOCKS: "Stocks",
  USERS: "Utilisateurs",
  SHIPMENTS: "Expéditions",
  CONTENT: "Contenu",
  AUTH: "Authentification",
}

export const actionVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  APPROVE: "default",
  REJECT: "destructive",
  INVITE: "secondary",
  DELIVER: "default",
}
