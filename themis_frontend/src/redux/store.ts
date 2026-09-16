import { configureStore } from "@reduxjs/toolkit";
import noveltyReducer from "./features/noveltySlice";  
import noveltieTypeReducer from "./features/noveltieTypeSlice";
import cardNoveltieSlice from "./features/cardNoveltieTypeSlice";
import messageSlice from "./features/messageSlice";
import themeReduce from "./features/themeSlice";
import rolesSlice from "./features/rolesSlice";
import modalSlice from "./features/ModalSlice";
import loadingStateSlice from "./features/LoadingState";
import metadataReducer from "./features/metadataSlice";
import studentReducer from "./features/studentSlice";
// selectedRole slice removed
import authReducer from "./features/authSlice";

export const store = configureStore({
    reducer: {
        student: studentReducer,
        noveltieType: noveltieTypeReducer,
        selectedNovelty: noveltyReducer,
        cardNoveltieType: cardNoveltieSlice,
        message: messageSlice,
        theme: themeReduce,  
        roles: rolesSlice,
        modalOptions: modalSlice,
        loadingState: loadingStateSlice,
        metadata: metadataReducer
            ,
            auth: authReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
