import {createContext} from "react";

export const initialState = {
   email:'',
    type:''
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
        case "Sort Type":
            return {
                ...state,
                type:action.payload
            }


        default:return state
    }
}