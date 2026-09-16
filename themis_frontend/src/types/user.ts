/**
 * Tipos para el sistema de autenticación Themis
 */

export type RoleType = "instructor" | "coordinador" | "aprendiz" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  document?: string;
  photo?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  role: RoleType | null;
  login: (userData: User) => void;
  logout: () => void;
}

export interface CerberosUser {
  id: string;
  person: {
    name: string;
    lastname: string;
    email?: string;
    document?: string;
    photo?: string;
  };
  roles: Array<{ name: string }>;
  processDetails?: Array<{
    process: {
      functionName: string;
    };
  }>;
}
