import { DataLogin, UserData, UserEmptyState } from "@/core/models";
import { AuthService } from "@/core/services";
import { SnackbarUtility } from "@/core/utilities"; 
import { create } from "zustand";

 

type AuthState = {
    loading: boolean
    successLogin: boolean
    user: UserData
    login: (username: string, password: string) => void;
    logOut: () => void
}

export const useAuthStore = create<AuthState>((set) => (
    {
        loading: false,
        successLogin: false,
        user: AuthService.getUser() ? AuthService.getUser() : UserEmptyState,
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

                    const userData = response.payload as DataLogin;

                    const jwtToken = userData.userData[0]?.jwtToken;

                    AuthService.setPersistent("ACCESS_TOKEN", jwtToken!);
                    AuthService.setPersistent("USER", JSON.stringify(userData)); 
                  
                    set(state => ({
                        ...state,
                        successLogin: true
                    }))
                }

            }).finally(() => {
                set(state => ({
                    ...state,
                    loading: false
                }))
            })
        },
        logOut: () => {
            AuthService.clearStorageToken();
            set(state => ({
                ...state,
                user: UserEmptyState
            }))
        }
    }
)

)


