import React from "react"
import { useAppSelector } from "@/redux/hooks"
import { Card, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle } from "lucide-react"

const EmptyState: React.FC = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode)

  return (
    <Card className="shadow-lg rounded-lg">
      <CardContent className="flex items-center justify-center min-h-[500px] p-8">
        <div className="text-center">
          <CheckCircle className={`w-28 h-28 mx-auto ${darkMode ? "text-green-400" : "text-green-500"} mb-6`} />
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            ¡Excelente! No tienes casos de seguimiento
          </h2>
          <p className={`text-lg mb-4 max-w-lg mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Actualmente no has sido reportado en ningún caso de seguimiento. ¡Sigue así!
          </p>
          <p className={`text-sm max-w-md mx-auto ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            Los casos de seguimiento aparecerán aquí cuando un profesor o coordinador te reporte por alguna novedad que requiera atención especial.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmptyState
