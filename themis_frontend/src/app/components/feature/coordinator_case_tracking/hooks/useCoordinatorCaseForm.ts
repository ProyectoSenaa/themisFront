import { useState } from "react"
import { CoordinatorCaseFormData } from "../types"
import { DEFAULT_COORDINATOR_FORM_DATA, FILE_UPLOAD_CONFIG } from "../constants"

interface UseCoordinatorCaseFormProps {
  showToast: (title: string, message: string, type: "success" | "error" | "warning") => void
}

export const useCoordinatorCaseForm = ({ showToast }: UseCoordinatorCaseFormProps) => {
  const [formData, setFormData] = useState<CoordinatorCaseFormData>(DEFAULT_COORDINATOR_FORM_DATA)
  const [isUploading, setIsUploading] = useState(false)

  const resetForm = () => {
    setFormData(DEFAULT_COORDINATOR_FORM_DATA)
  }

  const updateFormData = (updates: Partial<CoordinatorCaseFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleStudentSelection = (studentId: string, studentsData: any) => {
    const selectedStudent = studentsData?.allStudentList?.data?.find(
      (student: any) => student.id === studentId
    )

    if (selectedStudent) {
      setFormData(prev => ({
        ...prev,
        studentId,
        studentName: `${selectedStudent.person.name} ${selectedStudent.person.lastname}`,
        studentDocument: selectedStudent.person.document
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        studentId,
        studentName: "",
        studentDocument: ""
      }))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tamaño
    if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE) {
      showToast("Error", "El archivo es demasiado grande. Máximo 5MB permitido.", "error")
      return
    }

    // Validar tipo
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension as any)) {
      showToast("Error", "Tipo de archivo no permitido. Use JPG, PNG, GIF, PDF, TXT, DOC, DOCX.", "error")
      return
    }

    setIsUploading(true)

    try {
      // Simular upload - reemplazar con lógica real de upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // En producción, aquí haríamos el upload real y obtendríamos la URL
      const mockUrl = `https://example.com/files/${file.name}`
      
      setFormData(prev => ({
        ...prev,
        evidenceFiles: mockUrl
      }))

      showToast("Éxito", "Archivo subido correctamente", "success")
    } catch (error) {
      showToast("Error", "Error al subir el archivo. Intente nuevamente.", "error")
    } finally {
      setIsUploading(false)
      // Limpiar el input
      event.target.value = ""
    }
  }

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      evidenceFiles: ""
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.studentId) {
      showToast("Error", "Debe seleccionar un estudiante", "error")
      return false
    }

    if (!formData.followUpTypeId) {
      showToast("Error", "Debe seleccionar un tipo de caso", "error")
      return false
    }

    if (!formData.caseDescription.trim()) {
      showToast("Error", "Debe proporcionar una descripción del caso", "error")
      return false
    }

    if (formData.caseDescription.trim().length < 10) {
      showToast("Error", "La descripción debe tener al menos 10 caracteres", "error")
      return false
    }

    return true
  }

  return {
    formData,
    setFormData,
    updateFormData,
    resetForm,
    handleStudentSelection,
    handleFileUpload,
    removeFile,
    validateForm,
    isUploading
  }
}
