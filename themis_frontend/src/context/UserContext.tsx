'use client';

import React, { createContext, useContext } from 'react';
import { UserContextType } from '@/types/user';

/**
 * Contexto de Usuario para compartir datos de autenticación
 * en toda la aplicación
 */
export const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Hook para usar el contexto de usuario
 */
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe usarse dentro de UserContext.Provider');
  }
  return context;
};

/**
 * Hook seguro que retorna null si no está disponible (para uso en SSR)
 */
export const useUserContextSafe = () => {
  return useContext(UserContext);
};
