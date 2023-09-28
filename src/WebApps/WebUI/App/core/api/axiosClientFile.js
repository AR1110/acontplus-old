import { createAxiosClient } from "./createAxiosClient";

import jwt_decode from "jwt-decode";

function getCurrentAccessToken() {
  const cat = localStorage.getItem("ngStorage-currentUser");
  const objToken = JSON.parse(cat);
  return objToken.token;
}

function getCurrentRefreshToken() {}

function setRefreshedTokens(tokens) {
  console.log("set tokens...");
}

async function logout() {
  console.log("logout...");
}

var decodedJwt = jwt_decode(getCurrentAccessToken());

export const uploadFile = createAxiosClient({
  options: {
    baseURL: `${decodedJwt.urlGateway}/gateway/`,
    timeout: 300000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  },
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl: null,
  logout,
  setRefreshedTokens,
});
