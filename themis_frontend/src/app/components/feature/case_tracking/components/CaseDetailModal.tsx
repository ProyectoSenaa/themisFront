"use client"

import React, { memo } from "react"
import Modal from "@/components/ui/Modal/Modal"
import Button from "@/components/ui/button"
import { Card, CardContent } from '@/components/ui/card'
import { 
  User, 
  Activity, 
  AlertCircle, 
  CalendarDays, 
  Download, 
  Edit 
} from "lucide-react"
import type { CaseItem } from "../types"

interface CaseDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (caseItem: CaseItem) => void
  selectedCase: CaseItem | null
  onDownloadFile: (base64Data: string, caseId: string) => void
  darkMode: boolean
}

export const CaseDetailModal = memo<CaseDetailModalProps>(({
  isOpen,
  onClose,
  onEdit,
  selectedCase,
  onDownloadFile,
  darkMode
}) => {
  if (!selectedCase) return null

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={`w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-2xl font-sans`}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            Detalle del Caso
          </h2>
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full`}>
            {selectedCase.status}
          </span>
        </div>

        <div className="space-y-6 text-base">
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                <div>
                  <p className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Estudiante</p>
                  <p className={`font-bold text-lg ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {selectedCase.studentName}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Documento: {selectedCase.studentDocument}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-4">
                <Activity className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                <div>
                  <p className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Programa</p>
                  <p className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {selectedCase.program}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <p className={`font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Tipo de Caso</p>
            <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} flex items-center gap-2`}>
              <AlertCircle className="w-4 h-4 text-blue-500" />
              {selectedCase.noveltyType}
            </p>
          </div>

          <div>
            <p className={`font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Descripción</p>
            <p className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedCase.description}</p>
          </div>

          <div>
            <p className={`font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Fecha de Reporte</p>
            <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} flex items-center gap-2`}>
              <CalendarDays className="w-4 h-4 text-green-500" />
              {new Date(selectedCase.reportDate).toLocaleDateString("es-ES")}
            </p>
          </div>

          {selectedCase.followUp.evidenceFiles && (
            <div>
              <p className={`font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Evidencia</p>
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedCase.followUp.evidenceFiles) {
                    onDownloadFile(selectedCase.followUp.evidenceFiles, selectedCase.id)
                  }
                }}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" /> Descargar Archivo de Evidencia
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-8">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            onClick={() => {
              onClose()
              onEdit(selectedCase)
            }}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Editar
          </Button>
        </div>
      </div>
    </Modal>
  )
})

CaseDetailModal.displayName = "CaseDetailModal"
