"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useQuery, useLazyQuery } from "@apollo/client";
import { COMMITTEES_BY_STUDENT_ID, GENERATE_MINUTE_DOCX } from "@/graphqlServices/queries";
import { RefreshCw, AlertTriangle, Users, FileText } from "lucide-react";
import CommitteeCard from "./components/CommitteeCard";

// Types
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

export default function StudentCommittees() {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [useMockData, setUseMockData] = useState(false); // Toggle for mock data
    const darkMode = useAppSelector((state) => state.theme.darkMode);
    const { user } = useAppSelector((state) => state.auth);

    // Get student ID from user
    const studentId = user?.student?.id;

    // GraphQL query
    const {
        data: committeesData,
        loading: loadingCommittees,
        error: committeesError,
    } = useQuery(COMMITTEES_BY_STUDENT_ID, {
        variables: { studentId: studentId ? Number(studentId) : 0 },
        skip: !studentId || useMockData, // Skip if using mock data
        fetchPolicy: "network-only",
    });

    const [runGenerateMinuteDocx] = useLazyQuery(GENERATE_MINUTE_DOCX, {
        fetchPolicy: "no-cache",
    });

    // Mock data for testing
    const mockCommittees: Committee[] = [
        {
            id: "1",
            coordination: {
                id: "1",
                name: "Coordinación de Tecnología e Innovación",
            },
            isCurrent: true,
            isActive: true,
            committeeEvents: [
                {
                    id: "101",
                    date: "2024-11-15",
                    hour: "14:00:00",
                    session: "Sesión 1 - Evaluación de Novedades",
                    coordinationName: "Coordinación de Tecnología e Innovación",
                    finishedAt: "2024-11-15T16:30:00",
                    minutes: [
                        {
                            id: "201",
                            fileContent: "base64mockdata",
                        },
                    ],
                },
            ],
            teachers: [
                {
                    id: "301",
                    collaborator: {
                        person: {
                            name: "María",
                            lastname: "González Pérez",
                        },
                    },
                },
                {
                    id: "302",
                    collaborator: {
                        person: {
                            name: "Carlos",
                            lastname: "Rodríguez López",
                        },
                    },
                },
            ],
        },
        {
            id: "2",
            coordination: {
                id: "2",
                name: "Coordinación de Desarrollo de Software",
            },
            isCurrent: true,
            isActive: true,
            committeeEvents: [
                {
                    id: "102",
                    date: "2024-12-05",
                    hour: "10:00:00",
                    session: "Sesión 2 - Revisión de Casos",
                    coordinationName: "Coordinación de Desarrollo de Software",
                    finishedAt: null, // Pendiente
                    minutes: [],
                },
            ],
            teachers: [
                {
                    id: "303",
                    collaborator: {
                        person: {
                            name: "Ana",
                            lastname: "Martínez Silva",
                        },
                    },
                },
            ],
        },
        {
            id: "3",
            coordination: {
                id: "3",
                name: "Coordinación de Bases de Datos",
            },
            isCurrent: false,
            isActive: true,
            committeeEvents: [
                {
                    id: "103",
                    date: "2024-10-20",
                    hour: "15:30:00",
                    session: "Sesión Extraordinaria",
                    coordinationName: "Coordinación de Bases de Datos",
                    finishedAt: "2024-10-20T17:00:00",
                    minutes: [
                        {
                            id: "202",
                            fileContent: "base64mockdata2",
                        },
                    ],
                },
            ],
            teachers: [
                {
                    id: "304",
                    collaborator: {
                        person: {
                            name: "Jorge",
                            lastname: "Hernández Castro",
                        },
                    },
                },
                {
                    id: "305",
                    collaborator: {
                        person: {
                            name: "Laura",
                            lastname: "Díaz Moreno",
                        },
                    },
                },
                {
                    id: "306",
                    collaborator: {
                        person: {
                            name: "Pedro",
                            lastname: "Sánchez Ruiz",
                        },
                    },
                },
            ],
        },
    ];

    // Extract committees from response or use mock data
    const committees: Committee[] = useMemo(() => {
        if (useMockData) {
            return mockCommittees;
        }
        return committeesData?.committeesByStudentId?.data || [];
    }, [committeesData, useMockData]);

    // Download minute handler
    const handleDownloadMinute = async (eventId: string) => {
        const fileName = `acta-comite-${eventId}.docx`;

        const triggerDownload = (href: string, name = fileName) => {
            const a = document.createElement("a");
            a.href = href;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => document.body.removeChild(a), 0);
        };

        const normalizeBase64 = (s: string) => {
            let b = s.trim();
            const idx = b.indexOf("base64,");
            if (idx >= 0) b = b.substring(idx + "base64,".length);
            b = b.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/=]/g, "");
            const pad = b.length % 4;
            if (pad > 0) b = b + "=".repeat(4 - pad);
            return b;
        };

        try {
            setDownloadingId(eventId);
            const cleanIdStr = String(eventId).replace(/^backend-/, "").replace(/^evt-/, "");

            const { data } = await runGenerateMinuteDocx({
                variables: { committeeEventId: cleanIdStr },
            });
            const payload: string | undefined = data?.generateMinuteDocx;

            if (payload && typeof payload === "string" && payload.length > 0) {
                // Handle URL response
                if (/^https?:\/\//i.test(payload)) {
                    triggerDownload(payload);
                    return;
                }

                // Handle data URL
                if (/^data:/i.test(payload)) {
                    triggerDownload(payload);
                    return;
                }

                // Handle base64
                try {
                    const base64 = normalizeBase64(payload);
                    const byteCharacters = atob(base64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], {
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });
                    const objUrl = URL.createObjectURL(blob);
                    triggerDownload(objUrl);
                    setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
                    return;
                } catch (e) {
                    console.error("Error decoding base64:", e);
                    const mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    const dataUrl = `data:${mime};base64,${payload}`;
                    triggerDownload(dataUrl);
                    return;
                }
            }

            alert("No se pudo generar el acta.");
        } catch (err) {
            console.error("Error downloading minute:", err);
            alert("Error al descargar el acta.");
        } finally {
            setDownloadingId(null);
        }
    };

    // Show loading state
    if (loadingCommittees) {
        return (
            <div
                className={`min-h-screen ${darkMode
                    ? "bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950"
                    : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"
                    } p-4 md:p-8 flex items-center justify-center`}
            >
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                        Cargando comités...
                    </p>
                </div>
            </div>
        );
    }

    // Show error state
    if (committeesError) {
        return (
            <div
                className={`min-h-screen ${darkMode
                    ? "bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950"
                    : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"
                    } p-4 md:p-8 flex items-center justify-center`}
            >
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                        Error al cargar los comités
                    </p>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} mt-2`}>
                        {committeesError.message}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${darkMode
                ? "bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950"
                : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"
                } p-4 md:p-8`}
        >
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Committees Grid */}
                {committees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {committees.map((committee) =>
                            committee.committeeEvents.map((event) => (
                                <CommitteeCard
                                    key={event.id}
                                    committee={committee}
                                    event={event}
                                    onDownloadMinute={handleDownloadMinute}
                                    downloadingId={downloadingId}
                                    darkMode={darkMode}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    <div
                        className={`text-center py-12 rounded-2xl border ${darkMode
                            ? "bg-slate-900/80 border-slate-700/50"
                            : "bg-white/80 border-slate-200/50"
                            } backdrop-blur-xl`}
                    >
                        <Users className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
                        <p className={`text-lg font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                            No estás citado en ningún comité
                        </p>
                        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} mt-2`}>
                            Cuando seas citado a un comité, aparecerá aquí
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
