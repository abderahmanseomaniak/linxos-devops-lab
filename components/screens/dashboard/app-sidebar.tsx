"use client"

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
import { IconCalendar, IconHome, IconLayoutDashboard, IconLogin, IconSettings, IconUsers, IconLayoutGrid, IconTruck, IconFileText, IconMapPin, IconList } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import uiConstants from "@/data/ui-constants.json"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard: IconLayoutDashboard,
  Home: IconHome,
  Settings: IconSettings,
  Calendar: IconCalendar,
  Users: IconUsers,
  LayoutGrid: IconLayoutGrid,
  Truck: IconTruck,
  FileText: IconFileText,
  MapPin: IconMapPin,
  ClipboardList: IconList,
  Scroll: IconList,
}

const generalItems = uiConstants.sidebar.general.map(item => ({
  ...item,
  icon: iconMap[item.icon],
}))

const managementItems = uiConstants.sidebar.management.map(item => ({
  ...item,
  icon: iconMap[item.icon],
}))

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard-global") {
      return pathname === href || pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/assets/logos/logo-texte-noir.png"
                  alt="Logo"
                  className="h-12 block dark:hidden"
                />
                <img
                  src="/assets/logos/logo-texte-blanc.png"
                  alt="Logo"
                  className="h-12 hidden dark:block"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Général</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
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

        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/auth"}>
              <Link href="/auth">
                <IconLogin />
                <span>Connexion</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}