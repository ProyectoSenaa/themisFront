"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAppSelector } from "@/redux/hooks"
import Button from "@/components/ui/button"
import {
  FileText,
  AlertTriangle,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BookOpen,
} from "lucide-react"
import StudentCaseCard from "./components/StudentCaseCard"
import CaseDetailModal from "./components/case_detail_modal"
import NoveltyStatusGuide from "./components/novelty_status_guide"
import { useQuery } from "@apollo/client"
import { GET_ALL_PLANS_IMPROVE } from "@/graphql/follow-up-queries"
import { useRoleBasedFollowUpQuery } from "@/hooks/useRoleBasedFollowUpQuery"
import client from "@/lib/apollo-provider"
import { downloadBase64File } from "@/app/utils/fileUtils"

// Types
export interface StudentCaseItem {
  id: string
  reportDate: string
  description: string
  status: string
  noveltyType: string
  teacherName: string
  teacherEmail: string
  teacherPhone?: string
  evidenceFiles?: string
  improvementPlan?: string
  uploadedPlan?: string
  improvementPlanFiles?: string
  followUp: {
    id: string
    caseDescription: string
    creationDate: string
    followUpTypeId: string
    followUpStatusId: string
    teacherId: string
    studentId: string
    evidenceFiles?: string
    improvementPlanFiles?: string
  }
}

type CaseStatus =
  | "abierto"
  | "en revision"
  | "resuelto"
  | "condicionamiento de matricula"
  | "cancelamiento de matricula"
  | "aplazamiento del proceso formativo"
  | "plan de mejoramiento adicional"

// Constants
const PAGINATION_CONFIG = {
  CARDS_PER_PAGE: 3,
} as const

