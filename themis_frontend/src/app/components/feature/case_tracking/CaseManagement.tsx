"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Button from "@/components/ui/button"
import Modal from "@/components/ui/Modal/Modal"
import Input from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { useAppSelector } from "@/redux/hooks"
import { AlertCircle, Plus, Eye, Edit, FileText, Clock, CheckCircle, XCircle, Upload, Download } from "lucide-react"
import { CaseCreateModal } from "./components/CaseCreateModal"
import { GET_ALL_FOLLOW_UPS, ADD_FOLLOW_UP } from "@/graphql/follow-up-queries"

import { useQuery, useMutation } from "@apollo/client"
import { UPDATE_FOLLOW_UP } from "@/graphql/follow-up-queries"

interface FollowUpCase {
  id: string
  creationDate: string
  caseDescription: string
  evidenceFiles?: string
  isActive: boolean
  studentId: string
  teacherId: string
  coordinatorId?: string
  followUpType: {
    id: string
    nameNovelty: string
  }
  followUpStatus: {
    id: string
    name: string
  }
  followUpFlowStatus: {
    id: string
    name: string
  }
  // Datos adicionales simulados
  studentName?: string
  studentDocument?: string
  program?: string
}

interface CaseFormData {
  studentId: string
  caseDescription: string
  followUpTypeId: string
  evidenceFiles?: string
}

const CaseManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  useEffect(() => {
    console.log('isCreateModalOpen:', isCreateModalOpen)
  }, [isCreateModalOpen])
  const [cases, setCases] = useState<FollowUpCase[]>([])
  // Obtener todos los casos de seguimiento
  const { data, loading, error, refetch } = useQuery(GET_ALL_FOLLOW_UPS, {
    variables: { page: 0, size: 100 }
  })
  const [addFollowUp] = useMutation(ADD_FOLLOW_UP)
  const [updateFollowUp] = useMutation(UPDATE_FOLLOW_UP)
  const [selectedCase, setSelectedCase] = useState<FollowUpCase | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [formData, setFormData] = useState<CaseFormData>({
    studentId: "",
    caseDescription: "",
    followUpTypeId: "",
    evidenceFiles: "",
  })

  const darkMode = useAppSelector((state) => state.theme.darkMode)


  useEffect(() => {
    // Si tienes una query para todos los casos, úsala aquí.
    if (data && data.allFollowUps && data.allFollowUps.data) {
      setCases(data.allFollowUps.data)
    }
  }, [data])

  const filteredCases = cases.filter((caseItem) => {
    if (filter === "all") return true
    const statusLower = caseItem.followUpStatus.name.toLowerCase()

    switch (filter) {
      case "abierto":
        return statusLower === "abierto"
      case "revision":
        return statusLower === "en revisión"
      case "resuelto":
        return statusLower === "resuelto"
      default:
        return true
    }
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "abierto":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "en revisión":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "resuelto":
        return "bg-green-100 text-green-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "abierto":
        return <AlertCircle className="w-4 h-4" />
      case "en revisión":
        return <Clock className="w-4 h-4" />
      case "resuelto":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  const handleCreateCase = () => {
    // Crear caso real con mutation
    addFollowUp({
      variables: {
        input: {
          caseDescription: formData.caseDescription,
          isActive: true,
          studentId: formData.studentId,
        },
      },
    }).then(() => {
      setIsCreateModalOpen(false)
      setFormData({ studentId: "", caseDescription: "", followUpTypeId: "", evidenceFiles: "" })
      refetch()
      alert("Caso creado exitosamente - El nuevo caso ha sido registrado en el sistema.")
    })
  }

  const handleViewCase = (caseItem: FollowUpCase) => {
    setSelectedCase(caseItem)
    setIsDetailModalOpen(true)
  }

  const handleEditCase = (caseItem: FollowUpCase) => {
    setSelectedCase(caseItem)
    setFormData({
      studentId: caseItem.studentId,
      caseDescription: caseItem.caseDescription,
      followUpTypeId: caseItem.followUpType.id,
      evidenceFiles: caseItem.evidenceFiles || "",
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateCase = () => {
    if (!selectedCase) return
    updateFollowUp({
      variables: {
        id: selectedCase.id,
        input: {
          caseDescription: formData.caseDescription,
        },
      },
    }).then(() => {
      setIsEditModalOpen(false)
      setSelectedCase(null)
      refetch()
      alert("Caso actualizado - Los cambios han sido guardados exitosamente.")
    })
  }

  return (
    <div className={`container mx-auto p-6 space-y-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Gestión de Casos</h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Sistema integral de seguimiento y gestión de casos de estudiantes
          </p>
        </div>

        <Button className="flex items-center gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Crear Nuevo Caso
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total de Casos</p>
              <p className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{cases.length}</p>
            </div>
            <FileText className={`h-8 w-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Casos Abiertos</p>
              <p className="text-2xl font-bold text-blue-600">
                {cases.filter((c) => c.followUpStatus.name.toLowerCase() === "abierto").length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>En Revisión</p>
              <p className="text-2xl font-bold text-yellow-600">
                {cases.filter((c) => c.followUpStatus.name.toLowerCase() === "en revisión").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Resueltos</p>
              <p className="text-2xl font-bold text-green-600">
                {cases.filter((c) => c.followUpStatus.name.toLowerCase() === "resuelto").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filtros y Lista de Casos */}
      <div className={`rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Lista de Casos</h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Gestiona y da seguimiento a todos los casos registrados
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="text-sm"
              >
                Todos
              </Button>
              <Button
                variant={filter === "abierto" ? "default" : "outline"}
                onClick={() => setFilter("abierto")}
                className="text-sm"
              >
                Abiertos
              </Button>
              <Button
                variant={filter === "revision" ? "default" : "outline"}
                onClick={() => setFilter("revision")}
                className="text-sm"
              >
                En Revisión
              </Button>
              <Button
                variant={filter === "resuelto" ? "default" : "outline"}
                onClick={() => setFilter("resuelto")}
                className="text-sm"
              >
                Resueltos
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className={`border-l-4 border-l-blue-500 rounded-lg p-4 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.followUpStatus.name)}`}>
                        {getStatusIcon(caseItem.followUpStatus.name)}
                        {caseItem.followUpStatus.name}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {caseItem.followUpType.nameNovelty}
                      </span>
                    </div>

                    <div>
                      <h3 className={`font-semibold text-lg ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                        {caseItem.studentName} - {caseItem.studentDocument}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{caseItem.program}</p>
                    </div>

                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} line-clamp-2`}>
                      {caseItem.caseDescription}
                    </p>

                    <div className={`flex items-center gap-4 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      <span>Creado: {new Date(caseItem.creationDate).toLocaleDateString("es-ES")}</span>
                      <span>Estado del flujo: {caseItem.followUpFlowStatus.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" onClick={() => handleViewCase(caseItem)} className="p-2">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={() => handleEditCase(caseItem)} className="p-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCases.length === 0 && (
              <div className="text-center py-8">
                <FileText className={`w-12 h-12 mx-auto ${darkMode ? "text-gray-500" : "text-gray-400"} mb-4`} />
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  No hay casos reportados aún!
                </h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  No se ha registrado ninguna novedad de estudiantes.
                </p>
                <Button
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded shadow"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Crear Primer Caso
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Creación */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        className={`w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}
      >
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Crear Nuevo Caso</h2>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Registra un nuevo caso de seguimiento para un estudiante
          </p>

          <div className="space-y-4">
            <div>
              <Label>ID del Estudiante</Label>
              <Input
                value={formData.studentId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                placeholder="Ingrese el ID del estudiante"
              />
            </div>

            <div>
              <Label>Tipo de Caso</Label>
              <select
                value={formData.followUpTypeId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, followUpTypeId: e.target.value })
                }
                className={`w-full p-3 border rounded-md ${darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
                  }`}
              >
                <option value="">Seleccione el tipo de caso</option>
                <option value="1">Bajo Rendimiento Académico</option>
                <option value="2">Falta Disciplinaria</option>
                <option value="3">Inasistencias</option>
                <option value="4">Comportamiento Inadecuado</option>
              </select>
            </div>

            <div>
              <Label>Descripción del Caso</Label>
              <textarea
                value={formData.caseDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, caseDescription: e.target.value })
                }
                placeholder="Describa detalladamente el caso..."
                rows={4}
                className={`w-full p-3 border rounded-md resize-none ${darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
                  }`}
              />
            </div>

            <div>
              <Label>Evidencia (Opcional)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  className={`flex-1 p-2 border rounded-md ${darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-900"
                    }`}
                />
                <Button variant="outline" className="p-2">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCase}>Crear Caso</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Detalles */}
      <Modal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        className={`w-full max-w-3xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}
      >
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
            Detalles del Caso
          </h2>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Información completa del caso de seguimiento
          </p>

          {selectedCase && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estudiante</Label>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {selectedCase.studentName}
                  </p>
                </div>
                <div>
                  <Label>Documento</Label>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {selectedCase.studentDocument}
                  </p>
                </div>
                <div>
                  <Label>Programa</Label>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{selectedCase.program}</p>
                </div>
                <div>
                  <Label>Fecha de Creación</Label>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {new Date(selectedCase.creationDate).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>

              <div>
                <Label>Tipo de Caso</Label>
                <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {selectedCase.followUpType.nameNovelty}
                </span>
              </div>

              <div>
                <Label>Estado Actual</Label>
                <span className={`inline-block ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedCase.followUpStatus.name)}`}>
                  {getStatusIcon(selectedCase.followUpStatus.name)}
                  {selectedCase.followUpStatus.name}
                </span>
              </div>

              <div>
                <Label>Descripción del Caso</Label>
                <div className={`mt-2 p-3 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {selectedCase.caseDescription}
                  </p>
                </div>
              </div>

              {selectedCase.evidenceFiles && (
                <div>
                  <Label>Evidencia</Label>
                  <Button variant="outline" className="ml-2 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar Evidencia
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className={`w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}
      >
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Editar Caso</h2>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Modifica la información del caso de seguimiento
          </p>

          <div className="space-y-4">
            <div>
              <Label>Descripción del Caso</Label>
              <textarea
                value={formData.caseDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, caseDescription: e.target.value })
                }
                rows={4}
                className={`w-full p-3 border rounded-md resize-none ${darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
                  }`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCase}>Guardar Cambios</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CaseManagement
