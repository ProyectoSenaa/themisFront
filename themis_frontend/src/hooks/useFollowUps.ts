import { useCallback, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import {
  GET_ALL_FOLLOW_UPS,
  GET_FOLLOW_UP_TYPES,
  GET_FOLLOW_UP_STATUSES,
  GET_FOLLOW_UP_FLOW_STATUSES,
  ADD_FOLLOW_UP,
  UPDATE_FOLLOW_UP,
  DELETE_FOLLOW_UP,
} from "@/graphql/follow-up-queries"
import { useRoleBasedFollowUpQuery } from "./useRoleBasedFollowUpQuery"

const PAGE_SIZE = 10

export interface FollowUp {
  id: string
  creationDate: string
  caseDescription: string
  evidenceFiles: string
  isActive: boolean
  student?: {
    id: string
    person?: {
      id: string
      name: string
      lastname: string
      email: string
      document: string
    }
  }
  teacher?: {
    id: string
    person?: {
      id: string
      name: string
      lastname: string
    }
  }
  followUpType?: {
    id: string
    name: string
    description: string
  }
  followUpStatus?: {
    id: string
    name: string
    description: string
  }
  followUpFlowStatus?: {
    id: string
    name: string
    description: string
  }
}

export interface FollowUpType {
  id: string
  name: string
  description: string
}

export interface FollowUpStatus {
  id: string
  name: string
  description: string
}

export interface FollowUpFlowStatus {
  id: string
  name: string
  description: string
}

export interface FollowUpInput {
  caseDescription: string
  evidenceFiles: string
  isActive: boolean
  studentId?: number | null
  teacherId?: number | null
  coordinatorId?: number | null
  studySheetId?: number | null
  followUpTypeId?: number | null
  followUpStatusId?: number | null
  followUpFlowStatusId?: number | null
}

export const useFollowUps = (page: number = 0) => {
  const [currentPage, setCurrentPage] = useState(page)

  // Get role-based query and variables
  const { query, variables, isFiltered, userRole } = useRoleBasedFollowUpQuery(
    currentPage,
    PAGE_SIZE
  )

  // Query para obtener follow-ups (filtrados por rol si aplica)
  const {
    data: followUpsData,
    loading: loadingFollowUps,
    error: followUpsError,
    refetch: refetchFollowUps,
  } = useQuery(query, {
    variables,
    fetchPolicy: "cache-and-network",
  })

  // Query para obtener tipos
  const {
    data: typesData,
    loading: loadingTypes,
    error: typesError,
  } = useQuery(GET_FOLLOW_UP_TYPES, {
    variables: { page: 0, size: 100 },
    fetchPolicy: "cache-first",
  })

  // Query para obtener estados
  const {
    data: statusesData,
    loading: loadingStatuses,
    error: statusesError,
  } = useQuery(GET_FOLLOW_UP_STATUSES, {
    variables: { page: 0, size: 100 },
    fetchPolicy: "cache-first",
  })

  // Query para obtener estados de flujo
  const {
    data: flowStatusesData,
    loading: loadingFlowStatuses,
    error: flowStatusesError,
  } = useQuery(GET_FOLLOW_UP_FLOW_STATUSES, {
    variables: { page: 0, size: 100 },
    fetchPolicy: "cache-first",
  })

  // Mutation para agregar
  const [addFollowUpMutation, { loading: addingFollowUp }] = useMutation(ADD_FOLLOW_UP, {
    refetchQueries: [{ query, variables }],
    awaitRefetchQueries: true,
  })

  // Mutation para actualizar
  const [updateFollowUpMutation, { loading: updatingFollowUp }] = useMutation(UPDATE_FOLLOW_UP, {
    refetchQueries: [{ query, variables }],
    awaitRefetchQueries: true,
  })

  // Mutation para eliminar
  const [deleteFollowUpMutation, { loading: deletingFollowUp }] = useMutation(DELETE_FOLLOW_UP, {
    refetchQueries: [{ query, variables }],
    awaitRefetchQueries: true,
  })

  const addFollowUp = useCallback(
    async (input: FollowUpInput) => {
      try {
        const response = await addFollowUpMutation({
          variables: { input },
        })
        return response.data.addFollowUp
      } catch (error) {
        console.error("Error adding follow-up:", error)
        throw error
      }
    },
    [addFollowUpMutation]
  )

  const updateFollowUp = useCallback(
    async (id: string, input: Partial<FollowUpInput>) => {
      try {
        const response = await updateFollowUpMutation({
          variables: { id, input },
        })
        return response.data.updateFollowUp
      } catch (error) {
        console.error("Error updating follow-up:", error)
        throw error
      }
    },
    [updateFollowUpMutation]
  )

  const deleteFollowUp = useCallback(
    async (id: string) => {
      try {
        const response = await deleteFollowUpMutation({
          variables: { id },
        })
        return response.data.deleteFollowUp
      } catch (error) {
        console.error("Error deleting follow-up:", error)
        throw error
      }
    },
    [deleteFollowUpMutation]
  )

  // Extract data - handle both filtered and non-filtered responses
  const responseKey = isFiltered
    ? (userRole === 'aprendiz' || userRole === 'estudiante' ? 'followUpsByStudent'
      : userRole === 'instructor' || userRole === 'teacher' ? 'followUpsByTeacher'
        : 'followUpsByCoordinator')
    : 'allFollowUps'

  const followUpResponse = followUpsData?.[responseKey]
  const followUps = followUpResponse?.data || []
  const totalPages = followUpResponse?.totalPages || 0
  const totalItems = followUpResponse?.totalItems || 0

  const types = typesData?.allFollowUpTypes?.data || []
  const statuses = statusesData?.allFollowUpStatuses?.data || []
  const flowStatuses = flowStatusesData?.allFollowUpFlowStatuses?.data || []

  return {
    // Follow-ups
    followUps,
    loadingFollowUps,
    followUpsError,
    totalPages,
    totalItems,
    currentPage,
    setCurrentPage,
    refetchFollowUps,
    isFiltered,
    userRole,

    // Types
    types,
    loadingTypes,
    typesError,

    // Statuses
    statuses,
    loadingStatuses,
    statusesError,

    // Flow Statuses
    flowStatuses,
    loadingFlowStatuses,
    flowStatusesError,

    // Mutations
    addFollowUp,
    addingFollowUp,
    updateFollowUp,
    updatingFollowUp,
    deleteFollowUp,
    deletingFollowUp,
  }
}
