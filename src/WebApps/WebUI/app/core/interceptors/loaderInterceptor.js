import app from '@src/app';
app.factory("loaderInterceptor", loaderInterceptor)
loaderInterceptor.$inject = ['$q']
function loaderInterceptor($q) {
    return {
        request: function (config) { 
            console.log(config)
            // Skip loader for requests marked with `noLoader` config
            if (config && config.noLoader) {
                return config;
            }
            showLoader();
            return config;
        },
        response: function (response) {
            hideLoader();
            return response;
        },
        responseError: function (error) {
            hideLoader();
            return $q.reject(error); // Re-throw the error
        },
    };
}