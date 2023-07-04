(function () {

    'use strict';


    app.directive('shouldFocus', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.shouldFocus, function (newVal, oldVal) {
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
    })
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


    //Permiso Update Artcicle
    app.directive('updateArticle', function ($rootScope) {
        return {

            link: function (scope, element, attrs) {

                if (!$rootScope.articlePermission.leer) {
                    element[0].style.display = 'none';
                }

                if (!$rootScope.articlePermission.editar) {
                    element[0].style.display = 'none';
                }
            },
        }
    })

    app.directive('estabStock', function (mainService, $compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                article: "=",
                placement: "@"
            },
            link: function (scope, element) {
                var popoverOptions = {
                    title: '<i class="mdi mdi-information-outline"></i> Bodega-Stock',
                    content: function () {
                        var popoverContent = ` <div class="table-responsive">
                                                <table class="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Estab.</th>
                                                            <th>Bodega</th>
                                                            <th>Stock</th>
                                                            <th>Ub.                                                       
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody ng-repeat="s in branchs" class="small">
                                                        <tr ng-repeat="ub in s.warehouses">
                                                            <td ng-if="$first" rowspan="2">{{s.branchOffice}}</td>
                                                            <td>{{ub.bodega}}</td>
                                                            <td>{{ub.stock}}</td>
                                                            <td>{{ub.ubicacion}}</td>
                                                        <tr>
                                                    </tbody>
                                                </table>
                                            </div>   
                                             `;

                        mainService.getData('get', '/Articulo/GetId?id=' + scope.article.idArticulo).then(response => {
                            const results = JSON.parse(response.payload) || [];

                            scope.branchs = results[4].map(val => {
                                val.warehouses = JSON.parse(val.warehouses)
                                return val;
                            })

                        })

                        // Compile the popover content with the scope
                        let compiledContent = $compile(popoverContent)(scope);
                        scope.$apply();
                        return compiledContent;

                    },
                    placement: scope.placement || 'bottom',
                    trigger: 'outsideClick',
                    html: true,
                    customClass: 'zindex'
                    // container: 'body'
                };


                // // Initialize the popover using element.popover()
                $(element).popover(popoverOptions);

                // // Open popover on element click
                element.on('mouseover', function (event) {
                    $(element).popover('show');
                });

                // // Close popover on outside click
                $(document).on('mouseover', function (event) {
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




    app.directive('totalesVentaView', function ($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.totalesVentaView, function (obj) {
                    if (typeof obj === 'object' && !obj.additional.totalesVenta.view) {
                        // Aquí puedes aplicar la lógica de la directiva cuando el objeto tenga un valor
                        // Por ejemplo, mostrar el elemento, modificar su estilo, etc.
                        element.remove();
                    }
                });

                // element.remove();
            }
        };
    })




    /**
     * ====================================START DIRECTIVES SALES=============================
     */
    app.directive('btnCliente', function (modalService, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                resultModal: '&',
                params: '='
            },
            link: function (scope, element, att) {
                element.on('click', async function (ev) {

                    let { fileCtrl, controllers, templates } = nombreModalVenta.CLIENTE;
                    let ctrl = (await import(fileCtrl))[controllers['M']];
                    let template = templates['M'];

                    let modalRef = modalService.openModalCustom({
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
    })

    app.directive('btnClienteLista', function (modalService, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                resultModal: '&',
                params: '='
            },
            link: function (scope, element, att) {
                element.on('click', async function (ev) {

                    let { fileCtrl, controllers, templates } = nombreModalVenta.CLIENTE;
                    let ctrl = (await import(fileCtrl))[controllers['ML']];
                    let template = templates['ML'];

                    let modalRef = modalService.openModalCustom({
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
    })

    app.directive('clienteInfoPopover', function () {
        return {
            restrict: 'A',
            scope: {
                customer: '=',
                popoverPlacement: '@'
            },
            link: function (scope, element, attrs) {
                element.popover({
                    title: '<i class="text-info fas fa-info"></i> Información Cliente',
                    content: `<div>
                                <span><b>Nombre Fiscal:</b> ${scope.customer.nombreFiscal}</span><br>
                                <span><b>Nombre Comercial:</b> ${scope.customer.nombreComercial}</span><br>
                                <span><b>Correo:</b> ${scope.customer.correo || ''}</span><br>
                                <span><b>Teléfono:</b> ${scope.customer.telefono || ''}</span><br>
                                <span><b>Dirección:</b> ${scope.customer.direccion || ''}</span>
                            </div>`,
                    placement: scope.popoverPlacement,
                    trigger: 'outisideclick',
                    html: true
                });
            }
        };
    });

    app.directive('clienteSearchDrtv', function ($compile, clienteService) {
        return {
            restrict: 'A',
            scope: {
                onSelect: '&',
                onKeyupCliente:'&',
                ngModel: '='
            },
            link: function (scope, element, attrs) {
                scope.cliente = {
                    nombreCliente: scope.ngModel
                }
                scope.searchCustomer = function (textSearch) {
                    if (textSearch.length > 1) {
                        return clienteService.search({textSearch})
                        .catch(error=>{
                            console.log(error);
                        })
                    }
                }
    
                element.attr('uib-typeahead', 'item as item.nombreFiscal for item in searchCustomer($viewValue)');
                element.attr('typeahead-on-select', 'onSelect({result: $item})');
                element.attr('typeahead-template-url', 'autocompleteClienteTemplate.html');
                element.attr('ng-keyup', 'onKeyupCliente()');
                element.attr('typeahead-editable', 'false');

                 
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
    });



    

    app.directive('btnEmpresa', function (modalService, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function (event) {
                    let fileCtrl = nombreModalVenta.EMPRESA.fileCtrl;
                    let ctrl = nombreModalVenta.EMPRESA.controller 
                    let template = nombreModalVenta.EMPRESA.template 
                    let controller = (await import(fileCtrl))[ctrl];


                    
                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: Object.assign({}, scope.params) || {},                        
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
    
    
    app.directive('btnEmpleado', function (modalService, nombreModalVenta) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function (event) {
                    let fileCtrl = nombreModalVenta.EMPLEADO.fileCtrl;
                    let ctrl = nombreModalVenta.EMPLEADO.controller 
                    let template = nombreModalVenta.EMPLEADO.template 
                    let controller = (await import(fileCtrl))[ctrl];


                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: Object.assign({}, scope.params) || {},                                               
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
            link: function (scope, element, attrs) {
    
                element.on('click', async function (event) {
                    let fileCtrl = nombreModalVenta.CARGO.fileCtrl;
                    let ctrl = nombreModalVenta.CARGO.controller 
                    let template = nombreModalVenta.CARGO.template 
                    let controller = (await import(fileCtrl))[ctrl];


                    const modalDialogRef = modalService.openModalCustom({
                        controller,
                        template,
                        size: 'md',
                        params: Object.assign({}, scope.params) || {},                                              
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


    app.directive('dateRangeFilter', function (formulario) {
        return {
            template: `<div><input date-range-picker class="form-control date-picker border-select" type="text"
                   ng-model="dateRangePicker.date" picker="dateRangePicker.picker"
                   picker-classes="extra-class-names" min="'2014-02-23'" max="dateRangePicker.maxDate"
                   options="dateRangePicker.options" options="{locale: {separator: " :"}}" />
       </div>`,
            restrict: 'E',
            replace: true,
            scope: {
                currentDate: '=',
                startDate: '=',
                endDate: '=',
                resultRangeDate: '&',
            },
            link: function (scope, $element, $attrs, form) {
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
                            'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                            'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                        },
                        eventHandlers: {
                            'apply.daterangepicker': function (event, picker) {

                                scope.startDate = scope.dateRangePicker.date.startDate
                                scope.endDate = scope.dateRangePicker.date.endDate;

                                scope.resultRangeDate({
                                    result: {
                                        startDate: scope.startDate,
                                        endDate: scope.endDate
                                    }
                                })
                                // $scope.getComprobantes()
                                // console.log('applied')
                            }
                        }
                    }
                };
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
            link: function (scope, element, att) {
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
            link: function (scope, element, att) {
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
     * 
     * 
     */
    app.directive('btnSendToEmail', function(modalService, nombreModalCommon){
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
                typeSend: '=',
                getParamToSendMail: '&' //funcion que arma parametro necesario para el envio de correo
            },
            link: function(scope, element, att){
                element.on('click', async function(){
                    
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
     * -------------------------------SEND DOCS. BY WHATSAPP-----------------------
     * 
     */
    app.directive('btnSendToWhatsApp', ['modalService', 'nombreModal', 'mainService', 'toastService', function (modalService, nombreModal, mainService, toastService) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
                hasPermission: '=',
                typeSend: '=',
            },
            link: function (scope, element, att) {
                element.on('click', function () {
                    console.log('click')
                    /**
                     * Eliminar mas adelante en cuanto se corrija el codDoc en las opciones de factura venta
                     */
                    let params = Object.assign({}, scope.params);
                    if(params.hasOwnProperty('codigoTipoDoc')){
                        params.codDoc = '01';
                    }
                    //===================================

                    mainService.getData('GET', 'WhatsappUsage/?json=' + JSON.stringify({ tipo: 2, idEntidad: 0 }), null, true).then(
                        async response => {
                            if (response.code == '0') {
                                toastService.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                let tempArray = JSON.parse(response.payload)
                                if (tempArray[0][0].code == '0') {
                                    Swal.fire({ title: 'Aviso', text: tempArray[0][0].message, icon: 'warning' })

                                } else {
                                    if (tempArray[0][0].message) {
                                        Swal.fire({ title: 'Aviso', text: tempArray[0][0].message, icon: 'info' })
                                        return
                                    }
                                    // let fileCtrl = nombreModalLogistica.VEHICULO.fileCtrl;
                                    // let ctrl = nombreModalLogistica.VEHICULO.controllers['M'];
                                    // let template = nombreModalLogistica.VEHICULO.templates['M'];
                                    const {
                                        MODAL_SEND_WHATSAPP_CTRL,
                                        MODAL_SEND_WHATSAPP_CSHTML
                                    } = nombreModal.common;
                                    const {
                                        ModalWhatsAppCtrl
                                    } = await import(MODAL_SEND_WHATSAPP_CTRL);
                                    // console.log(template)

                                    params.type = scope.typeSend;
                                    params.hasPermissions = scope.hasPermissions
                                    const modalDialogRef = modalService.openModalCustom({
                                        controller: ModalWhatsAppCtrl,
                                        template: MODAL_SEND_WHATSAPP_CSHTML,
                                        size: 'md',
                                        params: params || {},
                                        isRenderRazorPartial: true,  
                                    })

                                    modalDialogRef.result.then(result => {
                                        if (typeof result === "object") {
                                            scope.resultModal({
                                                result
                                            })
                                        }
                                    })
                                }
                            }
                            hideLoader()
                        }
                    ).catch(error => {
                        hideLoader()
                        console.log(error)
                    })
                });
            }
        }
    }])


    app.directive('openModalAdditionalDataDocument', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                datosAdicionales: '=',
                isView: '=',
                getDataAdditionalDocument: '&'
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function (event) {
                    let {
                        MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL,
                        MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML
                    } = nombreModal.common;
                    let {
                        InfoAdicionalTipoDocCtrl
                    } = await import('./../../modal/' + MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL);
    
                    let params = {
                        isView: scope.isView,
                        infoAdicionalDocumento: scope.datosAdicionales
                    }
                    let modalRef = modalService.openModalCustom({
                        controller: InfoAdicionalTipoDocCtrl,
                        template: 'Shared/Common/' + MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML,
                        size: 'md',
                        params
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
                onKeyupArticle:'&',
                ngModel: '='
            },
            link: function (scope, element, attrs) {
                scope.cliente = {
                    descripcion: scope.ngModel
                }
                scope.searchArticle = function (textSearch) {
                    if (textSearch.length > 1) {
                        let json = {
                            busqueda: textSearch,
                            condicion: false,
                            fraccionado: false
                        }
                        return articuloService.search(json)
                        .catch(error=>{
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
                
                console.log('rendered')
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
                onKeyupSearch:'&',
                ngModel: '='
            },
            link: function (scope, element, attrs) {
                scope.dataSearchUser = {
                    nombreCompleto: scope.ngModel
                }
                scope.search = function (textSearch) {
                    if (textSearch.length > 1) {
                        let json = {
                            busqueda: textSearch,
                            idRol: decodeToken.idUsuarioRol
                        }
                        return commonService.usuarioSearch(json)
                        .catch(error=>{
                            console.log(error);
                        })
                    }
                }
    
                element.attr('uib-typeahead', 'item as item.nombreCompleto for item in search($viewValue)');
                element.attr('typeahead-on-select', 'onSelect({result: $item})');
                element.attr('typeahead-template-url', 'autocompleteUserTemplate.html');
                element.attr('ng-keyup', 'onKeyupSearch()');
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
                
                console.log('rendered')
                document.head.appendChild(customStyle);
                $compile(element)(scope);
            }
        };
    });


})(window.angular)