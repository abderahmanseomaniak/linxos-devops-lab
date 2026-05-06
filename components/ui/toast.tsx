"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { IconCheck, IconAlertCircle, IconFileInfo, IconX } from "@tabler/icons-react"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const iconMap: Record<string, React.ElementType> = {
  success: IconCheck,
  error: IconAlertCircle,
  warning: IconAlertCircle,
  info: IconFileInfo,
}

const variantStyles: Record<string, string> = {
  success: "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20",
  error: "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20",
  warning: "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20",
  info: "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20",
}

const iconColors: Record<string, string> = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-amber-600",
  info: "text-blue-600",
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = iconMap[toast.type] || IconFileInfo
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => onDismiss(toast.id), 200)
  }

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-lg p-4 shadow-lg transition-all",
        variantStyles[toast.type],
        isExiting && "translate-x-full opacity-0"
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", iconColors[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-xs text-muted-foreground">{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <IconX className="size-4" />
      </button>
    </div>
  )
}

interface ToasterProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-96 flex-col gap-2 overflow-hidden">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

let toastId = 0

const listeners = new Set<(toasts: Toast[]) => void>()
let toasts: Toast[] = []

function notify(toast: Omit<Toast, "id">) {
  const id = String(++toastId)
  const newToast = { ...toast, id }
  toasts = [...toasts, newToast]
  listeners.forEach((listener) => listener(toasts))
  return id
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  listeners.forEach((listener) => listener(toasts))
}

function subscribe(listener: (toasts: Toast[]) => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const toast = {
  success: (title: string, description?: string, duration = 5000) =>
    notify({ type: "success", title, description, duration }),
  error: (title: string, description?: string, duration = 7000) =>
    notify({ type: "error", title, description, duration }),
  warning: (title: string, description?: string, duration = 6000) =>
    notify({ type: "warning", title, description, duration }),
  info: (title: string, description?: string, duration = 5000) =>
    notify({ type: "info", title, description, duration }),
}

export function ToastContainer() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribe(() => forceUpdate(n => n + 1))
  }, [])

  return <Toaster toasts={[...toasts]} onDismiss={dismiss} />
}

export function useToast() {
  return toast
}