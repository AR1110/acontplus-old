(function () {
    'use strict';
    angular.module('loginApp', ['ngStorage'])
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$http', '$localStorage'];

    function loginCtrl($scope, $http, $localStorage) {
        let urlBase = document.getElementById('urlGateway').value
        let urlService = `${urlBase}/gateway/`
        // Ditect user info
        let Url = "https://" + "cloudflare.com/cdn-cgi/trace";
        let customerIp = "";
        let AjaxUrl = new XMLHttpRequest();
        AjaxUrl.open("get", Url);
        AjaxUrl.send();

        // For get the customer data from response
        $scope.codes = ['', '', '', '', '', ''];
        $scope.mainResponse = {};

        AjaxUrl.onreadystatechange = function () {
            if (AjaxUrl.readyState === 4 && AjaxUrl.status === 200) {
                let resultUrl = AjaxUrl.responseText;
                let mapUrlStart = resultUrl.indexOf("ip") + 3;
                let mapUrlEnd = resultUrl.indexOf("ts");
                let IpResult = resultUrl.slice(mapUrlStart, mapUrlEnd);
                customerIp = IpResult.replace(/[\n\r]/g, "")
            }
        };
        $scope.loader = false;
        $scope.ver = false;
        $scope.data = {};
        $scope.hasManyRoles = false;
        $scope.roleSelected = {}

        let parser = new UAParser(navigator.userAgent)
        let parserResults = parser.getResult()
        $scope.askToCancel = () => {
            swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Esta seguro de salir de esta ventana, eliminara esta solicitud',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then(response => {
                if (response.isConfirmed) {
                    $("#accessAuthorizationModal").modal('hide');
                }
            })
        }
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

        $scope.authMultiple = () => {
            let item = $scope.roleSelected;
            item.userAgent = JSON.stringify({ userAgent: JSON.stringify(parserResults), ipAddress: customerIp });
            $http.post(`${urlService}seguridad/account/createToken`, item).then(
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

        $scope.loginMultiple = (item) => {
            $scope.roleSelected = item;
            if ($scope.roleSelected.needAuthorization) {
                $http.post(`${urlService}seguridad/account/requestaccess`, { uuid: $scope.roleSelected.uuid, userRoleId: $scope.roleSelected.userRoleId }).then(
                    response => {
                        if (response.data.code == '1') {
                            $("#accessAuthorizationModal").modal('show');
                        }
                    }
                ).catch(error => {
                    console.log(error)
                })
            } else {
                $scope.authMultiple();
            }
        }

        $scope.login = function () {
            try {
                showLoader();
                $scope.data.userAgent = JSON.stringify({ userAgent: JSON.stringify(parserResults), ipAddress: customerIp });
                $scope.data.returnUrl = $('#returnUrl').val();
                if ($scope.data.returnUrl == undefined || $scope.data.returnUrl === "" || $scope.data.returnUrl == null) {
                    $scope.data.returnUrl = '/';
                }
                $http.post(`${urlService}seguridad/account/login`, $scope.data).then(response => {
                    if (response.data.code === "0") {
                        hideLoader();
                        toastr.warning(response.data.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                        return;
                    };
                    if (response.data.code == "1") {
                        $scope.mainResponse = JSON.parse(response.data.payload); 
                        if ($scope.mainResponse.length == 1) {
                            if ($scope.mainResponse[0].needAuthorization) {
                                hideLoader();
                                $scope.roleSelected = $scope.mainResponse[0];
                                $("#accessAuthorizationModal").modal('show');
                                return;
                            }

                            $localStorage.currentUser = {
                                token: $scope.mainResponse[0].token
                            }
                            // add jwt token to auth header for all requests made by the $http service
                            $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.mainResponse[0].token
                            localStorage.setItem('userData', JSON.stringify($scope.mainResponse[0]));
                            hideLoader();
                            toastr.success(response.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                            location.href = $scope.mainResponse[0].returnUrl;
                            return;
                        }

                        if ($scope.mainResponse.length > 1) {
                            hideLoader();
                            $scope.hasManyRoles = true;
                            $scope.usuarioEntidades = $scope.mainResponse;
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

        $scope.skipCodeFields = function (event, index) {
            let newIndex = (index + 1)
            let id = `code_auth2f${newIndex}`
            document.getElementById(id).addEventListener('input', function () {
                // Check if the input length matches the desired value length
                console.log(this.value)
                if (this.value.length === 1 && newIndex <= 5) {
                    // Move focus to the second input field
                    document.getElementById('code_auth2f' + (newIndex + 1)).focus();
                }
            });
        }

        $scope.authenticate = function () {
            showLoader();
            $scope.dataSend = {
                senderId: 0,
                receiverId: 0,
                uuid: $scope.mainResponse[0].uuid,
                code: Number($scope.codes.join(''))
            }

            $http.post(`${urlService}seguridad/account/authenticate`, $scope.dataSend).then(response => {
                if (response.data.code === "0") {
                    hideLoader();
                    toastr.warning(response.data.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                    return;
                };
                if (response.data.code == "1") {
                    hideLoader();
                    $("#accessAuthorizationModal").modal('hide');
                    $scope.authMultiple();
                }
            }).catch(error => {
                hideLoader();
                console.log(error);
            });
        }
    };
})(window.angular)