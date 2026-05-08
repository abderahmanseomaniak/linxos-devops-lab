"use client"

import { AppSidebar } from "@/components/screens/dashboard/app-sidebar"
import DropdownProfile from "@/components/ui/dropdown-profile"
import Notifications from "@/components/ui/notifications"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useState, useEffect, type ReactNode } from "react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 ">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-6">
            {mounted && <Notifications />}
            {mounted && <DropdownProfile />}
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
