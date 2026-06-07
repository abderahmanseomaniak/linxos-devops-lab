"use client"

import {
  LogOutIcon,
  UserIcon,
  ChevronDownIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/providers/auth-provider"
import { USER_ROLE_LABELS } from "@/types/profiles.types"
import Link from "next/link"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function DropdownProfile() {
  const { profile, user, signOut } = useAuth()

  const name = profile?.full_name ?? user?.email ?? "Utilisateur"
  const email = profile?.email ?? user?.email ?? ""
  const role = profile?.role ?? "CONTENT_MANAGER"
  const initials = getInitials(name)
  const avatarUrl = user?.user_metadata?.avatar_url ?? "/origin/avatar.jpg"

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto gap-2 p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt={name} src={avatarUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <div className="text-sm font-medium">{name}</div>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{USER_ROLE_LABELS[role] ?? role}</Badge>
          </div>
          <ChevronDownIcon
            aria-hidden="true"
            className="opacity-60"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">{name}</span>
          <span className="truncate font-normal text-muted-foreground text-xs">{email}</span>
          <Badge variant="secondary" className="mt-1 w-fit text-[10px]">{USER_ROLE_LABELS[role] ?? role}</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
