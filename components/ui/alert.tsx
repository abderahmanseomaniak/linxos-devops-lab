import * as React from "react"

import { cn } from "@/lib/utils"
import { AlertCircleIcon, CheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

const Alert = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    variant?: "default" | "destructive" | "success" | "warning"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const Icon = {
    default: InfoIcon,
    destructive: AlertCircleIcon,
    success: CheckIcon,
    warning: TriangleAlertIcon,
  }[variant]

  return (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variant === "default" && "border-input bg-background text-foreground",
        variant === "destructive" && "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        variant === "success" && "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-600",
        variant === "warning" && "border-yellow-500/50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-600",
        className
      )}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription, AlertTitle }