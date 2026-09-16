"use client"

import type React from "react"
import { useState } from "react"
//import { Card, CardContent } from "@/components/ui/card"
import { Card, CardContent } from '@/components/ui/card'
import Button from "@/components/ui/button"
import { Calendar, User, FileText, Eye, Download, Upload, Phone, Mail } from "lucide-react"
import type { StudentCaseItem } from "../StudentCaseTracking"

interface StudentCaseCardProps {
  caseItem: StudentCaseItem
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
  onViewDetails: (caseItem: StudentCaseItem) => void
  onDownloadPlan: (caseItem: StudentCaseItem) => void
  onUploadPlan: (caseItem: StudentCaseItem, file: File) => void
}

export default function StudentCaseCard({
  caseItem,
  getStatusColor,
  getStatusIcon,
  onViewDetails,
  onDownloadPlan,
  onUploadPlan,
}: StudentCaseCardProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setIsUploading(true)
      setTimeout(() => {
        onUploadPlan(caseItem, file)
        setIsUploading(false)
      }, 1000)
    } else {
      alert("Por favor seleccione un archivo PDF válido")
    }
  }

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Caso #{caseItem.id}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(caseItem.status)}`}
            >
              {getStatusIcon(caseItem.status)}
              <span>{caseItem.status}</span>
            </div>
          </div>

          {/* Tipo de novedad */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{caseItem.noveltyType}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
              {caseItem.description}
            </p>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-500" />
            <span className="font-medium">
              {new Date(caseItem.reportDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">
                  Instructor Responsable
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{caseItem.teacherName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Mail className="w-3 h-3 text-slate-500 dark:text-slate-500" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{caseItem.teacherEmail}</p>
                </div>
                {caseItem.teacherPhone && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone className="w-3 h-3 text-slate-500 dark:text-slate-500" />
                    <p className="text-xs text-slate-600 dark:text-slate-400">{caseItem.teacherPhone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {caseItem.evidenceFiles && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Evidencias adjuntas</span>
              </div>
            )}
            {caseItem.improvementPlan && (
              <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Plan de mejoramiento disponible</span>
              </div>
            )}
            {caseItem.uploadedPlan && (
              <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Plan completado y subido</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <Button
              onClick={() => onViewDetails(caseItem)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md rounded-xl"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles Completos
            </Button>

            <div className="grid grid-cols-2 gap-2">
              {caseItem.improvementPlan && (
                <Button
                  onClick={() => onDownloadPlan(caseItem)}
                  variant="outline"
                  className="flex items-center justify-center gap-2 rounded-xl"
                >
                  <Download className="w-4 h-4" />
                  Descargar Plan
                </Button>
              )}

              {!caseItem.uploadedPlan && caseItem.improvementPlan && (
                <>
                  <input
                    type="file"
                    id={`upload-${caseItem.id}`}
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    onClick={() => document.getElementById(`upload-${caseItem.id}`)?.click()}
                    variant="outline"
                    disabled={isUploading}
                    className="flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading ? "Subiendo..." : "Subir Plan"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
