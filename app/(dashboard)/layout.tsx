"use client"

import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar"
import DropdownProfile from "@/components/ui/dropdown-profile"
import Notifications from "@/components/ui/notifications"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { type ReactNode } from "react"
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <SidebarProvider>
      <AppSidebar />
            <Toaster richColors position="top-right" />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 " suppressHydrationWarning>
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-6">
            <Notifications />
            <DropdownProfile />
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
