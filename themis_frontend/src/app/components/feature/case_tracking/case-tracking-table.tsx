"use client"

import type React from "react"
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Eye, User, Calendar, FileText, Edit, Trash2 } from "lucide-react"
import Button from "@/components/ui/button"

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
  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Cargando casos...</div>
  }

  if (cases.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No se encontraron casos de seguimiento</div>
  }
  return (
    <div className="space-y-4">
      {cases.map((caseItem: any) => (
        <Card key={caseItem.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-foreground dark:font-semibold dark:text-white">Caso #{caseItem.id}</h3>
                  {caseItem.isActive && (
                    <Badge variant="default" className="bg-green-500 text-white">
                      Activo
                    </Badge>
                  )}
                  {caseItem.followUpStatus && <Badge variant="secondary">{caseItem.followUpStatus.name}</Badge>}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{caseItem.caseDescription}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="font-medium text-foreground">Estudiante:</span>
                      <p className="text-muted-foreground">
                        {caseItem.student?.person
                          ? `${caseItem.student.person.name} ${caseItem.student.person.lastname}`
                          : "No asignado"}
                      </p>
                    </div>
                  </div>
                                    <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-500" />
                    <div>
                      <span className="font-medium text-foreground">Instructor:</span>
                      <p className="text-muted-foreground">
                        {caseItem.teacher?.person
                          ? `${caseItem.teacher.person.name} ${caseItem.teacher.person.lastname}`
                          : "No asignado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                      <span className="font-medium text-foreground">Fecha:</span>
                      <p className="text-muted-foreground">
                        {caseItem.creationDate ? new Date(caseItem.creationDate).toLocaleDateString("es-ES") : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {caseItem.followUpType && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <div>
                      <span className="font-medium text-sm text-foreground">Tipo de seguimiento:</span>
                      <p className="text-sm text-muted-foreground">{caseItem.followUpType.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <Button variant="outline" onClick={() => onViewCase(caseItem)} className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEditStatus(caseItem)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <Edit className="w-4 h-4" />
                  Cambiar estado
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDeleteCase(caseItem)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
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
