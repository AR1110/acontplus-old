const swalOffline = () => {
    Swal.fire({
        html: `<small>Esperando la conexión...</small>`,
        imageUrl: "/assets/images/offline.webp",
        imageHeight: "150px",
        allowOutsideClick: false,
        allowEscapeKey: true,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });
};

let app = angular.module("acontPlusApp", [
    "ngAnimate",
    "ngFileSaver",
    "ui.bootstrap",
    "ui.grid",
    "ui.grid.moveColumns",
    "ui.grid.edit",
    "ui.grid.validate",
    "ui.grid.cellNav",
    "ui.grid.resizeColumns",
    "ui.grid.pagination",
    "ui.grid.selection",
    "ui.grid.autoResize",
    "ui.grid.expandable",
    "ui.grid.saveState",
    "ngSanitize",
    "ngMaterial",
    "md.data.table",
    "fixed.table.header",
    "ngMessages",
    "ngFileUpload",
    "ngMask",
    "ngStorage",
    "ui.router",
    "ngCookies",
    "angularUUID2",
    "angularUtils.directives.dirPagination",
    "daterangepicker",
    "angular-jwt",
    "matchMedia",
]);

//check connection offilne/online
app.run(function ($window, $rootScope) {
    $rootScope.online = navigator.onLine;

    $window.addEventListener(
        "offline",
        function () {
            $rootScope.$apply(function () {
                $rootScope.online = false;
                swalOffline();
            });
        },
        false,
    );

    $window.addEventListener(
        "online",
        function () {
            $rootScope.$apply(function () {
                $rootScope.online = true;
                Swal.fire({
                    html: `<small>Recuperando la conexión...</small>`,
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    showConfirmButton: false,
                    timer: 999,
                });
            });
        },
        false,
    );

    if (!$rootScope.online) {
        swalOffline();
    }
});

function alertSessionExpiring() {
    let timerInterval;
    Swal.fire({
        icon: "warning",
        title: "Su sesión expirará pronto",
        html: "La sesión se cerrará en <b></b> minutos. ¿Desea continuar?",
        timer: 300000, // 5 minutos
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cerrar sesión",
        didOpen: () => {
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                const timeLeft = Swal.getTimerLeft();
                const minutesLeft = Math.ceil(timeLeft / 60000);
                timer.textContent = minutesLeft;
            }, 1000);
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.cancel) {
            // Si se agota el tiempo o cancela, cerrar sesión
            alertEndSession();
        } else if (result.isConfirmed) {
            // Si confirma continuar, no hacer nada (la sesión seguirá activa)
            console.log("Usuario decidió continuar con la sesión");
        }
    });
}

