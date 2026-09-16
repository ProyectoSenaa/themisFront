'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AuthService from '@/app/service/AuthService'

// Definición de roles disponibles
export enum UserRole {
  SUPER_ADMIN = 'SUPER ADMIN',
  ADMIN = 'ADMIN',
  APPRENTICE = 'APPRENTICE',
  INSTRUCTOR = 'INSTRUCTOR',
  COORDINATOR = 'COORDINATOR'
}

// Definición de permisos
export enum Permission {
  // Usuarios
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USER = 'CREATE_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',
  
  // Comités
  VIEW_COMMITTEES = 'VIEW_COMMITTEES',
  CREATE_COMMITTEE = 'CREATE_COMMITTEE',
  EDIT_COMMITTEE = 'EDIT_COMMITTEE',
  DELETE_COMMITTEE = 'DELETE_COMMITTEE',
  UPLOAD_BULK_COMMITTEES = 'UPLOAD_BULK_COMMITTEES',
  
  // Novedades
  VIEW_NOVELTIES = 'VIEW_NOVELTIES',
  CREATE_NOVELTY = 'CREATE_NOVELTY',
  EDIT_NOVELTY = 'EDIT_NOVELTY',
  DELETE_NOVELTY = 'DELETE_NOVELTY',
  APPROVE_NOVELTY = 'APPROVE_NOVELTY',
  
  // Reportes
  VIEW_REPORTS = 'VIEW_REPORTS',
  GENERATE_REPORTS = 'GENERATE_REPORTS',
  
  // Configuración
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  EDIT_SETTINGS = 'EDIT_SETTINGS',
  
  // Dashboard
  VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
  VIEW_USER_DASHBOARD = 'VIEW_USER_DASHBOARD'
}

// Mapeo de roles a permisos
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Todos los permisos
    Permission.VIEW_USERS, Permission.CREATE_USER, Permission.EDIT_USER, Permission.DELETE_USER,
    Permission.VIEW_COMMITTEES, Permission.CREATE_COMMITTEE, Permission.EDIT_COMMITTEE, Permission.DELETE_COMMITTEE, Permission.UPLOAD_BULK_COMMITTEES,
    Permission.VIEW_NOVELTIES, Permission.CREATE_NOVELTY, Permission.EDIT_NOVELTY, Permission.DELETE_NOVELTY, Permission.APPROVE_NOVELTY,
    Permission.VIEW_REPORTS, Permission.GENERATE_REPORTS,
    Permission.VIEW_SETTINGS, Permission.EDIT_SETTINGS,
    Permission.VIEW_ADMIN_DASHBOARD
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_USERS, Permission.CREATE_USER, Permission.EDIT_USER,
    Permission.VIEW_COMMITTEES, Permission.CREATE_COMMITTEE, Permission.EDIT_COMMITTEE, Permission.UPLOAD_BULK_COMMITTEES,
    Permission.VIEW_NOVELTIES, Permission.CREATE_NOVELTY, Permission.EDIT_NOVELTY, Permission.APPROVE_NOVELTY,
    Permission.VIEW_REPORTS, Permission.GENERATE_REPORTS,
    Permission.VIEW_ADMIN_DASHBOARD
  ],
  [UserRole.COORDINATOR]: [
    Permission.VIEW_COMMITTEES, Permission.CREATE_COMMITTEE, Permission.EDIT_COMMITTEE,
    Permission.VIEW_NOVELTIES, Permission.CREATE_NOVELTY, Permission.EDIT_NOVELTY, Permission.APPROVE_NOVELTY,
    Permission.VIEW_REPORTS,
    Permission.VIEW_USER_DASHBOARD
  ],
  [UserRole.INSTRUCTOR]: [
    Permission.VIEW_COMMITTEES,
    Permission.VIEW_NOVELTIES, Permission.CREATE_NOVELTY, Permission.EDIT_NOVELTY,
    Permission.VIEW_USER_DASHBOARD
  ],
  [UserRole.APPRENTICE]: [
    Permission.VIEW_NOVELTIES, Permission.CREATE_NOVELTY,
    Permission.VIEW_USER_DASHBOARD
  ]
}

// Interfaz del contexto
interface RoleContextType {
  userRole: UserRole | null
  userPermissions: Permission[]
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  isRole: (role: UserRole) => boolean
  isAnyRole: (roles: UserRole[]) => boolean
  refreshUserData: () => void
}

// Crear el contexto
const RoleContext = createContext<RoleContextType | undefined>(undefined)

// Props del provider
interface RoleProviderProps {
  children: ReactNode
}

// Provider del contexto
export function RoleProvider({ children }: RoleProviderProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userPermissions, setUserPermissions] = useState<Permission[]>([])

  // Función para refrescar datos del usuario
  const refreshUserData = () => {
    const user = AuthService.getUser()
    if (user && user.roleList && user.roleList.length > 0) {
      const role = user.roleList[0].name as UserRole
      setUserRole(role)
      setUserPermissions(rolePermissions[role] || [])
    } else {
      setUserRole(null)
      setUserPermissions([])
    }
  }

  // Cargar datos del usuario al inicializar
  useEffect(() => {
    refreshUserData()
  }, [])

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission)
  }

  // Función para verificar si el usuario tiene alguno de los permisos
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => userPermissions.includes(permission))
  }

  // Función para verificar si el usuario tiene todos los permisos
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => userPermissions.includes(permission))
  }

  // Función para verificar si el usuario tiene un rol específico
  const isRole = (role: UserRole): boolean => {
    return userRole === role
  }

  // Función para verificar si el usuario tiene alguno de los roles
  const isAnyRole = (roles: UserRole[]): boolean => {
    return userRole ? roles.includes(userRole) : false
  }

  const value: RoleContextType = {
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAnyRole,
    refreshUserData
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

// Hook personalizado para usar el contexto
export function useRole(): RoleContextType {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole debe ser usado dentro de un RoleProvider')
  }
  return context
}

// Hook personalizado para verificar permisos de manera más simple
export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRole()
  return { hasPermission, hasAnyPermission, hasAllPermissions }
}

// Hook personalizado para verificar roles
export function useRoles() {
  const { userRole, isRole, isAnyRole } = useRole()
  return { userRole, isRole, isAnyRole }
}
