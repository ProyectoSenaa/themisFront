import React, { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  darkMode?: boolean
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  duration = 4000,
  darkMode = false
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to finish
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen, duration, onClose])

  const getIcon = () => {
    const iconClass = "w-5 h-5"
    
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />
      case "error":
        return <XCircle className={`${iconClass} text-red-500`} />
      case "warning":
        return <AlertCircle className={`${iconClass} text-yellow-500`} />
      case "info":
        return <Info className={`${iconClass} text-[#398f0d]`} />
      default:
        return <Info className={`${iconClass} text-blue-500`} />
    }
  }

  const getBackgroundColor = () => {
    if (darkMode) {
      switch (type) {
        case "success":
          return "bg-green-900/90 border-green-700"
        case "error":
          return "bg-red-900/90 border-red-700"
        case "warning":
          return "bg-yellow-900/90 border-yellow-700"
        case "info":
          return "bg-[#0f3f06]/90 border-[#27610a]"
        default:
          return "bg-gray-900/90 border-gray-700"
      }
    } else {
      switch (type) {
        case "success":
          return "bg-green-50 border-green-200"
        case "error":
          return "bg-red-50 border-red-200"
        case "warning":
          return "bg-yellow-50 border-yellow-200"
        case "info":
          return "bg-green-50 border-green-200"
        default:
          return "bg-gray-50 border-gray-200"
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div
        className={`
          max-w-sm w-full border rounded-lg shadow-xl p-4 transition-all duration-300 ease-in-out glass-effect
          ${isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
          ${getBackgroundColor()}
        `}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {title}
            </h4>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {message}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className={`flex-shrink-0 p-1 rounded-md transition-colors button-hover-effect ${
              darkMode 
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Barra de progreso para mostrar el tiempo restante */}
        <div className={`mt-3 h-1 rounded-full overflow-hidden ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        }`}>
          <div 
            className={`h-full transition-all ease-linear ${
              type === "success" ? "bg-green-500" :
              type === "error" ? "bg-red-500" :
              type === "warning" ? "bg-yellow-500" :
              "bg-[#398f0d]"
            }`}
            style={{ 
              width: "100%",
              animation: `progress ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Hook personalizado para manejar toasts
export const useToast = () => {
  const [toast, setToast] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: "success" | "error" | "warning" | "info"
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info"
  })

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setToast({
      isOpen: true,
      title,
      message,
      type
    })
  }

  const closeToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }))
  }

  return {
    toast,
    showToast,
    closeToast
  }
}
