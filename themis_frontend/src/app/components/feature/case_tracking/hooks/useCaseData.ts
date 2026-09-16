import { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery } from "@apollo/client"
import { GET_STUDENT_LIST } from "@/app/graphqlServices/studentGraphql"
import { GET_ALL_FOLLOW_UPS } from "@/app/graphqlServices/followUpGraphql"
import {
  GET_ALL_FOLLOW_UP_TYPES,
  GET_ALL_FOLLOW_UP_STATUSES,
  GET_ALL_FOLLOW_UP_FLOW_STATUSES,
} from "@/app/graphqlServices/followUpTypesGraphql"
import type { FollowUp, FollowUpType, FollowUpStatus } from "@/app/interfaces/followUp"
import type { CaseItem, CaseFilter, SearchFilters, Student } from "../types"
import { createPaginationVariables, filterCases, calculateStatistics } from "../utils"

export const useCaseData = () => {
  const [cases, setCases] = useState<CaseItem[]>([])
  const [filter, setFilter] = useState<CaseFilter>("all")
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    studentName: "",
    program: "",
    status: "all",
  })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  // GraphQL queries
  const { data: studentsData, loading: studentsLoading, error: studentsError } = useQuery(GET_STUDENT_LIST)
  const {
    data: followUpsData,
    loading: followUpsLoading,
    refetch: refetchFollowUps,
  } = useQuery(GET_ALL_FOLLOW_UPS, { variables: createPaginationVariables() })
  const { data: followUpTypesData } = useQuery(GET_ALL_FOLLOW_UP_TYPES, { variables: createPaginationVariables() })
  const { data: followUpStatusesData } = useQuery(GET_ALL_FOLLOW_UP_STATUSES, {
    variables: createPaginationVariables(),
  })
  const { data: followUpFlowStatusesData } = useQuery(GET_ALL_FOLLOW_UP_FLOW_STATUSES, {
    variables: createPaginationVariables(),
  })

  // Transform data effect
  useEffect(() => {
    if (followUpsData?.allFollowUps?.data) {
      setLoading(true)

      const transformedCases: CaseItem[] = followUpsData.allFollowUps.data.map((followUp: FollowUp) => {
        const student = studentsData?.allStudentList?.data?.find((s: Student) => s.id === followUp.studentId)
        const followUpType = followUpTypesData?.allFollowUpTypes?.data?.find(
          (type: FollowUpType) => type.id === followUp.followUpTypeId,
        )
        const followUpStatus = followUpStatusesData?.allFollowUpStatuses?.data?.find(
          (status: FollowUpStatus) => status.id === followUp.followUpStatusId,
        )

        return {
          id: followUp.id,
          studentName: student ? `${student.person.name} ${student.person.lastname}` : "Estudiante no encontrado",
          studentDocument: student ? student.person.document : "N/A",
          noveltyType: followUpType ? followUpType.name : "Tipo no especificado",
          reportDate: followUp.creationDate,
          status: followUpStatus ? followUpStatus.name : "Estado no especificado",
          description: followUp.caseDescription,
          program:
            student?.studentStudySheets?.[0]?.studySheet?.trainingProject?.program?.name || "Programa no especificado",
          followUp: followUp,
        }
      })

      setCases(transformedCases)
      setLoading(false)
    } else if (!followUpsLoading) {
      setLoading(false)
    }
  }, [followUpsData, studentsData, followUpTypesData, followUpStatusesData, followUpsLoading])

  // Computed values
  const filteredCases = useMemo(() => filterCases(cases, filter, searchFilters), [cases, filter, searchFilters])
  const statistics = useMemo(() => calculateStatistics(cases), [cases])
  
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCases = filteredCases.slice(startIndex, endIndex)

  // Reset page when filtered cases change
  useEffect(() => {
    if (filteredCases.length > 0 && currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [filteredCases.length, currentPage, totalPages])

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }, [currentPage])

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }, [currentPage, totalPages])

  const clearFilters = useCallback(() => {
    setFilter("all")
    setSearchFilters({ studentName: "", program: "", status: "all" })
    setCurrentPage(1)
  }, [])

  return {
    // Data
    cases,
    currentCases,
    filteredCases,
    statistics,
    
    // Filters
    filter,
    setFilter,
    searchFilters,
    setSearchFilters,
    clearFilters,
    
    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    
    // Loading states
    loading: loading || followUpsLoading,
    studentsLoading,
    studentsError,
    
    // GraphQL data
    studentsData,
    followUpTypesData,
    followUpStatusesData,
    followUpFlowStatusesData,
    refetchFollowUps,
  }
}
