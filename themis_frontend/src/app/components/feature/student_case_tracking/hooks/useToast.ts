import { useState, useCallback } from "react"

export interface ToastState {
  isVisible: boolean
  title: string
  message: string
  type: "success" | "error" | "warning" | "info"
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    title: "",
    message: "",
    type: "info"
  })

  const showToast = useCallback((
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setToast({
      isVisible: true,
      title,
      message,
      type
    })

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 5000)
  }, [])

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }, [])

  return { toast, showToast, closeToast }
}
