import axios, { AxiosResponse } from 'axios';
import { normalizeRole } from '@/utils/roles';

const authBaseURL = 'http://localhost:8080/api/user';

class AuthService {
    async login(document: string, password: string, typeDocument: string): Promise<AxiosResponse<any>> {
        try {
            const response = await axios.post(`${authBaseURL}/login`, {
                document,
                password,
                typeDocument
            });

            if (response.data && response.data.data) {
                this.setUserData(response.data.data);
            }

            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Función auxiliar para verificar si estamos en el navegador
    private isBrowser(): boolean {
        return typeof window !== 'undefined';
    }

    setUserData(userData: any): void {
        if (!this.isBrowser()) return;

        if (userData) {
            // Normalizar y almacenar rol en la estructura del usuario
            const roleName = userData.roleList?.[0]?.name || userData.roles?.[0]?.name || userData.role;
            const normalized = normalizeRole(roleName);
            // asegurarse de que la copia almacenada tenga la propiedad `role`
            try {
                const toStore = { ...userData, role: normalized };
                localStorage.setItem('user', JSON.stringify(toStore));
            } catch (e) {
                localStorage.setItem('user', JSON.stringify(userData));
            }
            localStorage.setItem('userRole', normalized);
        }
    }

    getUser(): any {
        if (!this.isBrowser()) return null;

        // Primero intentar obtener de themis_auth (almacenamiento principal)
        const themisAuth = localStorage.getItem('themis_auth');
        if (themisAuth) {
            try {
                const parsed = JSON.parse(themisAuth);
                if (parsed.user) {
                    return parsed.user;
                }
            } catch (e) {
                // Continuar si hay error
            }
        }

        // Fallback a user antiguo
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getUserRole(): string | null {
        if (!this.isBrowser()) return null;

        // Primero intentar obtener del usuario en themis_auth
        const user = this.getUser();



        // Soportar ambos formatos: roleList y roles (Cerberos)
        const rolesList = user?.roleList || user?.roles;



        if (user && rolesList && rolesList.length > 0) {
            const mainRole = rolesList[0].name;
            const mappedRole = normalizeRole(mainRole);



            return mappedRole;
        }



        // Fallback a almacenamiento antiguo
        return localStorage.getItem('userRole');
    }

    hasRole(role: string): boolean {
        const user = this.getUser();

        // Soportar ambos formatos: roleList y roles (Cerberos)
        const rolesList = user?.roleList || user?.roles;

        if (!user || !rolesList) return false;

        return rolesList.some((userRole: any) =>
            normalizeRole(userRole.name) === normalizeRole(role));
    }

    logout(): void {
        if (!this.isBrowser()) return;
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('themis_auth');
        sessionStorage.removeItem('themis_auth');
        document.cookie = 'olympo_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    isAuthenticated(): boolean {
        return !!this.getUser();
    }

    private handleError(error: any): Promise<AxiosResponse<any>> {
        if (error.response) {

            return Promise.reject(new Error(error.response.data.message || 'Error en la solicitud'));
        } else if (error.request) {

            return Promise.reject(new Error('No se recibio respuesta del servidor'));
        } else {

            return Promise.reject(new Error(error.message));
        }
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance; 