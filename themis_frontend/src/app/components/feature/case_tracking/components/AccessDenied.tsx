"use client"

import React, { memo } from "react"
import { Card, CardContent } from '@/components/ui/card'

interface AccessDeniedProps {
  darkMode: boolean
}

export const AccessDenied = memo<AccessDeniedProps>(({ darkMode }) => {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardContent className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">🚫 Acceso Denegado</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Esta sección está disponible solo para instructores.
          </p>
        </div>
      </CardContent>
    </Card>
  )
})

AccessDenied.displayName = "AccessDenied"
