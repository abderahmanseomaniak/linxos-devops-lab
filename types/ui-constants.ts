export interface UIConstants {
  eventStatus: {
    labels: Record<string, string>
    variants: Record<string, string>
  }
  deliveryStatus: {
    labels: Record<string, string>
    variants: Record<string, string>
  }
  userRole: {
    labels: Record<string, string>
  }
  sidebar: {
    general: SidebarItem[]
    main: SidebarItem[]
    management: SidebarItem[]
  }
  iconMap: Record<string, string>
}

export interface SidebarItem {
  title: string
  href: string
  icon: string
}
