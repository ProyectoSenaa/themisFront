"use client"

import type React from "react"
import { CardHeader, CardTitle } from '@/components/ui/card'
import Button from "@/components/ui/button"
import Input from "@/components/ui/Input"
import { 
  ListFilter, 
  User, 
  GraduationCap, 
  X
} from "lucide-react"
import type { CaseFilter, SearchFilters } from "../types"

interface CaseFiltersProps {
  currentFilter: CaseFilter
  onFilterChange: (filter: CaseFilter) => void
  darkMode: boolean
  searchFilters: SearchFilters
  onSearchFiltersChange: (filters: SearchFilters) => void
  totalCases?: number
  filteredCases?: number
}

export const CaseFilters: React.FC<CaseFiltersProps> = ({
  currentFilter,
  onFilterChange,
  darkMode,
  searchFilters,
  onSearchFiltersChange,
  totalCases = 156,
  filteredCases = 12,
}) => {
  const filters = [
    { key: "all" as CaseFilter, label: "Todos" },
    { key: "abierto" as CaseFilter, label: "Abiertos" },
    { key: "en_revision" as CaseFilter, label: "En Revisión" },
    { key: "resuelto" as CaseFilter, label: "Resueltos" },
    { key: "condicionamiento_matricula" as CaseFilter, label: "Condicionamiento" },
    { key: "cancelamiento_matricula" as CaseFilter, label: "Cancelamiento" },
    { key: "aplazamiento_proceso" as CaseFilter, label: "Aplazamiento" },
    { key: "plan_mejoramiento" as CaseFilter, label: "Plan Mejoramiento" },
  ]

  const clearSearch = (field: keyof SearchFilters) => {
    onSearchFiltersChange({ 
      ...searchFilters, 
      [field]: "" 
    })
  }

  return (
    <div>
      {/* Tab Header */}
      <CardHeader 
        className={`flex-row items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <ListFilter className={`w-5 h-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <CardTitle className={`text-lg font-medium ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Lista de Casos
          </CardTitle>
        </div>
      </CardHeader>

      {/* Search Fields */}
      <div className="p-6 space-y-4">
        {/* Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={`h-5 w-5 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <Input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={searchFilters.studentName}
              onChange={(e) => onSearchFiltersChange({ ...searchFilters, studentName: e.target.value })}
              className={`pl-12 pr-10 py-3 w-full rounded-lg border transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-darkGreen focus:ring-1 focus:ring-darkGreen'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-darkGreen focus:ring-1 focus:ring-darkGreen'
              }`}
            />
            {searchFilters.studentName && (
              <button
                onClick={() => clearSearch('studentName')}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
                  darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Program Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <GraduationCap className={`h-5 w-5 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <Input
              type="text"
              placeholder="Buscar por programa..."
              value={searchFilters.program}
              onChange={(e) => onSearchFiltersChange({ ...searchFilters, program: e.target.value })}
              className={`pl-12 pr-10 py-3 w-full rounded-lg border transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-darkGreen focus:ring-1 focus:ring-darkGreen'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-darkGreen focus:ring-1 focus:ring-darkGreen'
              }`}
            />
            {searchFilters.program && (
              <button
                onClick={() => clearSearch('program')}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
                  darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="pt-2">
          <div className="flex flex-wrap gap-2">
            {filters.map(({ key, label }) => {
              const isActive = currentFilter === key
              return (
                <Button
                  key={key}
                  onClick={() => onFilterChange(key)}
                  variant={isActive ? "default" : "outline"}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-darkGreen hover:bg-green-700 text-white border-darkGreen shadow-sm'
                      : darkMode
                        ? 'bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                        : 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {label}
                </Button>
              )
            })}
          </div>
        </div>

    
      </div>
    </div>
  )
}