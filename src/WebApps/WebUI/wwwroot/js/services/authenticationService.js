(function () {
    'use strict';

    app.factory('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', '$localStorage'];

    function authenticationService($http, $localStorage) {
        let service = {
            login: login,
            logout: logout
        }

        return service

        function login(credentials, callback) {
            $http.post('api/authentication', credentials).then(
                response => {
                    if (response.data.token) {
                        $localStorage.currentUser = {
                            username: credentials.username,
                            token: response.data.token
                        }
                        $http.default.headers.common.Authorization = 'Bearer ' + response.data.token
                    }
                }
            )
        }
        function logout() {
            delete $localStorage.currentUser
            $http.default.headers.common.Authorization = ''
        }
    }
})(window.angular);