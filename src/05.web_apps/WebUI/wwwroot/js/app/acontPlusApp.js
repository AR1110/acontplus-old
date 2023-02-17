

const swalOffline = ()=>{
    Swal.fire({
        html:`<small>Esperando la conexión...</small>`,
        imageUrl: "/assets/images/offline.webp",
        imageHeight:'150px',
        allowOutsideClick:false,
        allowEscapeKey:true,
        showConfirmButton:false,
        didOpen:()=>Swal.showLoading()
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
    'ngIdle',
    'ngMask',
    'ngStorage',
    'ui.router',
    'ngCookies',
    'angularUUID2',
    'angularUtils.directives.dirPagination',
    'daterangepicker'
]);



//Configs

app.config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(600);
    IdleProvider.timeout(15);
    KeepaliveProvider.interval(10);
    IdleProvider.interrupt('mousemove keydown DOMMouseScroll mousewheel mousedown');
}]);

app.run(function (Idle) {
    Idle.watch();
})


//check connection offilne/online
app.run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;
   
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
            $rootScope.online = false;            
            swalOffline();               
        });
    }, false);

    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {                 
            $rootScope.online = true;
            Swal.fire({
                html:`<small>Recuperando la conexión...</small>`,
                allowOutsideClick:false,
                allowEscapeKey:true,
                showConfirmButton:false,
                timer:999
            })
        });
    }, false);

    if(!$rootScope.online){
        swalOffline();
    }
});

 app.run(function ($rootScope, $http, $location, $localStorage) {
     // keep user logged in after page refresh
     if ($localStorage.currentUser) {
         $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token
     }

     // redirect to login page if not logged in and trying to access a restricted page
     //$rootScope.$on('$locationChangeStart', function (event, next, current) {
     //    let publicPages = ['/login'];
     //    let restrictedPage = publicPages.indexOf($location.path()) === -1;
     //    if (restrictedPage && !$localStorage.currentUser) {
     //        toastr.warning('error', 'Ha perdido session')
     //        //$location.path('/Login');
     //    }
     //});
 })

