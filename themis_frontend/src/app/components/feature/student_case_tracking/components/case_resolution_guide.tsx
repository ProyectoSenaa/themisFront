"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { useEffect } from "react"
import {
  GraduationCap,
  UserX,
  AlertTriangle,
  FileWarning,
  Clock,
  Info,
  ChevronRight,
  BookOpen
} from "lucide-react"

interface CaseResolutionGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function CaseResolutionGuide({ isOpen, onClose }: CaseResolutionGuideProps) {
  useEffect(() => {
    console.log('CaseResolutionGuide - isOpen:', isOpen)
  }, [isOpen])

  const noveltyTypes = [
    {
      name: "Bajo Rendimiento Académico",
      description:
        "Se presenta cuando el aprendiz no alcanza los resultados de aprendizaje esperados o tiene dificultades para cumplir con las competencias del programa de formación.",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      actions: [
        "Revisa las competencias y resultados de aprendizaje que no has alcanzado",
        "Solicita apoyo pedagógico adicional con tu instructor",
        "Descarga y completa el plan de mejoramiento asignado",
        "Participa activamente en las actividades de refuerzo programadas",
        "Mantén evidencias de tu progreso y mejora continua",
        "Comunícate regularmente con tu instructor sobre tus avances",
      ],
    },
    {
      name: "Faltas Graves",
      description:
        "Incluye comportamientos que afectan gravemente la convivencia, el proceso formativo o incumplen el reglamento del aprendiz del SENA.",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
      borderColor: "border-red-200/50 dark:border-red-800/30",
      actions: [
        "Lee cuidadosamente el reporte y las evidencias presentadas",
        "Prepara tu versión de los hechos con evidencias si las tienes",
        "Solicita una reunión con tu instructor y coordinación académica",
        "Demuestra compromiso de mejora y cambio de comportamiento",
        "Cumple estrictamente con las sanciones o compromisos establecidos",
        "Evita repetir conductas que puedan generar nuevas novedades",
      ],
    },
    {
      name: "Retiro Injustificado",
      description:
        "Ocurre cuando el aprendiz se ausenta del proceso formativo sin presentar justificación válida o sin seguir los procedimientos establecidos.",
      icon: UserX,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      actions: [
        "Contacta inmediatamente con tu instructor para explicar la situación",
        "Presenta las justificaciones o documentos que respalden tu ausencia",
        "Solicita información sobre el proceso de reintegro si aplica",
        "Cumple con los compromisos académicos pendientes",
        "Mantén comunicación constante para evitar nuevas ausencias",
        "Revisa el reglamento sobre inasistencias y procedimientos",
      ],
    },
    {
      name: "Incumplimiento de Compromisos",
      description:
        "Se presenta cuando el aprendiz no cumple con los acuerdos, planes de mejoramiento o compromisos académicos previamente establecidos.",
      icon: FileWarning,
      color: "from-amber-500 to-yellow-500",
      bgColor: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
      borderColor: "border-amber-200/50 dark:border-amber-800/30",
      actions: [
        "Identifica qué compromisos no has cumplido y las razones",
        "Comunícate con tu instructor para replantear plazos si es necesario",
        "Organiza tu tiempo y prioriza el cumplimiento de compromisos",
        "Solicita apoyo si tienes dificultades para cumplir",
        "Presenta evidencias de avance parcial si las tienes",
        "Establece un plan de acción realista para ponerte al día",
      ],
    },
    {
      name: "Problemas de Convivencia",
      description:
        "Situaciones que afectan el ambiente de aprendizaje, las relaciones interpersonales o el trabajo en equipo dentro del proceso formativo.",
      icon: AlertTriangle,
      color: "from-indigo-500 to-violet-500",
      bgColor: "from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
      borderColor: "border-indigo-200/50 dark:border-indigo-800/30",
      actions: [
        "Reflexiona sobre tu comportamiento y su impacto en el grupo",
        "Participa en espacios de mediación o resolución de conflictos",
        "Muestra disposición para mejorar las relaciones con compañeros",
        "Cumple con las normas de convivencia establecidas",
        "Busca apoyo de bienestar institucional si lo necesitas",
        "Demuestra cambios positivos en tu actitud y comportamiento",
      ],
    },
    {
      name: "Otras Novedades",
      description:
        "Cualquier otra situación que requiera seguimiento académico y que no esté clasificada en las categorías anteriores.",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      actions: [
        "Lee detenidamente la descripción del caso reportado",
        "Contacta a tu instructor para entender la situación específica",
        "Sigue las indicaciones y compromisos establecidos",
        "Mantén comunicación constante sobre tu progreso",
        "Solicita clarificaciones si algo no está claro",
        "Cumple con los plazos y requisitos establecidos",
      ],
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-2xl">
        <DialogHeader className="border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
          <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            Guía de Tipos de Novedades
          </DialogTitle>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Conoce los diferentes tipos de novedades y las acciones recomendadas para cada caso
          </p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {noveltyTypes.map((novelty, index) => {
            const Icon = novelty.icon
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${novelty.bgColor} p-6 rounded-2xl border ${novelty.borderColor} transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 bg-gradient-to-br ${novelty.color} rounded-xl shadow-lg flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{novelty.name}</h3>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{novelty.description}</p>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                          Acciones Recomendadas
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {novelty.actions.map((action, actionIndex) => (
                          <li
                            key={actionIndex}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Nota Importante</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Cada tipo de novedad requiere un abordaje específico. Es fundamental que identifiques el tipo de novedad
                  que te ha sido reportada y sigas las acciones recomendadas. Recuerda que el objetivo del seguimiento es
                  apoyarte en tu proceso formativo y ayudarte a superar las dificultades. Mantén una actitud proactiva,
                  comunícate con tu instructor y cumple con los compromisos establecidos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <Button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl px-8 h-12 font-semibold"
            >
              Entendido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
