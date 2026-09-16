'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Verificar si hay autenticación en localStorage
        if (typeof window !== 'undefined') {
            try {
                const authData = localStorage.getItem('themis_auth');
                if (authData) {
                    const parsed = JSON.parse(authData);
                    if (parsed.token && parsed.user) {
                        // Usuario autenticado → ir al dashboard
                        router.replace('/routes/home');
                        return;
                    }
                }
            } catch (e) {
                console.error('Error verificando autenticación:', e);
            }
        }

        router.replace('/auth/login');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-700">Cargando...</p>
        </div>
    );
}