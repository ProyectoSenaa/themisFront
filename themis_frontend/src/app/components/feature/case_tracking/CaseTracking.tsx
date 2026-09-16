"use client"

import React, { useState, useEffect } from "react"
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
import { User, FileText, Plus, Search, AlertTriangle, Upload, File, X, AlertCircle, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Button from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,

} from "@/components/ui/alert-dialog"
import Label from "@/components/ui/Label"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/textarea"
import Select, { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import AlertTitle from "@/components/ui/Alert"
import { CaseTrackingTable } from "@/components/case-tracking-table"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchStudents, setSelectedStudent } from '@/redux/features/studentSlice';
import { useQuery } from '@apollo/client';
import { useRoleBasedFollowUpQuery } from '@/hooks/useRoleBasedFollowUpQuery';

const CaseTracking: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [caseToEdit, setCaseToEdit] = useState<any>(null)
  const [caseToDelete, setCaseToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 4

  const [followUpsData, setFollowUpsData] = useState<any>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { students, loading: loadingStudents } = useSelector((state: RootState) => state.student)
  const { user } = useSelector((state: RootState) => state.auth)
  const isDarkMode = useSelector((state: RootState) => state.theme.darkMode)
  const [studentSearch, setStudentSearch] = useState("")
  const [teachersData, setTeachersData] = useState<any>(null)
  const [typesData, setTypesData] = useState<any>(null)
  const [statusesData, setStatusesData] = useState<any>(null)
  const [flowStatusesData, setFlowStatusesData] = useState<any>(null)

  // Use role-based query hook
  const { query, variables } = useRoleBasedFollowUpQuery(currentPage, pageSize)

  // Apollo query for follow-ups
  const { data: followUpsResp, loading: loadingFollowUps, error: followUpsError, refetch: refetchFollowUps } = useQuery(GET_ALL_FOLLOW_UPS, {
    variables: {
      page: currentPage,
      size: pageSize
    },
    skip: !user,
    fetchPolicy: 'network-only'
  })

  // Eliminado: loadingStudents local, ahora se usa el de Redux
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
    studySheetId: "",
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
        let ficha = "";
        if (student.studentStudySheets && student.studentStudySheets.length > 0) {
          ficha = student.studentStudySheets[0]?.studySheet?.number || "";
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

  // Transform Apollo query response to local state format
  useEffect(() => {
    if (followUpsError) {
      console.error("[v0] Error fetching follow-ups:", followUpsError)
      setErrorMsg(followUpsError.message || "Error al cargar los casos")
      setApiConfigError(true)
      return
    }

    // Handle different response structures based on the query used
    const responseData = followUpsResp?.allFollowUps ||
      followUpsResp?.followUpsByStudent ||
      followUpsResp?.followUpsByTeacher ||
      followUpsResp?.followUpsByCoordinator

    if (responseData) {
      console.log("🔍 DEBUG: Follow-ups result:", responseData)
      console.log("🔍 DEBUG: Follow-ups data:", responseData?.data)
      console.log("🔍 DEBUG: Total items:", responseData?.totalItems)
      setFollowUpsData({ [Object.keys(followUpsResp)[0]]: responseData })
      setApiConfigError(false)
    }
  }, [followUpsResp, followUpsError])

  // Redux fetchStudents

  // const fetchTeachers = async () => {}

  const fetchTypes = async () => {
    setLoadingTypes(true)
    try {
      // El backend espera paginación
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
      // El backend espera paginación
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
      // El backend espera paginación
      const result = await graphqlRequest(GET_FOLLOW_UP_FLOW_STATUSES, { page: 0, size: 100 })
      setFlowStatusesData(result)
    } catch (error: any) {
      console.error("[v0] Error fetching flow statuses:", error)
    } finally {
      setLoadingFlowStatuses(false)
    }
  }

  useEffect(() => {
    dispatch(fetchStudents({ page: 0, size: 100 }))
    fetchTypes()
    fetchStatuses()
    fetchFlowStatuses()
  }, [dispatch])

  // Efecto para búsqueda dinámica de estudiantes
  useEffect(() => {
    if (studentSearch.length === 0 || studentSearch.length > 2) {
      dispatch(fetchStudents({ page: 0, size: 100, search: studentSearch }))
    }
  }, [studentSearch, dispatch])
  const handleStudentSearch = (value: string) => {
    setStudentSearch(value)
  }

  const filteredCases = React.useMemo(() => {
    // Get data from any of the possible query responses
    const data = followUpsData?.allFollowUps?.data ||
      followUpsData?.followUpsByStudent?.data ||
      followUpsData?.followUpsByTeacher?.data ||
      followUpsData?.followUpsByCoordinator?.data

    if (!data) return []

    if (!searchQuery) return data

    return data.filter((caseItem: any) => {
      const description = caseItem.caseDescription?.toLowerCase() || ""
      return description.includes(searchQuery.toLowerCase())
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
      if (!formData.studySheetId) {
        setErrorMsg("El aprendiz seleccionado no tiene ficha de estudio válida.")
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

      // Remove data URL prefix if present so backend receives pure base64
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
        teacherId: formData.teacherId ? Number(formData.teacherId) : 1,
        coordinatorId: formData.coordinatorId ? Number(formData.coordinatorId) : null,
        studySheetId: formData.studySheetId ? Number(formData.studySheetId) : null,
        followUpType: { id: Number(formData.followUpTypeId) },
        followUpStatus: { id: Number(statusId) },
        followUpFlowStatus: { id: Number(formData.followUpFlowStatusId) },
      }
      console.log("Input enviado:", input)
      await graphqlRequest(ADD_FOLLOW_UP, { input })

      setSuccessMsg("Caso de seguimiento creado exitosamente")
      setModalOpen(false)
      setFormData({
        caseDescription: "",
        studentId: "",
        studentName: "",
        teacherId: 1,
        coordinatorId: null,
        studySheetId: "",
        followUpTypeId: "",
        followUpStatusId: "",
        followUpFlowStatusId: "1",
        evidenceFiles: "",
        numberSheet: "",
      })
      setPdfFile(null)
      setPdfPreview("")
      refetchFollowUps()
    } catch (err: any) {
      console.error("[v0] Error creating follow-up:", err)
      // Parse GraphQL errors if available
      if (err?.graphQLErrors && err.graphQLErrors.length) {
        setErrorMsg(err.graphQLErrors.map((g: any) => g.message).join('; '))
      } else if (err?.networkError?.result?.errors) {
        // Apollo network error with GraphQL errors inside
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

  const
    handleUpdateStatus = async (e: React.FormEvent) => {
      e.preventDefault()
      setSuccessMsg("")
      setErrorMsg("")

      if (!caseToEdit) return

      // Validar presencia de selects
      if (!statusFormData.followUpStatusId || !statusFormData.followUpFlowStatusId) {
        setErrorMsg("Debe seleccionar Estado y Estado del Flujo antes de actualizar.")
        return
      }

      setUpdatingFollowUp(true)

      try {
        // Normalizar ids a numbers (el backend suele esperar números)
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

        console.log("[v0] UPDATE_FOLLOW_UP payload:", { id: caseToEdit.id, input })

        await graphqlRequest(UPDATE_FOLLOW_UP, {
          id: caseToEdit.id,
          input,
        })

        setSuccessMsg("Estado del caso actualizado exitosamente")
        setEditStatusModalOpen(false)
        setCaseToEdit(null)
        refetchFollowUps()
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

        // Log extra para depuración: cuerpo de la respuesta del servidor
        if (err?.networkError?.result) {
          console.error("[v0] networkError.result:", err.networkError.result)
        }
        if (err?.networkError?.statusCode) {
          console.error("[v0] networkError.statusCode:", err.networkError.statusCode)
        }
        if (err?.response) {
          console.error("[v0] response:", err.response)
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
      refetchFollowUps()
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

  // Enrich a case item with nested objects when backend returns only ids.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 lg:p-10 w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-cyan-500/10 dark:from-sky-500/5 dark:via-blue-500/5 dark:to-cyan-500/5 rounded-2xl blur-3xl" />
          <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                Seguimiento de Casos
              </h1>
            </div>


            <Button
              onClick={() => setModalOpen(true)}
              className={`flex items-center gap-2 bg-gradient-to-br ${isDarkMode ? 'from-[#00304D] to-[#005386]' : 'from-[#398f0d] to-lime-500'} text-white shadow-lg rounded-xl px-6 py-3 border-0 hover:shadow-xl transition-all duration-300`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Nuevo Caso</span>
            </Button>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-green-50 dark:bg-blue-900/20 text-green-800 dark:text-blue-200 rounded-lg border border-green-200 dark:border-blue-800">
            {successMsg}
          </div>
        )}
        {errorMsg && !apiConfigError && (
          <Alert className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 dark:border-red-800/50 rounded-xl shadow-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200 font-medium">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <Card className="border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-800/50 pb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lista de Casos</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por estudiante, instructor o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full sm:w-96 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CaseTrackingTable
              cases={filteredCases}
              onViewCase={(caseItem: any) => handleViewCase(caseItem)}
              onEditStatus={handleEditStatus}
              onDeleteCase={handleDeleteCase}
              loading={loadingFollowUps}
            />

            {(followUpsData?.allFollowUps?.totalPages || followUpsData?.followUpsByStudent?.totalPages || followUpsData?.followUpsByTeacher?.totalPages || followUpsData?.followUpsByCoordinator?.totalPages || 0) > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="rounded-xl"
                >
                  Anterior
                </Button>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {Array.from({ length: Math.min(5, followUpsData?.allFollowUps?.totalPages || followUpsData?.followUpsByStudent?.totalPages || followUpsData?.followUpsByTeacher?.totalPages || followUpsData?.followUpsByCoordinator?.totalPages || 1) }, (_, i) => {
                    const page = i
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page ? "rounded-xl bg-gradient-to-r from-green-800 to-green-600" : "rounded-xl"
                        }
                      >
                        {page + 1}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min((followUpsData?.allFollowUps?.totalPages || followUpsData?.followUpsByStudent?.totalPages || followUpsData?.followUpsByTeacher?.totalPages || followUpsData?.followUpsByCoordinator?.totalPages || 1) - 1, currentPage + 1))}
                  disabled={currentPage === (followUpsData?.allFollowUps?.totalPages || followUpsData?.followUpsByStudent?.totalPages || followUpsData?.followUpsByTeacher?.totalPages || followUpsData?.followUpsByCoordinator?.totalPages || 1) - 1}
                  className="rounded-xl"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-5xl max-h-[85vh] p-6 rounded-2xl bg-white dark:bg-slate-900 overflow-y-auto">

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0faf32] dark:bg-[#11567a] rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-3xl font-extrabold text-black dark:text-white tracking-tight">
                Registrar Nuevo Caso
              </DialogTitle>
            </div>
            <p className="text-black-700 dark:text-white text-base mt-2">
              Complete el formulario con los detalles del caso de seguimiento
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full px-0">
              <div className="pt-1 pb-1">
                <h2 className="text-3xl md:text-2xl font-extrabold text-black-700 dark:text-white mb-2 mt-1 border-b pb-1 text-left">INFORMACIÓN DEL APRENDIZ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="student" className="text-base font-semibold dark:text-white">
                      Aprendiz <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={String(formData.studentId)}  // Convertir a string
                      onValueChange={(value: string) => {
                        setFormData((f) => ({ ...f, studentId: value }))
                        const student = students.find((s: any) => String(s.id) === String(value))
                        if (student) {
                          dispatch(setSelectedStudent(student))
                          let ficha = "";
                          if (student.studentStudySheets && student.studentStudySheets.length > 0) {
                            ficha = student.studentStudySheets[0]?.studySheet?.number || "";
                          }
                          setFormData((f) => ({
                            ...f,
                            studySheetId: ficha,
                            numberSheet: ficha,
                            studentName: student.person ? `${student.person.name} ${student.person.lastname}` : ""
                          }))
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {formData.studentName || (loadingStudents ? "Cargando..." : "Seleccione un aprendiz")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {students.length === 0 && (
                          <div className="px-4 py-2 text-gray-500">
                            {loadingStudents ? "Cargando aprendices..." : "No hay aprendices disponibles"}
                          </div>
                        )}
                        {students.map((student: any) => (
                          <SelectItem key={student.id} value={String(student.id)} className="rounded-lg">
                            {student.person?.name} {student.person?.lastname}
                            {student.person?.document && ` (${student.person.document})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Campo Ficha de Estudio */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="studySheet" className="font-semibold text-base text-black dark:text-white">Ficha de Estudio <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.numberSheet}
                      disabled
                      className="rounded-xl border-slate-200 dark:border-slate-700 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Detalles del Seguimiento */}
              <div className="pt-1 pb-1">
                <h2 className="text-3xl md:text-2xl font-extrabold text-back dark:text-white mb-2 mt-1 border-b pb-1 text-left">DETALLES DEL SEGUIMIENTO</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-base font-semibold dark:text-white">
                      Tipo de Seguimiento <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.followUpTypeId}
                      onValueChange={(value: string) => setFormData((f) => ({ ...f, followUpTypeId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue>{typesData?.allFollowUpTypes?.data?.find((type: any) => type.id === formData.followUpTypeId)?.name || "Seleccione un tipo de seguimiento"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {typesData?.allFollowUpTypes?.data?.map((type: any) => (
                          <SelectItem key={type.id} value={type.id} className="rounded-lg">
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flowStatus" className="text-base font-semibold dark:text-white">
                      Estado del Flujo <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.followUpFlowStatusId}
                      onValueChange={(value: string) => setFormData((f) => ({ ...f, followUpFlowStatusId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue>{flowStatusesData?.allFollowUpFlowStatuses?.data?.find((flowStatus: any) => flowStatus.id === formData.followUpFlowStatusId)?.name || "Seleccione un estado de flujo"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {flowStatusesData?.allFollowUpFlowStatuses?.data?.map((flowStatus: any) => (
                          <SelectItem key={flowStatus.id} value={flowStatus.id} className="rounded-lg">
                            {flowStatus.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evidenceFiles" className="text-base font-semibold dark:text-white">
                      Evidencia (PDF) <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex flex-col gap-2">
                      <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handlePdfChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("pdf-upload")?.click()}
                        className=""
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {pdfFile ? "Cambiar archivo PDF" : "Subir archivo PDF"}
                      </Button>
                      {pdfFile && (
                        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-xl border border-red-200 dark:border-red-800/50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                              <File className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                            </div>
                            <span className="text-sm font-medium text-red-900 dark:text-red-100 truncate">
                              {pdfFile.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleRemovePdf}
                            className="hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Descripción del Caso */}
              <div className="pt-1 pb-1">
                <h2 className="text-4xl md:text-2xl font-extrabold text-black dark:text-white mb-2 mt-1 border-b pb-1 text-left">DESCRIPCIÓN DEL CASO</h2>
                <div className="flex flex-col gap-2 w-full md:col-span-2">
                  <Label htmlFor="description" className="text-base font-semibold dark:text-white mb-2">
                    Descripción del Caso <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.caseDescription}
                    onChange={(e) => setFormData((f) => ({ ...f, caseDescription: e.target.value }))}
                    placeholder="Describa detalladamente el caso de seguimiento, incluyendo contexto, situación actual y acciones tomadas..."
                    rows={8}
                    maxLength={1000}
                    className="resize-y min-h-[120px] max-h-[300px] rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500/20 w-full text-base"
                  />

                </div>
              </div>

              {/* Botones de acción fijados abajo */}
              <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-slate-900 py-4 flex justify-end gap-4 border-t border-slate-200/50 dark:border-slate-700/50 z-10 px-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-6 h-12 text-white bg-[#0faf32] border-none dark:text-white dark:bg-[#0A3952] hover:bg-[#0d7e25] dark:hover:bg-[#11567a]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={addingFollowUp}
                  className="rounded-xl px-8 h-12 font-bold text-white bg-[#0faf32] border-none dark:text-white dark:bg-[#11567a] hover:bg-[#0d7e25]  dark:hover:bg-[#0A3952]"
                >
                  {addingFollowUp ? "Registrando..." : "Registrar Caso"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Status Modal */}
        <Dialog open={editStatusModalOpen} onOpenChange={setEditStatusModalOpen}>
          <DialogContent className="max-w-4xl rounded-2xl border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900">
            <DialogHeader className="space-y-3 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Cambiar Estado del Caso
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdateStatus} className="space-y-6 mt-4">
              <div className="flex flex-col gap-8 w-full py-6 px-2">
                {/* Status Select */}
                <div className="space-y-3 flex-1">
                  <Label htmlFor="editStatus" className="text-base font-medium">
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={String(statusFormData.followUpStatusId)}
                    onValueChange={(value: string) => setStatusFormData((f) => ({ ...f, followUpStatusId: value }))}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder={loadingStatuses ? "Cargando..." : "Seleccione un estado"} >
                        {statusFormData.followUpStatusId
                          ? statusesData?.allFollowUpStatuses?.data?.find(
                            (s: any) => String(s.id) === String(statusFormData.followUpStatusId)
                          )?.name || "Seleccione un estado"
                          : "Seleccione un estado"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="min-w-80">
                      {statusesData?.allFollowUpStatuses?.data?.map((status: any) => (
                        <SelectItem key={status.id} value={String(status.id)} className="py-2 text-base">
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Flow Status Select */}
                <div className="space-y-3 flex-1">
                  <Label htmlFor="editFlowStatus" className="text-base font-medium">
                    Estado del Flujo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={String(statusFormData.followUpFlowStatusId)}
                    onValueChange={(value: string) => setStatusFormData((f) => ({ ...f, followUpFlowStatusId: value }))}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder={loadingFlowStatuses ? "Cargando..." : "Seleccione un estado de flujo"} >
                        {statusFormData.followUpFlowStatusId
                          ? flowStatusesData?.allFollowUpFlowStatuses?.data?.find(
                            (f: any) => String(f.id) === String(statusFormData.followUpFlowStatusId)
                          )?.name || "Seleccione un estado de flujo"
                          : "Seleccione un estado de flujo"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="min-w-80">
                      {flowStatusesData?.allFollowUpFlowStatuses?.data?.map((flowStatus: any) => (
                        <SelectItem key={flowStatus.id} value={String(flowStatus.id)} className="py-2 text-base">
                          {flowStatus.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditStatusModalOpen(false)}
                  className="rounded-xl px-6 h-12"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updatingFollowUp}
                  className="rounded-xl px-8 h-12 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-700 shadow-lg shadow-sky-500/25"
                >
                  {updatingFollowUp ? "Actualizando..." : "Actualizar Estado"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                ¿Está seguro de eliminar este caso?
              </DialogTitle>
              <AlertDescription>
                <span className="text-slate-600 dark:text-slate-400 text-base">
                  Esta acción no se puede deshacer. El caso de seguimiento será eliminado permanentemente del sistema.
                </span>
                {caseToDelete && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800/50">
                    <p className="font-medium text-red-900 dark:text-red-100">Caso #{caseToDelete.id}</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1 line-clamp-2">
                      {caseToDelete.caseDescription}
                    </p>
                  </div>
                )}
              </AlertDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                className="rounded-xl px-6 h-12"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingFollowUp}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-red-500/25"
              >
                {deletingFollowUp ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </DialogContent>
        </AlertDialog>

        {/* Case Detail Modal */}
        {selectedCase && (
          <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8">
              <DialogHeader className="space-y-3 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                  Detalle del Caso de Seguimiento
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-3 flex-nowrap whitespace-nowrap">
                  {selectedCase.isActive && (
                    <Badge
                      variant="default"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-1.5 text-sm"
                    >
                      Activo
                    </Badge>
                  )}
                  {selectedCase.followUpStatus && (
                    <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-sm">
                      {selectedCase.followUpStatus.name}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Fecha de Creación</Label>
                    <p className="text-base text-foreground dark:text-white font-medium">
                      {selectedCase.creationDate
                        ? new Date(selectedCase.creationDate).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "N/A"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Tipo de Seguimiento</Label>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      <p className="text-base text-foreground dark:text-white font-medium">
                        {selectedCase.followUpType?.name || "No especificado"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Aprendiz</Label>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <p className="text-base text-foreground dark:text-white font-medium">
                        {selectedCase.student?.person
                          ? `${selectedCase.student.person.name} ${selectedCase.student.person.lastname}`
                          : "No asignado"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Instructor</Label>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-500" />
                      <p className="text-base text-foreground dark:text-white font-medium">
                        {selectedCase.teacher?.person
                          ? `${selectedCase.teacher.person.name} ${selectedCase.teacher.person.lastname}`
                          : "No asignado"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Estado del Flujo</Label>
                    <p className="text-base text-foreground dark:text-white font-medium">
                      {selectedCase.followUpFlowStatus?.name || "No especificado"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Descripción del Caso</Label>
                  <p className="text-base text-foreground dark:text-white p-4 bg-slate-100 dark:bg-slate-800 rounded-lg leading-relaxed">
                    {selectedCase.caseDescription || "Sin descripción"}
                  </p>
                </div>

                {selectedCase.evidenceFiles && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Evidencia (PDF)
                    </Label>

                    {selectedCase.evidenceFiles ? (
                      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                              <File className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground dark:text-white">
                                Documento de evidencia
                              </p>
                              <p className="text-xs text-muted-foreground dark:text-white">
                                {selectedCase.evidenceFilesName || "Archivo PDF"}
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            className="rounded-lg bg-transparent"
                            onClick={() => {
                              const link = document.createElement("a")
                              link.href = selectedCase.evidenceFiles
                              link.download = `evidencia-caso-${selectedCase.id}.pdf`
                              link.click()
                            }}
                          >
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground dark:text-white">No hay evidencia adjunta</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <Button variant="outline" onClick={() => setSelectedCase(null)} className="rounded-xl px-6 h-12">
                    Cerrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default CaseTracking;

