import React from "react"
import { useAppSelector } from "@/redux/hooks"
import { Card, CardContent } from '@/components/ui/card'
import Button from "@/components/ui/button"
import { 
  Calendar,
  User,
  Eye,
  Download,
  AlertTriangle,
  BookOpen
} from "lucide-react"
import type { StudentCaseItem } from "../StudentCaseTracking"

interface StudentCaseCardProps {
  caseItem: StudentCaseItem
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
  onViewDetails: (caseItem: StudentCaseItem) => void
  onDownloadPlan: (caseItem: StudentCaseItem) => void
}

const StudentCaseCard: React.FC<StudentCaseCardProps> = ({
  caseItem,
  getStatusColor,
  getStatusIcon,
  onViewDetails,
  onDownloadPlan,
}) => {
  const darkMode = useAppSelector((state) => state.theme.darkMode)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className={`shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}>
      <CardContent className="p-6">
        {/* Status and Type */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(caseItem.status)}`}>
            {getStatusIcon(caseItem.status)}
            {caseItem.status}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            <AlertTriangle className="w-3 h-3" />
            {caseItem.noveltyType}
          </span>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className={`font-bold text-lg mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            Caso de Seguimiento
          </h3>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} line-clamp-3`}>
            {caseItem.description}
          </p>
        </div>

        {/* Teacher Info */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <User className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
            <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Reportado por:
            </span>
          </div>
          <p className={`text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            {caseItem.teacherName && caseItem.teacherName !== 'null' && caseItem.teacherName !== 'undefined' 
              ? caseItem.teacherName 
              : "Instructor no disponible"}
          </p>
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} ml-6`}>
            {caseItem.teacherEmail && caseItem.teacherEmail !== 'null' && caseItem.teacherEmail !== 'undefined'
              ? caseItem.teacherEmail
              : "Correo no disponible"}
          </p>
        </div>

        {/* Date */}
        <div className="mb-6">
          <div className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <Calendar className="w-4 h-4" />
            <span>Reportado el {formatDate(caseItem.reportDate)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 flex-1"
            onClick={() => onViewDetails(caseItem)}
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 flex-1"
            onClick={() => onDownloadPlan(caseItem)}
          >
            <Download className="w-4 h-4" />
            Descargar Plan
          </Button>
        </div>

        {/* Evidence indicator */}
        {caseItem.evidenceFiles && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className={`flex items-center gap-2 text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              <BookOpen className="w-4 h-4" />
              <span>Evidencia adjunta disponible</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StudentCaseCard
