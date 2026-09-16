import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle, Pause, Target, File } from "lucide-react"
import type { CaseStatistics } from "../types"

interface CaseStatisticsProps {
  statistics: CaseStatistics
  darkMode: boolean
}

export const CaseStatisticsCards: React.FC<CaseStatisticsProps> = ({ statistics, darkMode }) => {
  const statsConfig = [
    {
      title: "Total de Casos",
      value: statistics.total,
      icon: <FileText className={`h-6 w-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />,
      color: darkMode ? "text-slate-100" : "text-slate-900",
      bgGradient: darkMode ? "from-slate-800 to-slate-700" : "from-slate-50 to-white",
      borderColor: darkMode ? "border-slate-700" : "border-slate-200",
    },
    {
      title: "Abiertos",
      value: statistics.abierto,
      icon: <File className="h-6 w-6 text-blue-500" />,
      color: "text-blue-600",
      bgGradient: darkMode ? "from-blue-900/20 to-slate-800" : "from-blue-50 to-white",
      borderColor: "border-blue-200",
    },
    {
      title: "En Revisión",
      value: statistics.enRevision,
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      color: "text-amber-600",
      bgGradient: darkMode ? "from-amber-900/20 to-slate-800" : "from-amber-50 to-white",
      borderColor: "border-amber-200",
    },
    {
      title: "Resueltos",
      value: statistics.resuelto,
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
      color: "text-emerald-600",
      bgGradient: darkMode ? "from-blue-900/20 to-slate-800" : "from-emerald-50 to-white",
      borderColor: "border-emerald-200",
    },
    {
      title: "Condicionamiento",
      value: statistics.condicionamientoMatricula,
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      color: "text-orange-600",
      bgGradient: darkMode ? "from-orange-900/20 to-slate-800" : "from-orange-50 to-white",
      borderColor: "border-orange-200",
    },
    {
      title: "Cancelamiento",
      value: statistics.cancelamientoMatricula,
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      color: "text-red-600",
      bgGradient: darkMode ? "from-red-900/20 to-slate-800" : "from-red-50 to-white",
      borderColor: "border-red-200",
    },
    {
      title: "Aplazamiento",
      value: statistics.aplazamientoProceso,
      icon: <Pause className="h-6 w-6 text-purple-500" />,
      color: "text-purple-600",
      bgGradient: darkMode ? "from-purple-900/20 to-slate-800" : "from-purple-50 to-white",
      borderColor: "border-purple-200",
    },
    {
      title: "Plan Mejoramiento",
      value: statistics.planMejoramiento,
      icon: <Target className="h-6 w-6 text-indigo-500" />,
      color: "text-indigo-600",
      bgGradient: darkMode ? "from-indigo-900/20 to-slate-800" : "from-indigo-50 to-white",
      borderColor: "border-indigo-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
      {statsConfig.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.bgGradient} ${stat.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border-2`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6">
            <CardTitle
              className={`text-xs font-semibold tracking-wide uppercase ${darkMode ? "text-slate-300" : "text-slate-600"}`}
            >
              {stat.title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">{stat.icon}</div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</div>
            <div className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"} font-medium`}>
              casos registrados
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
