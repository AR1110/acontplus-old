import { createAxiosClient } from "./createAxiosClient";
import jwt_decode from "jwt-decode";

function getCurrentAccessToken() {
    // const cat = localStorage.getItem("token");
    // const objToken = JSON.parse(cat);
    // return objToken.token; 
    //return useAuthStore.getState().accessToken;
    if (typeof window !== 'undefined') {
        return localStorage.getItem("token");
    }
}

function getCurrentRefreshToken() {
    // this is how you access the zustand store outside of React.
    //return useAuthStore.getState().refreshToken;
}

function setRefreshedTokens(tokens) {
    console.log("set tokens...");
    console.log(tokens)
}

async function logout() {
    console.log("logout...");
    if (typeof window !== 'undefined') {
        return localStorage.removeItem("token");
    }
}
function getGateway() {
    const decodedToken = Object.assign(jwt_decode(getCurrentAccessToken()));
    const { urlGateway } = decodedToken
    return urlGateway;
}

export const client = createAxiosClient({
    options: {
        baseURL: `${getGateway()}/gateway/`,
        timeout: 300000,
        headers: {
            "Content-Type": "application/json",
        },
    },
    getCurrentAccessToken,
    getCurrentRefreshToken,
    refreshTokenUrl: null,//refreshTokenUrl: REFRESH_TOKEN_URL,
    logout,
    setRefreshedTokens,
});