//@ts-check
(function () {

    'use strict';


    app.directive('shouldFocus', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.shouldFocus, function (newVal) {
                    if (newVal && element.prop("class").indexOf("active")) {
                        var par = element.parent("ul");
                        var cellHeight = element.children().innerHeight();
                        var maxHeight = par.height();
                        var startIndex = Math.floor(maxHeight / cellHeight);

                        if (scope.$index > startIndex) {
                            var scroll = (scope.$index - startIndex) * cellHeight;
                            par.scrollTop(scroll);
                        }
                        if (scope.$index === 0) {
                            par.scrollTop(0);
                        }
                    }
                });
            }
        }
    }])
    //Para Doble scroll en los documentos
    app.directive('master', [function () { //declaration
        function link(scope, element) {
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
    }])




    app.directive('decimal', [function () {
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
    }]);

    //Directiva para numeros enteros y decimales
    app.directive('validNumber', [function () {
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
    }]);

    //DIRECTIVA PARA ENTRADA DE LETRAS MAYUSCULAS
    app.directive('touppercase', [function () {
        let teclaAnterior = "";
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, modelCtrl) {

                element.on("keydown", event => {
                    teclaAnterior = teclaAnterior + " " + event.keyCode;
                    var arregloTA = teclaAnterior.split(" ");
                    if (event.keyCode == 32 && arregloTA[arregloTA.length - 2] == 32) {
                        event.preventDefault();
                    }
                })

                function removeAccents(input) {

                    let inputText = input.replace(/[\n\r]+/g, ' ') || " ";
                    // inputText = inputText.normalize('NFD')
                    //     .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1").normalize();
                    // inputText = inputText.replace(/[`#$^*Ç¨_|+\=?'´",<>\{\}\[\]\\]/gi, '').trim()
                    modelCtrl.$setViewValue(inputText);
                    modelCtrl.$render();
                    return inputText.toUpperCase();
                }


                modelCtrl.$parsers.push(removeAccents);
                element.css("text-transform", "uppercase");
            }
        };
    }]);

    //DIRECTIVA PARA ENTRADA DE LETRAS MINUSCULAS
    app.directive('tolowercase', [function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (input) {
                    return input ? input.toLowerCase() : "";
                });
                element.css("text-transform", "lowercase");
            }
        };
    }]);

    //Directiva que permite entrada de solo Letras en input
    app.directive('validLetra', [function () {
        return {
            require: 'ngModel',
            link: function (scope, element,) {
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
    }])

    //Validar Email
    app.directive('validateEmail', [function () {
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
    }]);


    //Focus Input
    app.directive('autoFocus', [function () {
        return {
            restrict: 'A',
            link: function (scope, element,) {
                element.focus();
            }
        };
    }]);

    app.directive('focusSearchArticulo', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element,) {
                element.bind('click', function () {
                    $timeout(() => {
                        element.focus();
                    })
                })
            }
        }
    }])

    app.directive('tooltip', [function () {
        return {
            restrict: 'A',
            link: function (scope, element,) {
                $(element).hover(function () {
                    // on mouseenter
                    $(element).tooltip('show');
                }, function () {
                    // on mouseleave
                    $(element).tooltip('hide');
                });
            }
        };
    }]);

    //keyboard disable
    app.directive('keyboardDisable', [function () {
        return function (scope, elem,) {
            elem.on('keydown', function (e) {
                if (e.which === 9) {
                    return false;
                }
            })
        }
    }])

    app.directive('inputFocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'AC',
            link: function (_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 0);
            }
        }
    }]);

    app.directive('ngEnter', [function () {
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
    }])

    app.directive('stopEvent', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('click', function (e) {
                    e.stopPropagation();
                });
            }
        };
    }]);


    //Permiso Update Artcicle
    app.directive('updateArticle', ['$rootScope', function ($rootScope) {
        return {

            link: function (scope, element) {

                if (!$rootScope.articlePermission.leer) {
                    element[0].style.display = 'none';
                }

                if (!$rootScope.articlePermission.editar) {
                    element[0].style.display = 'none';
                }
            },
        }
    }])

    app.directive('estabStock', ['$compile', 'articuloService', '$timeout', '$log', function ($compile, articuloSvc, $timeout, $log) {
        return {
            restrict: 'A',
            scope: {
                article: "=",
                placement: "@"
            },
            link: function (scope, element) {
                // Hacer que el elemento sea visualmente interactivo
                element.addClass('estab-stock-trigger');
                element.css('cursor', 'pointer');

                // Variable para evitar múltiples llamadas
                var isLoadingData = false;

                // Función para mostrar SweetAlert con datos de stock
                function showStockDetails() {
                    if (isLoadingData) return;
                    isLoadingData = true;

                    // Mostrar SweetAlert con indicador de carga
                    Swal.fire({
                        title: '<i class="mdi mdi-information-outline mr-2"></i>Bodega-Stock',
                        html: '<div class="text-center p-3"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Cargando datos de stock...</p></div>',
                        showConfirmButton: false,
                        showCloseButton: true,
                        width: 'auto',
                        padding: '0',
                        customClass: {
                            container: 'stock-swal-container',
                            popup: 'stock-swal-popup'
                        },
                        didOpen: () => {
                            // Cargar datos cuando el modal esté abierto
                            loadStockData();
                        },
                        didClose: () => {
                            isLoadingData = false;
                        }
                    });
                }

                // Función para cargar datos de stock
                function loadStockData() {
                    $log.info('Cargando datos de stock para artículo ID:', scope.article.idArticulo);

                    if (!scope.article || !scope.article.idArticulo) {
                        updateSwalContent('<div class="text-danger p-3">Error: Artículo inválido</div>');
                        isLoadingData = false;
                        return;
                    }

                    articuloSvc.getDataStock(scope.article.idArticulo)
                        .then(function (response) {
                            $log.info('Datos de stock recibidos:', response);

                            var html = `
                            <div class="p-0">
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered mb-0">
                                        <thead class="thead-light">
                                            <tr>
                                                <th>Estab.</th>
                                                <th>Bodega</th>
                                                <th>Stock</th>
                                                <th>Ub.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                        `;

                            if (response && response.length > 0) {
                                response.forEach(function (branch) {
                                    if (branch.warehouses && branch.warehouses.length > 0) {
                                        var rowspanCount = branch.warehouses.length;

                                        branch.warehouses.forEach(function (wh, idx) {
                                            html += '<tr>';

                                            if (idx === 0) {
                                                html += '<td rowspan="' + rowspanCount + '">' + branch.branchOffice + '</td>';
                                            }

                                            html += '<td>' + wh.bodega + '</td>';
                                            html += '<td>' + wh.stock + '</td>';
                                            html += '<td>' + wh.ubicacion + '</td>';
                                            html += '</tr>';
                                        });
                                    }
                                });
                            } else {
                                html += '<tr><td colspan="4" class="text-center">No hay datos disponibles</td></tr>';
                            }

                            html += '</tbody></table></div></div>';

                            updateSwalContent(html);
                            isLoadingData = false;
                        })
                        .catch(function (error) {
                            $log.error('Error al cargar datos de stock:', error);
                            updateSwalContent('<div class="text-danger p-3">Error al cargar datos de stock</div>');
                            isLoadingData = false;
                        });
                }

                // Función para actualizar el contenido del SweetAlert
                function updateSwalContent(html) {
                    Swal.update({
                        html: html
                    });
                }

                // Evento de clic para mostrar los detalles
                element.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showStockDetails();
                });

                // Evento para hover opcional (puedes descomentar si quieres activarlo)
                var hoverTimer;
                element.on('mouseenter', function () {
                    hoverTimer = $timeout(function () {
                        showStockDetails();
                    }, 500); // Retraso para evitar activación accidental
                });

                element.on('mouseleave', function () {
                    $timeout.cancel(hoverTimer);
                });

                // Limpiar eventos al destruir el scope
                scope.$on('$destroy', function () {
                    element.off('click');
                    // $timeout.cancel(hoverTimer); // Descomentar si usas hover
                });
            }
        };
    }]);

    app.directive('totalesVentaView', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.totalesVentaView, function (obj) {
                    if ($rootScope.usuarioPermiso !== null && typeof $rootScope.usuarioPermiso === 'object') {
                        let { sales } = $rootScope.usuarioPermiso;
                        if (sales.adicionales && !sales.adicionales.totalesVenta) {
                            element.remove();
                        }
                    }
                });
            }
        };
    }])




    /**
     * ====================================START DIRECTIVES SALES=============================
     */
    app.directive('btnCliente', ['modalService', 'nombreModalVenta', 'toastService', function (modalSvc, nombreModalVenta, tS) {
        return {
            restrict: 'A',
            scope: {
                resultModal: '&',
                params: '='
            },
            link: function (scope, element) {
                element.on('click', async function () {
                    if (typeof scope.params === 'object' && /^9{13}$/.test(scope.params.numeroIdentificacion)) {
                        tS.toastr('warning', 'Consumir Final no puede ser editada.');
                        return
                    }

                    let { fileCtrl, controllers, templates } = nombreModalVenta.CLIENTE;
                    let ctrl = (await import(fileCtrl))[controllers['M']];
                    let template = templates['M'];

                    let modalRef = modalSvc.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params: Object.assign({}, scope.params) || {},
                        isRenderRazorPartial: true
                    })

                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            scope.resultModal({
                                result
                            })
                        }
                    })

                })
            }
        }
    }])

    app.directive('btnClienteLista', ['modalService', 'nombreModalVenta', function (modalSvc, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                resultModal: '&',
                params: '='
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    let { fileCtrl, controllers, templates } = nombreModalVenta.CLIENTE;
                    let ctrl = (await import(fileCtrl))[controllers['ML']];
                    let template = templates['ML'];

                    let modalRef = modalSvc.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params: Object.assign({}, scope.params) || {},
                        isRenderRazorPartial: true
                    })

                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            scope.resultModal({
                                result
                            })
                        }
                    })

                })
            }
        }
    }])

    app.directive('clienteInfoPopover', ['toastService', function (tS) {
        return {
            restrict: 'A',
            scope: {
                customer: '=',
                popoverPlacement: '@',
                infoAdicionalDocumento: '='
            },
            link: function (scope, element) {

                $(element).popover({
                    content: function () {

                        let placas = scope.customer.placas || [];
                        let infoAdicionalDocumento = scope.infoAdicionalDocumento || [];
                        let placasSeleccionadas = infoAdicionalDocumento.map(v => v.valor);

                        // Crear una cadena para almacenar el contenido HTML de las casillas de verificación
                        let checkboxesHTML = '';

                        // Iterar sobre la matriz "placas" y generar una casilla de verificación para cada elemento
                        placas.forEach(function (placa) {
                            let isChecked = placasSeleccionadas.includes(placa); // Verificar si la placa está en el array de placas seleccionadas

                            checkboxesHTML += `
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="checkbox_${placa}" value="${placa}" ${isChecked ? 'checked' : ''}>
                                    <label class="form-check-label" for="checkbox_${placa}">
                                        ${placa}
                                    </label>
                                </div>
                            `;
                        });

                        let popoverContentHTML = `
                        <div class="d-flex flex-column">
                            <div class="p-0">
                                <span><b>Nombre Fiscal:</b> ${scope.customer.nombreFiscal}</span>
                            </div>
                            <div class="p-0">
                                <span><b>Nombre Comercial:</b> ${scope.customer.nombreComercial}</span>
                            </div>
                            <div class="p-0">
                                <span><b>Correo:</b> ${scope.customer.correo || ''}</span>
                            </div>
                            <div class="p-0">
                                <span><b>Teléfono:</b> ${scope.customer.telefono || ''}</span>
                            </div>
                            <div class="p-0">
                                <span><b>Dirección:</b> ${scope.customer.direccion || ''}</span>
                            </div>
                            <div class="p-0">
                                <span><b>Placa:</b> </span>
                                 ${checkboxesHTML}
                            </div>
                        `;

                        // Convert the HTML string to a jQuery object
                        let $popoverContent = $(popoverContentHTML);

                        $popoverContent.find('.form-check-input').change(function () {
                            let valor = $(this).val();
                            let isChecked = $(this).is(':checked');

                            if (!scope.infoAdicionalDocumento) return


                            let index = scope.infoAdicionalDocumento.findIndex(function (item) {
                                return item.valor === valor;
                            });

                            if (isChecked) {
                                if (index === -1) {
                                    scope.infoAdicionalDocumento.push({
                                        nombre: 'Placa',
                                        valor: valor
                                    });
                                    tS.toastr('success', 'Agregado en información adicional del documento')
                                }
                            } else {
                                if (index !== -1) {
                                    scope.infoAdicionalDocumento.splice(index, 1);
                                }
                            }

                        });

                        return $popoverContent;
                    },
                    html: true,
                    trigger: 'manual',
                    placement: scope.popoverPlacement,
                });


                // Toggle popover on click
                element.on('click', function () {
                    $(this).popover('toggle');
                });

                // Hide popover when clicking outside
                $(document).on('click', function (event) {
                    if (!$(element).is(event.target) && $(element).has(event.target).length === 0 && $('.popover').has(event.target).length === 0) {
                        $(element).popover('hide');
                    }
                });

            }
        };
    }]);

    app.directive('clienteSearchDrtv', ['$compile', 'clienteService', function ($compile, clienteSvc) {
        return {
            restrict: 'A',
            scope: {
                onSelect: '&',
                onKeyupCliente: '&',
                ngModel: '='
            },
            link: function (scope, element) {
                scope.cliente = {
                    nombreCliente: scope.ngModel
                }
                scope.searchCustomer = function (textSearch) {
                    if (textSearch.length > 1) {
                        return clienteSvc.search({ textSearch })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                }

                element.attr('uib-typeahead', 'item as item.nombreFiscal for item in searchCustomer($viewValue)');
                element.attr('typeahead-on-select', 'onSelect({result: $item})');
                element.attr('typeahead-template-url', 'autocompleteClienteTemplate.html');
                element.attr('ng-keyup', 'onKeyupCliente()');
                element.attr('typeahead-editable', 'false');
                element.attr('ng-value', 'ngModel');


                // element.attr('ng-model', 'ngModel')
                element.removeAttr('cliente-search-drtv');

                // Add CSS styles dynamically
                element.attr('style', 'position:relative;');
                element.attr('popover-append-to-body', 'true');
                element.attr('popover-placement', 'bottom-left');
                element.attr('popover-popup-delay', '200');
                element.attr('popover-trigger', 'mouseenter');

                // Create a style element to apply custom CSS styles
                var customStyle = document.createElement('style');
                customStyle.innerHTML = `
                    [uib-typeahead-popup].dropdown-menu {
                        z-index: 999999 !important;
                        max-height: 250px;
                        overflow-y: auto;
                        width: auto;
                    }
                `;

                document.head.appendChild(customStyle);
                $compile(element)(scope);
            }
        };
    }]);


    /**
     * Buscador de cliente para venta en donde incluye a mas del buscador consultar datos del cliente al SRI en caso de no encontrar datos en la base de datos AcontPlus
     */
    app.directive('customerSearchSaleDrtv', ['$compile', 'clienteService', 'toastService', function ($compile, clienteSvc, tS) {
        return {
            restrict: 'A',
            scope: {
                onSelect: '&',
                onKeyup: '&',
                ngModel: '<',
                functionTrigger: '&',
                tiposIdentificacion: '<'
            },
            require: 'ngModel',
            link: function (scope, element) {
                scope.cliente = {
                    nombreCliente: scope.ngModel,
                }

                let validationSearchCustomerExternal = false;

                function verificarNumero(numero) {
                    numero = numero ? numero.trim() : ""

                    if (![10, 13].includes(numero.length)) return;

                    if (isNaN(numero)) return

                    if (numero.length === 13 && numero.slice(-3) !== "001") return;

                    return true;
                }

                function getIdTipoIdentificacion(codigo) {
                    let idTipoIdentificacion = 0;
                    if (Array.isArray(scope.tiposIdentificacion)) {
                        let dataTipoIdentificacion = scope.tiposIdentificacion.find(ti => ti.codigoSri === codigo);
                        if (dataTipoIdentificacion) {
                            idTipoIdentificacion = dataTipoIdentificacion.idTipoIdentificacion;
                        }
                    }
                    return idTipoIdentificacion;
                }


                scope.checkTypeIdentification = async function () {

                    let textSearch = scope.ngModel; //Recuperamos valor ingresado


                    if (!validationSearchCustomerExternal) return;
                    scope.functionTrigger({
                        result: {
                            nombreFiscal: textSearch,
                        }
                    })

                    //Verificamos si el campo ingresado es cedula o ruc (longitud caracteres)
                    if (!verificarNumero(textSearch)) return [];

                    //Numero de RUC
                    if (textSearch.length === 13) {
                        try {
                            showLoader();

                            let { numeroRuc, razonSocial, direccion, telefono, email, error } = await clienteSvc.checkClientSRIByRUC(textSearch);
                            hideLoader();
                            if (!numeroRuc) {
                                tS.toastr('warning', error)
                                return
                            }

                            let codigoTipoIdentificacion = '04';

                            //retornamos datos al controlador principal donde llamamos la directiva
                            scope.functionTrigger({
                                result: {
                                    nombreFiscal: textSearch,
                                    numeroIdentificacion: numeroRuc,
                                    identificacionComprador: numeroRuc,
                                    razonSocialComprador: razonSocial,
                                    nombreComercial: razonSocial,
                                    direccionComprador: direccion || null,
                                    telefono: telefono || null,
                                    email: email || null,
                                    idCliente: 0,
                                    codigoTipoIdentificacion,
                                    idTipoIdentificacion: getIdTipoIdentificacion(codigoTipoIdentificacion)
                                }
                            })
                            scope.$apply();
                        } catch (error) {
                            console.log(error);
                            hideLoader();
                            scope.functionTrigger({
                                result: {
                                    nombreFiscal: textSearch,
                                }
                            })
                        }
                    }

                    //Numero de Cedula
                    if (textSearch.length === 10) {
                        try {
                            showLoader();
                            let { identificacion, nombreCompleto, direccion, telefono, email, error } = await clienteSvc.checkClientSRIByCedula(textSearch)
                            hideLoader();
                            if (!identificacion || !nombreCompleto) {
                                tS.toastr('warning', error)
                                return
                            }


                            let codigoTipoIdentificacion = '05';
                            scope.functionTrigger({
                                result: {
                                    nombreFiscal: textSearch,
                                    numeroIdentificacion: identificacion,
                                    identificacionComprador: identificacion,
                                    razonSocialComprador: nombreCompleto,
                                    nombreComercial: nombreCompleto,
                                    direccionComprador: direccion || null,
                                    telefono: telefono || null,
                                    email: email || null,
                                    idCliente: 0,
                                    codigoTipoIdentificacion,
                                    idTipoIdentificacion: getIdTipoIdentificacion(codigoTipoIdentificacion)
                                }
                            })
                            scope.$apply();
                        } catch (error) {
                            console.log(error);
                            hideLoader();
                            scope.functionTrigger({
                                result: {
                                    nombreFiscal: textSearch,
                                }
                            })
                        }
                    }

                }


                scope.search = function (textSearch) {
                    validationSearchCustomerExternal = false;
                    if (textSearch.length < 2) return;

                    return clienteSvc.search({ textSearch }).then(response => {
                        if (response.code === "0") {
                            validationSearchCustomerExternal = true;
                        }
                        return response;
                    })
                        .catch(error => {
                            console.log(error);
                        })

                }

                element.attr('uib-typeahead', 'item as item.nombreFiscal for item in search($viewValue)');
                element.attr('typeahead-on-select', 'onSelect({result: $item})');
                element.attr('typeahead-template-url', 'customerSearchSaleTemplate.html');
                element.attr('ng-keyup', 'onKeyup()');
                element.attr('typeahead-editable', 'true');
                element.attr('ng-value', 'ngModel');
                element.attr('ng-enter', 'checkTypeIdentification()');
                element.removeAttr('customer-search-sale-drtv');


                // Add CSS styles dynamically
                element.attr('style', 'position:relative;');
                element.attr('popover-append-to-body', 'true');
                element.attr('popover-placement', 'bottom-left');
                element.attr('popover-popup-delay', '200');
                element.attr('popover-trigger', 'mouseenter');

                // Create a style element to apply custom CSS styles
                var customStyle = document.createElement('style');
                customStyle.innerHTML = `
                    [uib-typeahead-popup].dropdown-menu {
                        z-index: 999999 !important;
                        max-height: 250px;
                        overflow-y: auto;
                        width: auto;
                    }
                `;

                document.head.appendChild(customStyle);
                $compile(element)(scope);
            }
        };
    }]);







    app.directive('btnEmpresa', ['modalService', 'nombreModalVenta', function (modalSvc, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    let fileCtrl = nombreModalVenta.EMPRESA.fileCtrl;
                    let ctrl = nombreModalVenta.EMPRESA.controller
                    let template = nombreModalVenta.EMPRESA.template
                    let controller = (await import(fileCtrl))[ctrl];
                    let id = typeof scope.params === 'object' ? scope.params.idEmpresa : 0


                    const modalDialogRef = modalSvc.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        isRenderRazorPartial: true,
                        params: {
                            id
                        },
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                })

            }
        }
    }])


    app.directive('btnEmpleado', function (modalService, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    let fileCtrl = nombreModalVenta.EMPLEADO.fileCtrl;
                    let ctrl = nombreModalVenta.EMPLEADO.controller
                    let template = nombreModalVenta.EMPLEADO.template
                    let controller = (await import(fileCtrl))[ctrl];


                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: Object.assign({}, scope.params) || {},
                        isRenderRazorPartial: true,
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                })

            }
        }
    })


    app.directive('btnCargo', function (modalService, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    let fileCtrl = nombreModalVenta.CARGO.fileCtrl;
                    let ctrl = nombreModalVenta.CARGO.controller
                    let template = nombreModalVenta.CARGO.template
                    let controller = (await import(fileCtrl))[ctrl];


                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: Object.assign({}, scope.params) || {},
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                })

            }
        }
    })


    //https://www.daterangepicker.com/
    app.directive('dateRangeFilter', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                currentDate: '=',
                startDate: '=',
                endDate: '=',
                resultRangeDate: '&',
            },
            link: function (scope, element) {
                let thisMoment = moment(new Date())
                scope.startDate = thisMoment;
                scope.endDate = thisMoment;
                scope.dateRangePicker = {
                    date: {
                        startDate: thisMoment,
                        endDate: thisMoment,
                    },
                    picker: null,
                    options: {
                        pickerClasses: 'custom-display', //angular-daterangepicker extra
                        buttonClasses: 'btn',
                        applyButtonClasses: 'btn-success',
                        cancelButtonClasses: 'btn-danger',
                        locale: {
                            applyLabel: "Aplicar",
                            cancelLabel: 'Cancelar',
                            customRangeLabel: 'Rango Personalizado',
                            separator: ' - ',
                            format: "YYYY-MM-DD", //will give you 2017-01-06
                            //format: "D-MMM-YY", //will give you 6-Jan-17
                            //format: "D-MMMM-YY", //will give you 6-January-17
                        },
                        ranges: {
                            'Hoy': [moment(), moment()],
                            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Últimos 5 días': [moment().subtract(4, 'days'), moment()],
                            'Últimos 10 días': [moment().subtract(9, 'days'), moment()],
                            'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                            'El mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        },
                        eventHandlers: {
                            'apply.daterangepicker': function () {

                                scope.startDate = scope.dateRangePicker.date.startDate
                                scope.endDate = scope.dateRangePicker.date.endDate;

                                scope.resultRangeDate({
                                    result: {
                                        startDate: scope.startDate,
                                        endDate: scope.endDate
                                    }
                                })
                            }
                        }
                    }
                };
                var html = `<input name="date-range-filter" date-range-picker class="form-control date-picker border-select" type="text"
                ng-model="dateRangePicker.date" picker="dateRangePicker.picker"
                picker-classes="extra-class-names" min="'2014-02-23'" max="dateRangePicker.maxDate"
                options="dateRangePicker.options" options="{locale: {separator: " :"}}" />`;
                var e = $compile(html)(scope);
                element.replaceWith(e);
            }
        };

    })


    /**
     * ---------------------------------------
     */

    app.directive('btnTransportista', function (modalService, nombreModalLogistica) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    let fileCtrl = nombreModalLogistica.TRANSPORTISTA.fileCtrl;
                    let ctrl = nombreModalLogistica.TRANSPORTISTA.controllers['M'];
                    let template = nombreModalLogistica.TRANSPORTISTA.templates['M'];
                    let controller = (await import(fileCtrl))[ctrl];


                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: scope.params || {},
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                });
            }
        }
    })

    app.directive('btnVehiculo', function (modalService, nombreModalLogistica) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    let fileCtrl = nombreModalLogistica.VEHICULO.fileCtrl;
                    let ctrl = nombreModalLogistica.VEHICULO.controllers['M'];
                    let template = nombreModalLogistica.VEHICULO.templates['M'];
                    let controller = (await import(fileCtrl))[ctrl];


                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: scope.params || {},
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                });
            }
        }
    })

    /**
     *
     * ==========================SEND DOCS. BY EMAIL =========================
     * @warning OldVersion
     *
     */
    app.directive('btnSendToEmail', function (modalService, nombreModalCommon) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
                typeSend: '=',
                getParamToSendMail: '&' //funcion que arma parametro necesario para el envio de correo
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    let fileCtrl = nombreModalCommon.MAIL.fileCtrl;
                    let ctrl = nombreModalCommon.MAIL.controllers['ME'];
                    let template = nombreModalCommon.MAIL.templates['ME'];
                    let controller = (await import(fileCtrl))[ctrl];

                    let params = scope.getParamToSendMail({
                        params: scope.params
                    }) || scope.params;

                    modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: {
                            ...params,
                            typeSend: scope.typeSend
                        }
                    })

                })
            }
        }
    })


    /**
     * @description Nueva Version usar esta en proximos modulos
     */
    app.directive('actionSendMail', ['modalService', 'nombreModalCommon', function (modalSvc, nombreModalCommon) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
                typeSend: '=',
                getParamToSendMail: '&' //funcion que arma parametro necesario para el envio de correo
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    let fileCtrl = nombreModalCommon.SEND_MAIL.fileCtrl;
                    let ctrl = nombreModalCommon.SEND_MAIL.controllers['MSM'];
                    let template = nombreModalCommon.SEND_MAIL.templates['MSM'];
                    let controller = (await import(fileCtrl))[ctrl];


                    let params = scope.getParamToSendMail({
                        params: scope.params
                    }) || scope.params;


                    modalSvc.open({
                        controller,
                        template,
                        size: 'md',
                        params: {
                            data: structuredClone(params)
                            //...params,
                            // typeSend: scope.typeSend
                        }
                    })

                })
            }
        }
    }])



    /**
     * -------------------------------SEND DOCS. BY WHATSAPP-----------------------
     *
     */

    app.directive('actionSendToWhatsApp', ['modalService', 'nombreModalCommon', 'mainService', 'toastService', function (modalSvc, nombreModalCommon, mS, tS) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
                hasPermission: '=',
                typeSend: '=',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    showLoader();
                    let json = JSON.stringify({ tipo: 2, idEntidad: 0 });
                    let url = `Config/WhatsappUsage/?json=${json}`;

                    showLoader();
                    let response = await mS.getData('get', url).finally(() => hideLoader());

                    if (response.code === "0") {
                        tS.toastr({
                            type: 'warning',
                            message: response.message
                        })
                        return
                    }

                    if (response.code == '0') {
                        Swal.fire({ title: 'Aviso', text: response.message, icon: 'warning' })
                        return
                    }


                    if (response.message) {
                        Swal.fire({ title: 'Aviso', text: response.message, icon: 'info' })
                        return
                    }

                    let { fileCtrl, template, controller } = nombreModalCommon.SEND_WHATSAPP;
                    let ctrl = (await import(fileCtrl))[controller];
                    const modalRef = modalSvc.open({
                        controller: ctrl,
                        template,
                        size: 'md',
                        params: {
                            data: structuredClone(scope.params) || {},
                        }
                    })

                    modalRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })


                });
            }
        }
    }])

    app.directive('openModalAdditionalDataDocument', function (modalService, nombreModalCommon) {
        return {
            restrict: 'A',
            scope: {
                datosAdicionales: '=',
                isView: '=',
                getDataAdditionalDocument: '&'
            },
            link: function (scope, element) {

                element.on('click', async function () {

                    let { fileCtrl, controller, template } = nombreModalCommon.INFO_ADICIONAL_DOC;

                    let ctrl = (await import(fileCtrl))[controller]



                    let params = {
                        isView: scope.isView,
                        infoAdicionalDocumento: scope.datosAdicionales
                    }

                    let modalRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'lg',
                        params,
                    })

                    modalRef.result.then(function (result) {
                        if (typeof result === 'object') {
                            scope.getDataAdditionalDocument({
                                result
                            })
                        }
                    })
                })

            }
        }
    })


    //==================================================ineventario=================================
    app.directive('articleSearchDrtv', function ($compile, articuloService) {
        return {
            restrict: 'A',
            scope: {
                onSelect: '&',
                onKeyupArticle: '&',
                ngModel: '='
            },
            link: function (scope, element) {
                scope.cliente = {
                    descripcion: scope.ngModel
                }
                scope.searchArticle = function (textSearch) {
                    if (textSearch.length > 1) {
                        let json = {
                            busqueda: textSearch,
                            condicion: false,
                            fraccionado: false,
                            pageIndex: 1,
                            pageSize: 50
                        }
                        return articuloService.search(json)
                            .catch(error => {
                                console.log(error);
                            })
                    }
                }

                element.attr('uib-typeahead', 'item as item.descripcion for item in searchArticle($viewValue)');
                element.attr('typeahead-on-select', 'onSelect({result: $item})');
                element.attr('typeahead-template-url', 'autocompleteArticleTemplate.html');
                element.attr('ng-keyup', 'onKeyupArticle()');
                element.attr('typeahead-editable', 'false');


                // element.attr('ng-model', 'ngModel')
                element.removeAttr('article-search-drtv');

                // Add CSS styles dynamically
                element.attr('style', 'position:relative;');
                element.attr('popover-append-to-body', 'true');
                element.attr('popover-placement', 'bottom-left');
                element.attr('popover-popup-delay', '200');
                element.attr('popover-trigger', 'mouseenter');

                // Create a style element to apply custom CSS styles
                var customStyle = document.createElement('style');
                customStyle.innerHTML = `
                    [uib-typeahead-popup].dropdown-menu {
                        z-index: 999999 !important;
                        max-height: 250px;
                        overflow-y: auto;
                        width: auto;
                    }
                `;

                document.head.appendChild(customStyle);
                $compile(element)(scope);
            }
        };
    });


    app.directive('userSearchDrtv', function ($compile, commonService, decodeToken) {
        return {
            restrict: 'A',
            scope: {
                onSelect: '&',
                onKeyup: '&',
                ngModel: '='
            },
            link: function (scope, element) {
                scope.dataSearchUser = {
                    nombreCompleto: scope.ngModel
                }
                scope.search = function (textSearch) {
                    if (textSearch.length > 1) {
                        let json = {
                            busqueda: textSearch,
                            userRoleId: decodeToken.userRoleId
                        }
                        return commonService.usuarioSearch(json).then(response => {
                            let usuarios = response;
                            return usuarios.map(item => ({
                                idUsuario: item.idUsuario,
                                nombreCompleto: item.nombreCompleto,
                                nombreUsuario: item.nombreUsuario,
                                nroIdentificacion: item.nroIdentificacion,
                            }))
                        })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                }

                element.attr('uib-typeahead', 'item as item.nombreCompleto for item in search($viewValue)');
                element.attr('typeahead-on-select', 'onSelect({result: $item})');
                element.attr('typeahead-template-url', 'autocompleteUserTemplate.html');
                element.attr('ng-keyup', 'onKeyup()');
                element.attr('typeahead-editable', 'false');


                // element.attr('ng-model', 'ngModel')
                element.removeAttr('user-search-drtv');

                // Add CSS styles dynamically
                element.attr('style', 'position:relative;');
                element.attr('popover-append-to-body', 'true');
                element.attr('popover-placement', 'bottom-left');
                element.attr('popover-popup-delay', '200');
                element.attr('popover-trigger', 'mouseenter');

                // Create a style element to apply custom CSS styles
                var customStyle = document.createElement('style');
                customStyle.innerHTML = `
                    [uib-typeahead-popup].dropdown-menu {
                        z-index: 999999 !important;
                        max-height: 250px;
                        overflow-y: auto;
                        width: auto;
                    }
                `;

                document.head.appendChild(customStyle);
                $compile(element)(scope);
            }
        };
    });



    app.directive('empleadoSearchDrtv', function ($compile, empleadoService) {
        return {
            restrict: 'A',
            scope: {
                onSelect: '&',
                onKeyup: '&',
                ngModel: '='
            },
            link: function (scope, element) {
                scope.cliente = {
                    nombreCliente: scope.ngModel
                }
                scope.search = function (textSearch) {
                    if (textSearch.length > 1) {
                        return empleadoService.search({ textSearch })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                }

                element.attr('uib-typeahead', 'item as item.nombreCompleto for item in search($viewValue)');
                element.attr('typeahead-on-select', 'onSelect({result: $item})');
                element.attr('typeahead-template-url', 'autocompleteEmpleadoTemplate.html');
                element.attr('ng-keyup', 'onKeyup()');
                element.attr('typeahead-editable', 'false');


                // element.attr('ng-model', 'ngModel')
                element.removeAttr('empleado-search-drtv');

                // Add CSS styles dynamically
                element.attr('style', 'position:relative;');
                element.attr('popover-append-to-body', 'true');
                element.attr('popover-placement', 'bottom-left');
                element.attr('popover-popup-delay', '200');
                element.attr('popover-trigger', 'mouseenter');

                // Create a style element to apply custom CSS styles
                var customStyle = document.createElement('style');
                customStyle.innerHTML = `
                    [uib-typeahead-popup].dropdown-menu {
                        z-index: 999999 !important;
                        max-height: 250px;
                        overflow-y: auto;
                        width: auto;
                    }
                `;

                document.head.appendChild(customStyle);
                $compile(element)(scope);
            }
        };
    });



    app.directive('providerSearchDrtv', function ($compile, proveedorService) {
        return {
            restrict: 'A',
            scope: {
                onSelect: '&',
                onKeyup: '&',
                ngModel: '=',
                isReturnData: "="
            },
            link: function (scope, element) {
                scope.proveedor = {
                    nombreProveedor: scope.ngModel
                }
                scope.search = function (textSearch) {
                    if (textSearch.length > 1) {
                        return proveedorService.search(textSearch).then(response => {
                            let proveedores = response || [];
                            return proveedores.map(proveedor => {
                                return {
                                    idProveedor: proveedor.idProveedor,
                                    idTipoClienteProveedor: proveedor.idTipoClienteProveedor,
                                    idTipoEntidad: proveedor.idTipoEntidad,
                                    idSubContribuyente: proveedor.idSubContribuyente,
                                    idTiempoCredito: proveedor.idTiempoCredito,
                                    idTipoIdentificacion: proveedor.idTipoIdentificacion,
                                    idCiudad: proveedor.idCiudad,
                                    numeroIdentificacion: proveedor.numeroIdentificacion,
                                    razonSocial: proveedor.razonSocial,
                                    nombreFiscal: proveedor.razonSocial,
                                    nombreComercial: proveedor.nombreComercial,
                                    direccion: proveedor.direccion,
                                    telefono: proveedor.telefono,
                                    correo: proveedor.correo,
                                    estado: proveedor.estado,
                                    validationSri: proveedor.validationSri,
                                    diasCredito: proveedor.diasCredito,
                                    codigoIndetificacion: proveedor.codigoIndetificacion
                                }
                            })
                        })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                }

                scope.onSelectProveedor = function (data) {
                    if (scope.isReturnData) {
                        showLoader();
                        proveedorService.getId(data.idProveedor).then(response => {
                            scope.onSelect({ result: response })
                        })
                            .catch((error) => {
                                console.log(error)
                            })
                            .finally(() => hideLoader())
                        return
                    }
                    scope.onSelect({ result: data })
                }

                element.attr('uib-typeahead', 'item as item.nombreFiscal for item in search($viewValue)');
                element.attr('typeahead-on-select', 'onSelectProveedor($item)');
                element.attr('typeahead-template-url', 'autocompleteProviderTemplate.html');
                element.attr('ng-keyup', 'onKeyup()');
                element.attr('typeahead-editable', 'true');


                // element.attr('ng-model', 'ngModel')
                element.removeAttr('provider-search-drtv');

                // Add CSS styles dynamically
                element.attr('style', 'position:relative;');
                element.attr('popover-append-to-body', 'true');
                element.attr('popover-placement', 'bottom-left');
                element.attr('popover-popup-delay', '200');
                element.attr('popover-trigger', 'mouseenter');

                // Create a style element to apply custom CSS styles
                var customStyle = document.createElement('style');
                customStyle.innerHTML = `
                    [uib-typeahead-popup].dropdown-menu {
                        z-index: 999999 !important;
                        max-height: 250px;
                        overflow-y: auto;
                        width: auto;
                    }
                `;

                document.head.appendChild(customStyle);
                $compile(element)(scope);
            }
        };
    });



    app.directive('articleFraccionadoInfoDrtv', function ($compile, $timeout, articuloService) {
        return {
            restrict: 'A',
            scope: {
                article: "=",
                placement: "@"
            },
            link: function (scope, element) {
                let isPopoverInitialized = false;
                var popoverOptions = {
                    title: '<i class="mdi mdi-information-outline"></i> Artículo Fraccionado',
                    content: function () {
                        isPopoverInitialized = true;
                        var popoverContent = ` <div class="table-responsive">
                                                <table class="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>N°.</th>
                                                            <th>Medida</th>
                                                            <th>Stock</th>
                                                            <th ng-repeat="item in tarifas">
                                                            {{item.tarifa}}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="small">
                                                        <tr ng-repeat="item in articlesFractionals">
                                                            <td>{{$index+1}}</td>
                                                            <td>{{item.medida}}</td>
                                                            <td>{{item.stock}}</td>
                                                            <td ng-repeat="tt in item.tarifas">
                                                                {{tt.precioVenta}}
                                                            </td>
                                                        <tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                             `;

                        const query = {
                            tipo: 4,
                            idArticulo: scope.article.idArticulo
                        }
                        articuloService.getArticlesFractionalInfo(query).then(response => {
                            scope.tarifas = response[0].tarifas;
                            scope.articlesFractionals = response;

                        }).catch(error => {
                            console.log(error)
                        })

                        // Compile the popover content with the scope
                        let compiledContent = $compile(popoverContent)(scope);
                        scope.$apply();
                        return compiledContent;

                    },
                    placement: scope.placement || 'left',
                    trigger: 'outsideClick',
                    html: true,
                    customClass: 'contentArticlePopover',
                    container: 'body'
                };


                $(element).popover(popoverOptions);


                element.on('mouseover', function () {
                    if (!isPopoverInitialized) {
                        $(element).popover('show');
                    }
                });


                $(document).on('mouseover', function (event) {
                    isPopoverInitialized = false;
                    if (!$(element).is(event.target) && !$(element).has(event.target).length && $('.popover').has(event.target).length === 0) {
                        $(element).popover('hide');
                    }
                });

                // Clean up the popover when the directive is destroyed
                // scope.$on('$destroy', function () {
                //     $(element).popover('destroy');
                // });
            }
        };
    })


    app.directive('btnCategoriaCompra', function (modalService, nombreModalCompra) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    let fileCtrl = nombreModalCompra.CATEGORIA_COMPRA.fileCtrl;
                    let ctrl = nombreModalCompra.CATEGORIA_COMPRA.controller;
                    let template = nombreModalCompra.CATEGORIA_COMPRA.template;
                    let controller = (await import(fileCtrl))[ctrl];

                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: scope.params || {},
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                });
            }
        }
    })



    app.directive('btnRetencionAtsAddUpdate', function (toastService, modalService, nombreModalFactElect) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                let tS = toastService;
                element.on('click', async function () {
                    if (typeof scope.params === 'object' && scope.params.versionComp !== '2.0.0') {
                        tS.toastr('warning', 'No disponible');
                        return
                    }

                    let { fileCtrl, controller, template } = nombreModalFactElect.RETENCION_ATS;
                    let ctrl = (await import(fileCtrl))[controller];

                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params: {
                            data: scope.params
                        },
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                });
            }
        }
    })

    app.directive('btnCopy', function (toastService) {
        return {
            restrict: 'A',
            scope: {
                text: '='
            },
            link: function (scope, element) {
                let tS = toastService
                element.on('click', async function () {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(scope.text);
                        tS.toastr('info', 'Copiado: ' + scope.text)
                    } else {
                        console.log('API clipboard no soportado')
                    }
                });
            }
        }
    })


    //Convertir documento proforma
    /**
     * 1. Transformar datos de proforma pendiente a nota entrega o factura
     * 2. Transformar datos de nota entrega a factura
     */

    app.directive('btnConvertToDoc', function (modalService, nombreModalVenta, PolicyService) {
        return {
            restrict: 'A',
            scope: {
                codDoc: '=',
                id: '=',
                params: '=',
                onResult: '&'
            },
            link: function (scope, element) {
                element.on('click', async function () {
                    let fileCtrl = nombreModalVenta.CONVERT_TO_DOC.fileCtrl;
                    let ctrl = nombreModalVenta.CONVERT_TO_DOC.controllers["M"];
                    let template = nombreModalVenta.CONVERT_TO_DOC.templates['M'];

                    //si es nota entrega la validacion ingresa xq es transformacion a factura
                    if (scope.codDoc === "NE") {
                        await PolicyService.sendMaxDocuments();
                    }


                    let controller = (await import(fileCtrl))[ctrl];

                    let modalRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: {
                            codDoc: scope.codDoc,
                            id: scope.id,

                        },
                        isRenderRazorPartial: true
                    })

                    modalRef.result.then(result => {
                        if (result !== null && typeof result === 'object' && typeof scope.onResult === 'function') {
                            scope.onResult(result)
                        }
                    })

                })
            }
        }
    })

    //HISTORIAL CONVERSIÓN DOCUMENTO
    app.directive('btnHistorialConversionDoc', function (modalService, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                codDoc: '=',
                id: '=',
                params: '=',
                onResult: '&'
            },
            link: function (scope, element) {
                element.on('click', async function () {
                    let fileCtrl = nombreModalVenta.CONVERT_TO_DOC.fileCtrl;
                    let ctrl = nombreModalVenta.CONVERT_TO_DOC.controllers["MHCD"];
                    let template = nombreModalVenta.CONVERT_TO_DOC.templates['MHCD'];
                    let controller = (await import(fileCtrl))[ctrl];

                    let modalRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'lg',
                        params: {
                            codDoc: scope.codDoc,
                            id: scope.id,

                        },
                        isRenderRazorPartial: true
                    })

                })
            }
        }
    })


    //HISTORIAL COBRO DOCUMENTO
    app.directive('btnHistorialCobro', function (modalService, nombreModalContabilidad) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                onResult: '&',
                codDoc: '='
            },
            link: function (scope, element) {
                element.on('click', async function () {
                    let fileCtrl = nombreModalContabilidad.COBRO.fileHistorialCobro;
                    let ctrl = nombreModalContabilidad.COBRO.controllers["CD"];
                    let template = nombreModalContabilidad.COBRO.templates['CD'];
                    let controller = (await import(fileCtrl))[ctrl];

                    let modalRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'xl',
                        params: {
                            idComprobanteIngreso: scope.params.idComprobanteIngreso,
                            idCuentaPorCobrar: scope.params.idCuentaPorCobrar,
                            codDoc: scope.codDoc

                        },
                        isRenderRazorPartial: true
                    })

                    modalRef.result.then(result => {
                        if (result !== null && typeof result === 'object' && typeof scope.onResult === 'function') {
                            scope.onResult(result)
                        }
                    })

                })
            }
        }
    })


    //Reporte Comprobante Ingreso
    app.directive('btnComprobanteIngresoReport', ['commonService', function (commonSvc) {
        return {
            restrict: 'A',
            scope: {
                unique: '=',
                codEstab: '='
            },
            link: function (scope, element) {
                element.on('click', function () {

                    let format = 'pdf';

                    let dataParms = {
                        tipo: 3,
                        id: scope.unique,
                    }
                    const parameters = {
                        reportParams: JSON.stringify({
                            hasParams: true,
                            codigo: 'RCINGR',
                            format,
                            codEstab: scope.codEstab,
                            aditionalParams: []
                        }),
                        dataParams: JSON.stringify(dataParms)
                    }


                    commonSvc.getReport({
                        parameters,
                        formatType: format,
                        v2: true
                    })

                })
            }
        }
    }])



    /***
     * @description Modal component cuenta por pagar
     *
     */
    app.directive('btnCuentaPorPagar', ['modalService', function (modalSvc) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                onResult: '&'
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    let modalRef = modalSvc.openWithComponent({
                        component: 'appCuentaPorPagarComponent',
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                    })

                    modalRef.result.then(result => {
                        if (result && typeof result === 'object' && typeof scope.onResult === 'function') {
                            //  scope.onResult(result)
                        }
                    })

                })
            }
        }
    }])


    /***
     * @description Modal component cuenta por pagar
     *
     */
    app.directive('btnCuentaPorCobrar', ['modalService', function (modalSvc) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                onResult: '&'
            },
            link: function (scope, element) {
                element.on('click', async function () {
                    let params = scope.params || {}

                    let modalRef = modalSvc.openWithComponent({
                        component: 'appCuentaPorCobrarComponent',
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                        params: {
                            idCuentaPorCobrar: params.idCuentaPorCobrar
                        }
                    })

                    modalRef.result.then(result => {
                        if (result && typeof result === 'object' && typeof scope.onResult === 'function') {
                            //  scope.onResult(result)
                        }
                    })

                })
            }
        }
    }])



    /***
    * @description anular comprobante ingreso
    *
    */
    app.directive('btnAnularComprobanteIngreso', ['comprobanteIngresoService', 'toastService', 'formulario', function (compIngresoSvc, tS, fS) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                onResult: '&'
            },
            link: async function (scope, element) {
                let cuentasPorCobrar = [], cuotasPorCobrar = [], estadosPago = [];

                async function messageQtyDoc() {
                    let isConfirmed = await Swal.fire({
                        icon: 'warning',
                        text: 'Este anulación de comprobante afectará mas de un doc. porque se ha realizado cobro por lote ¿Desea continuar? '
                    })
                    return isConfirmed;
                }

                element.on('click', async function () {
                    const { idComprobanteIngreso } = scope.params;

                    try {

                        let isContinue = true;

                        if (scope.params.cantDocs > 1) {
                            isContinue = await messageQtyDoc();
                        }

                        if (!isContinue) return

                        const response = await compIngresoSvc.getDataForDelete(idComprobanteIngreso);

                        cuentasPorCobrar = response.cuentasPorCobrar;
                        cuotasPorCobrar = response.cuotasPorCobrar;
                        estadosPago = response.estadosPago;

                        if (cuentasPorCobrar.length === 0 || cuotasPorCobrar.length === 0) {

                            console.log("cuentasPorCobrar", cuentasPorCobrar);
                            console.log("cuotasPorCobrar", cuotasPorCobrar);
                            return;
                        }

                        const { isConfirmed, value } = await Swal.fire({
                            icon: 'warning',
                            html: '<small>¿Está seguro/a de anular este registro ahora?</small>',
                            input: 'text',
                            inputPlaceholder: 'Ingrese la observación',
                            showConfirmButton: true,
                            confirmButtonText: 'Sí, anular',
                            showCancelButton: true,
                            cancelButtonText: 'No, cancelar',
                            allowOutsideClick: false,
                            inputValidator: value => !value && '¡Ingrese la observación!'
                        });

                        if (!isConfirmed) return;

                        const dataParams = getDataParams();
                        const data = {
                            observacion: value,
                            ...dataParams
                        }
                        showLoader();
                        const updateResponse = await compIngresoSvc.update(idComprobanteIngreso, data);

                        if (updateResponse.code === "0") {
                            tS.toastr({
                                type: 'warning',
                                message: updateResponse.message
                            });
                        } else if (updateResponse.code === "1") {
                            tS.toastr({
                                type: 'success',
                                message: updateResponse.message
                            });

                            scope.onResult(updateResponse);
                        }

                    } catch (error) {
                        console.error(error);
                    } finally {
                        hideLoader();
                    }
                });

                function getDataIdEstadoPago(codigoEstadoPago) {
                    const dataEstadoPago = estadosPago.find(ep => ep.codigo === codigoEstadoPago);
                    return dataEstadoPago ? dataEstadoPago.idEstadoPago : 0;
                }

                function getDataParams() {
                    // Agrupa cuentas por cobrar
                    const cuentasPorCobrarAgrupado = cuentasPorCobrar.reduce((acc, curr) => {
                        let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar);
                        //let abono = curr.cobro ? curr.abono : 0;
                        let abono = curr.abono;

                        if (!existeDato) {
                            acc.push({
                                idCuentaPorCobrar: curr.idCuentaPorCobrar,
                                abonoDoc: fS.instanceDecimal(curr.abonoDoc).toNumber(),
                                abono,
                                diasMora: curr.diasMora,
                                mora: curr.mora
                            });
                        } else {
                            existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono);
                        }
                        return acc;
                    }, []);

                    // Agrupa cuotas por cobrar
                    const cuotasPorCobrarAgrupado = cuotasPorCobrar.reduce((acc, curr) => {
                        let existeDato = acc.find(dataCxc => dataCxc.idCuotaPorCobrar === curr.idCuotaPorCobrar);
                        //    let abono = curr.cobro ? curr.abono : 0;
                        let abono = curr.abono

                        if (!existeDato) {
                            acc.push({
                                idCuotaPorCobrar: curr.idCuotaPorCobrar,
                                abonoCuota: curr.abonoCuota,
                                abono,
                                diasMora: curr.diasMora,
                                mora: curr.mora
                            });
                        } else {
                            existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono);
                        }
                        return acc;
                    }, []);

                    // Calcula los valores residuales y el estado de pago para cuentas por cobrar
                    const tempCuentasPorCobrar = cuentasPorCobrarAgrupado.map(item => {
                        let valorResiduo = fS.instanceDecimal(item.abonoDoc).minus(item.abono).toNumber()
                        return {
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            abono: valorResiduo,
                            idEstadoPago: getDataIdEstadoPago(valorResiduo === 0 ? 'PE' : 'PP'),
                            diasMora: item.diasMora,
                            mora: item.mora
                        };
                    });

                    // Calcula los valores residuales y el estado de pago para cuotas por cobrar
                    const tempCuotasPorCobrar = cuotasPorCobrarAgrupado.map(item => {
                        let valorResiduo = fS.instanceDecimal(item.abonoCuota).minus(item.abono).toNumber()
                        return {
                            idCuotaPorCobrar: item.idCuotaPorCobrar,
                            abono: valorResiduo,
                            idEstadoPago: getDataIdEstadoPago(valorResiduo === 0 ? 'PE' : 'PP'),
                            mora: item.mora,
                            diasMora: item.diasMora
                        };
                    });

                    // Retorna los datos agrupados y calculados
                    return {
                        cuenta: tempCuentasPorCobrar,
                        cuota: tempCuotasPorCobrar
                    };
                }

            }

        }
    }])



    /**
     *==========================================================
     * DIRECTIVAS COMUNES
     * =========================================================
     */



    //============================END===========================


    /**
    *==========================================================
    * DIRECTIVAS VENTAS
    * =========================================================
    */
    app.directive('actionInfoAdicionalArticuloVenta', ['nombreModalVenta', 'modalService', function (nombreModalVenta, modalSvc) {
        return {
            restrict: 'A',
            scope: {
                entity: '=', //Datos del detalle
                resultModalAdicional: '&',
                infoAdicionalDoc: "=" //Información Adicional del Documento
            },
            link
        }

        function link(scope, element) {
            element.on('click', async () => {


                if (!Number.isInteger(scope.entity.cantidad)) {
                    Swal.fire({
                        title: 'Datos Adicionales',
                        icon: 'warning',
                        html: 'El valor de la cantidad del artículo tiene que ser un número entero!'
                    })
                    return
                }

                let { fileCtrl, controller, template } = nombreModalVenta.INFO_ADICIONAL_ARTICULO;
                let ctrl = (await import(fileCtrl))[controller]

                let modalRef = modalSvc.open({
                    controller: ctrl,
                    template,
                    size: 'lg',
                    params: {
                        entity: scope.entity,
                        infoAdicionalDoc: scope.infoAdicionalDoc || []

                    },
                })

                modalRef.result.then(result => {
                    scope.resultModalAdicional({
                        result
                    })
                })



            })
        }





    }])



    //============================END===========================


    //-------------------------------COMPROBANTE EGRESO START---------------------------------------
    /***
 * @description anular comprobante EGRESO
 *
 */
    app.directive('btnAnularComprobanteEgreso', ['comprobanteEgresoService', 'toastService', 'formulario', function (comprobanteEgresoSvc, tS, fS) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                onResult: '&'
            },
            link: async function (scope, element) {
                let cuentasPorPagar = [], cuotasPorPagar = [], estadosPago = [];

                async function messageQtyDoc() {
                    let isConfirmed = await Swal.fire({
                        icon: 'warning',
                        text: 'Este anulación de comprobante afectará mas de un doc. porque se ha realizado cobro por lote ¿Desea continuar? '
                    })
                    return isConfirmed;
                }

                element.on('click', async function () {
                    const { idComprobanteEgreso } = scope.params;

                    try {

                        let isContinue = true;

                        if (scope.params.cantDocs > 1) {
                            isContinue = await messageQtyDoc();
                        }

                        if (!isContinue) return
                        let response = await comprobanteEgresoSvc.getDataToDelete(idComprobanteEgreso);

                        cuentasPorPagar = response.cuentasPorPagar;
                        cuotasPorPagar = response.cuotasPorPagar;
                        estadosPago = response.estadosPago;

                        if (cuentasPorPagar.length === 0 || cuotasPorPagar.length === 0) {

                            console.log("cuentasPorPagar", cuentasPorPagar);
                            console.log("cuotasPorPagar", cuotasPorPagar);
                            return;
                        }

                        const { isConfirmed, value } = await Swal.fire({
                            icon: 'warning',
                            html: '<small>Esta seguro/a de Anular este registro de pago ahora?</small>',
                            input: 'text',
                            inputPlaceholder: 'Ingrese la observación',
                            showConfirmButton: true,
                            confirmButtonText: 'Sí, anular',
                            showCancelButton: true,
                            cancelButtonText: 'No, cancelar!',
                            allowOutsideClick: false,
                            inputValidator: (value) => {
                                if (!value) {
                                    return 'Ingrese la Observación!'
                                }
                                if (value.length <= 8) {
                                    return 'La observación tiene que tener al menos 10 caracteres!'
                                }
                            }
                        })

                        if (!isConfirmed) return;

                        const dataParams = getDataParams(cuentasPorPagar, cuotasPorPagar, estadosPago);
                        const data = {
                            observacion: value,
                            ...dataParams
                        }

                        try {


                            comprobanteEgresoSvc.anular(idComprobanteEgreso, data).then(response => {
                                if (response.code == "0") {
                                    fS.sweetAlert('warning', response.message, response.titleSms)
                                }
                                if (response.code == "1") {
                                    fS.sweetAlert('success', response.message, response.titleSms, 1000)
                                    scope.onResult(response);
                                }
                            }).catch(error => {
                                console.log(error);
                            })
                        } catch (error) {
                            console.log(error)
                        }


                    } catch (error) {
                        console.error(error);
                    }
                });

                /**
                    *
                    * @param {*} codigoEstadoPago
                    * @param {*} estadosPago
                    * @returns
                    */
                function getDataIdEstadoPago(codigoEstadoPago, estadosPago) {
                    const dataEstadoPago = estadosPago.find(ep => ep.codigo === codigoEstadoPago);
                    return dataEstadoPago ? dataEstadoPago.idEstadoPago : 0;
                }

                /**
                 *
                 * @param {*} cuentasPorPagar
                 * @param {*} cuotasPorPagar
                 * @param {*} estadosPago
                 * @returns
                 */
                function getDataParams(cuentasPorPagar, cuotasPorPagar, estadosPago) {
                    // Agrupa cuentas por pagar
                    const cuentasPorPagarAgrupado = cuentasPorPagar.reduce((acc, curr) => {
                        let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorPagar === curr.idCuentaPorPagar);
                        //   let abono = curr.cobro ? curr.abono : 0;
                        let abono = curr.abono;

                        if (!existeDato) {
                            acc.push({
                                idCuentaPorPagar: curr.idCuentaPorPagar,
                                abonoDoc: fS.instanceDecimal(curr.abonoDoc).toNumber(),
                                abono,
                            });
                        } else {
                            existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono).toNumber();
                        }
                        return acc;
                    }, []);

                    // Agrupa cuotas por pagar
                    const cuotasPorPagarAgrupado = cuotasPorPagar.reduce((acc, curr) => {
                        let existeDato = acc.find(dataCxc => dataCxc.idCuotaPorPagar === curr.idCuotaPorPagar);
                        //  let abono = curr.cobro ? curr.abono : 0;
                        let abono = curr.abono

                        if (!existeDato) {
                            acc.push({
                                idCuotaPorPagar: curr.idCuotaPorPagar,
                                abonoCuota: curr.abonoCuota,
                                abono,
                            });
                        } else {
                            existeDato.abono = fS.instanceDecimal(existeDato.abono).plus(curr.abono);
                        }
                        return acc;
                    }, []);

                    // Calcula los valores residuales y el estado de pago para cuentas por cobrar
                    const tempCuentasPorPagar = cuentasPorPagarAgrupado.map(item => {
                        //let valorResiduo = fS.minus(item.abonoDoc,item.abono).toNumber()
                        let valorResiduo = fS.instanceDecimal(item.abonoDoc).minus(item.abono).toNumber();

                        //quitar cuando se haya validado bien tema de decimales en compras
                        let abonoDocRounded = fS.roundNumber(item.abonoDoc, 2);
                        let abonoRounded = fS.roundNumber(item.abono, 2)
                        let valorResiduoValidar = fS.minus(abonoDocRounded, abonoRounded, 2);

                        return {
                            idCuentaPorPagar: item.idCuentaPorPagar,
                            abono: valorResiduo,
                            idEstadoPago: getDataIdEstadoPago(valorResiduoValidar === 0 ? 'PE' : 'PP', estadosPago)
                        };
                    });

                    // Calcula los valores residuales y el estado de pago para cuotas por cobrar
                    const tempCuotasPorCobrar = cuotasPorPagarAgrupado.map(item => {
                        let valorResiduo = fS.instanceDecimal(item.abonoCuota).minus(item.abono).toNumber()

                        return {
                            idCuotaPorPagar: item.idCuotaPorPagar,
                            abono: valorResiduo,
                            idEstadoPago: getDataIdEstadoPago(valorResiduo === 0 ? 'PE' : 'PP', estadosPago)
                        };
                    });

                    // Retorna los datos agrupados y calculados
                    return {
                        cuenta: tempCuentasPorPagar,
                        cuota: tempCuotasPorCobrar
                    };
                }

            }

        }
    }])

    //-------------------------------COMPROBANTE EGRESO END---------------------------------------



    //Reporte Comprobante Egreso
    app.directive('btnComprobanteEgresoReport', ['commonService', 'decodeToken', function (commonSvc, decodeToken) {
        return {
            restrict: 'A',
            scope: {
                unique: '=',
                codEstab: '='
            },
            link: function (scope, element) {
                element.on('click', function () {

                    let format = 'pdf';

                    let dataParms = {
                        codEstab: scope.codEstab,
                        id: scope.unique,
                        tipo: 1,
                        userRoleId: decodeToken.userRoleId
                    }
                    const parameters = {
                        reportParams: JSON.stringify({
                            hasParams: true,
                            codEstab: scope.codEstab,
                            codigo: "RCEGR",
                            format,
                            aditionalParams: []
                        }),
                        hasService: true,
                        dataParams: JSON.stringify(dataParms)
                    }


                    commonSvc.getReport({
                        parameters,
                        formatType: format,
                        v2: true
                    })

                })
            }
        }
    }])




})(window.angular)
