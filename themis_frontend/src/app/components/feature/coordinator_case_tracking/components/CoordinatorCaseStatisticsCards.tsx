import React from "react"
import { Card, CardContent } from '@/components/ui/card'
import { 
  FileText, 
  Clock, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Pause, 
  Target,
  Flag
} from "lucide-react"
import { CoordinatorCaseStatistics } from "../types"

interface CoordinatorCaseStatisticsCardsProps {
  statistics: CoordinatorCaseStatistics
  darkMode: boolean
}

export const CoordinatorCaseStatisticsCards: React.FC<CoordinatorCaseStatisticsCardsProps> = ({
  statistics,
  darkMode
}) => {
  const statsCards = [
    {
      title: "Total de Casos",
      value: statistics.total,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/50"
    },
    {
      title: "Alta Prioridad",
      value: statistics.altaPrioridad,
      icon: Flag,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/50"
    },
    {
      title: "Abiertos",
      value: statistics.abierto,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/50"
    },
    {
      title: "En Revisión",
      value: statistics.enRevision,
      icon: Eye,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/50"
    },
    {
      title: "Resueltos",
      value: statistics.resuelto,
      icon: CheckCircle,
  color: "text-green-600 dark:text-blue-400",
  bgColor: "bg-green-100 dark:bg-blue-900/50"
    },
    {
      title: "Condicionamiento",
      value: statistics.condicionamientoMatricula,
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/50"
    },
    {
      title: "Cancelamiento",
      value: statistics.cancelamientoMatricula,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/50"
    },
    {
      title: "Aplazamiento",
      value: statistics.aplazamientoProceso,
      icon: Pause,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/50"
    },
    {
      title: "Plan Mejoramiento",
      value: statistics.planMejoramiento,
      icon: Target,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/50"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statsCards.map((stat, index) => (
        <Card 
          key={index}
          className={`transition-all duration-200 hover:shadow-md ${
            darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50/80"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
