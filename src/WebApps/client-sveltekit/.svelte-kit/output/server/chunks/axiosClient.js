import axios from "axios";
import jwt_decode from "jwt-decode";
function createAxiosClient({
  options,
  getCurrentAccessToken: getCurrentAccessToken2,
  getCurrentRefreshToken: getCurrentRefreshToken2,
  refreshTokenUrl = null,
  logout: logout2,
  setRefreshedTokens: setRefreshedTokens2
}) {
  const client2 = axios.create(options);
  client2.interceptors.request.use(
    (config) => {
      if (config.authorization !== false) {
        const token = getCurrentAccessToken2();
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  client2.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const originalRequest = error.config;
      originalRequest.headers = JSON.parse(
        JSON.stringify(originalRequest.headers || {})
      );
      const refreshToken = getCurrentRefreshToken2();
      const handleError = (error2) => {
        logout2();
        return Promise.reject(error2);
      };
      if (refreshToken && error.response?.status === 401 && error.response.data.message === "TokenExpiredError" && originalRequest?.url !== refreshTokenUrl && originalRequest?._retry !== true) {
        let isRefreshing;
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            console.log(resolve);
            console.log(reject);
          }).then(() => {
            return client2(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }
        isRefreshing = true;
        originalRequest._retry = true;
        return client2.post(refreshTokenUrl, {
          refreshToken
        }).then((res) => {
          const tokens = {
            accessToken: res.data?.accessToken,
            refreshToken: res.data?.refreshToken
          };
          setRefreshedTokens2(tokens);
          return client2(originalRequest);
        }, handleError).finally(() => {
          isRefreshing = false;
        });
      }
      if (error.response?.status === 401 && error.response?.data?.message === "TokenExpiredError") {
        console.log(error);
        return handleError(error);
      }
      return Promise.reject(error);
    }
  );
  return client2;
}
function getCurrentAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
}
function getCurrentRefreshToken() {
}
function setRefreshedTokens(tokens) {
  console.log("set tokens...");
  console.log(tokens);
}
async function logout() {
  console.log("logout...");
  if (typeof window !== "undefined") {
    return localStorage.removeItem("token");
  }
}
function getGateway() {
  const decodedToken = Object.assign(jwt_decode(getCurrentAccessToken()));
  const { urlGateway } = decodedToken;
  return urlGateway;
}
const client = createAxiosClient({
  options: {
    baseURL: `${getGateway()}/gateway/`,
    timeout: 3e5,
    headers: {
      "Content-Type": "application/json"
    }
  },
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl: null,
  //refreshTokenUrl: REFRESH_TOKEN_URL,
  logout,
  setRefreshedTokens
});
export {
  client as c
};
