"use client"

import { useEffect, useState, useRef } from "react"
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
  const shareUrlRef = useRef("")

  useEffect(() => {
    shareUrlRef.current = `${window.location.origin}/track?ref=${reference}`
  }, [reference])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrlRef.current)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmail = () => {
    const subject = `Suivi de demande : ${reference}`
    const body = `Suivez le statut de votre demande ${reference} ici : ${shareUrlRef.current}`
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="size-4 mr-2" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <Check className="size-4 mr-2" />
          ) : (
            <Copy className="size-4 mr-2" />
          )}
          {copied ? "Copié !" : "Copier le lien"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>
          <Mail className="size-4 mr-2" />
          Envoyer par email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(reference)
          }}
        >
          <Link2 className="size-4 mr-2" />
          Copier la référence
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