//app.config(function ($httpProvider) {
//    $httpProvider.useApplyAsync(true);
//});
//Settings for incons in angularjs materialize
app.config(['$mdThemingProvider','$mdIconProvider', function ($mdThemingProvider, $mdIconProvider) {
    // $mdThemingProvider.theme('default').primaryPalette('blue');
    $mdIconProvider.fontSet('md', 'material-icons');
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

// app.factory('interceptorApi', [function () {
//     // defining interceptor configuration.
//     var interceptor = {
//         request: function (config) {
//             if(config && config.config && config.config.showLoader){
//                 showLoader();
//             }
//             return config;
//         },
//         response: function (response) {
//             hideLoader();
//             return response;
//         },
//         responseError: function(response) {

//             hideLoader();

//             return response
//         }
//     };
//     return interceptor;
// }]);

// app.config(['$httpProvider', function ($httpProvider) {
//     $httpProvider.interceptors.push('interceptorApi');
// }]);

// app.factory('oauthHttpInterceptor', function ($localStorage) {
//     return {
//         request: function (config) {
//             //if (config.headers.Authorization === 'Bearer') {
//             //    config.headers.Authorization = 'Bearer ' + $localStorage.currentUser.token
//             //}
//              if ($localStorage.currentUser) {
//                  config.headers.Authorization = 'Bearer ' + $localStorage.currentUser.token
//      }
//             return config;
//         }
//     };
// });

// app.config(function ($httpProvider) {
//     $httpProvider.interceptors.push('oauthHttpInterceptor');
// });

app.factory('mainService', mainService);

mainService.$inject = ['$http', 'Upload'];

function mainService($http, Upload) {
    let service = {};

    function getData(method, url, data = null, showLoader=false) {        
        return $http({
            method: method,
            url: url,
            data: data,
            headers: {
                //'Accept': 'application/json',
                //'Content-Type': 'application/json',
                'Access-Control-Request-Private-Network': true
            }
        }).then(response => {
            return response.data
        })
    }

    function getDataFile(url, file, data = null) {
        return Upload.upload({
            url: url,
            data: { file: file, data: data },
        }).then(response => {
            return response.data
        })
    }

    function getFile(method, url, data = null) {
        return $http({
            method: method,
            url: url,
            data: data,
            responseType: 'blob'
        }).then(response => {
            return response
        })
    }



    service.getData = getData;
    service.getDataFile = getDataFile;
    service.getFile = getFile;
    return service;
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
modalService.$inject = ['$uibModal'];

function modalService($uibModal) {
    return {
        openModal: function (controller, template, size, params, animation = true, windowClass = null, props = {}) {
            return $uibModal.open({
                animation,
                templateUrl: `/Home/RenderView?name=${template || 'Shared/ModalNotFound.cshtml'}`,
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
        openModalCustom: function({controller, template, size, params, keyboard=false, animation = true, windowClass = null, windowTopClass, openedClass , scope, props = {}}){
            return $uibModal.open({
                animation,
                templateUrl: `/Home/RenderView?name=${template || 'Shared/ModalNotFound.cshtml'}`,
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
                openedClass ,
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
                templateUrl: `/Home/RenderView?name=${template || 'Shared/ModalNotFound.cshtml'}`,
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
//Para Doble scroll en los documentos
app.directive('master', function () { //declaration
    function link(scope, element, attrs) {
        scope.$watch(function () {
            scope.duelScroll = {
                width: element[0].offsetWidth + 'px'
            };
        });
    }
    return {
        restrict: 'AE',
        link: link
    };
})


//Validate Date format
app.directive('validDate', ['$timeout', 'formulario', function ($timeout, form) {
    return {
        scope: {
            ngModel: '='
        },
        link: function (scope, elem, attr, ctrl) {
            elem.on('blur', function () {
                $timeout(function () {
                    scope.ngModel = scope.ngModel || new Date();
                    scope.$parent.getFechaVencimiento(scope.ngModel)
                    elem.removeClass('is-invalid');
                });
            });
            elem.on('keyup', function () {
                if (isNaN(Date.parse(scope.ngModel))) {
                    elem.addClass('is-invalid');
                } else {
                    // elem.removeClass('is-invalid');
                    // elem.addClass('is-valid');                       
                }
            })
        }
    }
}]);


app.directive('decimal', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9.]/g, '');

                    if (digits.split('.').length > 2) {
                        digits = digits.substring(0, digits.length - 1);
                    }
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseFloat(digits);
                }
                return "";
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});

//Directiva para numeros enteros y decimales 
app.directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    val = '';
                }

                let clean = val.replace(/[^-0-9\.]/g, '');
                let negativeCheck = clean.split('-');
                let decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 5);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

//DIRECTIVA PARA ENTRADA DE LETRAS MAYUSCULAS
app.directive('touppercase', function () {
    let flag = false;
    let teclaAnterior = "";
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, modelCtrl) {
            element.on("keydown", event=>{
                teclaAnterior = teclaAnterior + " " + event.keyCode;
                var arregloTA = teclaAnterior.split(" ");
                if (event.keyCode == 32 && arregloTA[arregloTA.length - 2] == 32) {
                  event.preventDefault();
                }
            })

            function removeAccents(input){               
                let inputText = input || "";
                inputText = inputText.normalize('NFD')
                                    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").normalize();
                inputText = inputText.replace(/[`#$%^*Ç¨_|+\=?'´",<>\{\}\[\]\\]/gi, '').trim()               
                modelCtrl.$setViewValue(inputText);
                modelCtrl.$render();
                return inputText.toUpperCase();
            }


            modelCtrl.$parsers.push(removeAccents);
            element.css("text-transform", "uppercase");
        }
    };
});

//DIRECTIVA PARA ENTRADA DE LETRAS MINUSCULAS
app.directive('tolowercase', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (input) {                
                return input ? input.toLowerCase() : "";
            });
            element.css("text-transform", "lowercase");
        }
    };
});

//Directiva que permite entrada de solo Letras en input 
app.directive('validLetra', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.bind('keypress', function (e) {
                let key = e.keyCode || e.which;
                let tecla = String.fromCharCode(key).toLowerCase();
                let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
                let especiales = [8, 37, 39, 46, 58, 60];
                let tecla_especial = false

                for (let i in especiales) {
                    if (key == especiales[i]) {
                        tecla_especial = true;
                        break;
                    }
                }

                if (letras.indexOf(tecla) == -1 && !tecla_especial) {
                    return false;
                }
            });

        }
    };
})

//Validar Email
app.directive('validateEmail', function () {
    let EMAIL_REGEXP = /^[a-z0-9]+(\.[a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9]+)*(\.[a-z]{2,4})$/;
    return {
        link: function (scope, elem) {
            elem.on("keyup", function () {
                let isMatchRegex = EMAIL_REGEXP.test(elem.val());
                if (isMatchRegex && elem.hasClass('is-invalid')) {
                    elem.addClass('is-valid');
                    elem.removeClass('is-invalid');
                    scope.formValid = 1;
                    // isMatchRegex == false
                } else if (!isMatchRegex && !elem.hasClass('is-invalid')) {
                    elem.removeClass('is-valid');
                    elem.addClass('is-invalid');
                    scope.formValid = 0;
                } else if (elem.val() == '') {
                    elem.removeClass('is-invalid');
                    elem.removeClass('is-valid');
                }
            });
        }
    }
});


//Focus Input
app.directive('autoFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.focus();
        }
    };
});

app.directive('focusSearchArticulo', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            element.bind('click', function (e) {
                $timeout(() => {
                    element.focus();
                })
            })
        }
    }
})

app.directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

//keyboard disable
app.directive('keyboardDisable', function () {
    return function (scope, elem, attr) {
        elem.on('keydown', function (e) {
            if (e.which === 9) {
                return false;
            }
        })
    }
})

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

//Filter tipo Iva 
app.filter('mapTipoIva', () => {
    return function (idTipoIva, tipoIvas) {          
        let result = tipoIvas.reduce((acc, curr) => ({ ...acc, [curr.idTipoIva]: curr.descripcion }), { 0: 'Tipo Iva' });
        return !idTipoIva ? result[0] : result[idTipoIva];
    }
});

app.filter('cellFilterTipoIva', ()=>{
    let result = {
        '0': 'Seleccione IVA'
    };
    return (input, context)=>{
        
        let fieldLevel = (context.editDropdownOptionsArray == undefined) ? context.col.colDef : context;
        let map = fieldLevel.editDropdownOptionsArray;
        let idField = fieldLevel.editDropdownIdLabel;
        let valueField = fieldLevel.editDropdownValueLabel;
       
        if (typeof map !== "undefined") {
            for (let value of map) {
                result[value.idTipoIva] = value.descripcion
            }                   
        }
        
        if (!input) {
            return result[0];
        } else {
            return result[input];
        } 
    }
})

app.filter('cellFilterBodega', ()=>{
    let result = {
        '0': 'Seleccione Bodega'
    };
    return (input, context)=>{
        
        let fieldLevel = (context.editDropdownOptionsArray == undefined) ? context.col.colDef : context;
        let map = fieldLevel.editDropdownOptionsArray;
        let idField = fieldLevel.editDropdownIdLabel;
        let valueField = fieldLevel.editDropdownValueLabel;
       
        if (typeof map !== "undefined") {
            for (let value of map) {
                result[value.idBodega] = value.descripcion
            }                   
        }
        
        if (!input) {
            return result[0];
        } else {
            return result[input];
        } 
    }
})

app.directive('inputFocus', function ($timeout) {
    return {
        restrict: 'AC',
        link: function (_scope, _element) {
            $timeout(function () {                
                _element[0].focus();
            }, 0);
        }
    }
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        })
    }
})

app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });

// app.directive('autoocus')

//Filter bodegas 
app.filter('mapBodega', () => {
    return function (idBodega, bodegas) {  
        if(!bodegas || bodegas.length===0) return { 0: 'Seleccionar bodega' }   

        let result = bodegas.reduce((acc, curr) => ({ ...acc, [curr.idBodega]: curr.descripcion }), { 0: 'Seleccionar bodega' });
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
        let result = tipoImpuestos.reduce((acc, curr) => ({ ...acc, [curr.idTipoImpuestoRenta]: curr.descripcion.toUpperCase() }), { 0: 'Seleccione el Tipo Impuesto' })
        return !idTipoImpuesto ? result[0] : result[idTipoImpuesto];
    }
});
app.filter('mapRetencionIva', () => {
    return (idRetencionIva, retencionesIvas) => {
        let result = retencionesIvas.reduce((acc, curr) => ({ ...acc, [curr.idRetencionIva]: curr.descripcion.toUpperCase() }), { 0: 'Seleccione Retención de IVA' })
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


