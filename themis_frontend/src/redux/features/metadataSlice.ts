import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MetadataState {
  title: string;
  // You can add more metadata properties here if needed in the future
  // Such as description, keywords, etc.
}

const initialState: MetadataState = {
  title: 'Themis - SENA', // Default title
};

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    resetMetadata: (state) => {
      state.title = initialState.title;
    },
  },
});

export const { setTitle, resetMetadata } = metadataSlice.actions;
export default metadataSlice.reducer;