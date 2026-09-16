"use client"

import React, { memo } from "react"
import { Plus } from "lucide-react"
import Button from "@/components/ui/button"

interface CaseHeaderProps {
  darkMode: boolean
  onCreateCase: () => void
}

export const CaseHeader = memo<CaseHeaderProps>(({ darkMode, onCreateCase }) => {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className={`text-5xl font-medium text-gray-800 tracking-normal dark:text-white uppercase mt-5 mb-8 text-center ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          Seguimiento de Casos
        </h1>
        <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Panel de instructor para gestión de casos de seguimiento
        </p>
      </div>
      <Button
        className="flex items-center gap-2 px-6 py-3 shadow-md transition-all duration-300 hover:scale-105"
        onClick={onCreateCase}
      >
        <Plus className="w-5 h-5" />
        Crear Nuevo Caso
      </Button>
    </div>
  )
})

CaseHeader.displayName = "CaseHeader"
