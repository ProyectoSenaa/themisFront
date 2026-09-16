import { createSlice } from "@reduxjs/toolkit";


const isLoading: boolean =  false;



const loadingStateSlice = createSlice({
    name:"loadingState",
    initialState: isLoading,
    reducers: {
        changeStateLoading: (state, action) => {
            

            return action.payload;
        }
    }
})



export const {changeStateLoading} = loadingStateSlice.actions;
export default loadingStateSlice.reducer;