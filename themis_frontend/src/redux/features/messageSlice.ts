import { createSlice } from "@reduxjs/toolkit";
import IAlertProps from "@/app/interfaces/components_interfaces/Alert/IAlertProps";

const initialState:IAlertProps = {message: "", type: "", duration: 0}


const messageSlice = createSlice({
    name: "message",
    initialState: initialState,
    reducers: {
        "createAlert": (state, action) => {
            const {message, type, duration} = action.payload;

            state.message = message;
            state.type = type;
            state.duration = duration;
        }
    }
})



export const {createAlert} = messageSlice.actions;
export default messageSlice.reducer;