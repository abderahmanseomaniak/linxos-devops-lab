"use client";

import { cn } from "@/lib/utils"

type PeackGradientProps = {
  className?: string
}

function PeackGradient({ className }: PeackGradientProps) {
  return (
    <div
      aria-hidden
      data-slot="peack-gradient"
      className={cn(
        "pointer-events-none animate-peack bg-[length:400%_400%] bg-linear-to-br from-primary via-primary-foreground to-accent dark:from-zinc-900 dark:via-primary dark:to-zinc-800",
        className
      )}
    />
  )
}

export { PeackGradient }
