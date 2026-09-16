export const CASE_STATUS_KEYWORDS = {
  ABIERTO: ["abierto", "pendiente", "nuevo"],
  EN_REVISION: ["en revision", "revision", "revisar", "evaluando"],
  RESUELTO: ["resuelto", "completado", "cerrado", "finalizado"],
  CONDICIONAMIENTO_MATRICULA: ["condicionamiento de matricula", "condicionamiento", "matricula condicional"],
  CANCELAMIENTO_MATRICULA: ["cancelamiento de matricula", "cancelamiento", "matricula cancelada", "cancelacion"],
  APLAZAMIENTO_PROCESO: ["aplazamiento del proceso formativo", "aplazamiento", "proceso aplazado"],
  PLAN_MEJORAMIENTO: ["plan de mejoramiento adicional", "plan de mejoramiento", "mejoramiento", "plan adicional"]
} as const

export const PRIORITY_KEYWORDS = {
  ALTA: ["alta", "urgente", "critico", "inmediato"],
  MEDIA: ["media", "normal", "moderado"],
  BAJA: ["baja", "menor", "rutinario"]
} as const

export const FILE_UPLOAD_CONFIG = {
  ACCEPTED_TYPES: ".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx",
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "gif", "pdf", "txt", "doc", "docx"]
} as const

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
} as const

export const STATUS_COLORS = {
  ABIERTO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  EN_REVISION: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  RESUELTO: "bg-green-100 text-green-800 dark:bg-blue-900 dark:text-blue-300",
  CONDICIONAMIENTO_MATRICULA: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  CANCELAMIENTO_MATRICULA: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  APLAZAMIENTO_PROCESO: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  PLAN_MEJORAMIENTO: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  DEFAULT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
} as const

export const PRIORITY_COLORS = {
  ALTA: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  MEDIA: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  BAJA: "bg-green-100 text-green-800 dark:bg-blue-900 dark:text-blue-300",
  DEFAULT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
} as const

export const DEFAULT_COORDINATOR_FORM_DATA = {
  studentId: "",
  studentName: "",
  studentDocument: "",
  instructorId: "",
  instructorName: "",
  caseDescription: "",
  followUpTypeId: "",
  followUpStatusId: "",
  evidenceFiles: "",
  priority: "media" as const
}
