import React from "react";
import { HiHome, HiUserGroup, HiNewspaper, HiDocumentText, HiDocument, HiCollection, HiOutlineUser, HiOutlineReply, HiCog, HiSearch } from "react-icons/hi";
import { RoleType } from '@/types/user';
import { normalizeRole } from '@/utils/roles';

export interface MenuItemType {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  section: 'principal' | 'gestion';
}

// Configuración de menús por rol
export const roleMenus: Record<RoleType, MenuItemType[]> = {
  ['coordinador']: [
    // Sección Principal
    { name: "Inicio", href: "/routes/home", icon: HiHome, section: "principal" },
    { name: "Registrar Novedades", href: "/routes/novelties", icon: HiNewspaper, section: "principal" },
    { name: "Responder Novedades", href: "/routes/novelties_response", icon: HiOutlineReply, section: "principal" },
    { name: "Estado Novedades", href: "/routes/novel_state", icon: HiDocumentText, section: "principal" },
    { name: "Seguimiento de Casos Reportados", href: "/routes/coordinator_case_tracking", icon: HiSearch, section: "principal" },
    { name: "Reporte de novedades", href: "/routes/reports", icon: HiDocument, section: "principal" },

    // Sección Gestión

    { name: "Comité", href: "/routes/committee", icon: HiCollection, section: "gestion" }
  ],

  ['instructor']: [
    // Sección Principal
    { name: "Inicio", href: "/routes/home", icon: HiHome, section: "principal" },
    { name: "Registrar Novedades", href: "/routes/novelties", icon: HiNewspaper, section: "principal" },
    { name: "Estado Novedades", href: "/routes/novel_state", icon: HiDocumentText, section: "principal" },
    { name: "Seguimiento de casos", href: "/routes/case_tracking", icon: HiSearch, section: "principal" },

    // Sección Gestión
    { name: "Comité", href: "/routes/committee", icon: HiCollection, section: "gestion" }
  ],

  ['aprendiz']: [
    // Sección Principal
    { name: "Inicio", href: "/routes/home", icon: HiHome, section: "principal" },
    { name: "Registrar Novedades", href: "/routes/novelties", icon: HiNewspaper, section: "principal" },
    { name: "Estado Novedades", href: "/routes/novel_state", icon: HiDocumentText, section: "principal" },
    { name: "Mis Casos de Seguimiento", href: "/routes/student_case_tracking", icon: HiSearch, section: "principal" },

    // Sección Gestión
    { name: "Mis Comités", href: "/routes/student-committees", icon: HiUserGroup, section: "gestion" }
  ],

  ['admin']: [
    // Sección Principal
    { name: "Inicio", href: "/routes/home", icon: HiHome, section: "principal" },
    { name: "Registrar Novedades", href: "/routes/novelties", icon: HiNewspaper, section: "principal" },
    { name: "Responder Novedades", href: "/routes/novelties_response", icon: HiOutlineReply, section: "principal" },
    { name: "Estado Novedades", href: "/routes/novel_state", icon: HiDocumentText, section: "principal" },
    { name: "Seguimiento de Casos Reportados", href: "/routes/coordinator_case_tracking", icon: HiSearch, section: "principal" },
    { name: "Reporte de novedades", href: "/routes/reports", icon: HiDocument, section: "principal" },

    // Sección Gestión
    { name: "Comité", href: "/routes/committee", icon: HiCollection, section: "gestion" }
  ]
};

// Función helper para obtener menús por sección
export const getMenusBySection = (role: RoleType | string | undefined, section: 'principal' | 'gestion'): MenuItemType[] => {
  const normalized = normalizeRole(role as string);
  const menus = roleMenus[normalized] || roleMenus['coordinador'];
  return menus.filter(menu => menu.section === section);
};

// Función helper para obtener todos los menús de un rol
export const getMenusByRole = (role: RoleType | string | undefined): MenuItemType[] => {
  const normalized = normalizeRole(role as string);
  return roleMenus[normalized] || roleMenus['coordinador'];
};
