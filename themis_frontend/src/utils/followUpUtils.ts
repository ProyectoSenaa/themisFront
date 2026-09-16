/**
 * Utilidades para manejar Follow-ups
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Valida los datos del formulario de seguimiento
 */
export const validateFollowUpForm = (data: {
  studentId?: string | number
  caseDescription?: string
  followUpTypeId?: string | number
  followUpFlowStatusId?: string | number
  evidenceFiles?: string
}): ValidationResult => {
  const errors: string[] = []

  if (!data.studentId) {
    errors.push("Debes seleccionar un aprendiz.")
  }

  if (!data.caseDescription?.trim()) {
    errors.push("La descripción del caso es obligatoria.")
  }

  if (!data.followUpTypeId) {
    errors.push("Debes seleccionar un tipo de seguimiento.")
  }

  if (!data.followUpFlowStatusId) {
    errors.push("Debes seleccionar un estado del flujo.")
  }

  if (!data.evidenceFiles) {
    errors.push("Debes subir un archivo PDF de evidencia.")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Convierte archivo a base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

/**
 * Normaliza IDs a números
 */
export const normalizeId = (id: any): number | null => {
  const normalized = Number(id)
  return isNaN(normalized) ? null : normalized
}

/**
 * Extrae errores de GraphQL
 */
export const extractGraphQLError = (error: any): string => {
  if (error?.graphQLErrors?.length > 0) {
    return error.graphQLErrors.map((g: any) => g.message).join("; ")
  }

  if (error?.networkError?.result?.errors) {
    return error.networkError.result.errors.map((g: any) => g.message).join("; ")
  }

  if (error?.message) {
    return error.message
  }

  return "Error desconocido"
}

/**
 * Obtiene el nombre completo del estudiante
 */
export const getStudentFullName = (student: any): string => {
  if (!student?.person) return "Sin información"
  return `${student.person.name} ${student.person.lastname}`.trim()
}

/**
 * Obtiene el nombre completo del profesor
 */
export const getTeacherFullName = (teacher: any): string => {
  if (!teacher?.person) return "Sin información"
  return `${teacher.person.name} ${teacher.person.lastname}`.trim()
}

/**
 * Formatea la fecha de creación
 */
export const formatCreationDate = (dateString: string): string => {
  if (!dateString) return "Sin fecha"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Obtiene el badge color según el estado
 */
export const getStatusBadgeColor = (statusName: string): string => {
  const statusColors: { [key: string]: string } = {
    "en revision": "bg-yellow-100 text-yellow-800",
    completado: "bg-green-100 text-green-800",
    pendiente: "bg-red-100 text-red-800",
    coordinacion: "bg-blue-100 text-blue-800",
    aprobado: "bg-emerald-100 text-emerald-800",
  }

  return statusColors[statusName?.toLowerCase()] || "bg-gray-100 text-gray-800"
}

/**
 * Mapea la estructura de entrada del formulario a la estructura esperada por el backend
 * Según schema GraphQL actualizado (Nov 2025)
 */
export const mapFormToFollowUpInput = (formData: any, base64PDF: string) => {
  return {
    // Campos del schema FollowUpDto
    date: formData.date || new Date().toISOString(),
    observation: formData.observation || formData.caseDescription || "",
    justification: formData.justification || "",
    followUpFiles: base64PDF || null,
    isActive: typeof formData.isActive === 'boolean' ? formData.isActive : true,
    
    // IDs de tipo Long
    studentId: formData.studentId ? Number(formData.studentId) : null,
    teacherId: formData.teacherId ? Number(formData.teacherId) : null,
    administrativeId: formData.administrativeId || formData.coordinatorId ? Number(formData.administrativeId || formData.coordinatorId) : null,
    studySheetId: formData.studySheetId ? Number(formData.studySheetId) : null,
    
    // Objetos DTO (según schema GraphQL)
    followUpType: formData.followUpTypeId ? { id: Number(formData.followUpTypeId) } : null,
    followUpStatus: formData.followUpStatusId ? { id: Number(formData.followUpStatusId) } : null,
    followUpFlowStatus: formData.followUpFlowStatusId ? { id: Number(formData.followUpFlowStatusId) } : null,
  }
}