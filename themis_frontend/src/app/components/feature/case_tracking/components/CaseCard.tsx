import React from "react"
import { Card, CardContent } from '@/components/ui/card'
import Button from "@/components/ui/button"
import { 
  Eye, 
  Edit, 
  XCircle, 
  Activity, 
  CalendarDays, 
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  File,
  Pause,
  Target
} from "lucide-react"
import { CaseItem } from "../types"
import { getStatusColor, formatDate, formatTime, getStatusIconType } from "../utils"
import { StatusSelect } from "./StatusSelect"

interface CaseCardProps {
  caseItem: CaseItem
  darkMode: boolean
  onView: (caseItem: CaseItem) => void
  onEdit: (caseItem: CaseItem) => void
  onDelete: (caseId: string) => void
  onChangeStatusToReview?: (caseItem: CaseItem) => void
  onChangeStatus?: (caseItem: CaseItem, newStatusId: string) => void
  followUpStatuses?: any[]
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caseItem,
  darkMode,
  onView,
  onEdit,
  onDelete,
  onChangeStatusToReview,
  onChangeStatus,
  followUpStatuses
}) => {
  const getStatusIcon = (status: string) => {
    const iconType = getStatusIconType(status)
    const iconClass = "w-3 h-3"
    
    switch (iconType) {
      case "clock":
        return <Clock className={iconClass} />
      case "check":
        return <CheckCircle className={iconClass} />
      case "x":
        return <XCircle className={iconClass} />
      case "file":
        return <File className={iconClass} />
      case "pause":
        return <Pause className={iconClass} />
      case "target":
        return <Target className={iconClass} />
      default:
        return <AlertCircle className={iconClass} />
    }
  }

  return (
    <Card 
      className={`relative overflow-visible group transition-all duration-200 hover:shadow-md z-0 hover:z-10 ${
        darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50/80"
      }`}
    >
      <div className="absolute top-0 left-0 h-full w-1 bg-green-500"></div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          {/* Contenido Principal */}
          <div className="flex-1 min-w-0">
            {/* Badges de Estado y Tipo */}
            <div className="flex flex-col gap-2 mb-3 ml-4">
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(caseItem.status)}`}>
                {getStatusIcon(caseItem.status)}
                {caseItem.status}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 w-fit">
                <Activity className="w-3 h-3" />
                {caseItem.noveltyType}
              </span>
            </div>
            
            {/* Información del Estudiante */}
            <div className="mb-2">
              <h3 className={`font-bold text-lg leading-tight ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                {caseItem.studentName}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {caseItem.studentDocument}
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {caseItem.program}
                </span>
              </div>
            </div>
            
            {/* Descripción */}
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} line-clamp-2 mb-2`}>
              {caseItem.description}
            </p>
            
            {/* Fecha y Hora */}
            <div className={`flex items-center gap-3 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-12 h-3" />
                {formatDate(caseItem.reportDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(caseItem.reportDate)}
              </span>
            </div>
          </div>
          
          {/* Botones de Acción - Verticales */}
          <div className="flex flex-col gap-1 shrink-0">
            <Button
              variant="ghost"
              onClick={() => onView(caseItem)}
              className={`p-2 rounded-md transition-colors duration-200 ${
                darkMode 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              title="Ver detalle"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onEdit(caseItem)}
              className={`p-2 rounded-md transition-colors duration-200 ${
                darkMode 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            {/* Selector de Estado */}
            {onChangeStatus && followUpStatuses && (
              <div className="mb-1">
                <StatusSelect
                  currentStatusId={caseItem.followUp.followUpStatusId}
                  statuses={followUpStatuses}
                  onStatusChange={(statusId) => onChangeStatus(caseItem, statusId)}
                  darkMode={darkMode}
                />
              </div>
            )}
            
            {/* Botón para enviar a revisión (mantener por compatibilidad) */}
            {onChangeStatusToReview && 
             !caseItem.status.toLowerCase().includes('revision') && 
             caseItem.status.toLowerCase() !== 'en revision' && 
             caseItem.status.toLowerCase() === 'abierto' && 
             !onChangeStatus && (
              <Button
                variant="ghost"
                onClick={() => onChangeStatusToReview(caseItem)}
                className="p-2 rounded-md transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                title="Enviar a revisión"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={() => onDelete(caseItem.id)}
              className="p-2 rounded-md transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              title="Eliminar"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}