"use client";

import React from "react";
import { Calendar, Clock, MapPin, User, Download, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/button";

interface CommitteeEvent {
    id: string;
    date: string;
    hour: string;
    session: string;
    coordinationName: string;
    finishedAt: string | null;
    minutes: Array<{
        id: string;
        fileContent: string;
    }>;
}

interface Committee {
    id: string;
    coordination: {
        id: string;
        name: string;
    };
    isCurrent: boolean;
    isActive: boolean;
    committeeEvents: CommitteeEvent[];
    teachers: Array<{
        id: string;
        collaborator: {
            person: {
                name: string;
                lastname: string;
            };
        };
    }>;
}

interface CommitteeCardProps {
    committee: Committee;
    event: CommitteeEvent;
    onDownloadMinute: (eventId: string) => void;
    downloadingId: string | null;
    darkMode: boolean;
}

export default function CommitteeCard({
    committee,
    event,
    onDownloadMinute,
    downloadingId,
    darkMode,
}: CommitteeCardProps) {
    const isFinished = !!event.finishedAt;
    const hasMinutes = event.minutes && event.minutes.length > 0;
    const isDownloading = downloadingId === event.id;

    // Format date
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    // Get instructor names
    const instructorNames = committee.teachers
        .map((t) => `${t.collaborator.person.name} ${t.collaborator.person.lastname}`)
        .join(", ");

    return (
        <div
            className={`rounded-2xl border shadow-xl transition-all duration-300 hover:shadow-2xl ${darkMode
                    ? "bg-slate-900/80 border-slate-700/50 hover:border-slate-600"
                    : "bg-white/80 border-slate-200/50 hover:border-slate-300"
                } backdrop-blur-xl overflow-hidden`}
        >
            {/* Header with status */}
            <div
                className={`px-6 py-4 border-b ${darkMode ? "border-slate-700/50" : "border-slate-200/50"
                    }`}
            >
                <div className="flex items-center justify-between">
                    <h3
                        className={`text-lg font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"
                            }`}
                    >
                        {committee.coordination.name}
                    </h3>
                    <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isFinished
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                    >
                        {isFinished ? (
                            <>
                                <CheckCircle className="w-3 h-3" />
                                Finalizado
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-3 h-3" />
                                Pendiente
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
                {/* Session info */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Calendar
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-slate-400" : "text-slate-600"
                                }`}
                        />
                        <div>
                            <p
                                className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Fecha
                            </p>
                            <p
                                className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"
                                    }`}
                            >
                                {formatDate(event.date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-slate-400" : "text-slate-600"
                                }`}
                        />
                        <div>
                            <p
                                className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Hora
                            </p>
                            <p
                                className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"
                                    }`}
                            >
                                {event.hour}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-slate-400" : "text-slate-600"
                                }`}
                        />
                        <div>
                            <p
                                className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Sesión
                            </p>
                            <p
                                className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"
                                    }`}
                            >
                                {event.session}
                            </p>
                        </div>
                    </div>

                    {instructorNames && (
                        <div className="flex items-start gap-3">
                            <User
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-slate-400" : "text-slate-600"
                                    }`}
                            />
                            <div>
                                <p
                                    className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"
                                        }`}
                                >
                                    Instructores
                                </p>
                                <p
                                    className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"
                                        }`}
                                >
                                    {instructorNames}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Download button */}
                {isFinished && (
                    <div className="pt-2">
                        <Button
                            onClick={() => onDownloadMinute(event.id)}
                            disabled={isDownloading || !hasMinutes}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isDownloading || !hasMinutes
                                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                                }`}
                        >
                            {isDownloading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Descargando...
                                </>
                            ) : hasMinutes ? (
                                <>
                                    <Download className="w-4 h-4" />
                                    Descargar Acta
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Acta no disponible
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {!isFinished && (
                    <div
                        className={`pt-2 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-600"
                            }`}
                    >
                        El acta estará disponible cuando finalice el comité
                    </div>
                )}
            </div>
        </div>
    );
}