function alertEndSession() {
    let timerInterval;
    Swal.fire({
        icon: "error",
        title: "Sesión expirada",
        html: "Su sesión ha caducado. Redirigiendo en <b></b> segundos",
        timer: 10000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Ir al login",
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${(Swal.getTimerLeft() * 0.001).toFixed()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
    }).then((result) => {
        if ((result.dismiss === Swal.DismissReason.timer) || (result.isConfirmed)) {
            Object.keys(localStorage).forEach(function (key) {
                localStorage.removeItem(key);
            });
            window.location.href = "/Login/Index";
        }
    });
}

app.factory("authInterceptorService", function ($q, $localStorage, jwtHelper) {
    let authInterceptorServiceFactory = {};
    let sessionWarningShown = false; // Flag para evitar múltiples alertas

    let _request = (config) => {
        if (config.url.includes('api.green-api.com')) {
            return config;
        }

        config.headers = config.headers || {};
        let authData = $localStorage.currentUser;

        if (authData && authData.token) {
            try {
                let decodedJwt = jwtHelper.decodeToken(authData.token);
                const expiration = Number(decodedJwt.exp);
                const currentTime = Math.floor(new Date() / 1000); // convert to seconds
                const timeUntilExpiration = expiration - currentTime;

                // Si el token ya expiró
                if (expiration < currentTime) {
                    return alertEndSession();
                }

                // Si faltan 5 minutos o menos para expirar (300 segundos) y no se ha mostrado la alerta
                if (timeUntilExpiration <= 300 && !sessionWarningShown) {
                    sessionWarningShown = true;
                    alertSessionExpiring();
                }

                config.headers["client-Id"] = "acontplus-web-app";
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
});


app.factory("errorInterceptor", function ($q, toastService) {
    return {
        responseError: function (response) {
            switch (response.status) {
                case 400:
                    toastService.toastr("warning", "Recurso no encontrado!");
                    break;
                default:
                    console.error("HTTP error:", response);
                    break;
            }
            return $q.reject(response);
        },
    };
});

app.factory("loaderInterceptor", function ($q) {
    var activeRequests = 0;

    function showLoaderIfNeeded() {
        if (activeRequests === 1) {
            showLoader(); // Solo mostramos loader al inicio
        }
    }

    function hideLoaderIfNeeded() {
        if (activeRequests === 0) {
            hideLoader(); // Solo ocultamos loader cuando no hay más solicitudes activas
        }
    }

    return {
        request: function (config) {
            if (config && config.noLoader) {
                return config;
            }
            activeRequests++;
            showLoaderIfNeeded();
            return config;
        },

        response: function (response) {
            if (!response.config.noLoader) {
                activeRequests--;
                hideLoaderIfNeeded();
            }
            return response;
        },

        responseError: function (error) {
            if (!error.config || !error.config.noLoader) {
                activeRequests--;
                hideLoaderIfNeeded();
            }
            return $q.reject(error);
        }
    };
});

// Register the interceptor with $httpProvider
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push("authInterceptorService");
    $httpProvider.interceptors.push("errorInterceptor");
    $httpProvider.interceptors.push("loaderInterceptor");
});

//Settings for incons in angularjs materialize
app.config([
    "$mdThemingProvider",
    "$mdIconProvider",
    function ($mdThemingProvider, $mdIconProvider) {
        // $mdThemingProvider.theme('default').primaryPalette('blue');
        $mdIconProvider.fontSet("md", "material-symbols-outlined");
    },
]);

/** Trasnlating to spanish buttons pagination ui.boostrap */
app.config([
    "uibPaginationConfig",
    function (uibPaginationConfig) {
        (uibPaginationConfig.firstText = "Primera"),
            (uibPaginationConfig.previousText = "Anterior"),
            (uibPaginationConfig.nextText = "Siguiente"),
            (uibPaginationConfig.lastText = "Ultima");
    },
]);

app.constant(
    "sessionDataEntidad",
    JSON.parse(localStorage.getItem("userData")),
);

app.constant('APP_CONSTANTS', {
    CODE_APP: 'AW',
    POLICIES: {
        MAX_DOCUMENTS: 'MAX_DOCUMENTS',
        MAX_INVENTORY_ITEMS: 'MAX_INVENTORY_ITEMS',
        MAX_USERS: 'MAX_USERS',
        MAX_WAREHOUSES: 'MAX_WAREHOUSES',
        MAX_ESTABLISHMENTS: 'MAX_ESTABLISHMENTS'
    },
    TYPES: {
        DEFAULT: 1,
        ADVANCED: 2
    }
});

//SERVICIOS

app.factory("decodeToken", function ($localStorage, jwtHelper) {
    let authData = $localStorage.currentUser;
    let decodedJwt = {};
    if (authData) {
        decodedJwt = jwtHelper.decodeToken(authData.token);
    }
    return decodedJwt;
});

app.factory("authToken", function ($localStorage, jwtHelper) {
    let token = {};
    function _get({ decoded = false }) {
        let authData = $localStorage.currentUser;
        if (authData) {
            if (decoded) {
                return (decodedJwt = jwtHelper.decodeToken(authData.token));
            } else {
                return authData;
            }
        }
    }
    token.get = _get;
    return token;
});

app.factory("mainService", mainService);

mainService.$inject = [
    "$http",
    "Upload",
    "decodeToken",
    "screenSize",
    "$timeout",
    "authToken",
];

function mainService($http, Upload, _token, _screenSize, $timeout, authToken) {
    let service = {};

    function _getData(
        method,
        url,
        data = null,
        forApi = false,
        externalApi = false,
        noLoader = false
    ) {
        if (externalApi) {
            return fetch(url, {
                method: method,
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                return response.json();
            });
        }
        return $http({
            method: method,
            url: window.apiProxyUrl + "/gateway/" + url,
            data: data,
            noLoader,
        }).then((response) => {
            return response.data;
        });
    }

    function _getDataFile(url, file, data = null, forApi = false) {
        return Upload.upload({
            url: window.apiProxyUrl + "/gateway/" + url,
            headers: {
                Authorization: authToken.get({ decoded: false }),
            },
            data: {
                file: file,
                data: data,
            },
        }).then((response) => {
            return response.data;
        });
    }

    function _uploadFile({ url, file, data = null }) {
        return Upload.upload({
            url: window.apiProxyUrl + "/gateway/" + url,
            headers: {
                Authorization: authToken.get({ decoded: false }),
            },
            data: {
                file: file,
                data: data,
            },
        }).then((response) => {
            return response.data;
        });
    }

    function _getFile(method, url, data = null, forApi = false) {
        return $http({
            method,
            url: `${window.apiProxyUrl}/gateway/${url}`,
            data,
            responseType: "blob",
        }).then((response) => response);
    }

    _detectDevice = () => {
        let isMobile = _screenSize.on("xs, sm", (isMatch) => {
            isMobile = isMatch;
        });
        if (isMobile) {
            Swal.fire(
                "Dispositivo Móvil Detectado!",
                "Para una mejor comodidad, le recomendamos usar una Laptop o PC.",
                "success",
            );
        } else {
            $timeout(() => {
                document.getElementById("menu_toggle").click();
            }, 1100);
        }
    };

    function _print(method, url, data = null) {
        return $http({
            method: method,
            url: url,
            data: data
        }).then((response) => {
            return response.data;
        });
    }

    service.getData = _getData;
    service.getDataFile = _getDataFile;
    service.uploadFile = _uploadFile;
    service.getFile = _getFile;
    service.detectDevice = _detectDevice;
    service.print = _print;
    return service;
}

//Toastr Notifications//
app.factory("toastService", function () {
    return {
        toastr: function (...rest) {
            let obj = {
                type: "warning",
                message: "",
                title: "",
                timeOut: null,
                extendedTimeOut: null,
                positionClass: null,
            };
            if (rest.length > 0) {
                const [
                    optionsOrType,
                    message,
                    title,
                    positionClass,
                    timeOut,
                    extendedTimeOut,
                ] = rest;

                if (optionsOrType !== null && typeof optionsOrType === "object") {
                    obj.type = optionsOrType.type;
                    obj.message = optionsOrType.message;
                    obj.title = optionsOrType.title;
                    obj.timeOut = optionsOrType.timeOut;
                    obj.extendedTimeOut = optionsOrType.extendedTimeOut;
                    obj.positionClass = optionsOrType.positionClass;
                } else {
                    obj.type = optionsOrType;
                    obj.message = message;
                    obj.title = title;
                    obj.timeOut = timeOut;
                    obj.extendedTimeOut = extendedTimeOut;
                    obj.positionClass = positionClass;
                }
            }

            toastr[obj.type](obj.message, obj.title, {
                closeButton: true,
                debug: false,
                newestOnTop: true,
                progressBar: true,
                positionClass: obj.positionClass || "toast-bottom-center",
                preventDuplicates: true,
                timeOut: obj.timeOut || 5000,
                extendedTimeOut: obj.extendedTimeOut || 1500,
            });
        },
    };
});

app.factory("modalService", modalService);
modalService.$inject = ["$uibModal", "$mdDialog"];

function modalService($uibModal, $mdDialog) {
    return {

        /**
         *
         * @param {object} params {controller, template, size, params, keyboard=false, animation = true, windowClass = null, scope, props = {}}
         * @returns object
         */
        openModalCustom: function ({
            controller,
            template,
            component,
            size,
            params,
            keyboard = false,
            animation = true,
            windowClass = null,
            windowTopClass,
            openedClass,
            scope,
            props = {},
        }) {
            let templateUrl = "";

            templateUrl = `/Home/Index?name=${template}`;

            return $uibModal.open({
                animation,
                templateUrl,
                controller,
                controllerAs: "$ctrl",
                component,
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
                    },
                },
            });
        },
        open: function ({
            controller,
            template,
            component,
            size,
            params,
            keyboard = false,
            animation = true,
            windowClass = null,
            windowTopClass,
            openedClass,
            scope,
            props = {},
        }) {
            let templateUrl = "";

            templateUrl = `/Home/Index?name=${template}`;

            return $uibModal.open({
                animation,
                templateUrl,
                controller,
                controllerAs: "$ctrl",
                component,
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
                    },
                },
            });
        },
        openWithComponent: function ({ component, params, size, windowClass }) {
            return $uibModal.open({
                animation: true,
                component,
                size,
                windowClass,
                backdrop: "static",
                resolve: {
                    params: function () {
                        return params;
                    },
                },
            })
        }
    };
}

//FILTERS GENERAL
app.filter("estadoPrimario", function ($sce) {
    return function (text) {
        return text
            ? $sce.trustAsHtml(
                "<span class='label label-success font-weight-100'>Activo</span>",
            )
            : $sce.trustAsHtml(
                "<span class='label label-danger font-weight-100'>Inactivo</span>",
            );
    };
});

app.filter("estadoSecundario", function ($sce) {
    return function (text) {
        return text
            ? $sce.trustAsHtml("<i class='fa fa-circle text-success'></i>")
            : $sce.trustAsHtml("<i class='fa fa-circle text-warning'></i>");
    };
});

app.filter("sino", function ($sce) {
    return function (text) {
        return text
            ? $sce.trustAsHtml("<span class='text-success'>SI</span>")
            : $sce.trustAsHtml("<span class='text-info'>NO</span>");
    };
});
app.filter("tipo", function ($sce) {
    return function (text) {
        return text
            ? $sce.trustAsHtml("<span class='text-success'>PROVEEDOR</span>")
            : $sce.trustAsHtml("<span class='text-info'>CLIENTE</span>");
    };
});
app.filter("ambienteSri", function ($sce) {
    return function (text) {
        let sriEnvironment = text == "2" ? true : false;
        return sriEnvironment
            ? $sce.trustAsHtml("<span class='text-success'>PRODUCCIÓN</span>")
            : $sce.trustAsHtml("<span class='text-warning'>PRUEBAS</span>");
    };
});
app.filter("tipoEmisionSri", function ($sce) {
    return function (text) {
        return text
            ? $sce.trustAsHtml("<span class='text-success'>NORMAL</span>")
            : $sce.trustAsHtml("<span class='text-info'></span>");
    };
});
//Filter tipo Iva
app.filter("mapTipoIva", () => {
    return function (idTipoIva, tipoIvas) {
        let result = tipoIvas.reduce(
            (acc, curr) => ({
                ...acc,
                [curr.idTipoIva]: curr.descripcion,
            }),
            {
                0: "Tipo Iva",
            },
        );
        return !idTipoIva ? result[0] : result[idTipoIva];
    };
});

