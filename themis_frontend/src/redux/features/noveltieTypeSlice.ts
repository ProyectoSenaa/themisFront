import {
  GET_NOVELTYTYPES,
  ADD_NOVELTYTYPE,
  UPDATE_NOVELTYTYPE,
  DELETE_NOVELTYTYPE
} from "@/app/graphqlServices/noveltytypesGraphql";
//import client from "@/LIB/apollo-provider";
import client from "@/lib/apollo-provider";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NoveltyType {
  id: string | number;
  nameNovelty: string;
  noveltyState: boolean;
  description: string;
  procedureDescription: string;
  externalRoleIds: (string | number)[]; // match backend DTO for multi-role
}

interface SelectedNovelty {
  id: number;
  date: string;
  files: File[] | null;
  observations: string;
  status: boolean;
  noveltyType: string;
}

// Definición de la interfaz para errores
interface NoveltyTypeError {
  code?: string | number;
  message: string;
  details?: string;
  field?: string;
  timestamp?: string;
}

interface NoveltyTypeState {
  data: NoveltyType[];
  loading: boolean;
  error: NoveltyTypeError | null;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  selectedNovelty: SelectedNovelty;
}

interface ResponseError {
  code: string | number;
  message: string;
}

interface NoveltyTypeResponse {
  data: NoveltyType[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface AddNoveltyTypeResponse {
  code: string;
  message: string;
  id: string | number;
}

interface UpdateNoveltyTypeResponse {
  code: string;
  message: string;
}

interface DeleteNoveltyTypeResponse {
  code: string;
  message: string;
}

// Add pagination parameters interface
interface PaginationParams {
  page?: number;
  size?: number;
}

// Fetch novelty types
export const fetchNoveltyTypes = createAsyncThunk<
  NoveltyTypeResponse,
  PaginationParams | void,
  { rejectValue: ResponseError }
>(
  "noveltyTypes/fetchAll",
  async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_NOVELTYTYPES,
        fetchPolicy: "network-only"
      });

      // Verifica la estructura de la respuesta


      if (!data || !data.allNoveltyTypes) {

        throw new Error('No se recibieron datos de tipos de novedades');
      }

      // Asegurarse de que data.allNoveltyTypes.data sea un array
      const noveltyTypesData = Array.isArray(data.allNoveltyTypes.data)
        ? data.allNoveltyTypes.data
        : [];

      return {
        data: noveltyTypesData,
        totalItems: data.allNoveltyTypes.totalItems || 0,
        totalPages: data.allNoveltyTypes.totalPages || 0,
        currentPage: data.allNoveltyTypes.currentPage || 0
      };
    } catch (error: any) {

      return rejectWithValue({
        code: 500,
        message: error.message || 'Error al cargar los tipos de novedades'
      });
    }
  }
);

// Add novelty type
export const addNoveltyType = createAsyncThunk<
  { code: string; message: string; noveltyType: NoveltyType },
  NoveltyType,
  { rejectValue: ResponseError }
>(
  "noveltyTypes/add",
  async (noveltyType, { rejectWithValue }) => {
    try {
      // Adapt input for backend: use externalRoleIds array
      const input = {
        nameNovelty: noveltyType.nameNovelty,
        noveltyState: noveltyType.noveltyState,
        description: noveltyType.description,
        procedureDescription: noveltyType.procedureDescription,
        externalRoleIds: Array.isArray(noveltyType.externalRoleIds)
          ? noveltyType.externalRoleIds.map(id => typeof id === 'string' ? Number(id) : id)
          : []
      };
      const { data } = await client.mutate({
        mutation: ADD_NOVELTYTYPE,
        variables: { input },
      });
      if (!data || !data.addNoveltyType || data.addNoveltyType.code !== "200") {
        return rejectWithValue({
          code: data?.addNoveltyType?.code || "500",
          message: data?.addNoveltyType?.message || "Error al agregar el tipo de novedad",
        });
      }
      return {
        code: data.addNoveltyType.code,
        message: data.addNoveltyType.message,
        noveltyType: { ...noveltyType, id: data.addNoveltyType.id },
      };
    } catch (error: any) {
      return rejectWithValue({
        code: "500",
        message: error.message || "Error al agregar el tipo de novedad"
      });
    }
  }
);

// Update novelty type
interface UpdateNoveltyTypeParams {
  id: string | number;
  input: Partial<NoveltyType>;
}

export const updateNoveltyType = createAsyncThunk<
  { id: string | number; updated: Partial<NoveltyType>; code: string; message: string },
  UpdateNoveltyTypeParams,
  { rejectValue: ResponseError }
