"use client"

import type React from "react"
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Eye, User, Calendar, FileText, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import Button from "@/components/ui/button"
import { useState } from "react"

interface CaseTrackingTableProps {
  cases: any[]
  onViewCase: (caseItem: any) => void
  onEditStatus: (caseItem: any) => void
  onDeleteCase: (caseItem: any) => void
  loading?: boolean
}

export const CaseTrackingTable: React.FC<CaseTrackingTableProps> = ({
  cases,
  onViewCase,
  onEditStatus,
  onDeleteCase,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground dark:text-white">Cargando casos...</div>
  }

  if (cases.length === 0) {
    return <div className="text-center py-12 text-muted-foreground dark:text-white">No se encontraron casos de seguimiento</div>
  }

  return (
    <div className="space-y-3 w-full">
      {cases.map((caseItem: any) => (
        <Card key={caseItem.id} className="hover:shadow-lg transition-shadow duration-200 w-full overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header with title and badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-base md:text-lg text-foreground dark:text-white">Caso #{caseItem.id}</h3>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {caseItem.isActive && (
                      <Badge variant="default" className="bg-green-500 text-white text-sm font-medium px-3 py-1">
                        Activo
                      </Badge>
                    )}
                    {caseItem.followUpStatus && (
                      <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                        {caseItem.followUpStatus.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white line-clamp-2">{caseItem.caseDescription}</p>
              </div>

              {/* Botón expandir en mobile */}
              <button
                onClick={() => setExpandedId(expandedId === caseItem.id ? null : caseItem.id)}
                className="md:hidden p-2 hover:bg-muted rounded-md flex-shrink-0"
              >
                {expandedId === caseItem.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Contenido expandible - Mobile */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-200 ${expandedId === caseItem.id ? "mt-4" : "max-h-0"
                }`}
            >
              <div className="space-y-3 border-t pt-4">
                <DetailItem
                  icon={<User className="w-4 h-4 text-blue-500" />}
                  label="Estudiante"
                  value={
                    caseItem.student?.person
                      ? `${caseItem.student.person.name} ${caseItem.student.person.lastname}`
                      : "No asignado"
                  }
                />
                <DetailItem
                  icon={<User className="w-4 h-4 text-purple-500" />}
                  label="Instructor"
                  value={
                    caseItem.teacher?.person
                      ? `${caseItem.teacher.person.name} ${caseItem.teacher.person.lastname}`
                      : "No asignado"
                  }
                />
                <DetailItem
                  icon={<Calendar className="w-4 h-4 text-orange-500" />}
                  label="Fecha"
                  value={
                    caseItem.creationDate
                      ? new Date(caseItem.creationDate).toLocaleDateString("es-ES")
                      : "N/A"
                  }
                />

                {caseItem.followUpType && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-base text-foreground dark:text-white">Tipo de seguimiento:</span>
                      <p className="text-sm text-muted-foreground dark:text-white">{caseItem.followUpType.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => onViewCase(caseItem)}
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onEditStatus(caseItem)}
                    className="flex items-center justify-center gap-2 w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Edit className="w-4 h-4" />
                    Cambiar estado
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onDeleteCase(caseItem)}
                    className="flex items-center justify-center gap-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>


            <div className="hidden md:block space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <DetailItem
                  icon={<User className="w-4 h-4 text-blue-500" />}
                  label="Estudiante"
                  value={
                    caseItem.student?.person
                      ? `${caseItem.student.person.name} ${caseItem.student.person.lastname}`
                      : "No asignado"
                  }
                />
                <DetailItem
                  icon={<User className="w-4 h-4 text-purple-500" />}
                  label="Instructor"
                  value={
                    caseItem.teacher?.person
                      ? `${caseItem.teacher.person.name} ${caseItem.teacher.person.lastname}`
                      : "No asignado"
                  }
                />
                <DetailItem
                  icon={<Calendar className="w-4 h-4 text-orange-500 " />}
                  label="Fecha"
                  value={
                    caseItem.creationDate
                      ? new Date(caseItem.creationDate).toLocaleDateString("es-ES")
                      : "N/A"
                  }
                />
              </div>

              {caseItem.followUpType && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <div>
                    <span className="font-medium text-base text-foreground dark:text-white">Tipo de seguimiento:</span>
                    <p className="text-sm text-muted-foreground dark:text-white">{caseItem.followUpType.name}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => onViewCase(caseItem)}
                  className="flex items-center justify-center gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEditStatus(caseItem)}
                  className="flex items-center justify-center gap-2 flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <Edit className="w-4 h-4" />
                  Cambiar estado
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDeleteCase(caseItem)}
                  className="flex items-center justify-center gap-2 flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


interface DetailItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="min-w-0">
      <span className="font-medium text-base text-foreground dark:text-white block">{label}:</span>
      <p className="text-muted-foreground dark:text-white">{value}</p>
    </div>
  </div>
)