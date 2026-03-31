import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typographyVariants = cva("scroll-m-20", {
  variants: {
    variant: {
      h1: "text-foreground text-5xl tracking-tighter text-balance lg:text-7xl",
      h2: "text-foreground text-4xl tracking-tight text-balance first:mt-0 lg:text-6xl",
      h3: "text-foreground text-2xl tracking-tight lg:text-4xl",
      h4: "text-foreground text-xl tracking-tight",
      lead: "text-muted-foreground text-xl leading-relaxed text-pretty",
      p: "text-muted-foreground text-pretty not-first:mt-4 lg:leading-6",
      large: "text-foreground text-lg font-medium",
      small: "text-muted-foreground text-sm leading-none",
      muted: "text-muted-foreground text-sm",
      code: "bg-muted text-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium",
      quote: "border-primary/30 text-muted-foreground mt-6 border-l-2 pl-6 italic",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="typography-h1"
      className={cn(typographyVariants({ variant: "h1", className }))}
      {...props}
    />
  )
}

function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="typography-h2"
      className={cn(typographyVariants({ variant: "h2", className }))}
      {...props}
    />
  )
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="typography-h3"
      className={cn(typographyVariants({ variant: "h3", className }))}
      {...props}
    />
  )
}

function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      data-slot="typography-h4"
      className={cn(typographyVariants({ variant: "h4", className }))}
      {...props}
    />
  )
}

function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography-lead"
      className={cn(typographyVariants({ variant: "lead", className }))}
      {...props}
    />
  )
}

function P({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography-p"
      className={cn(typographyVariants({ variant: "p", className }))}
      {...props}
    />
  )
}

function Large({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typography-large"
      className={cn(typographyVariants({ variant: "large", className }))}
      {...props}
    />
  )
}

function Small({ className, ...props }: React.ComponentProps<"small">) {
  return (
    <small
      data-slot="typography-small"
      className={cn(typographyVariants({ variant: "small", className }))}
      {...props}
    />
  )
}

function Muted({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="typography-muted"
      className={cn(typographyVariants({ variant: "muted", className }))}
      {...props}
    />
  )
}

function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="typography-code"
      className={cn(typographyVariants({ variant: "code", className }))}
      {...props}
    />
  )
}

function Quote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="typography-quote"
      className={cn(typographyVariants({ variant: "quote", className }))}
      {...props}
    />
  )
}

export {
  H1,
  H2,
  H3,
  H4,
  Lead,
  P,
  Large,
  Small,
  Muted,
  InlineCode,
  Quote,
  typographyVariants,
}
