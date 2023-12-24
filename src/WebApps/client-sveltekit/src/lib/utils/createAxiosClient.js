
//for more see https://dev.to/mihaiandrei97/jwt-authentication-using-axios-interceptors-55be
import axios from "axios";

export function createAxiosClient({
    options,
    getCurrentAccessToken,
    getCurrentRefreshToken,
    refreshTokenUrl = null,
    logout,
    setRefreshedTokens,
}) {
    const client = axios.create(options);
    client.interceptors.request.use(
        (config) => {
            if (config.authorization !== false) {
                const token = getCurrentAccessToken();
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

    client.interceptors.response.use(
        (response) => {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        },
        (error) => {
            const originalRequest = error.config;
            // In "axios": "^1.1.3" there is an issue with headers, and this is the workaround.
            originalRequest.headers = JSON.parse(
                JSON.stringify(originalRequest.headers || {})
            );
            const refreshToken = getCurrentRefreshToken();

            // If error, process all the requests in the queue and logout the user.
            const handleError = (error) => {
                logout();
                return Promise.reject(error);
            };

            // Refresh token conditions
            if (
                refreshToken &&
                error.response?.status === 401 &&
                error.response.data.message === "TokenExpiredError" &&
                originalRequest?.url !== refreshTokenUrl &&
                originalRequest?._retry !== true
            ) {
                let isRefreshing
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        console.log(resolve)
                        console.log(reject)
                    })
                        .then(() => {
                            return client(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }
                isRefreshing = true;
                originalRequest._retry = true;
                return client
                    .post(refreshTokenUrl, {
                        refreshToken: refreshToken,
                    })
                    .then((res) => {
                        const tokens = {
                            accessToken: res.data?.accessToken,
                            refreshToken: res.data?.refreshToken,
                        };
                        setRefreshedTokens(tokens);
                        return client(originalRequest);
                    }, handleError)
                    .finally(() => {
                        isRefreshing = false;
                    });
            }

            // Refresh token missing or expired => logout user...
            if (
                error.response?.status === 401 &&
                error.response?.data?.message === "TokenExpiredError"
            ) {
                console.log(error)
                return handleError(error);
            }
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(error);
        }
    );
    return client;
}
