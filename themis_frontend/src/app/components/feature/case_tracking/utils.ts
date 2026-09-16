import { 
  CASE_STATUS_KEYWORDS, 
  STATUS_COLORS, 
  PAGINATION_CONFIG 
} from "./constants"
import { CaseFilter, CaseItem, CaseStatistics, SearchFilters } from "./types"

export const checkStatusCategory = (status: string) => {
  const statusLower = status.toLowerCase()
  
  if (CASE_STATUS_KEYWORDS.ABIERTO.some(keyword => statusLower.includes(keyword))) {
    return "ABIERTO"
  }
  if (CASE_STATUS_KEYWORDS.EN_REVISION.some(keyword => statusLower.includes(keyword))) {
    return "EN_REVISION"
  }
  if (CASE_STATUS_KEYWORDS.RESUELTO.some(keyword => statusLower.includes(keyword))) {
    return "RESUELTO"
  }
  if (CASE_STATUS_KEYWORDS.CONDICIONAMIENTO_MATRICULA.some(keyword => statusLower.includes(keyword))) {
    return "CONDICIONAMIENTO_MATRICULA"
  }
  if (CASE_STATUS_KEYWORDS.CANCELAMIENTO_MATRICULA.some(keyword => statusLower.includes(keyword))) {
    return "CANCELAMIENTO_MATRICULA"
  }
  if (CASE_STATUS_KEYWORDS.APLAZAMIENTO_PROCESO.some(keyword => statusLower.includes(keyword))) {
    return "APLAZAMIENTO_PROCESO"
  }
  if (CASE_STATUS_KEYWORDS.PLAN_MEJORAMIENTO.some(keyword => statusLower.includes(keyword))) {
    return "PLAN_MEJORAMIENTO"
  }
  return "DEFAULT"
}

export const getStatusColor = (status: string): string => {
  const category = checkStatusCategory(status)
  return STATUS_COLORS[category]
}

export const getStatusIconType = (status: string): "clock" | "check" | "x" | "alert" | "file" | "pause" | "target" => {
  const category = checkStatusCategory(status)
  
  const iconMap = {
    ABIERTO: "file" as const,
    EN_REVISION: "clock" as const,
    RESUELTO: "check" as const,
    CONDICIONAMIENTO_MATRICULA: "alert" as const,
    CANCELAMIENTO_MATRICULA: "x" as const,
    APLAZAMIENTO_PROCESO: "pause" as const,
    PLAN_MEJORAMIENTO: "target" as const,
    DEFAULT: "alert" as const
  }
  
  return iconMap[category]
}

export const filterCases = (cases: CaseItem[], filter: CaseFilter, searchFilters?: SearchFilters): CaseItem[] => {
  let filteredCases = cases
  
  // Filter by status
  if (filter !== "all") {
    filteredCases = cases.filter((caseItem) => {
      const category = checkStatusCategory(caseItem.status)
      
      switch (filter) {
        case "abierto":
          return category === "ABIERTO"
        case "en_revision":
          return category === "EN_REVISION"
        case "resuelto":
          return category === "RESUELTO"
        case "condicionamiento_matricula":
          return category === "CONDICIONAMIENTO_MATRICULA"
        case "cancelamiento_matricula":
          return category === "CANCELAMIENTO_MATRICULA"
        case "aplazamiento_proceso":
          return category === "APLAZAMIENTO_PROCESO"
        case "plan_mejoramiento":
          return category === "PLAN_MEJORAMIENTO"
        default:
          return false
      }
    })
  }
  
  // Apply search filters
  if (searchFilters) {
    if (searchFilters.studentName) {
      const searchTerm = searchFilters.studentName.toLowerCase()
      filteredCases = filteredCases.filter(caseItem => 
        caseItem.studentName.toLowerCase().includes(searchTerm) ||
        caseItem.studentDocument.toLowerCase().includes(searchTerm)
      )
    }
    
    if (searchFilters.program) {
      const searchTerm = searchFilters.program.toLowerCase()
      filteredCases = filteredCases.filter(caseItem => 
        (caseItem.program || "").toLowerCase().includes(searchTerm)
      )
    }
  }
  
  return filteredCases
}

export const calculateStatistics = (cases: CaseItem[]): CaseStatistics => {
  const stats = cases.reduce((acc, caseItem) => {
    const category = checkStatusCategory(caseItem.status)
    
    acc.total++
    
    switch (category) {
      case "ABIERTO":
        acc.abierto++
        break
      case "EN_REVISION":
        acc.enRevision++
        break
      case "RESUELTO":
        acc.resuelto++
        break
      case "CONDICIONAMIENTO_MATRICULA":
        acc.condicionamientoMatricula++
        break
      case "CANCELAMIENTO_MATRICULA":
        acc.cancelamientoMatricula++
        break
      case "APLAZAMIENTO_PROCESO":
        acc.aplazamientoProceso++
        break
      case "PLAN_MEJORAMIENTO":
        acc.planMejoramiento++
        break
    }
    
    return acc
  }, { 
    total: 0, 
    abierto: 0, 
    enRevision: 0, 
    resuelto: 0, 
    condicionamientoMatricula: 0, 
    cancelamientoMatricula: 0, 
    aplazamientoProceso: 0, 
    planMejoramiento: 0 
  })
  
  return stats
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES")
}

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("es-ES", { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export const createPaginationVariables = (page = PAGINATION_CONFIG.DEFAULT_PAGE, size = PAGINATION_CONFIG.DEFAULT_SIZE) => ({
  page: page - 1, // Convert to 0-based for GraphQL
  size
})

export const paginateItems = <T>(items: T[], currentPage: number, itemsPerPage: number): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return items.slice(startIndex, endIndex)
}

export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage)
}
