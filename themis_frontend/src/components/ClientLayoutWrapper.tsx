'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { store, AppDispatch, RootState } from '@/redux/store';
import { loadAuthFromStorage } from '@/redux/features/authSlice';
import { UserContext } from '@/context/UserContext';
import { UserContextType, User, RoleType, CerberosUser } from '@/types/user';
import Loader from '@/app/components/Loader';
import { normalizeRole } from '@/utils/roles';

const CERBEROS_URL = process.env.NEXT_PUBLIC_CERBEROS_URL || 'http://localhost:3001';
const THEMIS_URL = process.env.NEXT_PUBLIC_THEMIS_URL || 'http://localhost:3000';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}


/**
 * Mapea el usuario de Cerberos al formato del contexto de Themis
 */
const mapCerberosUserToContextUser = (cerberosUser: CerberosUser | any): User => {
  const roleName = cerberosUser?.roles?.[0]?.name || 'aprendiz';

  return {
    id: parseInt(cerberosUser?.id || '0'),
    name: `${cerberosUser?.person?.name || ''} ${cerberosUser?.person?.lastname || ''}`
      .trim() || 'Usuario',
    email: cerberosUser?.person?.email || '',
    role: normalizeRole(roleName),
    document: cerberosUser?.person?.document,
    photo: cerberosUser?.person?.photo,
  };
};

/**
 * Componente interno que usa Redux (debe estar dentro del Provider)
 */
function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, loading, user: cerberosUser, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [checkCompleted, setCheckCompleted] = useState(false);

  // Rutas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/callback', '/auth/reset_password', '/auth/code_verification'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  /**
   * Cargar autenticación al montar el componente
   */
  useEffect(() => {
    const loadAuth = async () => {


      try {
        const result = await dispatch(loadAuthFromStorage()).unwrap();


        if (!result) {


          // Si no es ruta pública, redirigir a login
          if (!isPublicRoute) {

            const callbackUrl = `${THEMIS_URL}/auth/callback`;
            const loginUrl = `${CERBEROS_URL}/auth/login?project=themis&redirectUri=${encodeURIComponent(callbackUrl)}`;
            window.location.href = loginUrl;
          }
        }
      } catch (err) {


        if (!isPublicRoute) {
          const callbackUrl = `${THEMIS_URL}/auth/callback`;
          const loginUrl = `${CERBEROS_URL}/auth/login?project=themis&redirectUri=${encodeURIComponent(callbackUrl)}`;
          window.location.href = loginUrl;
        }
      } finally {
        setIsChecking(false);
        setCheckCompleted(true);
      }
    };

    // Timeout de seguridad
    const timeoutId = setTimeout(() => {

      setIsChecking(false);
      setCheckCompleted(true);
    }, 10000);

    loadAuth().finally(() => clearTimeout(timeoutId));
  }, [dispatch, isPublicRoute]);

  /**
   * Actualizar usuario cuando cambien los datos de Cerberos
   */
  useEffect(() => {


    if (cerberosUser) {
      const mappedUser = mapCerberosUserToContextUser(cerberosUser);

      setUser(mappedUser);
    }
  }, [cerberosUser]);

  /**
   * Actualizar usuario en el contexto
   */
  const loginUser = (userData: User) => {
    setUser({
      ...userData,
      role: normalizeRole(userData.role as string),
    });
  };

  /**
   * Cerrar sesión
   */
  const logoutUser = () => {
    setUser(null);
  };

  /**
   * Valor del contexto de usuario
   */
  const userContextValue: UserContextType = {
    user,
    setUser,
    isAuthenticated: !!user && isAuthenticated,
    role: user?.role ?? null,
    login: loginUser,
    logout: logoutUser,
  };

  // En rutas públicas, no mostrar loader
  if (isPublicRoute) {
    return (
      <UserContext.Provider value={userContextValue}>
        {children}
      </UserContext.Provider>
    );
  }

  // Mostrar loader mientras verifica autenticación
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600 font-semibold">Cargando sesión...</p>
          <p className="mt-2 text-gray-500 text-sm">Por favor espera mientras verificamos tu identidad</p>
          <p className="mt-4 text-xs text-blue-500">🔍 Abre la consola (F12) para ver detalles</p>
        </div>
      </div>
    );
  }

  // Si aún está comprobando después del timeout, mostrar error
  if (!checkCompleted && !isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-semibold">⏱️ Verificación en progreso...</p>
          <p className="mt-2 text-gray-500 text-sm">Redirigiendo a autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario y no es ruta pública, mostrar error
  if (!user || !isAuthenticated) {
    if (!isPublicRoute) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-600 font-semibold">Sesión no disponible</p>
            <p className="mt-2 text-gray-500 text-sm">Redirigiendo a autenticación...</p>
            {error && (
              <p className="mt-4 text-red-500 text-sm">
                Error: {typeof error === 'object' ? (error as any).message : 'Desconocido'}
              </p>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Wrapper principal que provee el store de Redux
 */
const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    </Provider>
  );
};

export default ClientLayoutWrapper;
export { mapCerberosUserToContextUser };
