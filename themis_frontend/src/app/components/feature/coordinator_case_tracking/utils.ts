import { 
  CoordinatorCaseItem, 
  CoordinatorCaseFilter, 
  CoordinatorSearchFilters, 
  CoordinatorCaseStatistics 
} from "./types"
import { CASE_STATUS_KEYWORDS, STATUS_COLORS, PRIORITY_COLORS } from "./constants"

export const createPaginationVariables = (page = 1, size = 100) => ({
  page: page - 1, // GraphQL usa 0-based pagination
  size
})

export const filterCoordinatorCases = (
  cases: CoordinatorCaseItem[],
  filter: CoordinatorCaseFilter,
  searchFilters: CoordinatorSearchFilters
): CoordinatorCaseItem[] => {
  return cases.filter(caseItem => {
    // Filtro por estado
    if (filter !== "all") {
      if (filter === "alta_prioridad") {
        if (caseItem.priority !== "alta") return false
      } else {
        const statusKeywords = CASE_STATUS_KEYWORDS[filter.toUpperCase() as keyof typeof CASE_STATUS_KEYWORDS]
        if (!statusKeywords?.some(keyword => 
          caseItem.status.toLowerCase().includes(keyword.toLowerCase())
        )) {
          return false
        }
      }
    }

    // Filtro por nombre de estudiante
    if (searchFilters.studentName) {
      if (!caseItem.studentName.toLowerCase().includes(searchFilters.studentName.toLowerCase())) {
        return false
      }
    }

    // Filtro por nombre de instructor
    if (searchFilters.instructorName) {
      if (!caseItem.instructorName.toLowerCase().includes(searchFilters.instructorName.toLowerCase())) {
        return false
      }
    }

    // Filtro por programa
    if (searchFilters.program) {
      if (!caseItem.program?.toLowerCase().includes(searchFilters.program.toLowerCase())) {
        return false
      }
    }

    // Filtro por estado específico
    if (searchFilters.status !== "all") {
      if (searchFilters.status === "alta_prioridad") {
        if (caseItem.priority !== "alta") return false
      } else {
        const statusKeywords = CASE_STATUS_KEYWORDS[searchFilters.status.toUpperCase() as keyof typeof CASE_STATUS_KEYWORDS]
        if (!statusKeywords?.some(keyword => 
          caseItem.status.toLowerCase().includes(keyword.toLowerCase())
        )) {
          return false
        }
      }
    }

    // Filtro por prioridad
    if (searchFilters.priority && searchFilters.priority !== "all") {
      if (caseItem.priority !== searchFilters.priority) {
        return false
      }
    }

    return true
  })
}

export const calculateCoordinatorStatistics = (cases: CoordinatorCaseItem[]): CoordinatorCaseStatistics => {
  const stats: CoordinatorCaseStatistics = {
    total: cases.length,
    abierto: 0,
    enRevision: 0,
    resuelto: 0,
    condicionamientoMatricula: 0,
    cancelamientoMatricula: 0,
    aplazamientoProceso: 0,
    planMejoramiento: 0,
    altaPrioridad: 0
  }

  cases.forEach(caseItem => {
    const status = caseItem.status.toLowerCase()
    
    if (CASE_STATUS_KEYWORDS.ABIERTO.some(keyword => status.includes(keyword))) {
      stats.abierto++
    } else if (CASE_STATUS_KEYWORDS.EN_REVISION.some(keyword => status.includes(keyword))) {
      stats.enRevision++
    } else if (CASE_STATUS_KEYWORDS.RESUELTO.some(keyword => status.includes(keyword))) {
      stats.resuelto++
    } else if (CASE_STATUS_KEYWORDS.CONDICIONAMIENTO_MATRICULA.some(keyword => status.includes(keyword))) {
      stats.condicionamientoMatricula++
    } else if (CASE_STATUS_KEYWORDS.CANCELAMIENTO_MATRICULA.some(keyword => status.includes(keyword))) {
      stats.cancelamientoMatricula++
    } else if (CASE_STATUS_KEYWORDS.APLAZAMIENTO_PROCESO.some(keyword => status.includes(keyword))) {
      stats.aplazamientoProceso++
    } else if (CASE_STATUS_KEYWORDS.PLAN_MEJORAMIENTO.some(keyword => status.includes(keyword))) {
      stats.planMejoramiento++
    }

    if (caseItem.priority === "alta") {
      stats.altaPrioridad++
    }
  })

  return stats
}

