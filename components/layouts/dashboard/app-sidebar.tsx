"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconCalendar,
  IconHome,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconLayoutGrid,
  IconTruck,
  IconFileText,
  IconMapPin,
  IconClipboardList,
  IconList,
  IconPackage,
  IconChartBar,
  IconBell,
  IconLogs,
  IconCategory,
  IconGift,
  IconPhoto,
  IconChecklist,
  IconUser,
  IconTruckDelivery,
  IconCertificate,
} from "@tabler/icons-react"
import { useAuth } from "@/providers/auth-provider"
import { ROLE_MENU_ACCESS } from "@/lib/auth-utils"

const roleMenuConfig: Record<string, Array<{ title: string; href: string; icon: React.ComponentType<{ className?: string }>; group: string }>> = {
  ADMIN: [
    { title: "Dashboard", href: "/", icon: IconLayoutDashboard, group: "Général" },
    { title: "Événements", href: "/events", icon: IconCalendar, group: "Gestion" },
    { title: "Campagnes", href: "/campaigns", icon: IconGift, group: "Gestion" },
    { title: "Catégories", href: "/categories", icon: IconCategory, group: "Gestion" },
    { title: "Produits", href: "/products", icon: IconPackage, group: "Gestion" },
    { title: "Stocks", href: "/stocks", icon: IconChartBar, group: "Gestion" },
    { title: "Allocations", href: "/allocations", icon: IconClipboardList, group: "Gestion" },
    { title: "Livraison", href: "/logistics", icon: IconTruckDelivery, group: "Gestion" },
    { title: "UGC", href: "/ugc", icon: IconPhoto, group: "Gestion" },
    { title: "Reporting", href: "/reporting", icon: IconChartBar, group: "Gestion" },
    { title: "Notifications", href: "/notifications", icon: IconBell, group: "Gestion" },
    { title: "Journalisation", href: "/logs", icon: IconLogs, group: "Gestion" },
    { title: "Configuration", href: "/config", icon: IconSettings, group: "Gestion" },
    { title: "Utilisateurs", href: "/users", icon: IconUsers, group: "Gestion" },
    { title: "Profil", href: "/profile", icon: IconUser, group: "Gestion" },
  ],
  SPONSORING_MANAGER: [
    { title: "Dashboard", href: "/", icon: IconLayoutDashboard, group: "Général" },
    { title: "Événements", href: "/events", icon: IconCalendar, group: "Gestion" },
    { title: "Allocations", href: "/allocations", icon: IconClipboardList, group: "Gestion" },
    { title: "Campagnes", href: "/campaigns", icon: IconGift, group: "Gestion" },
    { title: "Catégories", href: "/categories", icon: IconCategory, group: "Gestion" },
    { title: "Produits", href: "/products", icon: IconPackage, group: "Gestion" },
    { title: "Stocks", href: "/stocks", icon: IconChartBar, group: "Gestion" },
    { title: "Notifications", href: "/notifications", icon: IconBell, group: "Gestion" },
    { title: "Profil", href: "/profile", icon: IconUser, group: "Gestion" },
  ],
  LOGISTICS_MANAGER: [
    { title: "Dashboard Livraison", href: "/", icon: IconLayoutDashboard, group: "Général" },
    { title: "Livraisons", href: "/logistics", icon: IconTruckDelivery, group: "Gestion" },
    { title: "Preuves Livraison", href: "/delivery-proofs", icon: IconCertificate, group: "Gestion" },
    { title: "Notifications", href: "/notifications", icon: IconBell, group: "Gestion" },
    { title: "Profil", href: "/profile", icon: IconUser, group: "Gestion" },
  ],
  CONTENT_MANAGER: [
    { title: "Dashboard UGC", href: "/", icon: IconLayoutDashboard, group: "Général" },
    { title: "Contenus UGC", href: "/content", icon: IconPhoto, group: "Gestion" },
    { title: "Vérifications", href: "/verifications", icon: IconChecklist, group: "Gestion" },
    { title: "Reporting UGC", href: "/reporting", icon: IconChartBar, group: "Gestion" },
    { title: "Notifications", href: "/notifications", icon: IconBell, group: "Gestion" },
    { title: "Profil", href: "/profile", icon: IconUser, group: "Gestion" },
  ],
  MARKETING: [
    { title: "Dashboard", href: "/", icon: IconLayoutDashboard, group: "Général" },
    { title: "Événements", href: "/events", icon: IconCalendar, group: "Gestion" },
    { title: "Campagnes", href: "/campaigns", icon: IconGift, group: "Gestion" },
    { title: "Notifications", href: "/notifications", icon: IconBell, group: "Gestion" },
    { title: "Profil", href: "/profile", icon: IconUser, group: "Gestion" },
  ],
  VIEWER: [
    { title: "Dashboard", href: "/", icon: IconLayoutDashboard, group: "Général" },
    { title: "Événements", href: "/events", icon: IconCalendar, group: "Gestion" },
    { title: "Notifications", href: "/notifications", icon: IconBell, group: "Gestion" },
    { title: "Profil", href: "/profile", icon: IconUser, group: "Gestion" },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { profile, loading, signOut } = useAuth()

  const role = profile?.role ?? "VIEWER"
  const menuItems = roleMenuConfig[role] ?? roleMenuConfig.VIEWER

  const groupedItems = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src="/assets/logos/logo-texte-noir.png"
                  alt="Logo"
                  width={128}
                  height={48}
                  className="block dark:hidden"
                />
                <Image
                  src="/assets/logos/logo-texte-blanc.png"
                  alt="Logo"
                  width={128}
                  height={48}
                  className="hidden dark:block"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(groupedItems).map(([groupLabel, items]) => (
          <SidebarGroup key={groupLabel}>
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
