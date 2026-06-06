"use client"

import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar"
import DropdownProfile from "@/components/ui/dropdown-profile"
import Notifications from "@/components/ui/notifications"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { type ReactNode, useEffect } from "react"
import { Toaster } from "sonner"
import { SearchIcon } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/auth")
      return
    }
    if (profile && !profile.is_active) {
      router.replace("/auth")
    }
  }, [user, profile, loading, router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster richColors position="top-right" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4" suppressHydrationWarning>
          <SidebarTrigger className="-ml-1" />
          <div className="relative ml-2 hidden md:block">
            <SearchIcon className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Rechercher..."
              className="h-9 w-56 rounded-lg pl-8 text-sm lg:w-72"
            />
          </div>
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
