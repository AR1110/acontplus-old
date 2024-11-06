import app from '@src/app'; 
app.factory("errorInterceptor",errorInterceptor)
    errorInterceptor.$inject = ['$q', 'toastService'];
    function errorInterceptor($q, tS) {
    return {
        responseError: function (response) {
            switch (response.status) {
                case 400:
                    tS.toastr("warning", "Recurso no encontrado!");
                    break;
                default:
                    console.error("HTTP error:", response);
                    break;
            }
            return $q.reject(response);
        },
    };
};