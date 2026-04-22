import type { FieldError, Merge } from "react-hook-form"

import { Typography } from "@/components/ui/typography"

type ErrorLike =
  | FieldError
  | Merge<FieldError, (FieldError | undefined)[]>
  | { message?: string }
  | undefined

export function FieldMessage({ error }: { error?: ErrorLike }) {
  const message = (error as { message?: string } | undefined)?.message
  if (!message) return null
  return (
    <Typography variant="small" role="alert" className="text-destructive">
      {message}
    </Typography>
  )
}
