import { DataLogin, Establecimiento, UserData, UserEmptyState, estabInitialState } from "@/core/models";
import { authService, getUserData, persistenceClear, setEstabs, setToken, setUserData } from "@/core/services";
import { SnackbarUtility } from "@/core/utilities";
import { create } from "zustand";



type AuthState = {
    loading: boolean
    successLogin: boolean
    user: UserData
    estabs: Array<Establecimiento>
    dataEstab: Establecimiento
    setDataEstab(estabs: Array<Establecimiento>, dataEstab: Establecimiento): void
    // login: (username: string, password: string) => void;
    logOut: () => void
}

export const useAuthStore = create<AuthState>((set) => (
    {
        loading: false,
        successLogin: false,
        user: getUserData() ? getUserData() : UserEmptyState,
        estabs: [],
        dataEstab: estabInitialState,
        setDataEstab(estabs, dataEstab) {
            set({
                estabs,
                dataEstab
            })
        },
        // login: (username: string, password: string) => {

        //     set(state => ({
        //         ...state,
        //         loading: true,
        //         successLogin: false,
        //     }))

        //     authService.login(username, password).then(response => {

        //         if (response.code === "0") {
        //             SnackbarUtility.warning(response.message);
        //         }
        //         if (response.code === "1") {
        //             SnackbarUtility.success("Inciando Sessión");
        //             const dataLogin = response.payload as DataLogin;
        //             const userData = dataLogin.userData[0];

        //             if (!userData?.jwtToken) return

        //             setToken(userData.jwtToken)
        //             setUserData(userData);
        //             setEstabs(JSON.parse(dataLogin.establecimientos));

        //             set(state => ({
        //                 ...state,
        //                 successLogin: true
        //             }))
        //         }

        //     }).finally(() => {
        //         set(state => ({
        //             ...state,
        //             loading: false,
        //             successLogin: false
        //         }))
        //     })
        // },
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


