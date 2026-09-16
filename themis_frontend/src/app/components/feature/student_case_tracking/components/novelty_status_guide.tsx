"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import {
    FileText,
    Search,
    Bell,
    CheckCircle,
    UserCheck,
    Info,
    ChevronRight,
    BookOpen
} from "lucide-react"

interface NoveltyStatusGuideProps {
    isOpen: boolean
    onClose: () => void
}

export default function NoveltyStatusGuide({ isOpen, onClose }: NoveltyStatusGuideProps) {
    const processSteps = [
        {
            number: 1,
            name: "Iniciación de la Novedad",
            subtitle: "Solicitud del Aprendiz",
            description:
                "Como aprendiz, debes iniciar el trámite de tu novedad (académica, administrativa, o durante la formación) mediante un documento electrónico o físico dirigido a tu Centro de Formación.",
            icon: FileText,
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
            borderColor: "border-blue-200/50 dark:border-blue-800/30",
            actions: [
                "Prepara tu solicitud de novedad en formato electrónico o físico",
                "Dirígela al Centro de Formación correspondiente",
                "No intentes realizar autogestión de novedades",
                "Sigue estrictamente los procedimientos establecidos en la normativa",
                "Incluye toda la documentación de respaldo necesaria",
            ],
        },
        {
            number: 2,
            name: "Revisión y Aprobación",
            subtitle: "Evaluación Interna del Centro",
            description:
                "Tu solicitud será revisada por el coordinador de proceso o el Comité de Evaluación y Seguimiento, según la complejidad de la novedad. Una vez avalada, se realizarán los ajustes académicos o administrativos necesarios en el sistema.",
            icon: Search,
            color: "from-purple-500 to-pink-500",
            bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
            borderColor: "border-purple-200/50 dark:border-purple-800/30",
            actions: [
                "Espera pacientemente mientras tu solicitud es evaluada",
                "El coordinador o comité revisará tu caso detalladamente",
                "Se verificará que cumplas con todos los requisitos",
                "Los ajustes se realizarán en el sistema institucional",
                "Mantente disponible por si requieren información adicional",
            ],
        },
        {
            number: 3,
            name: "Comunicación de la Decisión",
            subtitle: "Notificación Oficial",
            description:
                "Recibirás la notificación de la decisión por correo electrónico dentro de los 3 días hábiles siguientes a la recepción de tu solicitud. Si tu novedad requiere traslado de Centro, el proceso puede tomar hasta 5 días hábiles adicionales.",
            icon: Bell,
            color: "from-amber-500 to-orange-500",
            bgColor: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
            borderColor: "border-amber-200/50 dark:border-amber-800/30",
            actions: [
                "Revisa tu correo electrónico institucional diariamente",
                "La respuesta llegará dentro de los 3 días hábiles",
                "Si no recibes respuesta en ese plazo, tu solicitud se considera aprobada",
                "Para traslados de Centro, el proceso puede extenderse hasta 5 días hábiles",
                "Verifica que la notificación incluya los procedimientos a seguir",
            ],
        },
        {
            number: 4,
            name: "Autorización y Ejecución",
            subtitle: "Implementación de la Novedad",
            description:
                "Tu novedad se considera autorizada una vez que hayas sido notificado oficialmente por la Subdirección del Centro de Formación o la Dirección Regional. En caso de traslados, debes cumplir con las condiciones del programa de destino.",
            icon: CheckCircle,
            color: "from-green-500 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
            borderColor: "border-green-200/50 dark:border-green-800/30",
            actions: [
                "Lee cuidadosamente los términos y procedimientos notificados",
                "Verifica que comprendes todos los requisitos",
                "Para traslados, asegúrate de cumplir las condiciones del programa destino",
                "Demuestra competencia en los resultados de aprendizaje requeridos",
                "Sigue las instrucciones específicas para tu tipo de novedad",
            ],
        },
        {
            number: 5,
            name: "Aceptación de la Novedad",
            subtitle: "Confirmación del Aprendiz",
            description:
                "Una vez autorizada tu novedad, debes realizar el acuse de recibo de la notificación dentro de los 5 días calendario siguientes. Si no lo haces en ese plazo, se entenderá que no aceptas la novedad y esta no se ejecutará.",
            icon: UserCheck,
            color: "from-indigo-500 to-violet-500",
            bgColor: "from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
            borderColor: "border-indigo-200/50 dark:border-indigo-800/30",
            actions: [
                "Realiza el acuse de recibo dentro de los 5 días calendario",
                "Confirma tu aceptación de manera formal y oportuna",
                "Si no respondes en el plazo, la novedad NO se ejecutará",
                "Guarda copia de tu confirmación de aceptación",
                "Cumple con todos los compromisos establecidos en la notificación",
            ],
        },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-2xl">
                <DialogHeader className="border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
                    <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        Proceso de Gestión de Novedades
                    </DialogTitle>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Guía paso a paso para gestionar tus novedades según los artículos 17 y 18 del reglamento del aprendiz SENA
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {processSteps.map((step) => {
                        const Icon = step.icon
                        return (
                            <div
                                key={step.number}
                                className={`bg-gradient-to-br ${step.bgColor} p-6 rounded-2xl border ${step.borderColor} transition-all duration-300 hover:shadow-lg`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-4 bg-gradient-to-br ${step.color} rounded-xl shadow-lg flex-shrink-0`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${step.color} text-white`}
                                            >
                                                Paso {step.number}
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{step.name}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 italic">{step.subtitle}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{step.description}</p>

                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                                                    Qué debes hacer
                                                </span>
                                            </div>
                                            <ul className="space-y-2">
                                                {step.actions.map((action, actionIndex) => (
                                                    <li
                                                        key={actionIndex}
                                                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                                                    >
                                                        <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
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
                            <Info className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Nota Importante</h4>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                                    Este proceso está diseñado para garantizar que tu solicitud de novedad sea atendida de manera formal y oportuna. Es fundamental que sigas cada paso correctamente y respetes los plazos establecidos.
                                </p>
                                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mt-3">
                                    <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold mb-2">⚠️ Recuerda:</p>
                                    <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                                        <li>• No intentes realizar autogestión de novedades</li>
                                        <li>• Respeta los plazos de respuesta (3 días hábiles para notificación)</li>
                                        <li>• Confirma tu aceptación dentro de los 5 días calendario</li>
                                        <li>• Si no recibes respuesta en 3 días hábiles, tu solicitud se considera aprobada</li>
                                        <li>• Mantén comunicación constante con tu Centro de Formación</li>
                                    </ul>
                                </div>
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
