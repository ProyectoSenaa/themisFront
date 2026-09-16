import {Provider} from "react-redux";
import { store } from "./store";
import React from "react";

interface Props {
    children: React.ReactNode
}



export function Providers ({ children }: Props) {
    return <Provider store={store}>
        {children}
    </Provider>
    
}