import { FollowUp } from "@/app/interfaces/followUp"

export interface CoordinatorCaseItem {
  id: string
  studentName: string
  studentDocument: string
  instructorName: string
  noveltyType: string
  reportDate: string
  status: string
  description: string
  program?: string
  followUp: FollowUp
  priority?: "alta" | "media" | "baja"
}

export interface CoordinatorCaseFormData {
  studentId: string
  studentName: string
  studentDocument: string
  instructorId: string
  instructorName: string
  caseDescription: string
  followUpTypeId: string
  followUpStatusId?: string
  evidenceFiles?: string
  priority?: "alta" | "media" | "baja"
}

export interface Instructor {
  id: string
  person: {
    id: string
    name: string
    lastname: string
    document: string
    email: string
    phone: string
  }
}

export interface Student {
  id: string
  person: {
    id: string
    name: string
    lastname: string
    document: string
    email: string
    phone: string
  }
  studentStudySheets: {
    studySheet: {
      id?: string
      trainingProject: {
        program: {
          name: string
        }
      }
    }
  }[]
}

export type CoordinatorCaseFilter = "all" | "abierto" | "en_revision" | "resuelto" | "condicionamiento_matricula" | "cancelamiento_matricula" | "aplazamiento_proceso" | "plan_mejoramiento" | "alta_prioridad"

export interface CoordinatorCaseStatistics {
  total: number
  abierto: number
  enRevision: number
  resuelto: number
  condicionamientoMatricula: number
  cancelamientoMatricula: number
  aplazamientoProceso: number
  planMejoramiento: number
  altaPrioridad: number
}

export interface CoordinatorSearchFilters {
  studentName: string
  instructorName: string
  program: string
  status: CoordinatorCaseFilter
  priority?: "alta" | "media" | "baja" | "all"
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}
