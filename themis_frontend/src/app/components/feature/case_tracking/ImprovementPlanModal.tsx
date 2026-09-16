"use client"

import type React from "react"
import { useState } from "react"
import Modal from "@/components/ui/Modal/Modal"
import Button from "@/components/ui/button"
import Input from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { useAppSelector } from "@/redux/hooks"

interface ImprovementPlanData {
  objectives: string[]
  actions: Array<{
    id: string
    description: string
    deadline: string
    responsible: string
    status: "pending" | "in-progress" | "completed"
  }>
  indicators: string[]
  studentSignature?: boolean
  instructorSignature?: boolean
}

interface ImprovementPlanModalProps {
  isOpen: boolean
  onClose: () => void
  caseId: string
  studentName: string
}

const ImprovementPlanModal: React.FC<ImprovementPlanModalProps> = ({ isOpen, onClose, caseId, studentName }) => {
  const [planData, setPlanData] = useState<ImprovementPlanData>({
    objectives: [""],
    actions: [
      {
        id: "1",
        description: "",
        deadline: "",
        responsible: "",
        status: "pending",
      },
    ],
    indicators: [""],
    studentSignature: false,
    instructorSignature: false,
  })

  const darkMode = useAppSelector((state) => state.theme.darkMode)

  const addObjective = () => {
    setPlanData({
      ...planData,
      objectives: [...planData.objectives, ""],
    })
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...planData.objectives]
    newObjectives[index] = value
    setPlanData({ ...planData, objectives: newObjectives })
  }

  const addAction = () => {
    const newAction = {
      id: Date.now().toString(),
      description: "",
      deadline: "",
      responsible: "",
      status: "pending" as const,
    }
    setPlanData({
      ...planData,
      actions: [...planData.actions, newAction],
    })
  }

  const updateAction = (id: string, field: string, value: string) => {
    const newActions = planData.actions.map((action) => (action.id === id ? { ...action, [field]: value } : action))
    setPlanData({ ...planData, actions: newActions })
  }

  const addIndicator = () => {
    setPlanData({
      ...planData,
      indicators: [...planData.indicators, ""],
    })
  }

  const updateIndicator = (index: number, value: string) => {
    const newIndicators = [...planData.indicators]
    newIndicators[index] = value
    setPlanData({ ...planData, indicators: newIndicators })
  }

  const handleSavePlan = () => {
    // Aquí se integraría con GraphQL para guardar el plan
    alert("Plan de Mejoramiento Guardado - El plan ha sido creado exitosamente y está listo para firmas.")
    onClose()
  }

  const handleSign = (type: "student" | "instructor") => {
    setPlanData({
      ...planData,
      [`${type}Signature`]: true,
    })

    alert(`Firma Registrada - La firma del ${type === "student" ? "estudiante" : "instructor"} ha sido registrada.`)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in-progress":
        return "En Progreso"
      case "completed":
        return "Completado"
      default:
        return status
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-lg`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            📋 Plan de Mejoramiento - {studentName}
          </h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Formulario digital para definir objetivos, acciones y seguimiento del plan de mejoramiento
          </p>
        </div>

        <div className="space-y-6">
          {/* Objetivos del Plan */}
          <div
            className={`border rounded-lg p-4 ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              🎯 Objetivos del Plan
            </h3>
            <div className="space-y-3">
              {planData.objectives.map((objective, index) => (
                <div key={index}>
                  <Label>Objetivo {index + 1}</Label>
                  <textarea
                    value={objective}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateObjective(index, e.target.value)
                    }
                    placeholder="Describa el objetivo específico del plan de mejoramiento..."
                    rows={2}
                    className={`w-full p-3 border rounded-md resize-none ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addObjective} className="w-full">
                Agregar Objetivo
              </Button>
            </div>
          </div>

          {/* Acciones a Realizar */}
          <div
            className={`border rounded-lg p-4 ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              ✅ Acciones a Realizar
            </h3>
            <div className="space-y-4">
              {planData.actions.map((action) => (
                <div
                  key={action.id}
                  className={`border rounded-lg p-4 space-y-3 ${
                    darkMode ? "border-gray-500 bg-gray-600" : "border-gray-300 bg-white"
                  }`}
                >
                  <div>
                    <Label>Descripción de la Acción</Label>
                    <textarea
                      value={action.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateAction(action.id, "description", e.target.value)
                      }
                      placeholder="Describa la acción específica a realizar..."
                      rows={2}
                      className={`w-full p-3 border rounded-md resize-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-500 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Fecha Límite</Label>
                      <Input
                        type="date"
                        value={action.deadline}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateAction(action.id, "deadline", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Responsable</Label>
                      <Input
                        value={action.responsible}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateAction(action.id, "responsible", e.target.value)
                        }
                        placeholder="Nombre del responsable"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <span
                      className={`inline-block ml-2 px-3 py-1 text-sm rounded-full ${
                        action.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {getStatusText(action.status)}
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addAction} className="w-full">
                Agregar Acción
              </Button>
            </div>
          </div>

          {/* Indicadores de Cumplimiento */}
          <div
            className={`border rounded-lg p-4 ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              📊 Indicadores de Cumplimiento
            </h3>
            <div className="space-y-3">
              {planData.indicators.map((indicator, index) => (
                <div key={index}>
                  <Label>Indicador {index + 1}</Label>
                  <Input
                    value={indicator}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateIndicator(index, e.target.value)
                    }
                    placeholder="Ej: Mejorar promedio académico a 3.5 o superior"
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addIndicator} className="w-full">
                Agregar Indicador
              </Button>
            </div>
          </div>

          {/* Sección de Firmas */}
          <div
            className={`border rounded-lg p-4 ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              ✍️ Firmas Digitales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <Label>Firma del Estudiante</Label>
                {planData.studentSignature ? (
                  <div className="w-full justify-center py-2 px-4 bg-green-100 text-green-800 dark:bg-blue-900 dark:text-blue-300 rounded-md font-semibold">
                    ✓ Firmado
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => handleSign("student")} className="w-full">
                    Firmar como Estudiante
                  </Button>
                )}
              </div>

              <div className="text-center space-y-2">
                <Label>Firma del Instructor</Label>
                {planData.instructorSignature ? (
                  <div className="w-full justify-center py-2 px-4 bg-green-100 text-green-800 dark:bg-blue-900 dark:text-blue-300 rounded-md font-semibold">
                    ✓ Firmado
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => handleSign("instructor")} className="w-full">
                    Firmar como Instructor
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan}>Guardar Plan de Mejoramiento</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ImprovementPlanModal