export const paginateItems = <T>(items: T[], currentPage: number, itemsPerPage: number): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return items.slice(startIndex, endIndex)
}

export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage)
}

export const getStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase()
  
  if (CASE_STATUS_KEYWORDS.ABIERTO.some(keyword => lowerStatus.includes(keyword))) {
    return STATUS_COLORS.ABIERTO
  }
  if (CASE_STATUS_KEYWORDS.EN_REVISION.some(keyword => lowerStatus.includes(keyword))) {
    return STATUS_COLORS.EN_REVISION
  }
  if (CASE_STATUS_KEYWORDS.RESUELTO.some(keyword => lowerStatus.includes(keyword))) {
    return STATUS_COLORS.RESUELTO
  }
  if (CASE_STATUS_KEYWORDS.CONDICIONAMIENTO_MATRICULA.some(keyword => lowerStatus.includes(keyword))) {
    return STATUS_COLORS.CONDICIONAMIENTO_MATRICULA
  }
  if (CASE_STATUS_KEYWORDS.CANCELAMIENTO_MATRICULA.some(keyword => lowerStatus.includes(keyword))) {
    return STATUS_COLORS.CANCELAMIENTO_MATRICULA
  }
  if (CASE_STATUS_KEYWORDS.APLAZAMIENTO_PROCESO.some(keyword => lowerStatus.includes(keyword))) {
    return STATUS_COLORS.APLAZAMIENTO_PROCESO
  }
  if (CASE_STATUS_KEYWORDS.PLAN_MEJORAMIENTO.some(keyword => lowerStatus.includes(keyword))) {
    return STATUS_COLORS.PLAN_MEJORAMIENTO
  }
  
  return STATUS_COLORS.DEFAULT
}

export const getPriorityColor = (priority?: string): string => {
  if (!priority) return PRIORITY_COLORS.DEFAULT
  
  const upperPriority = priority.toUpperCase()
  return PRIORITY_COLORS[upperPriority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.DEFAULT
}

export const getStatusIconType = (status: string): string => {
  const lowerStatus = status.toLowerCase()
  
  if (CASE_STATUS_KEYWORDS.ABIERTO.some(keyword => lowerStatus.includes(keyword))) {
    return "clock"
  }
  if (CASE_STATUS_KEYWORDS.EN_REVISION.some(keyword => lowerStatus.includes(keyword))) {
    return "alert"
  }
  if (CASE_STATUS_KEYWORDS.RESUELTO.some(keyword => lowerStatus.includes(keyword))) {
    return "check"
  }
  if (CASE_STATUS_KEYWORDS.CONDICIONAMIENTO_MATRICULA.some(keyword => lowerStatus.includes(keyword))) {
    return "pause"
  }
  if (CASE_STATUS_KEYWORDS.CANCELAMIENTO_MATRICULA.some(keyword => lowerStatus.includes(keyword))) {
    return "x"
  }
  if (CASE_STATUS_KEYWORDS.APLAZAMIENTO_PROCESO.some(keyword => lowerStatus.includes(keyword))) {
    return "pause"
  }
  if (CASE_STATUS_KEYWORDS.PLAN_MEJORAMIENTO.some(keyword => lowerStatus.includes(keyword))) {
    return "target"
  }
  
  return "alert"
}

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  } catch (error) {
    return "Fecha inválida"
  }
}

export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    })
  } catch (error) {
    return "Hora inválida"
  }
}

export const formatDateTime = (dateString: string): string => {
  return `${formatDate(dateString)} ${formatTime(dateString)}`
}
