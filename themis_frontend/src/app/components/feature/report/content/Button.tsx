import React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  className?: string
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", variant = "default", ...props }) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-6 py-4 text-sm font-medium transition-colors focus:outline-none"
  const variants: Record<string, string> = {
    default: darkMode
      ? "bg-gradient-to-r from-[#00304D] to-[#005386] text-white hover:bg-gray-700"
      : "bg-gradient-to-r from-[#398f0d] to-[#84cc16] text-white hover:bg-gray-800",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-200",
  }
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button;
