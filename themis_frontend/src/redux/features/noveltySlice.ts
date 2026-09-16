import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import client from "@/lib/apollo-provider";
import { GET_NOVELTY, GET_NOVELTY_BY_ID, ADD_NOVELTY, UPDATE_NOVELTY, DELETE_NOVELTY } from '@/app/graphqlServices/noveltyGraphql';

// Interfaces
interface Novelty {
  id: string;
  noveltyType: {
    id: string;
    nameNovelty: string;
  };
  student: {
    id: string;
    studentStudySheets: Array<{
      studySheet: {
        number: string;
        trainingProject: {
          program: {
            id: string;
            name: string;
          };
        };
      };
    }>;
    person: {
      id: string;
      name: string;
      document: string;
    };
  };
}

interface NoveltyState {
  selectedId: string | null;
  novelties: Novelty[];
  selectedNovelty: any | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: NoveltyState = {
  selectedId: null,
  novelties: [],
  selectedNovelty: null,
  loading: false,
  error: null,
};


export const fetchNoveltyById = createAsyncThunk(
  'novelties/fetchNoveltyById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_NOVELTY_BY_ID,
        variables: { id },
        fetchPolicy: 'no-cache',
      });
      return data.noveltyById;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunks
export const fetchNovelties = createAsyncThunk(
  'novelties/fetchNovelties',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_NOVELTY,
        variables: { page, size },
        fetchPolicy: 'cache-first',
      });
      return data.allNovelties.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const addNovelty = createAsyncThunk(
  'novelties/addNovelty',
  async (input: any, { rejectWithValue }) => {
    try {
  const { data } = await client.mutate({
        mutation: ADD_NOVELTY,
        variables: { input },
      });
      return data.addNovelty;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNovelty = createAsyncThunk(
  'novelties/updateNovelty',
  async ({ id, input }: { id: string; input: any }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_NOVELTY,
        variables: { id, input },
      });
      return data.updateNovelty;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNovelty = createAsyncThunk(
  'novelties/deleteNovelty',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_NOVELTY,
        variables: { id },
      });
      return data.deleteNovelty;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const noveltySlice = createSlice({
  name: 'novelties',
  initialState,
  reducers: {
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNovelties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNovelties.fulfilled, (state, action: PayloadAction<Novelty[]>) => {
        state.loading = false;
        state.novelties = action.payload;
      })
      .addCase(fetchNovelties.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNovelty.fulfilled, (state, action: PayloadAction<Novelty>) => {
        state.novelties.push(action.payload);
      })
      .addCase(updateNovelty.fulfilled, (state, action: PayloadAction<Novelty>) => {
        const index = state.novelties.findIndex((novelty) => novelty.id === action.payload.id);
        if (index !== -1) {
          state.novelties[index] = action.payload;
        }
      })
      .addCase(deleteNovelty.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.novelties = state.novelties.filter((novelty) => novelty.id !== action.payload.id);
      });

    // handlers for fetchNoveltyById
    builder
      .addCase(fetchNoveltyById.pending, (state) => {
        state.selectedNovelty = null;
      })
      .addCase(fetchNoveltyById.fulfilled, (state, action: PayloadAction<any>) => {
        state.selectedNovelty = action.payload;
      })
      .addCase(fetchNoveltyById.rejected, (state, action: PayloadAction<any>) => {
        state.selectedNovelty = null;
        state.error = action.payload;
      });
  },
});

export const { setSelectedId } = noveltySlice.actions;

export default noveltySlice.reducer;