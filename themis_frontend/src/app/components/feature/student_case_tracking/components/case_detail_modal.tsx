"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { Calendar, User, FileText, Download, AlertCircle, Upload, Phone, Mail, CheckCircle } from "lucide-react"
import type { StudentCaseItem } from "../StudentCaseTracking"

interface CaseDetailModalProps {
  isOpen: boolean
  onClose: () => void
  caseItem: StudentCaseItem | null
  onDownloadPlan: (caseItem: StudentCaseItem) => void
  onUploadPlan: (caseItem: StudentCaseItem, file: File) => void
}

export default function CaseDetailModal({
  isOpen,
  onClose,
  caseItem,
  onDownloadPlan,
  onUploadPlan,
}: CaseDetailModalProps) {
  const [isUploading, setIsUploading] = useState(false)

  if (!caseItem) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setIsUploading(true)
      // Simulación visual - sin funcionalidad
      setTimeout(() => {
        alert("Plan de mejoramiento cargado correctamente. Se enviará al instructor.")
        onUploadPlan(caseItem, file)
        setIsUploading(false)
        // Limpiar el input
        e.target.value = ""
      }, 1500)
    } else {
      alert("Por favor seleccione un archivo PDF válido")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="relative w-[90vw] max-w-4xl mx-auto rounded-3xl bg-white/95 dark:bg-slate-900/95 
        border border-slate-200/50 dark:border-slate-700/50 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.3)]
        p-6 flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300"
      >
        {/* HEADER */}
        <DialogHeader className="border-b border-slate-200/50 dark:border-slate-700/50 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md" />
            Detalles del Caso {caseItem.id}
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <div className="space-y-4 py-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Tipo de Novedad y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-sm font-semibold text-black dark:text-blue-400 uppercase tracking-wide mb-2 ml-1">
                Tipo de caso
              </h3>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 min-h-6">
                {caseItem.noveltyType || "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2 ml-1">
                Estado Actual
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="text-base font-bold text-blue-900 dark:text-blue-100">{caseItem.status || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-sm font-semibold text-black dark:text-blue-400 uppercase tracking-wide mb-2 ml-1">
              Descripción del Caso
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {caseItem.description || "Sin descripción disponible"}
            </p>
          </div>

          {/* Fecha e Instructor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-2xl border border-purple-200/50 dark:border-purple-800/30">
              <h3 className="text-sm font-semibold text-purple-700 dark:text-blue-400 uppercase tracking-wide mb-2 ml-1">
                Fecha de Reporte
              </h3>
              <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
                {new Date(caseItem.reportDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
              <h3 className="text-sm font-semibold text-green-700 dark:text-blue-400 uppercase tracking-wide mb-2 ml-1">
                Instructor Responsable
              </h3>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 break-words">
                {caseItem.teacherName && caseItem.teacherName !== 'null' && caseItem.teacherName !== 'undefined'
                  ? caseItem.teacherName
                  : "Instructor no disponible"}
              </p>
            </div>
          </div>

          {/* Correo */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Correo del Instructor:</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 break-all mt-1">
                  {caseItem.teacherEmail && caseItem.teacherEmail !== 'null' && caseItem.teacherEmail !== 'undefined'
                    ? caseItem.teacherEmail
                    : "Correo no disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Plan de Mejoramiento - Estado */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Plan de Mejoramiento
            </h3>
            
            {caseItem.uploadedPlan ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-2xl border border-green-200/50 dark:border-green-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      ✓ Plan cargado exitosamente
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      Enviado al instructor
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Pendiente: Carga de plan
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                      Carga tu plan de mejoramiento en la sección inferior
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
          {caseItem.improvementPlan && (
            <Button
              onClick={() => onDownloadPlan(caseItem)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl h-11 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Descargar Plan</span>
            </Button>
          )}

          {!caseItem.uploadedPlan && (
            <>
              <input
                type="file"
                id={`upload-modal-${caseItem.id}`}
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <Button
                onClick={() => document.getElementById(`upload-modal-${caseItem.id}`)?.click()}
                disabled={isUploading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg rounded-xl h-11 transition-all disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">{isUploading ? "Subiendo..." : "Cargar Plan de Mejoramiento"}</span>
              </Button>
            </>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-xl h-11 font-semibold bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}