app.filter("cellFilterTipoIva", () => {
    let result = {};

    return (input, context) => {
        let fieldLevel =
            context.editDropdownOptionsArray == undefined
                ? context.col.colDef
                : context;
        let map = fieldLevel.editDropdownOptionsArray;
        let idField = fieldLevel.editDropdownIdLabel;
        let valueField = fieldLevel.editDropdownValueLabel;

        if (typeof map !== "undefined") {
            for (let value of map) {
                result[value[idField]] = value.descripcion;
                //  result[idField] = value.descripcion
            }
        }

        if (!input) {
            return result[0];
        } else {
            return result[input];
        }
    };
});

app.filter("cellFilterBodega", () => {
    let result = {
        0: "Seleccione Bodega",
    };
    return (input, context) => {
        let fieldLevel =
            context.editDropdownOptionsArray == undefined
                ? context.col.colDef
                : context;
        let map = fieldLevel.editDropdownOptionsArray;
        let idField = fieldLevel.editDropdownIdLabel;
        let valueField = fieldLevel.editDropdownValueLabel;

        if (typeof map !== "undefined") {
            for (let value of map) {
                result[value.idBodega] = value[valueField];
            }
        }

        if (!input) {
            return result[0];
        } else {
            return result[input];
        }
    };
});

// app.directive('autoocus')

