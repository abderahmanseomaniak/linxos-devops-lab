"use client"

import { cn } from "@/lib/utils"

function Footer({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "flex flex-col items-center justify-between gap-4 border-t px-4 py-6 md:flex-row md:px-6",
        className
      )}
      {...props}
    />
  )
}

function FooterBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="footer-brand"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function FooterTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="footer-title"
      className={cn("font-semibold", className)}
      {...props}
    />
  )
}

export { Footer, FooterBrand, FooterTitle }