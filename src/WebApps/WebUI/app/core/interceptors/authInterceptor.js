import app from '@src/app'; 
app.factory("authInterceptor", authInterceptor)
    authInterceptor.$inject = ['$q', '$localStorage', 'jwtHelper']
    function authInterceptor($q, $localStorage, jwtHelper) {
    let authInterceptorServiceFactory = {};

    let _request = (config) => {
        config.headers = config.headers || {};
        let authData = $localStorage.currentUser;

        if (authData && authData.token) {
            try {
                let decodedJwt = jwtHelper.decodeToken(authData.token);
                const expiration = Number(decodedJwt.exp);
                const currentTime = Math.floor(new Date() / 1000); // convert to seconds

                if (expiration < currentTime) {
                    return alertEndSession();
                }
                config.headers.Authorization = "Bearer " + authData.token;
            } catch (error) {
                console.error("Error decoding token:", error);
                alertEndSession();
            }
        } else {
            alertEndSession();
        }

        return config;
    };

    let _responseError = (rejection) => {
        if (rejection.status === 401) {
            alertEndSession();
        }
        return $q.reject(rejection);
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
};
