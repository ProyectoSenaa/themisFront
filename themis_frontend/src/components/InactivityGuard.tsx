"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/features/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal/Modal";

// Configuración de tiempos
const TIMEOUT_MINUTES = 20;
const WARNING_MINUTES = 1;

const INACTIVITY_LIMIT = TIMEOUT_MINUTES * 60 * 1000;
const WARNING_LIMIT = (TIMEOUT_MINUTES - WARNING_MINUTES) * 60 * 1000;

export default function InactivityGuard({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [showWarning, setShowWarning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(WARNING_MINUTES * 60);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const warningIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const handleLogout = useCallback(() => {
        if (isAuthenticated) {
            console.log("💤 [InactivityGuard] Usuario inactivo, cerrando sesión...");
            setShowWarning(false);
            dispatch(logoutUser())
                .unwrap()
                .then(() => {
                    router.push("/auth/login");
                })
                .catch((err) => {
                    console.error("Error en auto-logout:", err);
                    router.push("/auth/login");
                });
        }
    }, [dispatch, isAuthenticated, router]);

    const showWarningModal = useCallback(() => {
        if (isAuthenticated) {
            setShowWarning(true);
            setRemainingSeconds(WARNING_MINUTES * 60);

            // Iniciar cuenta regresiva visual
            if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
            warningIntervalRef.current = setInterval(() => {
                setRemainingSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(warningIntervalRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [isAuthenticated]);

    const checkActivity = useCallback(() => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;

        if (timeSinceLastActivity >= INACTIVITY_LIMIT) {
            handleLogout();
        } else if (timeSinceLastActivity >= WARNING_LIMIT) {
            if (!showWarning) {
                showWarningModal();
            }
        }
    }, [handleLogout, showWarning, showWarningModal]);

    const handleActivity = useCallback(() => {
        // Si se muestra la advertencia, ignorar actividad general (mouse, scroll, etc)
        // El usuario DEBE hacer clic en el botón para mantener la sesión.
        if (showWarning) return;

        lastActivityRef.current = Date.now();
    }, [showWarning]);

    const handleKeepSession = useCallback(() => {
        console.log("✅ [InactivityGuard] Usuario decidió mantener sesión");
        setShowWarning(false);
        lastActivityRef.current = Date.now();
        if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Polling cada segundo para verificar tiempos
        const intervalId = setInterval(checkActivity, 1000);

        const events = [
            "mousedown",
            "mousemove",
            "keypress",
            "scroll",
            "touchstart",
            "click",
        ];

        // Agregar listeners para actividad general
        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            clearInterval(intervalId);
            if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [isAuthenticated, checkActivity, handleActivity]);

    return (
        <>
            {children}

            <Modal
                open={showWarning}
                onClose={() => { }} // No permitir cerrar haciendo click afuera
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">
                        Inactividad Detectada
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
                        Tu sesión expirará en <span className="font-bold text-red-500">{remainingSeconds}</span> segundos debido a inactividad.
                        Presiona el botón para continuar.
                    </p>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                            onClick={handleKeepSession}
                        >
                            Mantener Sesión
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
