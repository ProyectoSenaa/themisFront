'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { validateCerberosToken, logoutUser } from '@/redux/features/authSlice';
import { useUserContextSafe } from '@/context/UserContext';
import { RoleType, CerberosUser } from '@/types/user';

/**
 * Hook principal para manejo de autenticación
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const userContext = useUserContextSafe();

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = useCallback(
    (roleName: RoleType): boolean => {
      if (!user?.roles) return false;
      return user.roles.some(
        (role: any) =>
          role.name.toLowerCase().includes(roleName.toLowerCase())
      );
    },
    [user]
  );

  /**
   * Verificar si el usuario tiene un proceso específico
   */
  const hasProcess = useCallback(
    (processName: string): boolean => {
      if (!user?.processDetails) return false;
      return user.processDetails.some(
        (detail: any) =>
          detail.process?.functionName
            ?.toLowerCase()
            .includes(processName.toLowerCase())
      );
    },
    [user]
  );

  /**
   * Validar token desde URL (después del redirect de Cerberos)
   */
  const validateTokenFromUrl = useCallback(async (token: string) => {
    try {
      console.log('🔐 [useAuth] Validando token de Cerberos...');
      const result = await dispatch(validateCerberosToken(token)).unwrap();
      console.log('✅ [useAuth] Token validado exitosamente');
      return result;
    } catch (err) {
      console.error('❌ [useAuth] Error validando token:', err);
      throw err;
    }
  }, [dispatch]);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      console.log('🔓 [useAuth] Cerrando sesión...');
      await dispatch(logoutUser()).unwrap();
      console.log('✅ [useAuth] Sesión cerrada');
      router.push('/auth/login');
    } catch (err) {
      console.error('❌ [useAuth] Error en logout:', err);
      router.push('/auth/login');
    }
  }, [dispatch, router]);

  /**
   * Obtener URL de login de Cerberos
   */
  const getCerberosLoginUrl = useCallback((): string => {
    const cerberosUrl = process.env.NEXT_PUBLIC_CERBEROS_URL || 'http://localhost:3001';
    const themisUrl = process.env.NEXT_PUBLIC_THEMIS_URL || 'http://localhost:3000';
    const callbackUrl = `${themisUrl}/auth/callback`;
    
    return `${cerberosUrl}/auth/login?project=themis&redirectUri=${encodeURIComponent(callbackUrl)}`;
  }, []);

  /**
   * Redirigir a login de Cerberos
   */
  const redirectToCerberosLogin = useCallback(() => {
    const loginUrl = getCerberosLoginUrl();
    window.location.href = loginUrl;
  }, [getCerberosLoginUrl]);

  return {
    // Estado
    user,
    isAuthenticated,
    token,
    loading,
    error,
    userContext,

    // Métodos
    hasRole,
    hasProcess,
    validateTokenFromUrl,
    logout,
    getCerberosLoginUrl,
    redirectToCerberosLogin,
  };
};

/**
 * Hook para monitorear cambios en la autenticación
 */
export const useAuthListener = (callback: (isAuth: boolean) => void) => {
  const { isAuthenticated } = useAuth();
  const [prevAuth, setPrevAuth] = useState<boolean | null>(null);

  useEffect(() => {
    if (prevAuth !== null && prevAuth !== isAuthenticated) {
      callback(isAuthenticated);
    }
    setPrevAuth(isAuthenticated);
  }, [isAuthenticated, callback, prevAuth]);
};
