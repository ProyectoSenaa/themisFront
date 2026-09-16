"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  GET_ALL_FOLLOW_UPS,
  GET_FOLLOW_UP_TYPES,
  GET_FOLLOW_UP_STATUSES,
  GET_FOLLOW_UP_FLOW_STATUSES,
  ADD_FOLLOW_UP,
  UPDATE_FOLLOW_UP,
  DELETE_FOLLOW_UP
} from "@/graphql/follow-up-queries"
import { graphqlRequest } from "@/lib/graphql-client"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchStudents, setSelectedStudent } from '@/redux/features/studentSlice'

export default function useCaseTracking() {
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [caseToEdit, setCaseToEdit] = useState<any>(null)
  const [caseToDelete, setCaseToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  const [followUpsData, setFollowUpsData] = useState<any>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { students, loading: loadingStudents } = useSelector((state: RootState) => state.student)
  const [studentSearch, setStudentSearch] = useState("")
  const [teachersData, setTeachersData] = useState<any>(null)
  const [typesData, setTypesData] = useState<any>(null)
  const [statusesData, setStatusesData] = useState<any>(null)
  const [flowStatusesData, setFlowStatusesData] = useState<any>(null)

  const [loadingFollowUps, setLoadingFollowUps] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingStatuses, setLoadingStatuses] = useState(false)
  const [loadingFlowStatuses, setLoadingFlowStatuses] = useState(false)

  const [addingFollowUp, setAddingFollowUp] = useState(false)
  const [updatingFollowUp, setUpdatingFollowUp] = useState(false)
  const [deletingFollowUp, setDeletingFollowUp] = useState(false)

  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [apiConfigError, setApiConfigError] = useState(false)

  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfPreview, setPdfPreview] = useState<string>("")

  const [formData, setFormData] = useState({
    caseDescription: "",
    studentId: "",
    studentName: "",
    teacherId: 1,
    coordinatorId: null,
    followUpTypeId: "",
    followUpStatusId: "",
    followUpFlowStatusId: "1",
    evidenceFiles: "",
    numberSheet: "",
  })

  const [statusFormData, setStatusFormData] = useState({
    followUpStatusId: "",
    followUpFlowStatusId: "",
  })

  useEffect(() => {
    if (formData.studentId && students.length > 0) {
      const student = students.find((s: any) => s.id === formData.studentId)
      if (student) {
        let ficha = ""
        if (student.studentStudySheets && student.studentStudySheets.length > 0) {
          ficha = student.studentStudySheets[0]?.studySheet?.number || ""
        }
        setFormData((f) => ({
          ...f,
          studySheetId: ficha,
          numberSheet: ficha,
          studentName: student.person ? `${student.person.name} ${student.person.lastname}` : ""
        }))
      } else {
        setFormData((f) => ({ ...f, studySheetId: "", numberSheet: "", studentName: "" }))
      }
    } else {
      setFormData((f) => ({ ...f, studySheetId: "", numberSheet: "", studentName: "" }))
    }
  }, [formData.studentId, students])

  const fetchFollowUps = async () => {
    setLoadingFollowUps(true)
    try {
      const result = await graphqlRequest(GET_ALL_FOLLOW_UPS, { page: currentPage, size: pageSize })
      setFollowUpsData(result)
      setApiConfigError(false)
    } catch (error: any) {
      console.error("[v0] Error fetching follow-ups:", error)
      setErrorMsg(error.message || "Error al cargar los casos")
      setApiConfigError(true)
    } finally {
      setLoadingFollowUps(false)
    }
  }

  const fetchTypes = async () => {
    setLoadingTypes(true)
    try {
      const result = await graphqlRequest(GET_FOLLOW_UP_TYPES, { page: 0, size: 100 })
      setTypesData(result)
    } catch (error: any) {
      console.error("[v0] Error fetching types:", error)
    } finally {
      setLoadingTypes(false)
    }
  }

  const fetchStatuses = async () => {
    setLoadingStatuses(true)
    try {
      const result = await graphqlRequest(GET_FOLLOW_UP_STATUSES, { page: 0, size: 100 })
      setStatusesData(result)
    } catch (error: any) {
      console.error("[v0] Error fetching statuses:", error)
    } finally {
      setLoadingStatuses(false)
    }
  }

  const fetchFlowStatuses = async () => {
    setLoadingFlowStatuses(true)
    try {
      const result = await graphqlRequest(GET_FOLLOW_UP_FLOW_STATUSES, { page: 0, size: 100 })
      setFlowStatusesData(result)
    } catch (error: any) {
      console.error("[v0] Error fetching flow statuses:", error)
    } finally {
      setLoadingFlowStatuses(false)
    }
  }

  useEffect(() => {
    fetchFollowUps()
    dispatch(fetchStudents({ page: 0, size: 100 }))
    fetchTypes()
    fetchStatuses()
    fetchFlowStatuses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (studentSearch.length === 0 || studentSearch.length > 2) {
      dispatch(fetchStudents({ page: 0, size: 100, search: studentSearch }))
    }
  }, [studentSearch, dispatch])

  useEffect(() => {
    fetchFollowUps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const handleStudentSearch = (value: string) => {
    setStudentSearch(value)
  }

  const filteredCases = useMemo(() => {
    if (!followUpsData?.allFollowUps?.data) return []

    if (!searchQuery) return followUpsData.allFollowUps.data

    return followUpsData.allFollowUps.data.filter((caseItem: any) => {
      // Note: Backend only returns IDs, not full student/teacher objects
      // Search is limited to case description and IDs
      const description = caseItem.caseDescription?.toLowerCase() || ""
      const studentIdStr = caseItem.studentId?.toString() || ""
      const teacherIdStr = caseItem.teacherId?.toString() || ""

      return (
        description.includes(searchQuery.toLowerCase()) ||
        studentIdStr.includes(searchQuery) ||
        teacherIdStr.includes(searchQuery)
      )
    })
  }, [followUpsData, searchQuery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg("")
    setErrorMsg("")
    setAddingFollowUp(true)

    try {
      const evidenceFilesData = pdfPreview || formData.evidenceFiles

      if (!formData.studentId) {
        setErrorMsg("Debes seleccionar un aprendiz.")
        setAddingFollowUp(false)
        return
      }
      if (!formData.caseDescription.trim()) {
        setErrorMsg("La descripción del caso es obligatoria.")
        setAddingFollowUp(false)
        return
      }
      if (!formData.followUpTypeId) {
        setErrorMsg("Debes seleccionar un tipo de seguimiento.")
        setAddingFollowUp(false)
        return
      }
      if (!formData.followUpFlowStatusId) {
        setErrorMsg("Debes seleccionar un estado del flujo.")
        setAddingFollowUp(false)
        return
      }
      if (!evidenceFilesData) {
        setErrorMsg("Debes subir un archivo PDF de evidencia.")
        setAddingFollowUp(false)
        return
      }

      const rawBase64 = typeof evidenceFilesData === 'string'
        ? evidenceFilesData.replace(/^data:.*;base64,/, '')
        : evidenceFilesData

      const statusId = formData.followUpStatusId || '1'

      // ✅ Aligned with backend GraphQL schema FollowUpDto
      const input: any = {
        caseDescription: formData.caseDescription,
        evidenceFiles: rawBase64,
        isActive: true,
        studentId: Number(formData.studentId),
        teacherId: formData.teacherId ? Number(formData.teacherId) : null,
        coordinatorId: formData.coordinatorId ? Number(formData.coordinatorId) : null,
        studySheetId: (formData as any).studySheetId ? Number((formData as any).studySheetId) : null,
        followUpType: { id: Number(formData.followUpTypeId) },
        followUpStatus: { id: Number(statusId) },
        followUpFlowStatus: { id: Number(formData.followUpFlowStatusId) },
      }

      await graphqlRequest(ADD_FOLLOW_UP, { input })

      setSuccessMsg("Caso de seguimiento creado exitosamente")
      setModalOpen(false)
      setFormData({
        caseDescription: "",
        studentId: "",
        studentName: "",
        teacherId: 1,
        coordinatorId: null,
        followUpTypeId: "",
        followUpStatusId: "",
        followUpFlowStatusId: "1",
        evidenceFiles: "",
        numberSheet: "",
      })
      setPdfFile(null)
      setPdfPreview("")
      fetchFollowUps()
    } catch (err: any) {
      console.error("[v0] Error creating follow-up:", err)
      if (err?.graphQLErrors && err.graphQLErrors.length) {
        setErrorMsg(err.graphQLErrors.map((g: any) => g.message).join('; '))
      } else if (err?.networkError?.result?.errors) {
        setErrorMsg(err.networkError.result.errors.map((g: any) => g.message).join('; '))
      } else if (err?.message) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg("Error al crear el caso de seguimiento")
      }
    } finally {
      setAddingFollowUp(false)
    }
  }

  const handleEditStatus = (caseItem: any) => {
    setCaseToEdit(caseItem)
    setStatusFormData({
      followUpStatusId: caseItem.followUpStatus?.id || caseItem.followUpStatusId || "",
      followUpFlowStatusId: caseItem.followUpFlowStatus?.id || caseItem.followUpFlowStatusId || "",
    })
    setEditStatusModalOpen(true)
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg("")
    setErrorMsg("")

    if (!caseToEdit) return

    if (!statusFormData.followUpStatusId || !statusFormData.followUpFlowStatusId) {
      setErrorMsg("Debe seleccionar Estado y Estado del Flujo antes de actualizar.")
      return
    }

    setUpdatingFollowUp(true)

    try {
      const followUpStatusId = Number(statusFormData.followUpStatusId)
      const followUpFlowStatusId = Number(statusFormData.followUpFlowStatusId)
      const studentId = caseToEdit.studentId ? Number(caseToEdit.studentId) : null
      const teacherId = caseToEdit.teacherId ? Number(caseToEdit.teacherId) : null
      const studySheetId = caseToEdit.studySheetId ? Number(caseToEdit.studySheetId) : null
      const followUpTypeId = caseToEdit.followUpType?.id || caseToEdit.followUpTypeId

      // ✅ Aligned with backend GraphQL schema FollowUpDto
      const input: any = {
        caseDescription: caseToEdit.caseDescription || "",
        evidenceFiles: caseToEdit.evidenceFiles || null,
        isActive: typeof caseToEdit.isActive === "boolean" ? caseToEdit.isActive : true,
        studentId,
        teacherId,
        coordinatorId: caseToEdit.coordinatorId ? Number(caseToEdit.coordinatorId) : null,
        studySheetId,
        followUpType: { id: Number(followUpTypeId) },
        followUpStatus: { id: followUpStatusId },
        followUpFlowStatus: { id: followUpFlowStatusId },
      }

      await graphqlRequest(UPDATE_FOLLOW_UP, {
        id: caseToEdit.id,
        input,
      })

      setSuccessMsg("Estado del caso actualizado exitosamente")
      setEditStatusModalOpen(false)
      setCaseToEdit(null)
      fetchFollowUps()
    } catch (err: any) {
      console.error("[v0] Error updating status:", err)
      if (err?.graphQLErrors && err.graphQLErrors.length) {
        setErrorMsg(err.graphQLErrors.map((g: any) => g.message).join("; "))
      } else if (err?.networkError?.result?.errors) {
        setErrorMsg(err.networkError.result.errors.map((g: any) => g.message).join("; "))
      } else if (err?.response?.errors) {
        setErrorMsg(err.response.errors.map((g: any) => g.message).join("; "))
      } else if (err?.message) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg("Error al actualizar el estado del caso")
      }
    } finally {
      setUpdatingFollowUp(false)
    }
  }

  const handleDeleteCase = (caseItem: any) => {
    setCaseToDelete(caseItem)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    setSuccessMsg("")
    setErrorMsg("")

    if (!caseToDelete) return

    setDeletingFollowUp(true)

    try {
      await graphqlRequest(DELETE_FOLLOW_UP, {
        id: caseToDelete.id,
      })

      setSuccessMsg("Caso de seguimiento eliminado exitosamente")
      setDeleteDialogOpen(false)
      setCaseToDelete(null)
      fetchFollowUps()
    } catch (err: any) {
      console.error("[v0] Error deleting case:", err)
      setErrorMsg(err.message || "Error al eliminar el caso de seguimiento")
      setDeleteDialogOpen(false)
    } finally {
      setDeletingFollowUp(false)
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPdfPreview(reader.result as string)
        setFormData((f) => ({ ...f, evidenceFiles: reader.result as string }))
      }
      reader.readAsDataURL(file)
    } else {
      setErrorMsg("Por favor seleccione un archivo PDF válido")
    }
  }

  const handleRemovePdf = () => {
    setPdfFile(null)
    setPdfPreview("")
    setFormData((f) => ({ ...f, evidenceFiles: "" }))
  }

  const handleViewCase = (caseItem: any) => {
    const student =
      caseItem.student ||
      (students && students.find((s: any) => String(s.id) === String(caseItem.studentId))) ||
      null

    const teacher = caseItem.teacher || null

    const followUpType =
      caseItem.followUpType ||
      typesData?.allFollowUpTypes?.data?.find((t: any) => String(t.id) === String(caseItem.followUpTypeId)) ||
      null

    const followUpFlowStatus =
      caseItem.followUpFlowStatus ||
      flowStatusesData?.allFollowUpFlowStatuses?.data?.find((f: any) => String(f.id) === String(caseItem.followUpFlowStatusId)) ||
      null

    const followUpStatus =
      caseItem.followUpStatus ||
      statusesData?.allFollowUpStatuses?.data?.find((s: any) => String(s.id) === String(caseItem.followUpStatusId)) ||
      null

    const enriched = {
      ...caseItem,
      student,
      teacher,
      followUpType,
      followUpFlowStatus,
      followUpStatus,
    }

    setSelectedCase(enriched)
  }

  return {
    selectedCase,
    setSelectedCase,
    modalOpen,
    setModalOpen,
    editStatusModalOpen,
    setEditStatusModalOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    caseToEdit,
    setCaseToEdit,
    caseToDelete,
    setCaseToDelete,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    followUpsData,
    students,
    loadingStudents,
    studentSearch,
    setStudentSearch: handleStudentSearch,
    teachersData,
    typesData,
    statusesData,
    flowStatusesData,
    loadingFollowUps,
    loadingTeachers,
    loadingTypes,
    loadingStatuses,
    loadingFlowStatuses,
    addingFollowUp,
    updatingFollowUp,
    deletingFollowUp,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    apiConfigError,
    pdfFile,
    pdfPreview,
    formData,
    setFormData,
    statusFormData,
    setStatusFormData,
    handleSubmit,
    handleEditStatus,
    handleUpdateStatus,
    handleDeleteCase,
    handleConfirmDelete,
    handlePdfChange,
    handleRemovePdf,
    handleViewCase,
    filteredCases,
    fetchFollowUps,
  }
}
