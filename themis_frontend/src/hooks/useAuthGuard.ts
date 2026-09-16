import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

/**
 * Hook para proteger rutas que requieren autenticación
 * Espera a que Redux termine de cargar antes de verificar
 */
export const useAuthGuard = () => {
    const router = useRouter();
    const { isAuthenticated, loading, token } = useSelector((state: RootState) => state.auth);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Solo verificar cuando Redux haya terminado de cargar
        if (!loading) {


            if (!isAuthenticated || !token) {

                router.replace('/auth/login');
            } else {

                setIsChecking(false);
            }
        }
    }, [isAuthenticated, loading, token, router]);

    return { isChecking: loading || isChecking, isAuthenticated };
};
