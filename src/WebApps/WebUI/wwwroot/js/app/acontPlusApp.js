const swalOffline = () => {
    Swal.fire({
        html: `<small>Esperando la conexión...</small>`,
        imageUrl: "/assets/images/offline.webp",
        imageHeight: '150px',
        allowOutsideClick: false,
        allowEscapeKey: true,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    })
}

let app = angular.module('acontPlusApp', [
    'ngAnimate',
    'ngFileSaver',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.moveColumns',
    'ui.grid.edit',
    'ui.grid.validate',
    'ui.grid.cellNav',
    'ui.grid.resizeColumns',
    "ui.grid.pagination",
    'ui.grid.selection', //data grid Select Rows        
    'ui.grid.autoResize',
    'ui.grid.expandable',
    'ui.grid.saveState',
    'ngSanitize',
    'ngMaterial',
    'md.data.table',
    'fixed.table.header',
    'ngMessages',
    'ngFileUpload', //for  file upload
    //'ngIdle',
    'ngMask',
    'ngStorage',
    'ui.router',
    'ngCookies',
    'angularUUID2',
    'angularUtils.directives.dirPagination',
    'daterangepicker',
    'angular-jwt',
    'matchMedia'
]);

// app.config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
//     IdleProvider.idle(600);
//     IdleProvider.timeout(15);
//     KeepaliveProvider.interval(10);
//     IdleProvider.interrupt('mousemove keydown DOMMouseScroll mousewheel mousedown');
// }]);

// app.run(function (Idle) {
//     Idle.watch();
// })

//check connection offilne/online
app.run(function ($window, $rootScope) {
    $rootScope.online = navigator.onLine;

    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
            swalOffline();
        });
    }, false);

    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
            Swal.fire({
                html: `<small>Recuperando la conexión...</small>`,
                allowOutsideClick: false,
                allowEscapeKey: true,
                showConfirmButton: false,
                timer: 999
            })
        });
    }, false);

    if (!$rootScope.online) {
        swalOffline();
    }
})

function alertEndSession() {
    let timerInterval = 0
    Swal.fire({
        icon: 'warning',
        title: 'Authenticación',
        text: 'Ha perdido session, inicie nuevamente',
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
                const content = Swal.getHtmlContainer()
                if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                        b.textContent = Swal.getTimerLeft()
                    }
                }
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        location.href = '/Login/Index'
        if (result.dismiss === Swal.DismissReason.timer) {
            location.href = '/Login/Index'
        }
    })
}

app.factory('authInterceptorService', function ($q, $localStorage, jwtHelper) {
    let authInterceptorServiceFactory = {}

    let _request = (config) => {
        config.headers = config.headers || {}
        let authData = $localStorage.currentUser
        if (authData) {
            if (!authData.token) {
                alertEndSession()
                return
            }
            config.headers.Authorization = 'Bearer ' + authData.token
            let decodedJwt = jwtHelper.decodeToken(authData.token)
            //console.log(decodedJwt)
            const expiration = Number(decodedJwt.exp)
            let newDate = moment.tz(new Date(), "America/Guayaquil")
            //console.log(newDate)
            const currentTime = Math.floor(new Date(newDate) / 1000); // convert to seconds
            // console.log(currentTime)
            // console.log(expiration)

            if (expiration < currentTime) {
                //console.log('yes')
                alertEndSession()
            }
            config.headers['X-IdUsuarioRol'] = decodedJwt.idUsuarioRol
        }
        return config
    }

    let _responseError = (rejection) => {
        if (rejection.status == 401) {
            alertEndSession()
        }
        return $q.reject(rejection)
    }
    authInterceptorServiceFactory.request = _request
    authInterceptorServiceFactory.responseError = _responseError
    return authInterceptorServiceFactory
})

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService')
})

//app.config(function ($httpProvider) {
//    $httpProvider.useApplyAsync(true);
//});


//Settings for incons in angularjs materialize
app.config(['$mdThemingProvider', '$mdIconProvider', function ($mdThemingProvider, $mdIconProvider) {
    // $mdThemingProvider.theme('default').primaryPalette('blue');
    $mdIconProvider.fontSet('md', 'material-symbols-outlined');
}]);


/** Trasnlating to spanish buttons pagination ui.boostrap */
app.config(['uibPaginationConfig', function (uibPaginationConfig) {
    uibPaginationConfig.firstText = 'Primera',
        uibPaginationConfig.previousText = 'Anterior',
        uibPaginationConfig.nextText = 'Siguiente',
        uibPaginationConfig.lastText = 'Ultima'
}]);


