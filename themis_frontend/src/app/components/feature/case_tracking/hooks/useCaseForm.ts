import { useState, useCallback } from "react"
import { CaseFormData } from "../types"
import { DEFAULT_FORM_DATA } from "../constants"
import { fileToBase64, validateFile, getFileTypeIcon, formatFileSize } from "@/lib/fileUtils"

interface UseToastHook {
  showToast: (title: string, message: string, type: "success" | "error" | "warning" | "info") => void
}

export const useCaseForm = (toastHook?: UseToastHook) => {
  const [formData, setFormData] = useState<CaseFormData>(DEFAULT_FORM_DATA)
  const [isUploading, setIsUploading] = useState(false)

  const updateFormData = useCallback((updates: Partial<CaseFormData>) => {
    setFormData((prev: CaseFormData) => ({ ...prev, ...updates }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
    setIsUploading(false)
  }, [])

  const handleStudentSelection = useCallback((
    studentId: string, 
    studentsData: any
  ) => {
    const selectedStudent = studentsData?.allStudentList?.data?.find(
      (student: any) => student.id === studentId
    )
    
    if (selectedStudent) {
      updateFormData({
        studentId,
        studentName: `${selectedStudent.person.name} ${selectedStudent.person.lastname}`,
        studentDocument: selectedStudent.person.document,
      })
    }
  }, [updateFormData])

  const handleFileUpload = useCallback(async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    
    if (!file) {
      if (toastHook) {
        toastHook.showToast(
          "Error de Selección",
          "No se seleccionó ningún archivo. Por favor, selecciona un archivo válido.",
          "warning"
        )
      }
      return
    }

    // Mostrar notificación de inicio de validación
    if (toastHook) {
      toastHook.showToast(
        "Validando Archivo",
        `${getFileTypeIcon(file)} Verificando "${file.name}" (${formatFileSize(file.size)})...`,
        "info"
      )
    }

    // Validar archivo
    const validation = validateFile(file)
    
    if (!validation.isValid) {
      if (toastHook) {
        toastHook.showToast(
          "Archivo Rechazado",
          validation.error || "El archivo no cumple con los requisitos",
          "error"
        )
      }
      // Limpiar el input
      event.target.value = ""
      return
    }

    // Mostrar notificación de inicio de carga
    if (toastHook) {
      toastHook.showToast(
        "Procesando Archivo",
        `${getFileTypeIcon(file)} Convirtiendo "${file.name}" a formato compatible...`,
        "info"
      )
    }

    setIsUploading(true)

    try {
      const base64 = await fileToBase64(file)
      updateFormData({ evidenceFiles: base64 })
      
      // Notificación de éxito
      if (toastHook) {
        toastHook.showToast(
          "Archivo Cargado Exitosamente",
          `${getFileTypeIcon(file)} "${file.name}" se ha procesado y está listo para enviar con el caso.`,
          "success"
        )
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      
      // Notificación de error detallada
      if (toastHook) {
        toastHook.showToast(
          "Error al Procesar Archivo",
          `❌ No se pudo procesar "${file.name}". Verifica que el archivo no esté dañado e intenta nuevamente.`,
          "error"
        )
      }
      
      // Limpiar el input en caso de error
      event.target.value = ""
    } finally {
      setIsUploading(false)
    }
  }, [updateFormData, toastHook])

  const removeFile = useCallback(() => {
    updateFormData({ evidenceFiles: "" })
    if (toastHook) {
      toastHook.showToast(
        "Archivo Eliminado",
        "El archivo de evidencia ha sido removido del caso.",
        "info"
      )
    }
  }, [updateFormData, toastHook])

  const validateForm = useCallback((): boolean => {
    return !!(
      formData.studentId && 
      formData.caseDescription && 
      formData.followUpTypeId
    )
  }, [formData])

  return {
    formData,
    updateFormData,
    resetForm,
    handleStudentSelection,
    handleFileUpload,
    removeFile,
    validateForm,
    setFormData,
    isUploading
  }
}
