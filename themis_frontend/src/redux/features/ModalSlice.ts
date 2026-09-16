import { createSlice } from "@reduxjs/toolkit";
import modalProps from "@/app/interfaces/redux/ModalSlice/modalProps";


const initialState: modalProps = {
    modalVisible: false,
    addModalVisible: false,
    confirmUpdateModalVisible: false,
    itemToUpdateIndex: undefined,
    selectedItem: undefined,
    formValues: undefined
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        "isModalVisible": (state, action) => {
            state.modalVisible = action.payload.value;
        },
        "addItemToUpdateIndex": (state, action) => {
            state.itemToUpdateIndex = action.payload;
        },
        "addSelectedItem": (state, action) => {
            const {id, nameNovelty, noveltyState, description, procedureDescription, roles} = action.payload;

            const newObj = {
                id,
                nameNovelty,
                noveltyState,
                description,
                procedureDescription,
                roles
            }

            state.selectedItem = newObj;

        },
        "isAddModalVisible": (state, action) =>  {
            const {value} = action.payload;

            state.addModalVisible = value;
            
            if (!value) {
                state.formValues = undefined;
            }
        },
        "addFormValues": (state, action) => {
            const {id, nameNovelty, noveltyState, description, procedureDescription, roles} = action.payload;

            const newObj = {
                id, 
                nameNovelty,
                noveltyState,
                description,
                procedureDescription,
                roles
            }

            state.formValues = newObj;
        },
        "isConfirmUpdateModalVisible": (state, action) => {
            state.confirmUpdateModalVisible = action.payload;
            
            if (!action.payload) {
                state.itemToUpdateIndex = undefined;
            }
        }
    } 
})


export const {isModalVisible, isAddModalVisible, addItemToUpdateIndex, addSelectedItem, addFormValues, isConfirmUpdateModalVisible} = modalSlice.actions;
export default modalSlice.reducer;