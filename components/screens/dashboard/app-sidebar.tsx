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
import { IconCalendar, IconLayoutBoardSplit, IconHome, IconLayoutDashboard, IconLogin, IconSearch, IconSettings, IconUsers, IconLayoutGrid, IconTruck, IconFileText, IconMapPin, IconClipboardList, IconList } from "@tabler/icons-react"

import uiConstants from "@/data/ui-constants.json"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard: IconLayoutDashboard,
  Home: IconHome,
  Search: IconSearch,
  Settings: IconSettings,
  Calendar: IconCalendar,
  Users: IconUsers,
  LayoutGrid: IconLayoutGrid,
  Truck: IconTruck,
  FileText: IconFileText,
  MapPin: IconMapPin,
  ClipboardList: IconClipboardList,
  Scroll: IconList,
}





const managementItems = uiConstants.sidebar.management.map(item => ({
  ...item,
  icon: iconMap[item.icon],
}))
const testItems = uiConstants.sidebar.test.map(item => ({
  ...item,
  icon: iconMap[item.icon],
}))

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" >
                {/* Light mode */}
                <Image
                  src="/assets/logos/logo-texte-noir.png"
                  alt="Logo"
                  width={128}
                  height={48}
                  className="block dark:hidden"
                />

                {/* Dark mode */}
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
        
       
        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
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
         <SidebarGroup>
          <SidebarGroupLabel>Test</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {testItems.map((item) => (
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/auth">
                <IconLogin />
                <span>Login</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}