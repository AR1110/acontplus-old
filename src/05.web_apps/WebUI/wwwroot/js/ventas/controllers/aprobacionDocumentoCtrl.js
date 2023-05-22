(function(){

    'use strict';

    //Variable servicios
    let mS = {};
    let tS = {};
    let notaEntregaSvc = {};
    let proformaSvc = {};
    let facturaSvc = {};

    //Variables Constantes
    const URL_TEMPLATE = 'AprobDocument/'


    app.controller('aprobacionDocumentoCtrl', aprobacionDocumentoCtrl);

    aprobacionDocumentoCtrl.$inject = ['$scope', '$injector', 'modalService', 'nombreModalVenta'];

    function aprobacionDocumentoCtrl($scope, $injector, modalSvc, nombreModalVenta) {

        //Injection Services
        mS             = $injector.get('mainService');
        tS             = $injector.get('toastService');
        notaEntregaSvc = $injector.get('notaEntregaService');
        proformaSvc    = $injector.get('proformaService');
        facturaSvc     = $injector.get('facturaService');


        let OPTION_APROBACION = Object.freeze({
            0:  Object.freeze({
                docOrigen: {
                    codigo: 'NE',
                    descripcion: 'Nota de Entrega'
                },
                docDestino: {
                    codigo: 'FV',
                    descripcion: 'Factura'
                }                
            }),
            1:  Object.freeze({
                docOrigen: {
                    codigo: 'PR',
                    descripcion: 'Proforma'
                },
                docDestino: {
                    codigo: 'FV',
                    descripcion: 'Factura'
                }                
            }),  
            2:  Object.freeze({
                docOrigen: {
                    codigo: 'PR',
                    descripcion: 'Proforma'
                },
                docDestino: {
                    codigo: 'NE',
                    descripcion: 'Nota de Entrega'
                }                
            })          
        });

        $scope.askToOpenModalOption = async function() {
            try {
                  
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger m-l-5'
                    },
                    buttonsStyling: false
                })
        
                swalWithBootstrapButtons.fire({
                    title: 'Opción Aprobación Documento',                    
                    input: 'select',
                    inputOptions: {
                        0: 'NOTA DE ENTREGA A FACTURA',
                        1: 'PROFORMA A FACTURA',
                        2: 'PROFORMA A NOTA DE ENTREGA'
                    },
                    inputPlaceholder: 'Seleccionar...',
                    showCancelButton: true,
                    confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
                    cancelButtonText: '<small>&times; Cerrar</small>',
                    reverseButtons: false,
                    allowOutsideClick: false,
                    focusConfirm: true,
                    inputValidator: (value) => {
                        return !value && 'Seleccione la opción de aprobación'
                    }
                }).then(result => {
                    if(result.isConfirmed){
                       
                        let modalRef = modalSvc.openModalCustom({
                            controller: 'ModalSelectDocCtrl',
                            template: URL_TEMPLATE + '_ModalSelectDocumento.cshtml',
                            size: 'xl',
                            windowClass: 'uibModalFullScreen',
                            params: OPTION_APROBACION[result.value]
                        })

                    }
                })
                
            } catch (error) {
                console.log(error);
            }
        }

    }



    /**
     * 
     * _------------------Modal para seleccionar los documentos 
     * 
     */
    app.controller('ModalSelectDocCtrl', ModalSelectDocCtrl);

    ModalSelectDocCtrl.$inject = [
        '$scope', 
        '$uibModalInstance',
        'uiGridConstants', 
        'clienteService', 
        'params'
    ];

    function ModalSelectDocCtrl($scope, $uibModalInstance, uiGridConstants, clienteSvc, params) {
        
        let {docOrigen, docDestino} = params;
        $scope.docOrigen = docOrigen;
        $scope.docDestino = docDestino;

        $scope.cliente = {};
        $scope.dataSearch = {};


        $scope.gridOptionsDetalle = {};

        $scope.selectedDocuments = [];


        $scope.gridOptionsSelectedDocs = {
            enableFiltering: true,
            enableSorting: true,
            enableGridMenu: true,

            enableRowSelection: true,
            enableSelectAll: true,

            showColumnFooter: true,
            showGridFooter: true,
            expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" ui-grid-resize-columns ></div>',
            expandableRowScope: {
                subGridVariable: 'subGridScopeVariable'
            },
            expandableRowHeight: 150,
            isRowSelectable: function (row) {
                if (["AC", "PE"].includes(row.entity.codDoc)) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        $scope.gridOptionsSelectedDocs.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);


            gridApi.selection.on.rowSelectionChanged($scope, (row) => {
                //------
            })


            gridApi.selection.on.rowSelectionChangedBatch($scope, function () {})
        }


        //GridOptions Invoice 
        $scope.gridOptionsDetalle = {
            enableSorting: true,
            suppressMultiSort: true,
        }

        $scope.infoAdicionalDocumento = [];

        
        // Step Uno
        $scope.stepUno = function () {
            $scope.footerActionStepUno = true;
            $scope.footerActionStepDos = false;

            $("#step a:first-child").addClass('active');
            $("#step a:last-child").removeClass('active');

            const stepDocOrigen = document.getElementById("stepDocOrigen");
            const stepDocDestino = document.getElementById("stepDocDestino");

            stepDocOrigen.style.display = "block";
            stepDocDestino.style.display = "none";
        }


        $scope.stepDos = function() {
            try {
                if (!$scope.cliente.idCliente > 0) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }

                $scope.selectedDocuments = $scope.gridApi.selection.getSelectedRows() || []
                if ($scope.selectedDocuments.length === 0) {
                    tS.toastr('warning', 'Seleccione al menos un Documento', 'Siguiente', 'toast-bottom-center');
                    return
                }

                showLoader();
                //UNIMOS TODOS LOS DETALLES DEL COMPROBANTE

                let resultJoinDetails = $scope.selectedDocuments.flatMap(item => item.subGridOptions.data);


                //Si la Opcion es Agrupar Articulos del Detalle 
                // if (this.groupByArticle) {
                //     resultJoinDetails = resultJoinDetails.reduce((arrGroup, current) => {
                //         let thatItem = arrGroup.find(item => item.codigo == current.codigo);
                //         if (thatItem == undefined) arrGroup = [...arrGroup, {
                //             ...current
                //         }]
                //         else {
                //             thatItem.cantidad += current.cantidad;

                //             let precioVenta = thatItem.precioVenta += current.precioVenta;
                //             let precioConIva = thatItem.precioConIva += current.precioConIva;
                //             let porcentajeDescuento = thatItem.porcentajeDescuento += current.porcentajeDescuento;
                //             let valorDescuento = thatItem.valorDescuento += current.valorDescuento;
                //             let totalDescuento = thatItem.totalDescuento += current.totalDescuento;
                //             let subTotal = thatItem.subTotal += current.subTotal;
                //             let total = thatItem.total += current.total;

                //             thatItem.precioVenta = this._fS.roundNumber(precioVenta, this.decimal.nroPrecio);
                //             thatItem.precioConIva = this._fS.roundNumber(precioConIva, this.decimal.nroPrecio);
                //             thatItem.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroPorcentaje);
                //             thatItem.valorDescuento = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuento);
                //             thatItem.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle);
                //             thatItem.subTotal = this._fS.roundNumber(subTotal, 5);
                //             thatItem.total = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);
                //         }
                //         return arrGroup
                //     }, [])
                // }

                //Agregamos Bodega e Indice
                let index = 1;
                $scope.gridOptionsDetalle.data = resultJoinDetails.map(item => {
                    item.idBodega = $scope.idBodega;
                    item.n = index++;
                    return item;
                })

                //Creamos objeto GridOptions para calculos de totales y subtotales             
                // this.uiGridInvoice = new UiGridOptions({
                //     $scope: this.$scope,
                //     gridOptions: this.gridOptionsDetailDocument,
                //     _fS: this._fS,
                //     _mS: this._mS,
                //     _tS: this._tS,
                //     tipoIvas: this.tipoIvas
                // })

                // this.uiGridInvoice.setInitiload({
                //     bodegas: this.bodegas,
                //     tipoIvas: this.tipoIvas,
                //     decimal: this.decimal,
                //     actividadTipoIva: this.actividadTipoIva
                // })

                // this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());

                // this.getImporteTotal();

                $scope.footerActionStepUno = false;
                $scope.footerActionStepDos = true;

                $("#step a:first-child").removeClass('active');
                $("#step a:last-child").addClass('active');

                const stepDocOrigen = document.getElementById("stepDocOrigen");
                const stepDocDestino = document.getElementById("stepDocDestino");

                stepDocOrigen.style.display = "none";
                stepDocDestino.style.display = "block";
                hideLoader();
            } catch (error) {
                hideLoader();
                console.trace(error);
            }
        }


        //============================================Filtros==============================
        $scope.resultDateRange = function(item){
            $scope.getDocumentos();
            if($scope.cliente.idCliente>0){

            }
        }


        $scope.clienteSearch = function(textSearch) {
            let query = {
                textSearch
            }
           
            if(textSearch.length > 2) {
                return clienteSvc.search(query).catch(error=>{
                    console.log(error)
                })
            }
        }


        $scope.getDocumentos = function(){
            try {
               

            } catch (error) {
                console.log(error)
            }
        }



        $scope.closeModal = function() {
            $uibModalInstance.close();
        }
    }


})(window.angular)