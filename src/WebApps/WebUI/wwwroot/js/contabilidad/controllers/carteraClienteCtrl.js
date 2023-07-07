(function(){

    'use strict';

    app.controller('carteraClienteCtrl', carteraClienteCtrl);

    carteraClienteCtrl.$inject = ['$scope', 'commonService', 'mainService', 'clienteService', 'formulario']

    function carteraClienteCtrl($scope, commonSvc, mS, clienteSvc, fS) {
        
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        

        $scope.dataSearch = {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            byCliente: 0
        }
        $scope.moreSearchOptions = false;
        $scope.dataSearch.verDetalleDoc = false;
        $scope.total = 0;
        $scope.abono = 0;
        $scope.saldo = 0;

        $scope.format = null;

        
        $scope.initiload = async function () {
            try {
                showLoader();
                await commonSvc.getEstabAsign().then(response => {
                    $scope.establecimientos = response;
                    if ($scope.establecimientos.length > 0) {
                        $scope.dataSearch.codEstab = $scope.establecimientos[0].codEstab;
                    } else {
                        Toast.fire({
                            icon:'warning',
                            html: 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO'
                        })                        
                    }
                }).catch(error=>{
                    hideLoader();
                    console.log(error);
                })
                
            
                await commonSvc.getEstadoDocByCodDoc('CCL').then(response => {
                    $scope.estadoDocumentos = response;
                })
                hideLoader();                        
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.initiload();
        
           //========================Start Filters=================
        
        $scope.resultRangeFilter = function(item) {
            $scope.dataSearch.fechaInicio = item.startDate,
            $scope.dataSearch.fechaFin =  item.endDate
            // $scope.getAprobComprobantes();
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

        $scope.onKeyupClienteSearchFiltro = function(){
            if(!$scope.modelTextSearch)            {
                $scope.dataSearch.byCliente = 0;
                $scope.dataSearch.verDetalleDoc = false;
            }
        }

        $scope.selectedClienteSearchFiltro = function(item) {
            $scope.dataSearch.byCliente =item.idCliente;            
        }

        $scope.onClickBtnMore = function() {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.isValidForm = function() {
            if (!$scope.dataSearch.codEstab) {
                Toast.fire({
                    icon:'warning', 
                    html:'Seleccione el Establecimiento',
                });
                return
            }

            // if (!$scope.dataSearch.checkBoxDeudores && !$scope.dataSearch.checkBoxCliente) {
            //     toast.toastr('warning', 'Seleccione el Cliente', 'Filtrar');
            //     return
            // }

            // if ($scope.dataSearch.checkBoxCliente) {
            //     if (form.campo($scope.dataSearch.byCliente) || $scope.dataSearch.byCliente === 0) {
            //         toast.toastr('warning', 'Seleccione el Cliente', 'Filtrar');
            //         return
            //     };
            // }
            if(!$scope.dataSearch.fechaInicio){
                Toast.fire({
                    icon:'warning', 
                    html:'Ingrese fecha de Inicio',
                });
                return
            }

            if(!$scope.dataSearch.fechaFin){
                Toast.fire({
                    icon:'warning', 
                    html:'Ingrese fecha fin',
                });
                return
            }
            return true
        }

        $scope.search = function(){
            if(!$scope.isValidForm()) return;
            Toast.fire({
                icon:'warning', 
                html:'No Disponible',
            });
        }

        $scope.exportToExcel = function(){
            $scope.format = 'excel' ;
            if(!$scope.isValidForm()) return;

            $scope.getReport();

        }

        $scope.exportToPDF = function(){
            $scope.format = 'pdf' ;
            if(!$scope.isValidForm()) return;

            $scope.getReport();
        }


        $scope.getReport = function(){     
            let dataParams = {
                codEstab: $scope.dataSearch.codEstab,
                checkBoxCliente:$scope.dataSearch.byCliente > 0,
                byCliente: $scope.dataSearch.byCliente,
                checkBoxEstado: $scope.dataSearch.byEstado > 0,
                byEstado: $scope.dataSearch.byEstado,
                fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                verDetalleDoc: $scope.dataSearch.byCliente>0?false: $scope.dataSearch.verDetalleDoc
            }       
            console.log($scope.dataSearch.byCliente)
            console.log($scope.dataSearch.verDetalleDoc)
            console.log(dataParams)
            const parameters = {
                hasIdUsuarioRol: true,
                reportParams: JSON.stringify({
                    hasParams: false,
                    codigo: "RCCL",
                    format: $scope.format,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataParams)
            }

            commonSvc.getReport({
                parameters,
                formatType: $scope.format
            })
        }


        $scope.verDocumento = function(item) {
            commonSvc.viewDetailDocument({
                id: item.idDocumento,
                codigoDocumento: item.codigo,
                size: 'xl',
                windowClass: 'uibModalFullScreen'
            })
        }


    }

})(window.angular)

// app.controller('carteraClienteCtrl', carteraClienteCtrl);

// carteraClienteCtrl.$inject = ['mainService', '$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario'];

// function carteraClienteCtrl(_mS, $scope, $filter, _mS, commonSvc, _modalSvc, _nombreModal, toast, form) {

//     $scope.copiaCarteraClientes = [];
//     $scope.carteraClientes = [];

//     $scope.total = 0;
//     $scope.abono = 0;
//     $scope.saldo = 0;

//     //Filters        
//     $scope.dataSearch = {};
//     $scope.dataSearch.checkBoxDeudores = false;
//     $scope.dataSearch.tipoFecha = 'FE'
//     $scope.meses = form.meses();
//     $scope.mes = $scope.meses[new Date().getMonth() + 1].numero;


   

//     $scope.load = () => {
//         _mS.getData('get', '/EstabAsig/Get?json=' + JSON.stringify({})).then(response => {
//             $scope.establecimientos = JSON.parse(response.payload) || [];

//             if ($scope.establecimientos.length > 0) {
//                 $scope.dataSearch.codEstab = $scope.establecimientos[0].codEstab;
//             } else {
//                 toast.toastr('warning', 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO')
//             }
//         })

//         commonSvc.getEstadoDocByCodDoc('CCL').then(response => {
//             $scope.estadoDocumentos = response;
//         })
//     };
//     $scope.load();



   

//     $scope.openModalFiltro = function () {
//         $("#modalFiltro").modal('show');
//     }

//     $scope.onChangeDeudores = function () {
//         $scope.carteraClientes = [];
//         $scope.total = 0;
//         $scope.abono = 0;
//         $scope.saldo = 0;

//         if ($scope.dataSearch.checkBoxDeudores) {
//             $scope.dataSearch.checkBoxCliente = false;
//             $scope.dataSearch.checkBoxFecha = false;
//             $scope.dataSearch.checkBoxEstado = false;
//         }
//     }

   
//     $scope.filtrar = function () {
//         try {
//             if (!$scope.dataSearch.codEstab) {
//                 toast.toastr('warning', 'Seleccione el Establecimiento', 'Filtrar');
//                 return
//             };

//             if (!$scope.dataSearch.checkBoxDeudores && !$scope.dataSearch.checkBoxCliente) {
//                 toast.toastr('warning', 'Seleccione el Cliente', 'Filtrar');
//                 return
//             }

//             if ($scope.dataSearch.checkBoxCliente) {
//                 if (form.campo($scope.dataSearch.byCliente) || $scope.dataSearch.byCliente === 0) {
//                     toast.toastr('warning', 'Seleccione el Cliente', 'Filtrar');
//                     return
//                 };
//             }

//             if ($scope.dataSearch.checkBoxFecha) {
//                 if (form.campo($scope.dataSearch.fechaInicio)) {
//                     toast.toastr('warning', 'Ingrese fecha de Inicio', 'Filtrar');
//                     return
//                 }
//                 if (form.campo($scope.dataSearch.fechaFin)) {
//                     toast.toastr('warning', 'Ingrese fecha Fin', 'Filtrar');
//                     return
//                 }
//             }

//             if ($scope.dataSearch.checkBoxEstado) {
//                 if (form.campo($scope.dataSearch.byEstado) || $scope.dataSearch.byEstado === 0) {
//                     toast.toastr('warning', 'Seleccione el Estado', 'Filtrar');
//                     return
//                 }
//             }

//             showLoader();
//             _mS.getData('get', '/CarteraCliente/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
//                 if (response.id === "0" || response.code === "0") {
//                     hideLoader();
//                     form.sweetAlert('warning', response.message);
//                     return
//                 }

//                 if (response.id === "1" || response.code === "1") {
//                     $scope.carteraClientes = JSON.parse(response.data) || [];
//                     $scope.copiaCarteraClientes = JSON.parse(JSON.stringify($scope.carteraClientes));
//                     $scope.setTotalColumn();
//                     $("#modalFiltro").modal('hide');
//                     hideLoader();
//                 }

//             }).catch(error => {
//                 hideLoader();
//                 console.error(error)
//             })
//         } catch (error) {
//             hideLoader();
//             console.log(error)
//         }
//     }

//     $scope.filterLocal = function () {
//         $scope.carteraClientes = $filter("filter")($scope.copiaCarteraClientes, $scope.txtSearch);
//         $scope.setTotalColumn();
//     }

//     $scope.setTotalColumn = function () {
//         let total = 0,
//             abono = 0,
//             saldo = 0;
//         for (let cartera of $scope.carteraClientes) {
//             total += cartera.total;
//             abono += cartera.abono;
//             saldo += cartera.saldo;
//         }
//         $scope.total = form.roundNumber(total, 5);
//         $scope.abono = form.roundNumber(abono, 5);
//         $scope.saldo = form.roundNumber(saldo, 5);
//     }







//     $scope.getDownload = async () => {
//         if ($scope.carteraClientes.length === 0) {
//             toast.toastr('warning', 'No hay documentos', 'Reporte');
//             return
//         }

//         const {
//             value: formatType
//         } = await Swal.fire({
//             icon: 'warning',
//             title: 'Tipo Formato',
//             input: 'radio',
//             inputOptions: {
//                 pdf: 'PDF',
//                 excel: 'EXCEL'
//             },
//             inputValidator: (value) => {
//                 if (!value) {
//                     return 'Seleccione el Tipo de Formato!'
//                 }
//             },
//             confirmButtonText: 'Descargar',
//             showDenyButton: true,
//             denyButtonText: 'No, cancelar',
//             allowOutsideClick: false,
//             showLoaderOnDeny: true,
//             allowEscapeKey: false
//         })

//         if (!formatType) return




//     }




//     $scope.getCuotaDocumento = function (dataTipoDocumento, dataCliente) {
//         $scope.dataTipoDocumento = dataTipoDocumento;
//         $scope.cliente = dataCliente;
//         showLoader();
//         _mS.getData('get', `/CuotaXCobrar/GetByDocument?idComprobante=${dataTipoDocumento.idComprobante}&idTipoDoc=${dataTipoDocumento.idTipoDocumento}`).then(response => {
//             if (response.id == "0") {
//                 hideLoader();
//                 Swal.fire({
//                     title: `<small>${response.titleSms}</small>`,
//                     icon: 'warning',
//                     html: `<small>${response.message}</small>`
//                 })
//             }
//             if (response.id === "1") {
//                 $scope.cuotas = response.data;
//                 $("#modalCuotaCarteraCliente").modal('show');
//                 hideLoader();
//             }
//             hideLoader();
//         })
//     };

//     $("#modalCuotaCarteraCliente").on('hide.bs.modal', e => {
//         $scope.cliente = {};
//         $scope.dataTipoDocumento = {};
//         $scope.cuotas = [];
//     })
// }