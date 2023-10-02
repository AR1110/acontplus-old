
import { createAxiosClient } from "./createAxiosClient";

import jwt_decode from "jwt-decode";

function getCurrentAccessToken() {
    const cat = localStorage.getItem("ngStorage-currentUser");
    const objToken = JSON.parse(cat);
    return objToken.token;
    // this is how you access the zustand store outside of React.
    //return useAuthStore.getState().accessToken;
}

function getCurrentRefreshToken() {
    // this is how you access the zustand store outside of React.
    //return useAuthStore.getState().refreshToken;
}

function setRefreshedTokens(tokens) {
    console.log("set tokens...");
}

async function logout() {
    console.log("logout...");
}
//console.log(getCurrentAccessToken());
var decodedJwt = jwt_decode(getCurrentAccessToken());
//console.log(decodedJwt);

export const client = createAxiosClient({
    options: {
        baseURL: `${decodedJwt.urlGateway}/gateway/`,
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

export const clientFile = (url, parameters) => {
   return axios({
        url: `${decodedJwt.urlGateway}/gateway/` + url,
        method: 'POST',
        responseType: 'blob',
        data: parameters,
        headers: { 'Authorization': 'Bearer ' + getCurrentAccessToken() }
    })
};