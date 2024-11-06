import app from '@src/app'; 
// Registrar el interceptor
import '@core/interceptors/authInterceptor'
import '@core/interceptors/errorInterceptor'
import '@core/interceptors/loaderInterceptor'

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push("authInterceptor");
    $httpProvider.interceptors.push("errorInterceptor");
    $httpProvider.interceptors.push("loaderInterceptor");
}]);

//routes 
import '@core/routes/modal.route'

//utils
import '@core/utils/utils'

//filters 
import '@core/filters.js'

//core services
import '@core/services/modalService'
import '@core/services/tokenService'
import '@core/services/mainService';
import '@core/services/toastService'; 
 import '@core/services/userPermissionService';