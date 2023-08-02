(function(){

    'use strict';

    app.controller('liquidacionCompraCtrl', liquidacionCompraCtrl);

    liquidacionCompraCtrl.$inject = [
        '$scope', 
        '$filter', 
        'mainService', 
        'commonService', 
        'modalService', 
        'nombreModal', 
        'formulario', 
        'toastService', 
        'decodeToken',
        'liquidacionCompraService'
    ]

    function liquidacionCompraCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, fS, _tS, decodeToken, liquidacionCompraSvc) {

        const TIPO_DOC = _commonSvc.tipoDoc['LC'];
        let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

        $scope.proveedor = {
            nombreProveedor: ''
        }

        $scope.searchUser = {
            nombreCompleto: ''
        }
        $scope.moreSearchOptions = false;

        $scope.liquidacionesCompra = [];
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000
        } 
    
        $scope.sumTotalColumna = function () {
            let total = 0, totalAbono = 0, totalSaldo = 0;
            for(let item of $scope.liquidacionesCompra){
                total += item.total;
                totalAbono += item.abono;                
                totalSaldo += item.saldo;
            }
        
            $scope.total = fS.roundNumber(total, 5);
            $scope.totalAbono = fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = fS.roundNumber(totalSaldo, 5);
        }


        $scope.getLiquidacionesCompra = function () {
            try {
                showLoader();

                $scope.liquidacionesCompra = [];
                $scope.copiaLiquidacionCompras = [];
                $scope.sumTotalColumna(); 
                let dataSearch = {
                    tipo : 1,
                    codEstab: $scope.dataSearch.codEstab,
                    checkBoxFecha : $scope.dataSearch.nroSecuencial ? false: true,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    checkBoxProveedor: $scope.dataSearch.idProveedor > 0,
                    idProveedor: $scope.dataSearch.idProveedor,
                    checkBoxEstado: $scope.dataSearch.codEstadoDoc?true: false,
                    codEstadoDoc: $scope.dataSearch.codEstadoDoc,
                    isSearchNroDoc: $scope.dataSearch.nroSecuencial ? true: false,
                    nroSecuencial: $scope.dataSearch.nroSecuencial
                }
                liquidacionCompraSvc.getAll(dataSearch).then(response => {
                    hideLoader();   
                    $scope.liquidacionesCompra = response;
                    $scope.copiaLiquidacionCompras = JSON.parse(JSON.stringify($scope.liquidacionesCompra))
                    $scope.sumTotalColumna(); 

                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.initiload = () => {

            _commonSvc.getEstabAsign().then(response => {
           
                $scope.establecimientos = response; 
                
                if($scope.establecimientos.length>0){ 
                    let codEstab = $scope.establecimientos.length>0?$scope.establecimientos[0].codEstab: 0;            
                    $scope.dataSearch.codEstab = codEstab;
                    $scope.getLiquidacionesCompra();
                }else{
                    hideLoader();
                    tS.toastr('warning', 'No tienes asignado ningún Establecimiento')
                }
            }).catch(err => {
                hideLoader();
                console.error(err);
            })  

            _commonSvc.getEstadoDocByCodDoc(TIPO_DOC.codigo).then(response => {
                $scope.estadoPagos = response;
            })

        }
        $scope.initiload();

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
            $scope.dataSearch.fechaFin = item.endDate
            $scope.getLiquidacionesCompra();
        }

        //====================Cliente===========
        $scope.onKeyupProveedor= function(){
            if(!$scope.proveedor.nombreProveedor){
                $scope.dataSearch.idProveedor = 0;
            }
        }
        $scope.onSelectProveedor = function(item){
            $scope.dataSearch.idProveedor = item.idProveedor;
            $scope.getLiquidacionesCompra();
        }

        $scope.onKeyupUser = function(){
            if(!$scope.searchUser.nombreCompleto){
                $scope.dataSearch.idUsuario = 0;
            }
        }
        $scope.onSelectUser = function(item) {
            $scope.dataSearch.idUsuario = item.idUsuario;
            $scope.getLiquidacionesCompra();
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }
  
        $scope.filterLocalLCompras = function () {
            let liquidacionCompras = JSON.parse(JSON.stringify($scope.copiaLiquidacionCompras));
            $scope.liquidacionCompras = $filter("filter")(liquidacionCompras, $scope.txtFilter);
            $scope.sumTotalColumna();
        }

        


        $scope.openModalNew = async () => {

            let {
                MODAL_FILE_CTRL,
                MODAL_NUEVO
            } = _nombreModalConst.liquidacion_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
            let template = MODAL_NUEVO['template'];

            let params = {
                TIPO_REGISTRO: 'NUEVO'
            }

            $scope.openModalParam({
                controller,
                template,
                params
            })
        }

        $scope.openModalDetalle = async (item) => {
            try {
                showLoader();
                let {
                    MODAL_FILE_CTRL,
                    MODAL_DETALLE
                } = _nombreModalConst.liquidacion_compra;
                let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
                let template = MODAL_DETALLE['template'];

                let response = await _commonSvc.getDataTipoDocCompra({
                    id: item.idLiquidacionCompra,
                    codigoDocumento: TIPO_DOC.codigo
                })

                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'DETALLE',
                    data: response
                }

                $scope.openModalParam({
                    controller,
                    template,
                    params
                })
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }

        $scope.openModalEditar = async (item) => {
            try {
                showLoader();
                let {
                    MODAL_FILE_CTRL,
                    MODAL_EDITAR
                } = _nombreModalConst.liquidacion_compra;
                let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
                let template = MODAL_EDITAR['template'];

                let response = await _commonSvc.getDataTipoDocCompra({
                    id: item.idLiquidacionCompra,
                    codigoDocumento: TIPO_DOC.codigo
                })

                console.log(response)
                if (!response.isComplete) return

                let params = {
                    TIPO_REGISTRO: 'EDITAR',
                    data: response
                }

                $scope.openModalParam({
                    controller,
                    template,
                    params
                })
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        }

        $scope.openModalParam = async ({
            controller,
            template,
            size = 'xl',
            params
        }) => {
            _modalSvc.openModalCustom({
                controller,
                template,
                size,
                params,
                windowClass: 'uibModalFullScreen'
            }).result.then(result => {
                if (typeof result === 'object') {
                    $scope.getLiquidacionesCompra()
                }
            })
        }



        $scope.askToDelete = async (item) => {

            let {
                isConfirmed
            } = await Swal.fire({
                title: 'Eliminar Documento?',
                html: `<small>Esta Ud. seguro de eliminar este Factura</b> N° ${item.nroDocumento}</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar'
            })

            if (isConfirmed) {
                fS.showLoaderAnular();
                _mS.getData('delete', '/FacturaCompra/Delete?id=' + item.idFacturaCompra).then(response => {
                    if (response.code === "0") {
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        $scope.getFacturaCompras();
                    }
                })
            }
        }



        //Reporte 
        $scope.getReport = function (item) {

            let format = 'pdf';
            let dataParms = {
                id: item.idLiquidacionCompra,
                codEstab: item.codEstab,
                codigo: 'RLC',
                format,
            }

            const parameters = {
                dataParams: JSON.stringify(dataParms)
            }

            // let dataParms = {
            //     codEstab: item.codEstab,
            //     id: item.idLiquidacionCompra,            
            // }

            // let parameters = {
            //     reportParams: JSON.stringify({
            //         codigo: 'RLC', 
            //         codEstab: item.codEstab,
            //         format: 'pdf',
            //         aditionalParams: []
            //     }),
            //     dataParams: JSON.stringify(dataParms),
            //     sendEmail:false
            // }
            showLoader();
            _commonSvc.getReportDynamic({
                parameters,
                format
            })
        }





    }

})(window.angular)