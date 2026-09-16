"use client"

import React, { memo } from "react"
import { Card, CardContent } from '@/components/ui/card'
import Button from "@/components/ui/button"
import { FileText } from "lucide-react"

interface EmptyStateProps {
  darkMode: boolean
  hasFilters: boolean
  onCreateCase: () => void
  onClearFilters?: () => void
}

export const EmptyState = memo<EmptyStateProps>(({
  darkMode,
  hasFilters,
  onCreateCase,
  onClearFilters
}) => {
  if (hasFilters) {
    return (
      <CardContent className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <FileText className={`w-20 h-20 mx-auto ${darkMode ? "text-gray-600" : "text-gray-400"} mb-6`} />
          <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            No se encontraron casos
          </h3>
          <p className={`text-base mb-6 max-w-md mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No hay casos que coincidan con los filtros seleccionados. 
            Intenta modificar los criterios de búsqueda.
          </p>
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Limpiar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    )
  }

  return (
    <Card className="shadow-lg rounded-lg">
      <CardContent className="flex items-center justify-center min-h-[500px] p-8">
        <div className="text-center">
          <FileText className={`w-28 h-28 mx-auto ${darkMode ? "text-gray-600" : "text-gray-400"} mb-6`} />
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            ¡No hay casos reportados aún!
          </h2>
          <p className={`text-lg mb-8 max-w-lg mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Aún no has registrado ninguna novedad de estudiantes.
          </p>
          <Button 
            onClick={onCreateCase}
            className="px-6 py-3 shadow-md transition-all duration-300 hover:scale-105"
          >
            Crear Primer Caso
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

EmptyState.displayName = "EmptyState"
