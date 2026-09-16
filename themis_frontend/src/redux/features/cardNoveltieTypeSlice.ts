import { createSlice } from "@reduxjs/toolkit";
import INoveltyType from "@/app/interfaces/components_interfaces/CardA_&_CardSA/INoveltyType";
import IRole from "@/app/interfaces/components_interfaces/CardA_&_CardSA/IRole";

type typeInitialState = INoveltyType | INoveltyType[];


const initialState: typeInitialState = [];


const cardNoveltieSlice = createSlice({
    name: "card",
    initialState,
    reducers: {
        addNoveltieType: (state, action) => {
            return [...state, ...action.payload];
        },
        noveltieForm: (state, action) => {
            return [...state, ...action.payload];
        },
        setNovelties: (state, action) => {
            // Reemplaza el estado completo con la carga proporcionada
            return action.payload;
        }
    }
})


export const { addNoveltieType, noveltieForm, setNovelties } = cardNoveltieSlice.actions;
export default cardNoveltieSlice.reducer;