const STATUS_CONFIG: Record<CaseStatus, { color: string; icon: typeof Clock }> = {
  abierto: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  "en revision": {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Eye,
  },
  resuelto: {
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  "condicionamiento de matricula": {
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: AlertTriangle,
  },
  "cancelamiento de matricula": {
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: XCircle,
  },
  "aplazamiento del proceso formativo": {
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: Clock,
  },
  "plan de mejoramiento adicional": {
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    icon: FileText,
  },
}

const DEFAULT_STATUS_CONFIG = {
  color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  icon: AlertTriangle,
}

export default function StudentCaseTracking() {
  // State
  const [selectedCase, setSelectedCase] = useState<StudentCaseItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)
  const [cases, setCases] = useState<StudentCaseItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Redux state
  const darkMode = useAppSelector((state) => state.theme.darkMode)
  const { user } = useAppSelector((state) => state.auth)

  // Use the role-based hook to get the correct query and variables
  const { query, variables, isFiltered, idPerson } = useRoleBasedFollowUpQuery(0, 100);

  console.log('🔍 [StudentCaseTracking] Query being used:', query?.loc?.source?.body);
  console.log('🔍 [StudentCaseTracking] Variables:', variables);
  console.log('🔍 [StudentCaseTracking] User role context:', { isFiltered, idPerson, user });

  // GraphQL query
  const {
    data: followUpsResp,
    loading: loadingFollowUps,
    error: followUpsError,
  } = useQuery(query, {
    variables,
    skip: true, // !user, // Temporarily skip to test UI
    fetchPolicy: 'network-only' // Ensure we get fresh data
  })

  // Transform API data to local state
  useEffect(() => {
    // Handle different response structures based on the query used
    const responseData = followUpsResp?.allFollowUps?.data ||
      followUpsResp?.followUpsByStudent?.data ||
      followUpsResp?.followUpsByTeacher?.data ||
      followUpsResp?.followUpsByCoordinator?.data;

    console.log('🔍 [StudentCaseTracking] Full followUpsResp:', followUpsResp);
    console.log('🔍 [StudentCaseTracking] responseData:', responseData);

    if (!responseData) {
      setCases([])
      return
    }

    let filteredData = responseData;

    // Apply client-side filtering if needed (specifically for students using GET_ALL_FOLLOW_UPS)
    if (isFiltered && idPerson && followUpsResp?.allFollowUps) {
      filteredData = responseData.filter((item: any) => {
        // Check if the item belongs to the student
        // We check both student.person.id (if available via federation) and studentId (if available directly)
        const itemPersonId = item.student?.person?.id;
        const itemStudentId = item.student?.id;

        // Note: idPerson from Redux might be string or number, so we use loose equality or string conversion
        return String(itemPersonId) === String(idPerson);
      });
    }

    const mapped: StudentCaseItem[] = filteredData.map((f: any) => {
      console.log('🔍 [StudentCaseTracking] Raw followUp item:', f);
      console.log('🔍 [StudentCaseTracking] f.teacher:', f.teacher);
      console.log('🔍 [StudentCaseTracking] f.teacher?.person:', f.teacher?.person);
      console.log('🔍 [StudentCaseTracking] f.student:', f.student);
      
      const teacherPerson = f.teacher?.person
      const student = f.student
      const followUp = f

      console.log('🔍 [StudentCaseTracking] teacherPerson:', teacherPerson);
      console.log('🔍 [StudentCaseTracking] teacherPerson?.name:', teacherPerson?.name);
      console.log('🔍 [StudentCaseTracking] teacherPerson?.lastname:', teacherPerson?.lastname);
      
      // Manejar tanto el caso donde teacher.person existe como cuando solo existe teacher con __typename
      let calculatedTeacherName: string | null = null;
      let calculatedTeacherEmail: string | null = null;
      
      if (teacherPerson && teacherPerson.name && teacherPerson.lastname) {
        calculatedTeacherName = `${teacherPerson.name} ${teacherPerson.lastname}`;
        calculatedTeacherEmail = teacherPerson.email || null;
      } else if (f.teacher?.__typename) {
        // Si teacher existe pero no tiene person, es una referencia de Federation sin resolver
        console.warn('⚠️ [StudentCaseTracking] Teacher reference not resolved by backend:', f.teacher);
        calculatedTeacherName = "Instructor no disponible";
        calculatedTeacherEmail = "Correo no disponible";
      }
      
      console.log('🔍 [StudentCaseTracking] calculatedTeacherName:', calculatedTeacherName);

      return {
        id: String(followUp.id ?? ""),
        reportDate: followUp.creationDate ?? null,
        description: followUp.caseDescription ?? null,
        status: followUp.followUpStatus?.name ?? null,
        noveltyType: followUp.followUpType?.name ?? null,
        teacherName: calculatedTeacherName || "Instructor no disponible",
        teacherEmail: calculatedTeacherEmail || "Correo no disponible",
        teacherPhone: null,
        evidenceFiles: followUp.evidenceFiles ?? null,
        improvementPlan: null,
        improvementPlanFiles: followUp.improvementPlanFiles ?? null,
        followUp: {
          id: String(followUp.id ?? ""),
          caseDescription: followUp.caseDescription ?? null,
          creationDate: followUp.creationDate ?? null,
          followUpTypeId: followUp.followUpType?.id
            ? String(followUp.followUpType.id)
            : followUp.followUpTypeId
              ? String(followUp.followUpTypeId)
              : null,
          followUpStatusId: followUp.followUpStatus?.id
            ? String(followUp.followUpStatus.id)
            : followUp.followUpStatusId
              ? String(followUp.followUpStatusId)
              : null,
          teacherId: followUp.teacher?.id
            ? String(followUp.teacher.id)
            : followUp.teacherId
              ? String(followUp.teacherId)
              : null,
          studentId: student?.id ? String(student.id) : followUp.studentId ? String(followUp.studentId) : null,
          evidenceFiles: followUp.evidenceFiles ?? null,
          improvementPlanFiles: followUp.improvementPlanFiles ?? null,
        },
      }
    })

    setCases(mapped)
  }, [followUpsResp])

  // Pagination calculations
  const itemsPerPage = PAGINATION_CONFIG.CARDS_PER_PAGE
  const totalPages = Math.ceil(cases.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Memoized current cases to avoid recalculation
  const currentCases = useMemo(() => cases.slice(startIndex, endIndex), [cases, startIndex, endIndex])

  // Helper functions
  const getStatusColor = useCallback((status?: string | null): string => {
    const normalizedStatus = (status || "").toLowerCase() as CaseStatus
    return STATUS_CONFIG[normalizedStatus]?.color || DEFAULT_STATUS_CONFIG.color
  }, [])

  const getStatusIcon = useCallback((status?: string | null): React.ReactNode => {
    const normalizedStatus = (status || "").toLowerCase() as CaseStatus
    const IconComponent = STATUS_CONFIG[normalizedStatus]?.icon || DEFAULT_STATUS_CONFIG.icon
    return <IconComponent className="w-4 h-4" />
  }, [])

  // Event handlers
  const handleViewCase = useCallback((caseItem: StudentCaseItem) => {
    setSelectedCase(caseItem)
    setIsDetailModalOpen(true)
  }, [])

  const handleDownloadImprovementPlan = useCallback(async (caseItem: StudentCaseItem) => {
    try {
      // Query improvement plans and try to match by student id
      const resp = await client.query({
        query: GET_ALL_PLANS_IMPROVE,
        variables: { page: 0, size: 200 },
        fetchPolicy: 'network-only',
      })

      // Debug: mostrar la respuesta completa en consola para inspección
      // (temporal) - permite pegar aquí el objeto y analizar su forma
      // eslint-disable-next-line no-console
      console.debug('GET_ALL_PLANS_IMPROVE response', resp)

      const plans: any[] = resp?.data?.allImprovementPlans?.data || []

      const studentId = caseItem?.followUp?.studentId

      // Try to find plan by student id first, otherwise fall back to first plan
      const plan = plans.find((p) => String(p?.student?.id) === String(studentId)) || plans[0]

      if (!plan) {
        alert('No se encontró un plan de mejoramiento asociado a este caso.')
        return
      }

      const fileField = plan.improvementPlanFile

      if (!fileField) {
        alert('El plan no contiene un archivo adjunto.')
        return
      }

      const downloadBlob = (bytes: Uint8Array, mime = 'application/pdf') => {
        // Debug: print header bytes (hex + ascii) to help diagnose corrupted PDFs
        try {
          const sample = bytes.slice(0, 64)
          const hex = Array.from(sample).map(b => b.toString(16).padStart(2, '0')).join(' ')
          const ascii = String.fromCharCode(...Array.from(sample).map(b => (b >= 32 && b <= 126) ? b : 46))
          // eslint-disable-next-line no-console
          console.debug('[download] blob header hex:', hex)
          // eslint-disable-next-line no-console
          console.debug('[download] blob header ascii:', ascii)
        } catch (e) {
          // ignore
        }
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mime })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `plan-mejoramiento-${plan.id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      const tryParseNumberArrayString = (s: string): Uint8Array | null => {
        try {
          const parsed = JSON.parse(s)
          if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')) {
            return new Uint8Array(parsed)
          }
        } catch (e) {
          // not JSON
        }

        // try comma-separated numbers like "12,34,56"
        if (/^\s*\d+[\d,\s]*\d+\s*$/.test(s)) {
          const nums = s.split(',').map((t) => Number(t.trim())).filter((n) => !Number.isNaN(n))
          if (nums.length) return new Uint8Array(nums)
        }

        return null
      }

      const hexToBytes = (hex: string): Uint8Array | null => {
        const cleaned = hex.replace(/[^0-9a-fA-F]/g, '')
        if (cleaned.length % 2 !== 0) return null
        const bytes = new Uint8Array(cleaned.length / 2)
        for (let i = 0; i < cleaned.length; i += 2) {
          bytes[i / 2] = parseInt(cleaned.substr(i, 2), 16)
        }
        return bytes
      }

      const normalizeBase64 = (s: string) => {
        if (!s) return ''
        // Strip data url prefix if present
        const idx = s.indexOf('base64,')
        if (idx >= 0) return s.slice(idx + 7).replace(/\s+/g, '')
        return s.replace(/\s+/g, '')
      }

      const isBase64 = (s: string) => {
        const cleaned = normalizeBase64(s)
        return cleaned.length > 100 && /^[A-Za-z0-9+/=]+$/.test(cleaned)
      }

      // If the backend returned a direct URL (http, blob, data) -> download by link
      if (typeof fileField === 'string' && (fileField.startsWith('http') || fileField.startsWith('blob:') || fileField.startsWith('data:'))) {
        const link = document.createElement('a')
        link.href = fileField
        link.download = `plan-mejoramiento-${plan.id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }

      // If it's a base64 string -> use utility to download
      if (typeof fileField === 'string' && isBase64(fileField)) {
        const raw = normalizeBase64(fileField)
        // Debug info
        // eslint-disable-next-line no-console
        console.debug('[download] downloading from base64, bytes ~', Math.ceil(raw.length * 3 / 4))
        // Inspect first bytes before download
        try {
          const binary = atob(raw)
          const arr = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
          const sample = arr.slice(0, 64)
          const hex = Array.from(sample).map(b => b.toString(16).padStart(2, '0')).join(' ')
          const ascii = String.fromCharCode(...Array.from(sample).map(b => (b >= 32 && b <= 126) ? b : 46))
          // eslint-disable-next-line no-console
          console.debug('[download] base64 header hex:', hex)
          // eslint-disable-next-line no-console
          console.debug('[download] base64 header ascii:', ascii)
        } catch (e) {
          // ignore
        }
        downloadBase64File(raw, `plan-mejoramiento-${plan.id}.pdf`, 'application/pdf')
        return
      }

      // If it's a JSON-like array string or comma-separated numbers
      if (typeof fileField === 'string') {
        const asNums = tryParseNumberArrayString(fileField)
        if (asNums) {
          downloadBlob(asNums, 'application/pdf')
          return
        }

        // hex string
        const maybeHex = hexToBytes(fileField)
        if (maybeHex) {
          downloadBlob(maybeHex, 'application/pdf')
          return
        }

        // Java byte[] toString like [B@3217559a -> cannot reconstruct
        if (/^\[B@/.test(fileField)) {
          // Try fallback fields
          const maybeUrl = plan.improvementPlanFiles || plan.improvementPlanFileUrl || null
          if (maybeUrl && typeof maybeUrl === 'string') {
            const link = document.createElement('a')
            link.href = maybeUrl
            link.download = `plan-mejoramiento-${plan.id}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return
          }

          // Give actionable developer message
          // eslint-disable-next-line no-console
          console.debug('Plan raw value that cannot be reconstructed:', plan)
          alert('El servidor devolvió un valor binario no utilizable para descarga (p.ej. "[B@..."). Pide al backend exponer el archivo como URL o base64 para poder descargarlo. Revisa la consola para más detalles.')
          return
        }
      }

      // If the backend returned an object with data or bytes array
      if (typeof fileField === 'object' && fileField !== null) {
        // possible shapes: { data: "base64..." } or { data: [1,2,3] }
        const possible = (fileField as any)
        if (typeof possible.data === 'string' && isBase64(possible.data)) {
          const raw = normalizeBase64(possible.data)
          // eslint-disable-next-line no-console
          console.debug('[download] downloading from object.data base64, bytes ~', Math.ceil(raw.length * 3 / 4))
          try {
            const binary = atob(raw)
            const arr = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
            const sample = arr.slice(0, 64)
            const hex = Array.from(sample).map(b => b.toString(16).padStart(2, '0')).join(' ')
            const ascii = String.fromCharCode(...Array.from(sample).map(b => (b >= 32 && b <= 126) ? b : 46))
            // eslint-disable-next-line no-console
            console.debug('[download] object.data base64 header hex:', hex)
            // eslint-disable-next-line no-console
            console.debug('[download] object.data base64 header ascii:', ascii)
          } catch (e) {
            // ignore
          }
          downloadBase64File(raw, `plan-mejoramiento-${plan.id}.pdf`, 'application/pdf')
          return
        }

        if (Array.isArray(possible.data) && possible.data.every((n: any) => typeof n === 'number')) {
          downloadBlob(new Uint8Array(possible.data), 'application/pdf')
          return
        }
      }

      // Last fallback: try improvementPlanFiles field
      const maybeUrl = plan.improvementPlanFiles || plan.improvementPlanFileUrl || null
      if (maybeUrl && typeof maybeUrl === 'string') {
        const link = document.createElement('a')
        link.href = maybeUrl
        link.download = `plan-mejoramiento-${plan.id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }

      // Try common REST endpoints as a last-ditch frontend-only attempt
      const tryFetchCommonPaths = async (planId: string | number) => {
        const candidatePaths = [
          `/improvement-plans/${planId}/file`,
          `/api/improvement-plans/${planId}/file`,
          `/improvementPlan/${planId}/file`,
          `/api/improvementPlan/${planId}/file`,
          `/files/improvement-plan/${planId}`,
          `/files/plans/${planId}`,
        ]

        for (const p of candidatePaths) {
          try {
            // eslint-disable-next-line no-console
            console.debug('[download] intentando URL candidata:', p)
            const r = await fetch(p, { method: 'GET' })
            if (!r.ok) continue

            const contentType = r.headers.get('content-type') || ''
            // Try arrayBuffer (safer for binary)
            const ab = await r.arrayBuffer()
            if (ab && ab.byteLength > 0) {
              try {
                const bytesForDebug = new Uint8Array(ab).slice(0, 64)
                const hex = Array.from(bytesForDebug).map(b => b.toString(16).padStart(2, '0')).join(' ')
                const ascii = String.fromCharCode(...Array.from(bytesForDebug).map(b => (b >= 32 && b <= 126) ? b : 46))
                // eslint-disable-next-line no-console
                console.debug('[download] fetched candidate header hex:', hex)
                // eslint-disable-next-line no-console
                console.debug('[download] fetched candidate header ascii:', ascii)
              } catch (e) {
                // ignore
              }
              // If response is small text, check if it's base64 text
              if (contentType.includes('text') || contentType === '') {
                const textDecoder = new TextDecoder()
                const text = textDecoder.decode(ab)
                const maybe = normalizeBase64(text)
                if (isBase64(maybe)) {
                  // eslint-disable-next-line no-console
                  console.debug('[download] candidate returned base64 text, bytes ~', Math.ceil(maybe.length * 3 / 4))
                  downloadBase64File(maybe, `plan-mejoramiento-${planId}.pdf`, 'application/pdf')
                  return true
                }
              }

              // Otherwise treat as binary PDF
              if (ab.byteLength > 0) {
                const bytes = new Uint8Array(ab)
                // quick heuristic: PDF files start with "%PDF-"
                const header = String.fromCharCode.apply(null, Array.from(bytes.slice(0, 5)))
                if (header.startsWith('%PDF-') || contentType.includes('application/pdf')) {
                  const blob = new Blob([ab], { type: 'application/pdf' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `plan-mejoramiento-${planId}.pdf`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                  return true
                }
                // If header not PDF, still attempt to download as pdf
                const blob = new Blob([ab], { type: contentType || 'application/pdf' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `plan-mejoramiento-${planId}.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
                return true
              }
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.debug('[download] intento fallido para', p, e)
          }
        }
        return false
      }

      const fetched = await tryFetchCommonPaths(plan.id)
      if (fetched) return

      alert('No se pudo reconstruir el archivo desde la respuesta del servidor. Revisa la consola para más detalles y considera exponer el archivo como URL o base64 en el backend.')
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error descargando plan de mejoramiento', error)
      alert(`Error al descargar el plan: ${error?.message || error}`)
    }
  }, [])

  const handleUploadImprovementPlan = useCallback((caseItem: StudentCaseItem, file: File) => {
    // Actualizar el estado local del caso
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseItem.id
          ? {
            ...c,
            uploadedPlan: file.name,
            improvementPlanFiles: c.improvementPlanFiles || file.name,
            followUp: {
              ...c.followUp,
              improvementPlanFiles: c.followUp.improvementPlanFiles || file.name,
            },
          }
          : c
      )
    )

    // Actualizar el caso seleccionado si está abierto
    if (selectedCase && selectedCase.id === caseItem.id) {
      setSelectedCase({
        ...selectedCase,
        uploadedPlan: file.name,
        improvementPlanFiles: selectedCase.improvementPlanFiles || file.name,
        followUp: {
          ...selectedCase.followUp,
          improvementPlanFiles: selectedCase.followUp.improvementPlanFiles || file.name,
        },
      })
    }
  }, [selectedCase])

  const handleRefreshData = useCallback(() => {
    alert("Datos actualizados correctamente")
  }, [])

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
  }, [])

  const handleCloseGuideModal = useCallback(() => {
    setIsGuideModalOpen(false)
  }, [])

  const handleOpenGuideModal = useCallback(() => {
    console.log('Opening guide modal...')
    setIsGuideModalOpen(true)
  }, [])

  // Pagination handlers
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
      }
    },
    [totalPages],
  )

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])

  // Show loading state
  if (loadingFollowUps) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"} p-4 md:p-8 flex items-center justify-center`}
      >
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className={`text-lg font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Cargando casos...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (followUpsError) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"} p-4 md:p-8 flex items-center justify-center`}
      >
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className={`text-lg font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            Error al cargar los casos
          </p>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} mt-2`}>{followUpsError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"} p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-cyan-500/10 dark:from-emerald-500/5 dark:via-blue-500/5 dark:to-cyan-500/5 rounded-3xl blur-3xl" />
          <div className="flex gap-3">
            <Button
              onClick={handleOpenGuideModal}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl px-6"
              aria-label="Abrir guía de resolución"
            >
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              <span className="font-semibold">Guía de Resolución</span>
            </Button>
          </div>
        </div>

        {/* Cases Grid */}
        {currentCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCases.map((caseItem) => (
              <StudentCaseCard
                key={caseItem.id}
                caseItem={caseItem}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                onViewDetails={handleViewCase}
                onDownloadPlan={handleDownloadImprovementPlan}
              />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 rounded-2xl border ${darkMode ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-slate-200/50"} backdrop-blur-xl`}
          >
            <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
            <p className={`text-lg font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              No hay casos disponibles
            </p>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} mt-2`}>
              Los casos aparecerán aquí cuando estén disponibles
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {cases.length > itemsPerPage && (
          <nav
            aria-label="Navegación de casos"
            className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl shadow-xl border ${darkMode ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-slate-200/50"} backdrop-blur-xl`}
          >
            <div className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`} aria-live="polite">
              Página {currentPage} de {totalPages}
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-transparent"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Anterior
              </Button>

              <div className="flex gap-2" role="list">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  const isCurrentPage = pageNumber === currentPage

                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      variant={isCurrentPage ? "default" : "outline"}
                      className={`w-10 h-10 p-0 rounded-xl ${isCurrentPage ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : ""
                        }`}
                      aria-label={`Ir a página ${pageNumber}`}
                      aria-current={isCurrentPage ? "page" : undefined}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>

              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-transparent"
                aria-label="Página siguiente"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>

            <div className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"} mt-4 sm:mt-0`}>
              {cases.length} {cases.length === 1 ? "caso" : "casos"} en total
            </div>
          </nav>
        )}

        {/* Modals */}
        <CaseDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          caseItem={selectedCase}
          onDownloadPlan={handleDownloadImprovementPlan}
          onUploadPlan={handleUploadImprovementPlan}
        />

        <NoveltyStatusGuide isOpen={isGuideModalOpen} onClose={handleCloseGuideModal} />
      </div>
    </div>
  )
}
