"use client"

import React, { memo } from "react"
import Modal from "@/components/ui/Modal/Modal"
import Button from "@/components/ui/button"
import Label from "@/components/ui/Label"
import { 
  User, 
  Activity, 
  Upload, 
  CheckCircle, 
  X, 
  AlertCircle 
} from "lucide-react"
import type { CaseFormData } from "../types"

interface CaseCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  formData: CaseFormData
  updateFormData: (updates: Partial<CaseFormData>) => void
  handleStudentSelection: (studentId: string, studentsData: any) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: () => void
  isUploading: boolean
  darkMode: boolean
  studentsData: any
  studentsLoading: boolean
  studentsError: any
  followUpTypesData: any
}

export const CaseCreateModal = memo<CaseCreateModalProps>(({
  isOpen,
  onClose,
  onSubmit,
  formData,
  updateFormData,
  handleStudentSelection,
  handleFileUpload,
  removeFile,
  isUploading,
  darkMode,
  studentsData,
  studentsLoading,
  studentsError,
  followUpTypesData
}) => {
  console.log('CaseCreateModal isOpen:', isOpen);
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={`w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-2xl transition-all duration-300`}
    >
      <div className="p-8">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          Crear Nuevo Caso
        </h2>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Registra un nuevo caso de seguimiento para un estudiante.
        </p>
        
        <div className="space-y-6">
          {/* Campo de Selección de Estudiante */}
          <div>
            <Label
              htmlFor="student-select"
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Seleccionar Estudiante
            </Label>
            <div className="relative mt-1">
              <User
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              />
              <select
                id="student-select"
                value={formData.studentId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleStudentSelection(e.target.value, studentsData)
                }
                className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-green-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-green-500"
                }`}
              >
                <option value="">Seleccione un estudiante</option>
                {studentsData?.allStudentList?.data?.map((student: any) => (
                  <option key={student.id} value={student.id}>
                    {student.person.name} {student.person.lastname} - {student.person.document}
                  </option>
                ))}
              </select>
            </div>
            {studentsLoading && (
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Cargando estudiantes...
              </p>
            )}
            {studentsError && <p className="text-sm mt-1 text-red-600">Error al cargar estudiantes</p>}
          </div>

          {/* Campo de Tipo de Caso */}
          <div>
            <Label
              htmlFor="case-type-select"
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Tipo de Caso
            </Label>
            <div className="relative mt-1">
              <Activity
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              />
              <select
                id="case-type-select"
                value={formData.followUpTypeId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateFormData({ followUpTypeId: e.target.value })
                }
                className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 transition-colors ${
                  darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Seleccione el tipo de caso</option>
                {followUpTypesData?.allFollowUpTypes?.data?.map((type: any) => (
                  <option key={type.id} value={type.id} disabled={!type.isActive}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo de Descripción */}
          <div>
            <Label
              htmlFor="case-description"
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Descripción del Caso
            </Label>
            <textarea
              id="case-description"
              value={formData.caseDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFormData({ caseDescription: e.target.value })
              }
              placeholder="Describa detalladamente el caso..."
              rows={4}
              className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 transition-colors mt-1 ${
                darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Campo de Archivos de Evidencia */}
          <div>
            <Label
              htmlFor="evidenceFile"
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Archivos de Evidencia
            </Label>
            <div className="space-y-3 mt-1">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="evidenceFile"
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("evidenceFile")?.click()}
                  className={`flex items-center gap-2 text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Subir Archivo
                    </>
                  )}
                </Button>
                
                {formData.evidenceFiles && !isUploading && (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-blue-400 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Archivo cargado
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-6 w-6"
                      title="Eliminar archivo"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {isUploading && (
                <div className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"} flex items-center gap-2`}>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Procesando archivo, por favor espera...
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Formatos permitidos: JPG, PNG, GIF, PDF, TXT, DOC, DOCX (máx. 5MB)
                </p>
                <div className="group relative">
                  <AlertCircle className={`w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"} cursor-help`} />
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 text-xs rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 ${
                    darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-700"
                  }`}>
                    <strong>Tipos de archivo permitidos:</strong><br />
                    • 🖼️ Imágenes: JPG, JPEG, PNG, GIF<br />
                    • 📄 Documentos: PDF<br />
                    • 📝 Texto: TXT, DOC, DOCX<br />
                    <br />
                    <strong>Tamaño máximo:</strong> 5MB por archivo
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onSubmit}>Crear Caso</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
})

CaseCreateModal.displayName = "CaseCreateModal"
