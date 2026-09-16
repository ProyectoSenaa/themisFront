import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import IRole from "../../app/interfaces/components_interfaces/CardA_&_CardSA/IRole";
import chaosClient from "../../lib/apollo-provider";
import { GET_ROLES } from "../../app/graphqlServices/rolGraphql";

interface RoleState {
  allRoles: IRole[];
  selectedRoles: string[];
  loading: boolean;
  error: string | null;
}

// Modificar el estado inicial
const initialState: RoleState = {
  allRoles: [],
  selectedRoles: [],
  loading: false,
  error: null
};

// Thunk para obtener roles desde GraphQL a través del túnel Cloudflare
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (params: { roleName?: string, page?: number, size?: number } = {}, thunkAPI) => {
    try {

      const { data } = await chaosClient.query({
        query: GET_ROLES,
        variables: {
          roleName: params.roleName || null,
          page: params.page || 0,
          size: params.size || 10
        },
        fetchPolicy: "network-only" // Asegura datos frescos
      });



      // Corregir la ruta de acceso a los datos
      if (!data || !data.allRoles || !data.allRoles.data) {
        throw new Error('No se recibieron datos de roles');
      }
      // Adaptar los roles para asegurar que tengan un id único
      const adaptedRoles = data.allRoles.data.map((role: any, idx: number) => ({
        ...role,
        id: role.id ?? idx // Si no hay id, asigna el índice como id temporal
      }));

      return adaptedRoles;
    } catch (error: any) {

      return thunkAPI.rejectWithValue(error.message || 'Error al cargar roles');
    }
  }
);

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearRoles: (state) => {
      state.selectedRoles = [];
    },
    selectedRolesForm: (state, action: PayloadAction<string[]>) => {
      state.selectedRoles = action.payload;
    },
    // Añadir un reducer para actualizar manualmente los roles
    setRoles: (state, action: PayloadAction<IRole[]>) => {
      state.allRoles = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;

        // Elimina duplicados usando Set
        const uniqueRolesMap = new Map();
        if (Array.isArray(action.payload)) {
          action.payload.forEach((role: IRole) => {
            if (!uniqueRolesMap.has(role.id)) {
              uniqueRolesMap.set(role.id, role);
            }
          });
          state.allRoles = Array.from(uniqueRolesMap.values());
        } else {

          state.allRoles = [];
        }


      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar roles';

      });
  }
});

export const { clearRoles, selectedRolesForm, setRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
