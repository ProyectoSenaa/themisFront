import { FollowUp } from "@/app/interfaces/followUp"

export interface CaseItem {
  id: string
  studentName: string
  studentDocument: string
  noveltyType: string
  reportDate: string
  status: string
  description: string
  program?: string
  followUp: FollowUp
}

export interface CaseFormData {
  studentId: string
  studentName: string
  studentDocument: string
  caseDescription: string
  followUpTypeId: string
  followUpStatusId?: string
  evidenceFiles?: string
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

export type CaseFilter = "all" | "abierto" | "en_revision" | "resuelto" | "condicionamiento_matricula" | "cancelamiento_matricula" | "aplazamiento_proceso" | "plan_mejoramiento"

export interface CaseStatistics {
  total: number
  abierto: number
  enRevision: number
  resuelto: number
  condicionamientoMatricula: number
  cancelamientoMatricula: number
  aplazamientoProceso: number
  planMejoramiento: number
}

export interface SearchFilters {
  studentName: string
  program: string
  status: CaseFilter
}

export interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}
