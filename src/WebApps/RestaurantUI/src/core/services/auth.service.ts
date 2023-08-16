import { Http } from "@/core/utilities";
import { ApiResponse } from "../models";

const login = async (username: string, password: string): Promise<ApiResponse> => {
  const response = await Http({
    method: "post",
    url: "account/login",
    data: {
      username,
      password,
      external: true,
    },
  });
  return response.data;
};

const setPersistent = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

const getToken = function (): string | null {
  return localStorage.getItem("ACCESS_TOKEN");
};
const getUser = function () {
  const user = localStorage.getItem("USER");
  return user ? JSON.parse(user) : null;
};

const decodeToken = function () {
  const token = getToken();
  if (!token) {
    return null;
  }
  const tokenToAtob = token.split(".");
  if(!tokenToAtob) return null;

  const object = JSON.parse(tokenToAtob[1]!);
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
  setPersistent,
  getToken,
  getUser,
  decodeToken,
  isTokenExpired,
  clearStorageToken,
};