app.constant('sessionDataEntidad', JSON.parse(localStorage.getItem('userData')))

//SERVICIOS

app.factory('decodeToken', function ($localStorage, jwtHelper) {
    let authData = $localStorage.currentUser;
    let decodedJwt = {};
    if (authData) {
        decodedJwt = jwtHelper.decodeToken(authData.token)
    }
    return decodedJwt
})

app.factory('mainService', mainService);

mainService.$inject = ['$http', 'Upload', 'decodeToken', 'screenSize', '$timeout'];

function mainService($http, Upload, _token, _screenSize, $timeout) {
    let service = {}

    function _getData(method, url, data = null, forApi = false) {
        return $http({
            method: method,
            url: (forApi) ? _token.urlGateway + '/gateway/' + url : url,
            data: data
        }).then(response => {
            return response.data
        })
    }

    function _getDataFile(url, file, data = null, forApi = false) {
        return Upload.upload({
            url: (forApi) ? _token.urlGateway + '/gateway/' + url : url,
            data: {
                file: file,
                data: data
            },
        }).then(response => {
            return response.data
        })
    }

    function _getFile(method, url, data = null, forApi = false) {
        return $http({
            method: method,
            url: (forApi) ? _token.urlGateway + '/gateway/' + url : url,
            data: data,
            responseType: 'blob'
        }).then(response => {
            return response
        })
    }

    _detectDevice = () => {
        let isMobile = _screenSize.on('xs, sm', (isMatch) => {
            isMobile = isMatch
        })
        if (isMobile) {
            Swal.fire(
                'Dispositivo Móvil Detectado!',
                'Para una mejor comodidad, le recomendamos usar una Laptop o PC.',
                'success'
            )
        } else {
            $timeout(() => {
                document.getElementById('menu_toggle').click()
            }, 1100)
        }
    }

    service.getData = _getData
    service.getDataFile = _getDataFile
    service.getFile = _getFile
    service.detectDevice = _detectDevice
    return service
}

//Toastr Notifications//
app.factory('toastService', function () {
    return {
        toastr: function (type, message, title = null, positionClass = null, timeOut = null, extendedTimeOut = null) {
            toastr[type](message, title, {
                closeButton: true,
                debug: false,
                newestOnTop: true,
                progressBar: true,
                positionClass: positionClass || 'toast-bottom-center',
                preventDuplicates: true,
                timeOut: timeOut || 5000,
                extendedTimeOut: extendedTimeOut || 1000
            })
        }
    }
});

app.factory('modalService', modalService);
modalService.$inject = ['$uibModal', '$mdDialog'];

function modalService($uibModal,  $mdDialog) {
    return {
        openModal: function (controller, template, size, params, animation = true, windowClass = null, props = {}) {
            return $uibModal.open({
                animation,
                templateUrl: `/Home/RenderView?name=~/Views/${template}`,
                controller: controller,
                size,
                windowClass,
                backdrop: "static",
                keyboard: false,
                scrollable: true,
                width: props.width,
                height: props.height,
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
                minWidth: props.minWidth,
                minHeight: props.minHeight,
                resolve: {
                    params: function () {
                        return params;
                    }
                }
            });
        },


        /**
         * 
         * @param {object} params {controller, template, size, params, keyboard=false, animation = true, windowClass = null, scope, props = {}}
         * @returns object 
         */
        openModalCustom: function ({
            controller,
            template,
            size,
            params,
            keyboard = false,
            animation = true,
            windowClass = null,
            windowTopClass,
            openedClass,
            scope,
            props = {},
            isRenderRazorPartial = false,
            isRenderHtmlNormal = false,
        }) {

            let templateUrl = '';
            if (isRenderRazorPartial) {
                templateUrl = `/Home/RenderView?name=${template}`;
            }

            if (!isRenderRazorPartial) {
                templateUrl = `/Home/RenderView?name=~/Views/${template}`
            }


            return $uibModal.open({
                animation,
                templateUrl,
                controller,
                controllerAs: '$ctrl',
                scope,
                size,
                windowClass,
                backdrop: "static",
                scrollable: true,
                keyboard,
                width: props.width,
                height: props.height,
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
                minWidth: props.minWidth,
                minHeight: props.minHeight,
                windowTopClass,
                openedClass,
                resolve: {
                    params: function () {
                        return params;
                    }
                }
            })
        },
        openModalSecond: function (controller, template, size, params, animation = true, windowClass = null, $scope, props = {}) {
            return $uibModal.open({
                animation,
                templateUrl: `/Home/RenderView?name=~/Views/${template}`,
                controller,
                controllerAs: '$ctrl',
                scope: $scope,
                size,
                windowClass,
                backdrop: "static",
                scrollable: true,
                keyboard: false,
                width: props.width,
                height: props.height,
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
                minWidth: props.minWidth,
                minHeight: props.minHeight,
                resolve: {
                    params: function () {
                        return params;
                    }
                }
            });
        },

        openMdDialog: function ({controller, templateUrl, targetEvent, clickOutsideToClose=false, fullscreen=true, params}) {
            return  $mdDialog.show({
                controller,
                templateUrl: `/Home/RenderView?name=${templateUrl}`,
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent,
                clickOutsideToClose, 
                fullscreen,    
                locals: {
                    params
                }               
            })
        },
        modalOptions: {}
    }

}

