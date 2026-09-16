import React from "react"

export interface AlertProps {
  children?: React.ReactNode
  variant?: "default" | "destructive"
  className?: string
}

export const Alert: React.FC<AlertProps> = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-green-50 border-green-200 text-green-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
  }
  return <div className={`${variants[variant]} ${className}`}>{children}</div>
}

export interface BasicProps {
  children?: React.ReactNode
  className?: string
}

export const AlertTitle: React.FC<BasicProps> = ({ children, className = "" }) => (
  <h5 className={`font-medium ${className}`}>{children}</h5>
)

export const AlertDescription: React.FC<BasicProps> = ({ children, className = "" }) => (
  <div className={`mt-2 text-sm ${className}`}>{children}</div>
)
