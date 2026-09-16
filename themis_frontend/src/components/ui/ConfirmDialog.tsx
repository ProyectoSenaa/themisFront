import React from "react"
import Modal from "./Modal/Modal"
import Button from "./button"
import { AlertTriangle, Trash2, Edit, Send, CheckCircle, XCircle } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  type?: "delete" | "edit" | "send" | "success" | "warning" | "info"
  confirmText?: string
  cancelText?: string
  darkMode?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  darkMode = false
}) => {
  const getIcon = () => {
    const iconClass = "w-16 h-16 mx-auto mb-4"
    
    switch (type) {
      case "delete":
        return <Trash2 className={`${iconClass} text-red-500`} />
      case "edit":
  return <Edit className={`${iconClass} text-[#398f0d]`} />
      case "send":
        return <Send className={`${iconClass} text-green-500`} />
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />
      case "warning":
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />
      default:
        return <AlertTriangle className={`${iconClass} text-gray-500`} />
    }
  }

  const getButtonStyles = () => {
    switch (type) {
      case "delete":
        return "bg-red-600 hover:bg-red-700 text-white"
      case "edit":
        return "bg-[#398f0d] hover:bg-[#2f6f0b] text-white"
      case "send":
        return "bg-green-600 hover:bg-green-700 text-white"
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white"
      default:
        return "bg-yellow-600 hover:bg-yellow-700 text-white"
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={`w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl transition-all duration-300 glass-effect`}
    >
      <div className="p-8 text-center">
        <div className="mb-4 flex justify-center">
          {getIcon()}
        </div>
        
        <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          {title}
        </h3>
        
        <p className={`text-base mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className={`px-6 py-2 transition-all duration-200 button-hover-effect ${
              darkMode 
                ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500" 
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            {cancelText}
          </Button>
          
          <Button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-6 py-2 ${getButtonStyles()} shadow-lg transition-all duration-200 button-hover-effect`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
