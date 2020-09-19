import {createContext} from "react";

export const initialState = {
   email:''
}

export const Context = createContext(initialState);

export const reducer = (state,action)=>{
    switch (action.type){
        case "Login":
            return {
                ...state,
               email:action.payload.email,
                darkMode:action.payload.mode
            }
        case "Exit":
            return {
                ...state,
                logged: false
            }
        case "Toggle mode":
            return {
                ...state,
                darkMode:!state.darkMode
            }
        default:return state
    }
}