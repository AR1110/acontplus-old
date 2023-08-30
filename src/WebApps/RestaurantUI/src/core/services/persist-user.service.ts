import { PERSIS_USER } from "../constants";
import { Establecimiento, UserData } from "../models"

//Token 
export const setToken = (token: string) => {
    localStorage.setItem(PERSIS_USER.auth_token, token);
}

export const getToken = () => {
    const auth_token = localStorage.getItem(PERSIS_USER.auth_token);
    return auth_token;
}

//User
export const setUserData = (userData: UserData)=>{
    localStorage.setItem(PERSIS_USER.user_data, JSON.stringify(userData))
}
export const getUserData = (): UserData =>{
    const userData = localStorage.getItem(PERSIS_USER.user_data);    
    return userData? JSON.parse(userData) : {}
}

//Estabs 
export const setEstabs = (estabs: Establecimiento[])=>{
    localStorage.setItem(PERSIS_USER.estabs, JSON.stringify(estabs));
}

export const getEstabs = (): Establecimiento[]=>{
    const estabs = localStorage.getItem(PERSIS_USER.estabs); 
    return estabs ? JSON.parse(estabs) : []
}

export const persistenceClear = ()=>{ 
    Object.keys(localStorage).forEach(function (key) {
        localStorage.removeItem(key);
    })
}