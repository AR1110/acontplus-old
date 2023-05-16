(function(){

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
                            console.log(scope.branchs)
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
    
    //permiso para ver kardex en documentos de ventas 
    app.directive('viewKardex', function ($rootScope, modalService, nombreModal) {
        return {
            scope: {
                params: "=",
                btnTitle: "=",
                sizeBtn: "="
            },
            template: ' <a style="cursor:pointer;" ng-if="kardex.view" class= "btn btn-info btn-xs text-white" title="Ver Kardex de Artículo"> <i class="mdi mdi-timetable"></i></a >',
            link: function (scope, element, attr) {
                let {
                    ventaPermiso
                } = $rootScope.usuarioPermiso;
    
                scope.kardex = ventaPermiso.additional.kardex;
    
                element.on('click', async function (e) {
    
                    let {
                        MODAL_CTRL,
                        MODAL_CSHTML
                    } = nombreModal.kardex;
    
                    const articulo = {
                        idArticulo: scope.params.idArticulo,
                        codigo: scope.params.codigo,
                        descripcion: scope.params.descripcion,
                    }
    
                    const {
                        ModalKardexCtrl
                    } = await import('./../modal/' + MODAL_CTRL);
    
                    modalService.openModalCustom({
                        controller: ModalKardexCtrl,
                        template: MODAL_CSHTML,
                        size: 'xl',
                        params: articulo,
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })
    
                })
            }
        };
    })
    
    
    app.directive('viewKardexBtn', function (modalService, nombreModal) {
        return {
            scope: {
                params: "=",
                btnTitle: "=",
                sizeBtn: "="
            },
            link: function (scope, element, attr) {
    
                element.on('click', async function (e) {
    
                    let {
                        MODAL_CTRL,
                        MODAL_CSHTML
                    } = nombreModal.kardex;
    
                    const articulo = {
                        idArticulo: scope.params.idArticulo,
                        codigo: scope.params.codigo,
                        descripcion: scope.params.descripcion,
                    }
    
                    const {
                        ModalKardexCtrl
                    } = await import('./../modal/' + MODAL_CTRL);
    
                    modalService.openModalCustom({
                        controller: ModalKardexCtrl,
                        template: MODAL_CSHTML,
                        size: 'xl',
                        params: articulo,
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })
    
                })
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
    



})