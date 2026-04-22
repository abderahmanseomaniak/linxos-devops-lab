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
import { IconCalendar, IconLayoutBoardSplit, IconHome, IconLayoutDashboard, IconLogin, IconSearch, IconSettings, IconScroll, IconIconUsers, IconLayoutGrid, IconTruck, IconFileText, IconMapPin, IconClipboardList } from "@tabler/icons-react"
import Link from "next/link"
import uiConstants from "@/data/ui-constants.json"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  IconLayoutDashboard,
  IconHome,
  IconSearch,
  IconSettings,
  IconCalendar,
  IconIconUsers,
  IconLayoutGrid,
  IconTruck,
  IconFileText,
  IconMapPin,
  IconClipboardList,
  IconScroll,
}

const generalItems = uiConstants.sidebar.general.map(item => ({
  ...item,
  icon: iconMap[item.icon],
}))



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
                <img
                  src="/assets/logos/logo-texte-noir.svg"
                  alt="Logo"
                  className="h-7 block dark:hidden"
                />

                {/* Dark mode */}
                <img
                  src="/assets/logos/logo-texte-blanc.svg"
                  alt="Logo"
                  className="h-7 hidden dark:block"
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