"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCerberosData } from '@/redux/features/authSlice';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Obtener parámetros de la URL
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (!token) {
          throw new Error("No se encontró token en la URL");
        }



        let user = null;

        // Si viene el usuario en la URL, parsearlo
        if (userStr) {
          try {
            user = JSON.parse(decodeURIComponent(userStr));

          } catch (e) {

          }
        }

        // Si NO viene el usuario, validar el token con GraphQL
        if (!user) {

          const { validateCerberosToken } = await import('@/redux/features/authSlice');
          const result = await dispatch(validateCerberosToken(token)).unwrap();
          user = result.user;

        }

        const authData = { token, user };

        // Guardar token usando la función centralizada
        const { saveTokenToLocalStorage } = await import('@/lib/tokenPersistencie');
        saveTokenToLocalStorage(token, "callback");

        // Guardar datos completos del usuario
        localStorage.setItem("themis_auth", JSON.stringify(authData));
        sessionStorage.setItem("themis_auth", JSON.stringify(authData));


        // Actualizar Redux
        dispatch(setCerberosData(authData));


        // Esperar un momento para asegurar que todo se guardó
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verificar que se guardó correctamente
        const verificacion = localStorage.getItem("themis_auth");
        if (!verificacion) {
          throw new Error("Error guardando datos de autenticación");
        }



        // Redirigir al home/dashboard
        router.replace("/routes/home");

      } catch (err: any) {

        setError(err?.message || "Error de autenticación");

        // Limpiar cualquier dato corrupto
        localStorage.removeItem("themis_auth");
        sessionStorage.removeItem("themis_auth");

        // Redirigir de vuelta al login de Cerberos
        setTimeout(() => {
          const cerberosUrl = process.env.NEXT_PUBLIC_CERBEROS_URL || 'http://10.1.163.75:3001';
          window.location.href = `${cerberosUrl}/auth/login?project=Themis&error=auth_failed`;
        }, 1500);
      } finally {
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [searchParams, router, dispatch]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-bold text-lg mb-2 text-gray-800">Error de autenticación</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-4">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-green-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {isProcessing ? "Procesando autenticación..." : "¡Autenticado!"}
        </h2>
        <p className="text-gray-600">
          {isProcessing ? "Un momento por favor" : "Redirigiendo al sistema..."}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}