>(
  "noveltyTypes/update",
  async ({ id, input }, { rejectWithValue }) => {
    try {
      // Adapt input for backend: use externalRoleIds array
      const backendInput = {
        nameNovelty: input.nameNovelty,
        noveltyState: input.noveltyState,
        description: input.description,
        procedureDescription: input.procedureDescription,
        externalRoleIds: Array.isArray(input.externalRoleIds)
          ? input.externalRoleIds.map(id => typeof id === 'string' ? Number(id) : id)
          : []
      };
      const { data } = await client.mutate({
        mutation: UPDATE_NOVELTYTYPE,
        variables: { id, input: backendInput },
      });
      if (!data || !data.updateNoveltyType || data.updateNoveltyType.code !== "200") {
        return rejectWithValue({
          code: data?.updateNoveltyType?.code || "500",
          message: data?.updateNoveltyType?.message || "Error al actualizar el tipo de novedad",
        });
      }
      return {
        id,
        updated: input,
        code: data.updateNoveltyType.code,
        message: data.updateNoveltyType.message
      };
    } catch (error: any) {
      return rejectWithValue({
        code: "500",
        message: error.message || "Error al actualizar el tipo de novedad"
      });
    }
  }
);

// Delete novelty type
export const deleteNoveltyType = createAsyncThunk<
  { id: string | number; message: string; code: string },
  string | number,
  { rejectValue: ResponseError }
>(
  "noveltyTypes/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_NOVELTYTYPE,
        variables: { id },
      });

      if (!data || !data.deleteNoveltyType || data.deleteNoveltyType.code !== "200") {
        return rejectWithValue({
          code: data?.deleteNoveltyType?.code || "500",
          message: data?.deleteNoveltyType?.message || "Error al eliminar el tipo de novedad",
        });
      }

      return {
        id,
        message: data.deleteNoveltyType.message,
        code: data.deleteNoveltyType.code,
      };
    } catch (error: any) {

      return rejectWithValue({
        code: "500",
        message: error.message || "Error al eliminar el tipo de novedad"
      });
    }
  }
);

const initialState: NoveltyTypeState = {
  data: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalItems: 0,
  totalPages: 0,
  selectedNovelty: {
    id: 0,
    date: "",
    files: null,
    observations: "",
    status: false,
    noveltyType: ""
  }
};

const noveltyTypeSlice = createSlice({
  name: "noveltyTypes",
  initialState,
  reducers: {
    addNoveltie: (state, action: PayloadAction<SelectedNovelty>) => {
      state.selectedNovelty = action.payload;
    },
    addNoveltieId: (state, action: PayloadAction<number>) => {
      state.selectedNovelty.id = action.payload;
    },
    addObservations: (state, action: PayloadAction<string>) => {
      state.selectedNovelty.observations = action.payload;
    },
    // Añadir un reducer para actualizar manualmente los datos
    setNoveltyTypes: (state, action: PayloadAction<NoveltyType[]>) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch novelty types
      .addCase(fetchNoveltyTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoveltyTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;

      })
      .addCase(fetchNoveltyTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? { code: action.payload.code, message: action.payload.message }
          : { message: action.error.message || 'Error al cargar los tipos de novedades' };

      })

      // Add novelty type
      .addCase(addNoveltyType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNoveltyType.fulfilled, (state, action) => {
        state.data.push(action.payload.noveltyType);
        state.totalItems += 1;
        state.loading = false;

      })
      .addCase(addNoveltyType.rejected, (state, action) => {
        state.error = action.payload
          ? { code: action.payload.code, message: action.payload.message }
          : { message: action.error.message || 'Error desconocido' };
        state.loading = false;

      })

      // Update novelty type
      .addCase(updateNoveltyType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNoveltyType.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...action.payload.updated };

        } else {

        }
        state.loading = false;
      })
      .addCase(updateNoveltyType.rejected, (state, action) => {
        state.error = action.payload
          ? { code: action.payload.code, message: action.payload.message }
          : { message: action.error.message || 'Error desconocido' };
        state.loading = false;

      })

      // Delete novelty type
      .addCase(deleteNoveltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNoveltyType.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data.splice(index, 1);
          state.totalItems -= 1;

        } else {

        }
        state.loading = false;
      })
      .addCase(deleteNoveltyType.rejected, (state, action) => {
        state.error = action.payload
          ? { code: action.payload.code, message: action.payload.message }
          : { message: action.error.message || 'Error desconocido' };
        state.loading = false;

      });
  },
});

export const { addNoveltie, addNoveltieId, addObservations, setNoveltyTypes } = noveltyTypeSlice.actions;
export default noveltyTypeSlice.reducer;