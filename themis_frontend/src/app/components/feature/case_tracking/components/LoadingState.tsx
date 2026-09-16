"use client"

import React, { memo } from "react"
import { Card, CardContent } from '@/components/ui/card'

interface LoadingStateProps {
  darkMode: boolean
}

export const LoadingState = memo<LoadingStateProps>(({ darkMode }) => {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardContent className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-darkGreen mx-auto mb-4"></div>
          <p className={`text-xl font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Cargando casos...
          </p>
        </div>
      </CardContent>
    </Card>
  )
})

LoadingState.displayName = "LoadingState"