//


//(function () {
//    "use strict";

//    angular.module('mainApp')
//        .controller('dynamicMenuCtrl', dynamicMenuCtrl)

//    dynamicMenuCtrl.$inject = ['$scope']

//    function dynamicMenuCtrl($scope) {
//        $scope.menus = [];
//        $scope.subMenus = [];

//        var userInfo = JSON.parse(localStorage.getItem('userInfo'));
//        $scope.menus = JSON.parse(localStorage.getItem('menus'));
//        $scope.subMenus = JSON.parse(localStorage.getItem('subMenus'));

//        if (userInfo != null || userInfo != undefined) {
//            var textHtml = "";
//            var subMenu = false;
//            textHtml +=
//                '<li class="user-pro"> <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false"><img src="' + userInfo.imagen + '" alt="" class="img-circle"><span class="hide-menu">' + userInfo.nombreUsuario + '</span></a>' +
//                '<ul aria-expanded="false" class="collapse">' +
//                '<li><a href="/Usuario/Perfil"><i class="ti-user"></i> Mi Perfil</a></li>' +
//                '<li><a href="/Login/Logout"><i class="fa fa-power-off"></i> Salir</a></li>' +
//                '</ul>' +
//                '</li>';
//            for (var i = 0; i < $scope.menus.length; i++) {
//                if (subMenu == true) {
//                    textHtml += '</ul></li>';
//                    subMenu = false;
//                };
//                if ($scope.menus[i].subMenu == false) {
//                    textHtml += '<li>' +
//                        '<a href="' + $scope.menus[i].url + '" class="waves-effect waves-dark">' +
//                        '<i class="' + $scope.menus[i].icono + '" ></i ><span class="hide-menu"> ' + $scope.menus[i].descripcion + '</a></span>' +
//                        '</li>';
//                };
//                if ($scope.menus[i].subMenu == true) {
//                    subMenu = true;
//                    textHtml += '<li>' +
//                        '<a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false"><i class="' + $scope.menus[i].icono + '"></i><span class="hide-menu"> ' + $scope.menus[i].descripcion + '</span></a>' +
//                        '<ul aria-expanded="false" class="collapse">';
//                    for (var sm = 0; sm < $scope.subMenus.length; sm++) {
//                        if ($scope.menus[i].idMenu == $scope.subMenus[sm].idMenu) {
//                            textHtml += '<li><a href="' + $scope.subMenus[sm].url + '">' + $scope.subMenus[sm].descripcion + '</a></li>';
//                        }
//                    }
//                };
//            };
//            $('#sidebarnav').html(textHtml);
//        }
//    }

//})(window.angular);

//Directivas 

//FILTERS GENERAL 
app.filter('estadoPrimario', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml("<span class='label label-success font-weight-100'>Activo</span>") : $sce.trustAsHtml("<span class='label label-danger font-weight-100'>Inactivo</span>");
    }
});

app.filter('estadoSecundario', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml("<i class='fa fa-circle text-success'></i>") : $sce.trustAsHtml("<i class='fa fa-circle text-warning'></i>");
    }
});

app.filter('sino', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml("<span class='text-success'>SI</span>") : $sce.trustAsHtml("<span class='text-info'>NO</span>");
    }
});
app.filter('tipo', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml("<span class='text-success'>PROVEEDOR</span>") : $sce.trustAsHtml("<span class='text-info'>CLIENTE</span>");
    }
});
app.filter('ambienteSri', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml("<span class='text-success'>PRUEBAS</span>") : $sce.trustAsHtml("<span class='text-info'>PRODUCCIÓN</span>");
    }
})
app.filter('tipoEmisionSri', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml("<span class='text-success'>NORMAL</span>") : $sce.trustAsHtml("<span class='text-info'></span>");
    }
})
//Filter tipo Iva 
app.filter('mapTipoIva', () => {
    return function (idTipoIva, tipoIvas) {
        let result = tipoIvas.reduce((acc, curr) => ({
            ...acc,
            [curr.idTipoIva]: curr.descripcion
        }), {
            0: 'Tipo Iva'
        });
        return !idTipoIva ? result[0] : result[idTipoIva];
    }
});

