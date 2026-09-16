
export interface AuthData {
  token: string;
  timestamp: number;
  user:
  {
    id: string;

    person: {
      name: string;
      lastname: string;
      document: string;
    };
    roles: Array<{ name: string }>;
  };
  source: string;
}


// Clave simple para ofuscación (no es seguridad de grado militar, pero evita lectura directa)
const OBFUSCATION_KEY = "THEMIS_SECURE_TOKEN_KEY_2025";

export const encrypt = (text: string): string => {
  try {
    if (!text) return text;
    // Simple XOR cipher
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length));
    }
    // Convert to Base64 to make it safe for storage and look like a "hash"
    return btoa(result);
  } catch (e) {

    return text;
  }
};

export const decrypt = (text: string): string => {
  try {
    if (!text) return text;
    // Decode Base64
    const input = atob(text);
    let result = "";
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(input.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length));
    }
    return result;
  } catch (e) {
    // If decryption fails (e.g. old plain text token), return original
    return text;
  }
};

export const saveTokenToLocalStorage = (token: string, source: string = "manual"): boolean => {
  try {


    // Guardar token directo (siempre) - ENCRIPTADO
    localStorage.setItem("themis_token", encrypt(token));

    // Guardar en formato completo (solo si no existe ya)
    const existing = localStorage.getItem("themis_auth");
    if (!existing) {
      const authData: AuthData = {
        token,
        timestamp: Date.now(),
        user: {
          id: "temp",
          person: {
            name: "Usuario",
            lastname: "Temporal",
            document: "",
          },
          roles: [{ name: "Usuario" }],
        },
        source,
      };
      // Encriptamos todo el objeto JSON para mayor seguridad visual
      localStorage.setItem("themis_auth", encrypt(JSON.stringify(authData)));
    }

    localStorage.setItem("themis_auth_timestamp", Date.now().toString());


    return true;
  } catch (error) {

    return false;
  }
};

export const getTokenFromStorage = (): string | null => {
  try {


    // Primero intentar obtener de themis_auth
    const authDataEncrypted = localStorage.getItem("themis_auth");

    if (authDataEncrypted) {
      try {
        // Intentar desencriptar
        const authDataJson = decrypt(authDataEncrypted);
        const parsed = JSON.parse(authDataJson);
        if (parsed.token) {

          return parsed.token;
        }
      } catch (e) {
        // Fallback por si estaba en texto plano (migración)
        try {
          const parsed = JSON.parse(authDataEncrypted);
          if (parsed.token) return parsed.token;
        } catch (e2) {

        }
      }
    }

    const tokenEncrypted = localStorage.getItem("themis_token");
    if (tokenEncrypted) {

      return decrypt(tokenEncrypted);
    }


    return null;
  } catch (error) {

    return null;
  }
};

export const verifyTokenInStorage = (): boolean => {
  try {
    const token = getTokenFromStorage();
    const hasAuth = !!localStorage.getItem("themis_auth"); // Check existence only
    const hasToken = !!localStorage.getItem("themis_token");

    const isValid = token !== null && (hasAuth || hasToken);



    return isValid;
  } catch (error) {

    return false;
  }
};

export const clearTokenFromStorage = (): void => {
  try {

    localStorage.removeItem("themis_token");
    localStorage.removeItem("themis_auth");
    localStorage.removeItem("themis_auth_timestamp");
    sessionStorage.removeItem("themis_token");

  } catch (error) {

  }
};

/**
 * Obtener datos completos de autenticación del storage
 */
export const getAuthDataFromStorage = (): AuthData | null => {
  try {
    const authDataEncrypted = localStorage.getItem("themis_auth");
    if (authDataEncrypted) {
      try {
        return JSON.parse(decrypt(authDataEncrypted));
      } catch (e) {
        // Fallback plain text
        return JSON.parse(authDataEncrypted);
      }
    }
    return null;
  } catch (error) {

    return null;
  }
};

/**
 * Verificar si el token es válido
 */
export const isTokenValid = (): boolean => {
  const token = getTokenFromStorage();
  if (!token) return false;

  // Token debe tener longitud mínima (típicamente JWT tiene 100+ caracteres)
  if (token.length < 50) {

    return false;
  }

  return true;
};

/**
 * Verificar edad del token
 */
export const getTokenAge = (): number | null => {
  try {
    const timestamp = localStorage.getItem("themis_auth_timestamp");
    if (!timestamp) return null;

    const age = Date.now() - parseInt(timestamp);

    return age;
  } catch (error) {

    return null;
  }
};

/**
 * Debug: mostrar estado completo de storage
 */
export const debugStorageState = (): void => {

};
