"use client"

import { AppSidebar } from "@/components/screens/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Typography } from "@/components/ui/typography"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { NavbarNotifications } from "@/components/navbar/navbar-notifications"
import { NavbarProfile } from "@/components/navbar/navbar-profile"
import { IconMenu2 } from "@tabler/icons-react"
import notificationsData from "@/data/notifications.json"
import usersData from "@/data/users.json"
import { User } from "@/types/users"

const PAGE_LABELS: Record<string, string> = {
  "dashboard-global": "Dashboard",
  "events": "Événements",
  "users": "Utilisateurs",
  "kanban": "Tableau Kanban",
  "logistics": "Logistique",
  "content": "Contenu UGC",
  "logs": "Journal",
  "config": "Configuration",
  "tracking": "Suivi",
  "forms": "Formulaires",
  "sponsorship": "Sponsoring",
  "profile": "Profil",
}

function PageIndicator({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean)
  const currentPage = segments[segments.length - 1] || "dashboard-global"
  const label = PAGE_LABELS[currentPage] || currentPage

  if (pathname === "/" || pathname === "/dashboard-global") {
    return null
  }

  return (
    <Typography variant="small" className="text-muted-foreground hidden md:block">
      {label}
    </Typography>
  )
}

export function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const currentUser = usersData[0] as User

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <PageIndicator pathname={pathname} />
          <div className="ml-auto flex items-center gap-2">
            <NavbarNotifications notifications={notificationsData} />
            <NavbarProfile user={currentUser} />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout