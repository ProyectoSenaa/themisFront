import React from "react"
import { Search, Filter, User, UserCheck, BookOpen, Flag } from "lucide-react"
import Button from "@/components/ui/button"
import Input from "@/components/ui/Input"
import { CoordinatorCaseFilter, CoordinatorSearchFilters } from "../types"

interface CoordinatorCaseFiltersProps {
  currentFilter: CoordinatorCaseFilter
  onFilterChange: (filter: CoordinatorCaseFilter) => void
  darkMode: boolean
  searchFilters: CoordinatorSearchFilters
  onSearchFiltersChange: (filters: CoordinatorSearchFilters) => void
}

export const CoordinatorCaseFilters: React.FC<CoordinatorCaseFiltersProps> = ({
  currentFilter,
  onFilterChange,
  darkMode,
  searchFilters,
  onSearchFiltersChange
}) => {
  const filterButtons = [
    { 
      key: "all" as CoordinatorCaseFilter, 
      label: "Todos", 
      icon: Filter,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    },
    { 
      key: "abierto" as CoordinatorCaseFilter, 
      label: "Abiertos", 
      icon: Filter,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    { 
      key: "en_revision" as CoordinatorCaseFilter, 
      label: "En Revisión", 
      icon: Filter,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
    },
    { 
      key: "resuelto" as CoordinatorCaseFilter, 
      label: "Resueltos", 
      icon: Filter,
  color: "bg-green-100 text-green-700 dark:bg-blue-900 dark:text-blue-300"
    },
    { 
      key: "alta_prioridad" as CoordinatorCaseFilter, 
      label: "Alta Prioridad", 
      icon: Flag,
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    }
  ]

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "abierto", label: "Abierto" },
    { value: "en_revision", label: "En Revisión" },
    { value: "resuelto", label: "Resuelto" },
    { value: "condicionamiento_matricula", label: "Condicionamiento Matrícula" },
    { value: "cancelamiento_matricula", label: "Cancelamiento Matrícula" },
    { value: "aplazamiento_proceso", label: "Aplazamiento Proceso" },
    { value: "plan_mejoramiento", label: "Plan Mejoramiento" }
  ]

  const priorityOptions = [
    { value: "all", label: "Todas las prioridades" },
    { value: "alta", label: "Alta" },
    { value: "media", label: "Media" },
    { value: "baja", label: "Baja" }
  ]

  return (
    <div className={`border-b p-6 space-y-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ key, label, icon: Icon, color }) => (
          <Button
            key={key}
            variant={currentFilter === key ? "default" : "outline"}
            onClick={() => onFilterChange(key)}
            className={`flex items-center gap-1 text-sm transition-all duration-200 ${
              currentFilter === key 
                ? color 
                : darkMode 
                  ? "hover:bg-gray-700 border-gray-600" 
                  : "hover:bg-gray-50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Filtros de búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Buscar por estudiante */}
        <div className="relative">
          <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
          <Input
            type="text"
            placeholder="Buscar estudiante..."
            value={searchFilters.studentName}
            onChange={(e) => onSearchFiltersChange({ 
              ...searchFilters, 
              studentName: e.target.value 
            })}
            className={`pl-10 text-sm ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500" 
                : "bg-white border-gray-300 placeholder-gray-400"
            }`}
          />
        </div>

        {/* Buscar por instructor */}
        <div className="relative">
          <UserCheck className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
          <Input
            type="text"
            placeholder="Buscar instructor..."
            value={searchFilters.instructorName}
            onChange={(e) => onSearchFiltersChange({ 
              ...searchFilters, 
              instructorName: e.target.value 
            })}
            className={`pl-10 text-sm ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500" 
                : "bg-white border-gray-300 placeholder-gray-400"
            }`}
          />
        </div>

        {/* Buscar por programa */}
        <div className="relative">
          <BookOpen className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
          <Input
            type="text"
            placeholder="Buscar programa..."
            value={searchFilters.program}
            onChange={(e) => onSearchFiltersChange({ 
              ...searchFilters, 
              program: e.target.value 
            })}
            className={`pl-10 text-sm ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500" 
                : "bg-white border-gray-300 placeholder-gray-400"
            }`}
          />
        </div>

        {/* Filtro por estado */}
        <select
          value={searchFilters.status}
          onChange={(e) => onSearchFiltersChange({ 
            ...searchFilters, 
            status: e.target.value as CoordinatorCaseFilter 
          })}
          className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            darkMode 
              ? "bg-gray-700 border-gray-600 text-gray-200" 
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Filtro por prioridad */}
        <select
          value={searchFilters.priority || "all"}
          onChange={(e) => onSearchFiltersChange({ 
            ...searchFilters, 
            priority: e.target.value === "all" ? undefined : e.target.value as "alta" | "media" | "baja"
          })}
          className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            darkMode 
              ? "bg-gray-700 border-gray-600 text-gray-200" 
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Botón para limpiar filtros */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => {
            onFilterChange("all")
            onSearchFiltersChange({
              studentName: "",
              instructorName: "",
              program: "",
              status: "all",
              priority: undefined
            })
          }}
          className={`text-sm ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"}`}
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
