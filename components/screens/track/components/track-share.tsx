"use client"

import { useState } from "react"
import { Share2, Copy, Check, Mail, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TrackShareProps {
  reference: string
  className?: string
}

export function TrackShare({ reference, className }: TrackShareProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/track?ref=${reference}`
      : ""

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmail = () => {
    const subject = `Track Request: ${reference}`
    const body = `Check the status of your request ${reference} here: ${shareUrl}`
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="size-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <Check className="size-4 mr-2" />
          ) : (
            <Copy className="size-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>
          <Mail className="size-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(reference)
          }}
        >
          <Link2 className="size-4 mr-2" />
          Copy Reference
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}