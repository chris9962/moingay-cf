"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useToastStore, type ToastType } from "@/lib/toast-store"
import { cn } from "@/lib/utils"

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5" />
    case "error":
      return <AlertCircle className="h-5 w-5" />
    case "info":
      return <Info className="h-5 w-5" />
    case "warning":
      return <AlertTriangle className="h-5 w-5" />
  }
}

const getToastClasses = (type: ToastType) => {
  switch (type) {
    case "success":
      return "bg-green-100 text-green-800 border-green-300"
    case "error":
      return "bg-red-100 text-red-800 border-red-300"
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
  }
}

export function Toast() {
  const { toasts, removeToast } = useToastStore()

  // Handle escape key to dismiss all toasts
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toasts.forEach((toast) => removeToast(toast.id))
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [toasts, removeToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-md shadow-md border min-w-[300px] max-w-md animate-slide-up",
            getToastClasses(toast.type),
          )}
        >
          <div className="flex items-center gap-3">
            <ToastIcon type={toast.type} />
            <p>{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
