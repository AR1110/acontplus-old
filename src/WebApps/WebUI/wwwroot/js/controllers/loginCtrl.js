(function () {
    'use strict';
    angular.module('loginApp', ['ngStorage'])
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$http', '$localStorage'];

    function loginCtrl($scope, $http, $localStorage) {

        let urlBase = document.getElementById('urlGateway').value
        let urlService = `${urlBase}/gateway/`

        $scope.loader = false;
        $scope.ver = false;
        $scope.data = {};

        let parser = new UAParser(navigator.userAgent)
        let parserResults = parser.getResult()

        $scope.verContrasenia = function (ver) {
            let contra = $("#password")
            if (!ver) {
                contra.attr("type", 'text')
                $scope.ver = true;
            } else {
                contra.attr('type', "password");
                $scope.ver = false;
            }
        }

        $scope.loginMultiple = (item) => {
            showLoader();
            //let data = {
            //    fullname: item.fullname,
            //    username: item.username,
            //    userId: item.userId,
            //    role: item.role,
            //    userRoleId: item.userRoleId,
            //    idCardUser: item.idCardUser,
            //    idCardCompany
            //}
            item.userAgent = JSON.stringify(parserResults);
            $http.post(`${urlService}account/createToken`, item).then(
                response => {
                    if (response.data.code == "0") {
                        hideLoader();
                        toastr.warning(response.data.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                        return;
                    }

                    if (response.data.code == "1") {
                        $localStorage.currentUser = {
                            token: JSON.parse(response.data.payload).token
                        }
                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + JSON.parse(response.data.payload).token
                        localStorage.setItem('userData', response.data.payload);
                        hideLoader();
                        toastr.success(response.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                        location.href = JSON.parse(response.data.payload).returnUrl;
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
        }

        $scope.login = function () {
            try {
                showLoader();
                $scope.data.userAgent = JSON.stringify(parserResults);
                $scope.data.returnUrl = $('#returnUrl').val();
                if ($scope.data.returnUrl == undefined || $scope.data.returnUrl === "" || $scope.data.returnUrl == null) {
                    $scope.data.returnUrl = '/';
                }
                $http.post(`${urlService}account/login`, $scope.data).then(response => {
                    if (response.data.code === "0") {
                        hideLoader();
                        toastr.warning(response.data.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                        return;
                    };
                    if (response.data.code == "1") {
                        let mainResponse = JSON.parse(response.data.payload);
                        if (mainResponse.length == 1) {
                            $localStorage.currentUser = {
                                token: mainResponse[0].token
                            }
                            // add jwt token to auth header for all requests made by the $http service
                            $http.defaults.headers.common.Authorization = 'Bearer ' + mainResponse[0].token
                            localStorage.setItem('userData', JSON.stringify(mainResponse[0]));
                            hideLoader();
                            toastr.success(response.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                            location.href = mainResponse[0].returnUrl;
                            return;
                        }

                        if (mainResponse.length > 1) {
                            hideLoader();
                            $scope.usuarioEntidades = mainResponse;
                            toastr.info(response.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                            $("#modalLoginUsuarioEntidad").modal('show');
                        }
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                });
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }
        //Bloquear Ir a la pagina Anterior en el Navegador 
        history.pushState(null, document.title, location.href);
        window.addEventListener('popstate', function (event) {
            history.pushState(null, document.title, location.href);
        });
    };
})(window.angular)