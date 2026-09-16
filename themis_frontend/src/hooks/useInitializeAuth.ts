import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { loadAuthFromStorage } from '@/redux/features/authSlice';

/**
 * Hook para inicializar el estado de autenticación desde localStorage
 * Se ejecuta una sola vez cuando la app carga
 */
export const useInitializeAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Evitar ejecutar múltiples veces
    if (hasInitialized.current) return;

    // Solo ejecutar en cliente
    if (typeof window === 'undefined') {
      return;
    }

    try {

      dispatch(loadAuthFromStorage());
      hasInitialized.current = true;
    } catch (error) {
      console.error('Error al inicializar auth:', error);
      hasInitialized.current = true;
    }
  }, [dispatch]);
};
