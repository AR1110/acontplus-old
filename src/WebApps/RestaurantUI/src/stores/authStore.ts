import { DataLogin, Establecimiento, UserData, UserEmptyState } from "@/core/models";
import { AuthService, getEstabs, getUsetData, persistenceClear, setEstabs, setToken, setUserData } from "@/core/services";
import { SnackbarUtility } from "@/core/utilities"; 
import { create } from "zustand";

 

type AuthState = {
    loading: boolean
    successLogin: boolean
    user: UserData
    estabs: Array<Establecimiento>
    login: (username: string, password: string) => void;
    logOut: () => void
}

export const useAuthStore = create<AuthState>((set) => (
    {
        loading: false,
        successLogin: false,
        user: getUsetData() ? getUsetData() : UserEmptyState,
        estabs: getEstabs() ? getEstabs() : [],
        
        login:  (username: string, password: string) => {
            
            set(state => ({
                ...state,
                loading: true,
                successLogin: false,
            }))

            AuthService.login(username, password).then(response => {

                if (response.code === "0") {
                    SnackbarUtility.warning(response.message);
                }
                if (response.code === "1") {                   
                    SnackbarUtility.success("Inciando Sessión"); 
                    const dataLogin = response.payload as DataLogin;                    
                    const userData = dataLogin.userData[0];

                    if(!userData?.jwtToken) return
                  
                    setToken(userData.jwtToken)
                    setUserData(userData);
                    setEstabs(JSON.parse(dataLogin.establecimientos)) 
                    set(state => ({
                        ...state,
                        successLogin: true
                    }))
                }

            }).finally(() => {
                set(state => ({
                    ...state,
                    loading: false,
                    successLogin: false
                }))
            })
        },
        logOut: () => {  
            persistenceClear()
            set(state => ({
                ...state,
                user: UserEmptyState
            }))
            
        }
    }
)

)


