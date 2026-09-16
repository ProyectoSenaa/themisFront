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
  Target,
  User
} from "lucide-react"
import { CoordinatorCaseItem } from "../types"
import { getStatusColor, formatDate, formatTime, getStatusIconType } from "../utils"
import { StatusSelect } from "./StatusSelect"
import type { FollowUpStatus } from "@/app/interfaces/followUp"

interface CoordinatorCaseCardProps {
  caseItem: CoordinatorCaseItem
  darkMode: boolean
  onView: (caseItem: CoordinatorCaseItem) => void
  onEdit: (caseItem: CoordinatorCaseItem) => void
  onChangeStatus?: (caseItem: CoordinatorCaseItem, newStatusId: string) => void
  onApproveResolution?: (caseItem: CoordinatorCaseItem) => void
  followUpStatuses?: FollowUpStatus[]
}

export const CoordinatorCaseCard: React.FC<CoordinatorCaseCardProps> = ({
  caseItem,
  darkMode,
  onView,
  onEdit,
  onChangeStatus,
  onApproveResolution,
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
      <div className={`absolute top-0 left-0 h-full w-1 ${
        caseItem.priority === "alta" ? "bg-red-500" : 
        caseItem.priority === "media" ? "bg-yellow-500" : "bg-green-500"
      }`}></div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2 ml-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(caseItem.status)}`}>
                {getStatusIcon(caseItem.status)}
                {caseItem.status}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                <Activity className="w-3 h-3" />
                {caseItem.noveltyType}
              </span>
            </div>
            
            {/* Información del Estudiante e Instructor */}
            <div className="mb-2">
              <h3 className={`font-bold text-base leading-tight ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                {caseItem.studentName}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <User className="w-3 h-3" />
                  {caseItem.studentDocument}
                </span>
                <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {caseItem.program}
                </span>
              </div>
            </div>
            
            {/* Descripción */}
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} line-clamp-2 mb-1`}>
              {caseItem.description}
            </p>
            
            {/* Fecha y Hora - Debajo de la descripción */}
            <div className={`flex items-center gap-2 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
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
              className={`p-1.5 rounded-md transition-colors duration-200 ${
                darkMode 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              title="Ver detalle"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onEdit(caseItem)}
              className={`p-1.5 rounded-md transition-colors duration-200 ${
                darkMode 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              title="Editar"
            >
              <Edit className="w-3.5 h-3.5" />
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
            
            {/* Botón para aprobar resolución */}
            {onApproveResolution && caseItem.status.toLowerCase().includes('revision') && (
              <Button
                variant="ghost"
                onClick={() => onApproveResolution(caseItem)}
                className="p-1.5 rounded-md transition-colors duration-200 hover:bg-green-50 dark:hover:bg-blue-950/50 text-green-600 hover:text-green-700 dark:text-blue-400 dark:hover:text-blue-300"
                title="Aprobar resolución"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
