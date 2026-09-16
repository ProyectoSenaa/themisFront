"use client";

import { useEffect, Suspense, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoader } from './LoaderContext';
import Loader from '../app/components/Loader';

function LoaderProviderContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { showLoader, hideLoader, isLoading } = useLoader();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Limpiar timeout anterior si existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        showLoader();

        // Solo mostrar loader durante la navegación inicial
        timeoutRef.current = setTimeout(() => {
            hideLoader();
        }, 1000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [pathname]);

    return (
        <>
            {isLoading && <Loader />}
            {children}
        </>
    );
}

export function LoaderProviderComponent({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<Loader />}>
            <LoaderProviderContent>{children}</LoaderProviderContent>
        </Suspense>
    );
}