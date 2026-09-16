import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import client from "@/app/../lib/apollo-provider";
import { normalizeRole } from '@/utils/roles';
import { GET_AUTH_TOKEN, LOGOUT } from "@/app/graphqlServices/Cerveros_Login/authGraph";
import { decrypt, encrypt } from "@/lib/tokenPersistencie";

interface AuthData {
  token: string;
  user: any;
}

interface AuthError {
  code: string | number;
  message: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
  error: AuthError | null;
}

export const loadAuthFromStorage = createAsyncThunk<
  AuthData | null,
  void,
  { rejectValue: AuthError }
>(
  "auth/loadAuthFromStorage",
  async (_, { rejectWithValue }) => {
    try {


      // Primero intentar localStorage
      const localDataEncrypted = localStorage.getItem("themis_auth");
      if (localDataEncrypted) {
        try {

          const localData = decrypt(localDataEncrypted);
          const authData: AuthData = JSON.parse(localData);

          return authData;
        } catch (e) {
          // Fallback por si estaba en texto plano
          try {
            const authData: AuthData = JSON.parse(localDataEncrypted);
            return authData;
          } catch (e2) {
            console.warn("Error parsing auth data", e2);
          }
        }
      }

      // Fallback: intentar sessionStorage
      const sessionData = sessionStorage.getItem("themis_auth");
      if (sessionData) {
        const authData: AuthData = JSON.parse(sessionData);

        // Guardar encriptado en localStorage
        localStorage.setItem("themis_auth", encrypt(sessionData));
        return authData;
      }


      return null;
    } catch (error) {

      return rejectWithValue({
        code: 500,
        message: "Error loading authentication",
      });
    }
  }
);

// Validar token (solo para fallback en callback)
export const validateCerberosToken = createAsyncThunk<
  AuthData,
  string,
  { rejectValue: AuthError }
>(
  "auth/validateCerberosToken",
  async (token: string, { rejectWithValue }) => {
    try {

      const { data } = await client.mutate({
        mutation: GET_AUTH_TOKEN,
        variables: { token },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      if (data.getAuthToken.code !== "200") {
        return rejectWithValue({
          code: data.getAuthToken.code,
          message: data.getAuthToken.message,
        });
      }

      const authData: AuthData = {
        token: data.getAuthToken.token,
        user: data.getAuthToken.user,
      };



      // Guardar encriptado
      localStorage.setItem("themis_auth", encrypt(JSON.stringify(authData)));
      sessionStorage.setItem("themis_auth", JSON.stringify(authData));

      return authData;
    } catch (error) {

      return rejectWithValue({
        code: 500,
        message: (error as Error).message,
      });
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk<
  any,
  void,
  { rejectValue: AuthError; state: { auth: AuthState } }
>(
  "auth/logout",
  async (_, { getState, rejectWithValue }: any) => {
    try {
      const { auth } = getState();
      const { data } = await client.mutate({
        mutation: LOGOUT,
        variables: {
          idUser: auth.user?.id,
          token: auth.token,
        },
      });

      localStorage.removeItem("themis_auth");
      sessionStorage.removeItem("themis_auth");

      return data.logout;
    } catch (error) {
      localStorage.removeItem("themis_auth");
      sessionStorage.removeItem("themis_auth");
      return rejectWithValue({
        code: 500,
        message: (error as Error).message,
      });
    }
  }
);

// ============================================
// SLICE
// ============================================

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token: null,
    user: null,
    loading: true,
    error: null,
  } as AuthState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Acción para actualizar desde callback de Cerberos
    setCerberosData: (state, action: PayloadAction<AuthData>) => {

      // Normalizar rol antes de guardar en el estado
      try {
        const roleName = action.payload.user?.roles?.[0]?.name || action.payload.user?.role || action.payload.user?.roleList?.[0]?.name;
        action.payload.user.role = normalizeRole(roleName);
      } catch (e) {
        // ignore
      }

      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      state.loading = false;
    },
    clearAuth: (state) => {


      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;

      localStorage.removeItem("themis_auth");
      sessionStorage.removeItem("themis_auth");
    },
  },
  extraReducers: (builder) => {
    builder
      // loadAuthFromStorage
      .addCase(loadAuthFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAuthFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          // Asegurar rol normalizado si viene almacenado
          try {
            const roleName = action.payload.user?.roles?.[0]?.name || action.payload.user?.role || action.payload.user?.roleList?.[0]?.name;
            action.payload.user.role = normalizeRole(roleName);
          } catch (e) { }
          state.user = action.payload.user;
        }
      })
      .addCase(loadAuthFromStorage.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // validateCerberosToken
      .addCase(validateCerberosToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateCerberosToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        try {
          const roleName = action.payload.user?.roles?.[0]?.name || action.payload.user?.role || action.payload.user?.roleList?.[0]?.name;
          action.payload.user.role = normalizeRole(roleName);
        } catch (e) { }
        state.user = action.payload.user;
      })
      .addCase(validateCerberosToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { clearError, setCerberosData, clearAuth } = authSlice.actions;
export default authSlice.reducer;
