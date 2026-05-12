"use client"

import * as React from "react"
import { IconMinus, IconPlus } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NumberInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

function NumberInput({
  className,
  value = 0,
  onValueChange,
  min = 0,
  max,
  step = 1,
  disabled,
  ...props
}: NumberInputProps) {
  const clamp = React.useCallback(
    (v: number) => {
      let clamped = v
      if (min !== undefined) clamped = Math.max(min, clamped)
      if (max !== undefined) clamped = Math.min(max, clamped)
      return clamped
    },
    [min, max]
  )

  const decrement = () => onValueChange?.(clamp(value - step))
  const increment = () => onValueChange?.(clamp(value + step))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === "" || raw === "-") return
    const parsed = Number(raw)
    if (!Number.isNaN(parsed)) onValueChange?.(clamp(parsed))
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || (min !== undefined && value <= min)}
        onClick={decrement}
        aria-label="Diminuer"
      >
        <IconMinus />
      </Button>
      <Input
        inputMode="numeric"
        className="text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        min={min}
        max={max}
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={increment}
        aria-label="Augmenter"
      >
        <IconPlus />
      </Button>
    </div>
  )
}

export { NumberInput }
export type { NumberInputProps }
