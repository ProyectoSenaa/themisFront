'use client'

import React, { useState } from "react";
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { fetchNovelties } from '@/redux/features/noveltySlice';
import Alert from "./Alert";
import IFormRespondNoveltyProps from "../interfaces/components_interfaces/RespondFormNovelty/IFormRespondNoveltyProps";
import { IoDocumentTextOutline, IoPersonOutline, IoCardOutline, IoSchoolOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { MdDescription } from 'react-icons/md';
import { FaFilePdf } from 'react-icons/fa';
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(() => import('@/app/components/PDFViewer'), { ssr: false });

interface Props extends IFormRespondNoveltyProps {
    onResponded?: () => void;
    onSendToCommittee?: (noveltyId?: string, numeroFicha?: string) => Promise<any> | void;
}

const FormRespondNovelty: React.FC<Props> = ({ formValues, onResponded, onSendToCommittee }) => {

    const dispatch = useDispatch();

    // Dark mode detection (Redux, igual que ReportContent)
    const isDarkMode = useSelector((state: RootState) => state.theme.darkMode);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const [action, setAction] = useState<"approve" | "deny" | "send" | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [mensajeTipo, setMensajeTipo] = useState<"success" | "error" | "info" | "warning">("info");
    const [pdfUrlToShow, setPdfUrlToShow] = useState<string>("");

    // Debug: log formValues changes so we can see if ficha is present
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        console.debug('RespondFormNovelty: formValues:', formValues);
    }, [formValues]);


    React.useEffect(() => {
        if (!isPdfOpen) return;

        let createdUrl: string | null = null;
        const maybePdf = (formValues as any)?.pdfUrl ?? (Array.isArray((formValues as any)?.documents) ? (formValues as any).documents[0] : undefined);


        console.log('RespondFormNovelty: preparing PDF, formValues.documents:', (formValues as any).documents, 'formValues.pdfUrl:', (formValues as any).pdfUrl, 'maybePdf:', maybePdf);

        if (!maybePdf) {
            setPdfUrlToShow("");
            return;
        }

        const makeDataUrlFromBase64 = (s: string) => {
            const cleaned = s.replace(/\s+/g, '');
            const base64UrlRegex = /^[A-Za-z0-9\-_]+=*$/;
            const base64Regex = /^[A-Za-z0-9+/=]+$/;

            if (s.startsWith('data:')) return s;

            if (base64UrlRegex.test(cleaned) && !base64Regex.test(cleaned)) {
                let b = cleaned.replace(/-/g, '+').replace(/_/g, '/');
                while (b.length % 4 !== 0) b += '=';
                return `data:application/pdf;base64,${b}`;
            }

            if (base64Regex.test(cleaned)) {
                let b = cleaned;
                while (b.length % 4 !== 0) b += '=';
                return `data:application/pdf;base64,${b}`;
            }

            return s;
        };

        try {
            if (typeof maybePdf === 'string') {
                setPdfUrlToShow(makeDataUrlFromBase64(maybePdf));
            } else if (maybePdf instanceof File) {
                createdUrl = URL.createObjectURL(maybePdf);
                setPdfUrlToShow(createdUrl);
            } else if (maybePdf && typeof maybePdf === 'object') {

                const cand = maybePdf.base64 || maybePdf.file || maybePdf.data || maybePdf.url || undefined;
                if (cand && typeof cand === 'string') {
                    setPdfUrlToShow(makeDataUrlFromBase64(cand));
                } else if (cand instanceof File) {
                    createdUrl = URL.createObjectURL(cand);
                    setPdfUrlToShow(createdUrl);
                } else {
                    setPdfUrlToShow("");
                }
            } else {
                setPdfUrlToShow("");
            }
        } catch (err) {

            console.error('Error preparing PDF URL:', err);
            setPdfUrlToShow("");
        }

        return () => {
            if (createdUrl) {
                URL.revokeObjectURL(createdUrl);
            }
        };
    }, [isPdfOpen, formValues]);

    const handleDeny = async () => {
        setIsModalOpen(true);
        setAction("deny");
    };

    const handleApprove = () => {
        setIsModalOpen(true);
        setAction("approve");
    };


    const confirmAction = async () => {
        if (action === "deny") {
            try {
                const NoveltyService = (await import('@/app/service/NoveltyService')).default;
                // Use noveltyStatus object with id to match backend DTO shape
                await NoveltyService.updateStateNovelty(formValues?.id ? Number(formValues.id) : 0, { data: { noveltyStatus: { id: 4 } } });
                console.log('Novedad denegada (actualizada en backend)');
                setMensaje('La novedad ha sido denegada correctamente');
                setMensajeTipo('success');
                // Refresh novelties list so UI reflects DB change
                try { dispatch(fetchNovelties({ page: 0, size: 10 }) as any); } catch (e) { /* ignore */ }
            } catch (error) {
                console.error("Error al actualizar el estado de la novedad: ", error);
                setMensaje("Error al denegar la novedad");
                setMensajeTipo("error");
            }
        } else if (action === "approve") {
            try {
                const NoveltyService = (await import('@/app/service/NoveltyService')).default;
                // noveltyStatus id 3 -> Aprobado
                await NoveltyService.updateStateNovelty(formValues?.id ? Number(formValues.id) : 0, { data: { noveltyStatus: { id: 3 } } });
                console.log('Novedad aprobada (actualizada en backend)');
                setMensaje('La novedad ha sido aprobada correctamente');
                setMensajeTipo('success');

                try { dispatch(fetchNovelties({ page: 0, size: 10 }) as any); } catch (e) { /* ignore */ }
            } catch (error) {
                console.error("Error al aprobar la novedad: ", error);
                setMensaje("Error al aprobar la novedad");
                setMensajeTipo("error");
            }
        }
        else if (action === "send") {
            try {

                const anyVals: any = formValues as any
                const fichaCandidates = [
                    anyVals.numero_Ficha,
                    anyVals.ficha,
                    anyVals.studySheet,
                    anyVals.student?.studentStudySheets?.[0]?.studySheet?.number,
                ]
                let ficha: string | undefined = undefined
                for (const c of fichaCandidates) {
                    if (c === undefined || c === null) continue
                    const s = String(c).trim()
                    if (s && s !== 'N/A') {
                        ficha = s
                        break
                    }
                }

                if (typeof onSendToCommittee === 'function') {
                    await onSendToCommittee(formValues?.id ? String(formValues.id) : undefined, ficha)
                    setMensaje('La novedad fue enviada al comité')
                    setMensajeTipo('success')

                    try { dispatch(fetchNovelties({ page: 0, size: 10 }) as any); } catch (e) { /* ignore */ }
                } else {
                    setMensaje('Simulación: novedad marcada para comité')
                    setMensajeTipo('info')
                }
            } catch (err) {
                console.error('Error al enviar a comité', err)
                setMensaje('Error al enviar la novedad al comité')
                setMensajeTipo('error')
            }
        }
        setIsModalOpen(false);
        const currentAction = action;
        setAction(null);
        if (currentAction !== 'send' && onResponded) onResponded();
        setTimeout(() => {
            setMensaje(null);
        }, 1000);
    };

    // Early return after all hooks
    if (!formValues) return null;

    const cancelAction = () => {
        setIsModalOpen(false);
        setAction(null);
    };

    // Helper to safely extract ficha from formValues
    const getFichaFromFormValues = (): string | null => {
        const anyVals: any = formValues as any
        const candidates = [
            anyVals.numero_Ficha,
            anyVals.ficha,
            anyVals.studySheet,
            anyVals.student?.studentStudySheets?.[0]?.studySheet?.number,
        ]
        for (const c of candidates) {
            if (c === undefined || c === null) continue
            const s = String(c).trim()
            if (s && s !== 'N/A') return s
        }
        return ''
    }




    return (
        <div className="flex justify-center w-full items-start p-2 sm:p-4 font-inter bg-white dark:bg-[#181f2a]">
            {mensaje && (
                <div className="fixed top-4 right-4 z-50">
                    <Alert message={mensaje} type={mensajeTipo} />
                </div>
            )}
            <div className="container mx-auto p-0 w-full max-w-5xl">
                <div className="shadow-xl rounded-xl overflow-hidden transition-colors duration-500 bg-white dark:bg-[#232b3b] dark:border dark:border-[#3a4252]">
                    {/* Encabezado */}
                    <div className="bg-gradient-to-r p-4 sm:p-6 text-white from-darkGreen to-emerald-600 dark:from-[#00304D] dark:to-[#005386]">
                        <h1 className="text-xl sm:text-2xl font-bold">Revisión de Novedad</h1>
                        <p className="opacity-80 text-sm sm:text-base mt-1">Por favor revise los detalles de la novedad antes de tomar una decisión</p>
                    </div>
                    {/* Formulario */}
                    <form className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:space-x-8">
                            {/* Columna izquierda */}
                            <div className="flex-1">
                                <div className="space-y-4 sm:space-y-5">
                                    {/* Tarjeta: Tipo de novedad */}
                                    <div className="p-3 sm:p-4 rounded-lg shadow-sm transition-colors duration-300 bg-gray-50 dark:bg-[#232b3b] dark:border dark:border-[#3a4252]">
                                        <div className="flex items-center mb-2">
                                            <IoDocumentTextOutline className="text-darkGreen mr-2 text-lg sm:text-xl flex-shrink-0" />
                                            <label className="font-semibold text-sm sm:text-base text-gray-700 dark:text-white">Tipo de novedad</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formValues.noveltyType}
                                            disabled
                                            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none transition-colors duration-300 bg-gray-200 border-gray-300 text-gray-600 shadow-inner text-sm sm:text-base"
                                        />
                                    </div>
                                    {/* Tarjeta: Aprendiz */}
                                    <div className="p-3 sm:p-4 rounded-lg shadow-sm transition-colors duration-300 bg-gray-50 dark:bg-[#232b3b] dark:border dark:border-[#3a4252]">
                                        <div className="flex items-center mb-2">
                                            <IoPersonOutline className="text-darkGreen mr-2 text-lg sm:text-xl flex-shrink-0" />
                                            <label className="font-semibold text-sm sm:text-base text-gray-700 dark:text-white">Aprendiz</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formValues.apprenticeName}
                                            disabled
                                            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none transition-colors duration-300 bg-gray-200 border-gray-300 text-gray-600 shadow-inner text-sm sm:text-base"
                                        />
                                    </div>
                                    {/* Tarjeta: Documento */}
                                    <div className="p-3 sm:p-4 rounded-lg shadow-sm transition-colors duration-300 bg-gray-50 dark:bg-[#232b3b] dark:border dark:border-[#3a4252]">
                                        <div className="flex items-center mb-2">
                                            <IoCardOutline className="text-darkGreen mr-2 text-lg sm:text-xl flex-shrink-0" />
                                            <label className="font-semibold text-sm sm:text-base text-gray-700 dark:text-white">Número de documento</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formValues.document}
                                            disabled
                                            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none transition-colors duration-300 bg-gray-200 border-gray-300 text-gray-600 shadow-inner text-sm sm:text-base"
                                        />
                                    </div>
                                    {/* Tarjeta: Programa */}
                                    <div className="p-3 sm:p-4 rounded-lg shadow-sm transition-colors duration-300 bg-gray-50 dark:bg-[#232b3b] dark:border dark:border-[#3a4252]">
                                        <div className="flex items-center mb-2">
                                            <IoSchoolOutline className="text-darkGreen mr-2 text-lg sm:text-xl flex-shrink-0" />
                                            <label className="font-semibold text-sm sm:text-base text-gray-700 dark:text-white">Programa</label>
                                        </div>
                                        <textarea
                                            value={formValues.program}
                                            disabled
                                            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none resize-none transition-colors duration-300 bg-gray-200 border-gray-300 text-gray-600 shadow-inner text-sm sm:text-base"
                                            rows={2}
                                        />
                                    </div>
                                    {/* Tarjeta: Fundamentos */}
                                    <div className="p-3 sm:p-4 rounded-lg shadow-sm transition-colors duration-300 bg-gray-50 dark:bg-[#232b3b] dark:border dark:border-[#3a4252]">
                                        <div className="flex items-center mb-2">
                                            <MdDescription className="text-darkGreen mr-2 text-lg sm:text-xl flex-shrink-0" />
                                            <label className="font-semibold text-sm sm:text-base text-gray-700 dark:text-white">Fundamentos</label>
                                        </div>
                                        <textarea
                                            value={formValues.fundaments}
                                            disabled
                                            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none resize-none transition-colors duration-300 bg-gray-200 border-gray-300 text-gray-600 shadow-inner text-sm sm:text-base"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Columna derecha */}
                            <div className="lg:w-8/12 mt-6 lg:mt-0 flex flex-col">
                                <div className="flex-1 rounded-xl flex flex-col items-center justify-center mb-6 p-4 sm:p-6 min-h-[250px] sm:min-h-[350px] border transition-colors duration-300 bg-gray-50 border-gray-200 dark:bg-[#232b3b] dark:border-[#3a4252]">
                                    <FaFilePdf className="text-5xl sm:text-6xl text-red-500 mb-4" />
                                    <p className="text-center text-sm sm:text-base transition-colors duration-300 text-gray-500 dark:text-slate-300">Documento de soporte de la novedad</p>
                                    <button
                                        type="button"
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm sm:text-base"
                                        onClick={() => {
                                            // Log the source of the PDF for debugging (base64 / data URL / url)
                                            const maybePdf = (formValues as any)?.pdfUrl ?? (Array.isArray((formValues as any)?.documents) ? (formValues as any).documents[0] : undefined);
                                            // eslint-disable-next-line no-console
                                            console.log('Opening PDF viewer; maybePdf:', maybePdf);
                                            setIsPdfOpen(true);
                                        }}
                                    >
                                        <span className="mr-2">Ver PDF</span>
                                    </button>
                                </div>
                                {/* Botones de acción - Responsivos */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <button
                                        type="button"
                                        onClick={handleDeny}
                                        className="bg-red-500 hover:bg-red-600 text-white p-3 sm:p-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm text-sm sm:text-base"
                                    >
                                        <IoCloseCircleOutline className="text-lg sm:text-xl mr-2" />
                                        <span>Denegar</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleApprove}
                                        className="bg-darkGreen hover:bg-hoverGreen text-white p-3 sm:p-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm text-sm sm:text-base"
                                    >
                                        <IoCheckmarkCircleOutline className="text-lg sm:text-xl mr-2" />
                                        <span>Aprobar</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsModalOpen(true); setAction('send') }}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 sm:p-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm text-sm sm:text-base"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L12 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5 9L12 2L19 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="whitespace-nowrap">Mandar a comité</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal de confirmación */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full animate-fadeIn">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 border-b pb-3">
                            {action === "deny" ? "Denegar Novedad" : action === 'send' ? 'Enviar a Comité' : "Aprobar Novedad"}
                        </h3>
                        <p className="my-4 sm:my-6 text-sm sm:text-base text-gray-600">
                            {action === 'send' ? (
                                <>¿Está seguro de que desea <span className="font-semibold">enviar a comité</span> esta novedad?</>
                            ) : (
                                <>¿Está seguro de que desea <span className="font-semibold">{action === "deny" ? "denegar" : "aprobar"}</span> esta novedad? Esta acción no se puede deshacer.</>
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <button
                                onClick={cancelAction}
                                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`px-5 py-2.5 text-white rounded-lg transition-colors font-medium text-sm sm:text-base order-1 sm:order-2 ${action === "deny"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-darkGreen hover:bg-hoverGreen"
                                    }`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Viewer modal */}
            {typeof window !== 'undefined' && (
                <PDFViewer
                    pdfUrl={pdfUrlToShow}
                    isOpen={isPdfOpen}
                    onClose={() => setIsPdfOpen(false)}
                    title={`Documento Novedad ${formValues?.id ?? ''}`}
                />
            )}
        </div>
    );
};

export default FormRespondNovelty;
