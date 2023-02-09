(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('configContribuyenteCtrl', configContribuyenteCtrl);

    configContribuyenteCtrl.$inject = [
        '$scope', 
        '$interval', 
        'mainService', 
        'toastService', 
        'formulario'
    ];

    function configContribuyenteCtrl($scope, $interval, mS, toast, form) {
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            $scope.accion = accion[0];
        }
                
        $scope.data = {};        

        //Get Config Contribuyentes
        $scope.getConfigContribuyentes = function() {
            mS.getData('get', '/ConfigContribuyente/Get').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.configContribuyentes = response.data;
            }, error => console.log(error));
        }
        $scope.getConfigContribuyentes();

        $scope.expandDetalle = function(cc) {
            cc.expanded = !cc.expanded
            mS.getData('get', '/ConfigContribuyente/GetId?idConfigContribuyente=' + cc.config.idConfiguracionContribuyente).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message);
                    return
                }
                if (response.id == "1") {
                    cc.configDetalle = response.data.detalle.map(function({ detalle }) {
                        detalle.idConfigContribuyenteDetalle = detalle.idConfiguracionContribuyenteDetalle;
                        detalle.porcentaje = $scope.getPorcentajeIva(detalle.idRetencionIva);
                        return detalle;
                    });
                }
            })
        }

        //load querys
        $scope.init = function() {
            mS.getData('get', '/SubContribuyente/OptionSubContribuyente').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.subContribuyentes = response.data;
            });

            mS.getData('get', '/TipoImpuesto/OptionTipoImpuesto').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.tipoImpuestos = response.data;
                $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = response.data;
            });

            mS.getData('get', '/RetencionIva/GetByAll').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.retencionesIvas = response.data;
                $scope.gridOptions.columnDefs[2].editDropdownOptionsArray = response.data;
            })
        }
        $scope.init();

        //Abrir Modal 
        $scope.abrirModal = (data, tipo) => {
            $scope.tipo = tipo;

            $interval(function() {
                $scope.gridApi.core.handleWindowResize();
            }, 500, 10);  
                      
            if (tipo == 2) {
                $scope.getConfigContribuyenteById(data.idConfiguracionContribuyente);
            }
            $("#agregar").modal('show');
        };

        $scope.getConfigContribuyenteById = function(id) {
            mS.getData('get', '/ConfigContribuyente/GetId?idConfigContribuyente=' + id).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message);
                    return
                }
                if (response.id == "1") {
                    let { config: data, detalle } = response.data;
                    $scope.data = data.config;
                    $scope.gridOptions.data = detalle.map(function({ detalle }) {
                        detalle.idConfigContribuyenteDetalle = detalle.idConfiguracionContribuyenteDetalle;
                        detalle.porcentaje = $scope.getPorcentajeIva(detalle.idRetencionIva);
                        return detalle;
                    });
                }
            })
        }


        //Add item
        $scope.addItem = function() {
            $scope.gridOptions.data.push({
                idConfigContribuyenteDetalle: undefined,
                idTipoImpuestoRenta: 0,
                idRetencionIva: 0,
                porcentaje: undefined
            });
        };

        $scope.editColumnTipoImpuesto = function($scope) {
            return $scope.row.entity.idConfigContribuyenteDetalle == undefined
        }
        $scope.editColumnRetencionIva = function($scope) {
            return !form.campo($scope.row.entity.idTipoImpuestoRenta)
        };

        //Tabla Detalle Contribuyente
        $scope.gridOptions = {
            enableColumnMenus: false,
            columnDefs: [{
                    name: 'idConfigContribuyenteDetalle',
                    field: 'idConfigContribuyenteDetalle',
                    visible: false,
                    enableCellEdit: false,
                    width: '8%'
                }, {
                    name: 'Tipo Impuesto',
                    field: 'idTipoImpuestoRenta',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownValueLabel: 'descripcion',
                    editDropdownIdLabel: 'idTipoImpuestoRenta',
                    cellFilter: 'mapTipoImpuesto:grid.appScope.tipoImpuestos',
                    cellEditableCondition: $scope.editColumnTipoImpuesto,
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: 'number',
                    width: '45%',
                },
                {
                    name: 'Retencion I.V.A',
                    field: 'idRetencionIva',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownValueLabel: 'descripcion',
                    editDropdownIdLabel: 'idRetencionIva',
                    cellFilter: 'mapRetencionIva:grid.appScope.retencionesIvas',
                    cellEditableCondition: $scope.editColumnRetencionIva,
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: 'number',
                    width: '45%',
                },
                { name: '%', field: 'porcentaje', cellFilter: "currency:'%'", enableCellEdit: false, width: '8%', visible: true },
                {
                    name: 'Op',
                    headerCellTemplate: ' <button type="button" ng-click="grid.appScope.addItem()" class="btn btn-secondary  btn-sm"><i class="fa fa-plus-circle"></i></button>',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    cellTemplate: `<button ng-click="grid.appScope.deleteRow(row.entity)"   class="btn btn-danger btn-sm text-white" title="Eliminar Item agregada"><i class="ti-trash"></i></button>                             
                                `,
                    width: '2%'
                }
            ],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        // ng-disabled="row.entity.idConfigContribuyenteDetalle>0"

        //Actualizar
        $scope.gridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $interval(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                if (colDef.field === "idRetencionIva" && rowEntity.idRetencionIva) {
                    rowEntity.porcentaje = $scope.getPorcentajeIva(rowEntity.idRetencionIva);
                }
            });
        };

        $scope.getPorcentajeIva = function(id) {
            let result = $scope.retencionesIvas.find(val => val.idRetencionIva === id);
            return result.porcentaje;
        }

        $scope.deleteRow = function(row) {
            let index = $scope.gridOptions.data.indexOf(row);
            $scope.gridOptions.data.splice(index, 1);

            // if (form.campo(row.idConfigContribuyenteDetalle)) {
            // }
        };

        $scope.saveUpdate = function(tipo) {
            if (form.campo($scope.data.idSubContribuyenteEmpresa)) {
                toast.toastr('warning', 'Seleccione Contribuyente Empresa');
                return;
            }
            if (form.campo($scope.data.renta)) {
                toast.toastr('warning', 'Debe tener un tipo de Retención');
                return;
            }
            if (form.campo($scope.data.idSubContribuyenteProveedor)) {
                toast.toastr('warning', 'Seleccione Contribuyente Proveedor');
                return;
            }
            if ($scope.gridOptions.data.length == 0) {
                toast.toastr('warning', 'Agregue al menos un Detalle de Config. Contribuyente');
                return;
            }

            if ($scope.gridOptions.data.some(val => (val.idTipoImpuestoRenta === 0) || (val.idRetencionIva === 0))) {
                toast.toastr('warning', 'Complete los campos en el detalle');
                return
            };

            let config = {
                idSubContribuyenteEmpresa: $scope.data.idSubContribuyenteEmpresa,
                idSubContribuyenteProveedor: $scope.data.idSubContribuyenteProveedor,
                renta: $scope.data.renta,
                iva: $scope.data.iva
            };

            let data = {
                config,
                detalle: $scope.gridOptions.data
            };

            let url = tipo == 1 ? '/ConfigContribuyente/Post' : '/ConfigContribuyente/Put?idConfigContribuyente=' + $scope.data.idConfiguracionContribuyente;
            mS.getData('post', url, data).then(response => {
                if (response.id === "0") {
                    Swal.fire({                        
                        title:`<small>${response.titleSms}</small>`,
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    })
                    return
                }
                if (response.id === "1") {                   
                    Swal.fire({ 
                        title:`<small>${response.titleSms}</small>`,
                        icon: 'success', 
                        html: `<small>${response.message}</small>` ,
                        timer: 1000
                    });
                    $("#agregar").modal('hide');
                    $scope.getConfigContribuyentes();
                    return
                }
            })
        }

        $scope.deleteConfigContribuyente = function(idConfigContribuyente) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este registro ahora</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    $scope.execDelete(idConfigContribuyente);
                }
            })
        }

        $scope.execDelete = function(id) {
            mS.getData('get', '/ConfigContribuyente/Delete?idConfigC=' + id).then(response => {
                if (response.id === "0") {
                    Swal.fire({
                        title:`<small>${response.titleSms}</small>`,
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    });                    
                    return
                }
                if (response.id === "1") {
                    Swal.fire({
                        title:`<small>${response.titleSms}</small>`,
                        icon:'warning',
                        html:`<small>${response.message}</small>`,
                        timer:1000
                    });  
                    $scope.getConfigContribuyentes();
                    return
                }
            })
        }


        $("#agregar").on('hide.bs.modal', e => {
            $scope.data = {};
            $scope.gridOptions.data = [];
        });
    }
})(window.angular);