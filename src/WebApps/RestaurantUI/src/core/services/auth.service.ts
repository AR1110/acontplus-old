import { Http } from "@/core/utilities";
import { ApiResponse } from "../models";
import { PERSIS_USER, PATHS } from "../constants";

const login = async (username: string, password: string): Promise<ApiResponse> => {
  const response = await Http({
    method: "post",
    url: PATHS.ACCOUNT,
    data: {
      username,
      password,
      external: true,
    },
  });
  return response.data;
};
 

const getToken = function (): string | null {
  return localStorage.getItem(PERSIS_USER.auth_token);
};
 

const decodeToken = function () {
  const token = getToken();
  if (!token) {
    return null;
  }
 
  const tokenToAtob = token.split(".");
  if(!tokenToAtob) return null;

  const object = JSON.parse(atob(tokenToAtob[1]!));
  return object;
};

//Verificamos si el token es expirado
const isTokenExpired = function () {
  const token = decodeToken();
  if (!token) {
    return true;
  }

  if (token?.exp * 1000 < new Date().getTime()) {
    return true;
  }
  return false;
};

const clearStorageToken = () => {
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("USER");
};

export const AuthService = {
  login, 
  getToken, 
  decodeToken,
  isTokenExpired,
  clearStorageToken,
};
