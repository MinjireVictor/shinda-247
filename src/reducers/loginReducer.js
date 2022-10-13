import { LOGIN_TYPES } from "../App/types/login.types";


const INITIAL_STATE={
    loginClicked:false
}


export const LoginReducer=(state=INITIAL_STATE, action={})=>{
    const {type, payload}= action
    console.log("TYPE", type)
    switch(type){
        case LOGIN_TYPES.LOGIN_CLICKED:

        return {...state,loginClicked:true}
        case LOGIN_TYPES.LOGIN_CLOSED:

        return{...state,loginClicked:false}
        default:

        return state;
    }
}