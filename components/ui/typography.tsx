import { cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const typographyVariants = cva("scroll-m-20", {
  variants: {
    variant: {
      h1: "text-foreground text-4xl tracking-tighter text-balance lg:text-6xl",
      h2: "text-foreground text-3xl tracking-tight text-balance first:mt-0 lg:text-5xl",
      h3: "text-foreground text-xl tracking-tight lg:text-3xl",
      h4: "text-foreground text-lg tracking-tight",
      lead: "text-muted-foreground leading-relaxed text-pretty",
      p: "text-muted-foreground text-sm text-pretty",
      large: "text-foreground font-medium",
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

const defaultElements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  p: "p",
  large: "div",
  small: "small",
  muted: "span",
  code: "code",
  quote: "blockquote",
} as const

type Variant = keyof typeof defaultElements

type TypographyProps = React.ComponentProps<"p"> & {
  variant?: Variant
}

function Typography({
  variant = "p",
  className,
  ...props
}: TypographyProps) {
  const Comp = defaultElements[variant] as React.ElementType

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant, className }))}
      {...props}
    />
  )
}


export {
  Typography,
  typographyVariants
}