app.filter('cellFilterTipoIva', () => {
    let result = {};

    return (input, context) => {

        let fieldLevel = (context.editDropdownOptionsArray == undefined) ? context.col.colDef : context;
        let map = fieldLevel.editDropdownOptionsArray;
        let idField = fieldLevel.editDropdownIdLabel;
        let valueField = fieldLevel.editDropdownValueLabel;

        if (typeof map !== "undefined") {
            for (let value of map) {
                result[value[idField]] = value.descripcion
                //  result[idField] = value.descripcion
            }
        }

        if (!input) {
            return result[0];
        } else {
            return result[input];
        }
    }
})

app.filter('cellFilterBodega', () => {
    let result = {
        '0': 'Seleccione Bodega'
    };
    return (input, context) => {

        let fieldLevel = (context.editDropdownOptionsArray == undefined) ? context.col.colDef : context;
        let map = fieldLevel.editDropdownOptionsArray;
        let idField = fieldLevel.editDropdownIdLabel;
        let valueField = fieldLevel.editDropdownValueLabel;

        if (typeof map !== "undefined") {
            for (let value of map) {
                result[value.idBodega] = value[valueField]
            }
        }

        if (!input) {
            return result[0];
        } else {
            return result[input];
        }
    }
})


// app.directive('autoocus')

//Filter bodegas 
app.filter('mapBodega', () => {
    return function (idBodega, bodegas) {
        if (!bodegas || bodegas.length === 0) return {
            0: 'Seleccionar bodega'
        }

        let result = bodegas.reduce((acc, curr) => ({
            ...acc,
            [curr.idBodega]: curr.descripcion
        }), {
            0: 'Seleccionar bodega'
        });
        console.log(result)
        console.log(idBodega, bodegas)
        return !idBodega ? result[0] : result[idBodega];
    };
});

app.filter('estadoPago', () => {
    return function (text) {
        let template;
        if (text == 'PE') template = "<span class='label label-danger font-weight-100'>Pendiente</span>";
        if (text == 'PP') template = "<span class='label label-info font-weight-100'>Pendiente-Parcial</span>";
        if (text == 'PA') template = "<span class='label label-success font-weight-100'>Pagada</span>";
        return $sce.trustAsHtml(template);
    }
});

app.filter('mapTipoImpuesto', () => {
    return (idTipoImpuesto, tipoImpuestos) => {
        let result = tipoImpuestos.reduce((acc, curr) => ({
            ...acc,
            [curr.idTipoImpuestoRenta]: curr.descripcion.toUpperCase()
        }), {
            0: 'Seleccione el Tipo Impuesto'
        })
        return !idTipoImpuesto ? result[0] : result[idTipoImpuesto];
    }
});
app.filter('mapRetencionIva', () => {
    return (idRetencionIva, retencionesIvas) => {
        let result = retencionesIvas.reduce((acc, curr) => ({
            ...acc,
            [curr.idRetencionIva]: curr.descripcion.toUpperCase()
        }), {
            0: 'Seleccione Retención de IVA'
        })
        return !idRetencionIva ? result[0] : result[idRetencionIva];
    }
});
app.filter('mapTarifa', mapTarifa);

function mapTarifa() {
    let result = {
        '0': 'Seleccione Tarifa'
    };
    return function (input, tarifas) {
        if (tarifas !== undefined) {
            for (var value of tarifas) {
                result[value.idTarifa] = value.tarifa;
            }
            if (!input) {
                return result[0];
            } else {
                return result[input];
            }
        }
    }
}

app.filter('mapMedida', mapMedida);

function mapMedida() {
    let result = {
        '0': 'Seleccione Médida'
    };
    return function (input, medidas) {
        if (medidas !== undefined) {
            for (var value of medidas) {
                result[value.idMedida] = value.descripcion;
            }
            if (!input) {
                return result[0];
            } else {
                return result[input];
            }
        }
    }
}

app.filter('mapTipoIce', () => {
    let result = {
        0: 'Seleccione el Tipo Ice'
    }
    return (input, tipoIces) => {
        if (tipoIces === null || tipoIces == undefined) return result[0];
        for (let item of tipoIces) {
            result[item.codigo] = item.descripcion
        }
        return result[input]
    }
})

