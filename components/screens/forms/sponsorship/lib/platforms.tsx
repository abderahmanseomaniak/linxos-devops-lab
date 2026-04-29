import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconLink,
  IconWorld,
  type IconProps,
} from "@tabler/icons-react"
import type { FC } from "react"

export type Platform =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "x"
  | "website"
  | "other"

const hostPatterns: Array<{ platform: Platform; pattern: RegExp }> = [
  { platform: "instagram", pattern: /(^|\.)instagram\.com/i },
  { platform: "tiktok", pattern: /(^|\.)tiktok\.com/i },
  { platform: "facebook", pattern: /(^|\.)(facebook|fb)\.com/i },
  { platform: "x", pattern: /(^|\.)(twitter|x)\.com/i },
]

export function detectPlatform(url: string): Platform {
  const value = url.trim()
  if (!value) return "other"
  for (const { platform, pattern } of hostPatterns) {
    if (pattern.test(value)) return platform
  }
  if (/^https?:\/\//i.test(value) || /\.[a-z]{2,}($|\/)/i.test(value)) return "website"
  return "other"
}

const icons: Record<Platform, FC<IconProps>> = {
  instagram: IconBrandInstagram,
  tiktok: IconBrandTiktok,
  facebook: IconBrandFacebook,
  x: IconBrandX,
  website: IconWorld,
  other: IconLink,
}

export function PlatformIcon({ platform }: { platform: Platform }) {
  const Icon = icons[platform]
  return <Icon className="size-4" aria-hidden="true" />
}
