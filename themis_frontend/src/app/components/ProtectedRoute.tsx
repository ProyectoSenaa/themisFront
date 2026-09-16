'use client';

import LoadingScreen from './LoadingScreen';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface ProtectedRouteProps {
    children: React.ReactNode;
    loadingMessage?: string;
}

/**
 * Componente wrapper para proteger rutas que requieren autenticación
 * Espera a que Redux termine de cargar antes de renderizar el contenido
 */
export default function ProtectedRoute({
    children,
    loadingMessage
}: ProtectedRouteProps) {
    const { isChecking } = useAuthGuard();

    if (isChecking) {
        return <LoadingScreen message={loadingMessage} />;
    }

    return <>{children}</>;
}