//Filter bodegas
app.filter("mapBodega", () => {
    return function (idBodega, bodegas) {
        if (!bodegas || bodegas.length === 0)
            return {
                0: "Seleccionar bodega",
            };

        let result = bodegas.reduce(
            (acc, curr) => ({
                ...acc,
                [curr.idBodega]: curr.descripcion,
            }),
            {
                0: "Seleccionar bodega",
            },
        );
        return !idBodega ? result[0] : result[idBodega];
    };
});

app.filter("estadoPago", () => {
    return function (text) {
        let template;
        if (text == "PE")
            template =
                "<span class='label label-danger font-weight-100'>Pendiente</span>";
        if (text == "PP")
            template =
                "<span class='label label-info font-weight-100'>Pendiente-Parcial</span>";
        if (text == "PA")
            template =
                "<span class='label label-success font-weight-100'>Pagada</span>";
        return $sce.trustAsHtml(template);
    };
});

app.filter("mapTipoImpuesto", () => {
    return (idTipoImpuesto, tipoImpuestos) => {
        let result = tipoImpuestos.reduce(
            (acc, curr) => ({
                ...acc,
                [curr.idTipoImpuestoRenta]: curr.descripcion.toUpperCase(),
            }),
            {
                0: "Seleccione el Tipo Impuesto",
            },
        );
        return !idTipoImpuesto ? result[0] : result[idTipoImpuesto];
    };
});
app.filter("mapRetencionIva", () => {
    return (idRetencionIva, retencionesIvas) => {
        let result = retencionesIvas.reduce(
            (acc, curr) => ({
                ...acc,
                [curr.idRetencionIva]: curr.descripcion.toUpperCase(),
            }),
            {
                0: "Seleccione Retención de IVA",
            },
        );
        return !idRetencionIva ? result[0] : result[idRetencionIva];
    };
});
app.filter("mapTarifa", mapTarifa);

function mapTarifa() {
    let result = {
        0: "Seleccione Tarifa",
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
    };
}

app.filter("mapMedida", mapMedida);

function mapMedida() {
    let result = {
        0: "Seleccione Médida",
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
    };
}

app.filter("mapTipoIce", () => {
    let result = {
        0: "Seleccione el Tipo Ice",
    };
    return (input, tipoIces) => {
        if (tipoIces === null || tipoIces == undefined) return result[0];
        for (let item of tipoIces) {
            result[item.codigo] = item.descripcion;
        }
        return result[input];
    };
});


app.filter('roundTo', ['formulario', function (fS) {
    return function (input, decimals) {
        var number = parseFloat(input); // Convertir a número

        if (!isNaN(number)) {
            return fS.roundNumber(number, decimals || 2); // Redondear a 2 decimales por defecto
        }
        return input;
    }
}]);
