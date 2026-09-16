"use client"

import React, { memo } from "react"
import Modal from "@/components/ui/Modal/Modal"
import Button from "@/components/ui/button"
import Label from "@/components/ui/Label"
import Input from "@/components/ui/Input"
import { 
  Activity, 
  Upload, 
  CheckCircle, 
  X, 
  AlertCircle 
} from "lucide-react"
import type { CaseFormData } from "../types"

interface CaseEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  formData: CaseFormData
  setFormData: (data: CaseFormData) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: () => void
  isUploading: boolean
  darkMode: boolean
  followUpTypesData: any
}

export const CaseEditModal = memo<CaseEditModalProps>(({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  handleFileUpload,
  removeFile,
  isUploading,
  darkMode,
  followUpTypesData
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={`w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-2xl font-sans`}
    >
      <div className="p-8">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          Editar Caso
        </h2>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Modifica la información del caso seleccionado.
        </p>
        
        <div className="space-y-6">
          <div>
            <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Estudiante
            </Label>
            <Input
              value={formData.studentName}
              disabled
              className={`mt-1 p-3 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-100 text-gray-800 border-gray-300"}`}
            />
          </div>

          <div>
            <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Tipo de Caso
            </Label>
            <div className="relative mt-1">
              <Activity
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              />
              <select
                value={formData.followUpTypeId}
                onChange={(e) => setFormData({ ...formData, followUpTypeId: e.target.value })}
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

          <div>
            <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Descripción del Caso
            </Label>
            <textarea
              value={formData.caseDescription}
              onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
              placeholder="Describa detalladamente el caso..."
              rows={4}
              className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 transition-colors mt-1 ${
                darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Archivos de Evidencia
            </Label>
            <div className="space-y-3 mt-1">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="editEvidenceFile"
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("editEvidenceFile")?.click()}
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
                      Subir Nuevo Archivo
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
                  El archivo actual será reemplazado. Formatos: JPG, PNG, GIF, PDF, TXT, DOC, DOCX (máx. 5MB)
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
            <Button onClick={onSubmit}>Guardar Cambios</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
})

CaseEditModal.displayName = "CaseEditModal"
