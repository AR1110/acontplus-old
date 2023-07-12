app.controller('facturaCompraCtrl', facturaCompraCtrl);

facturaCompraCtrl.$inject = [
    '$scope', 
    '$filter', 
    'mainService', 
    'commonService', 
    'facturaCompraService', 
    'modalService', 
    'nombreModal', 
    'formulario'
]

function facturaCompraCtrl($scope, $filter, _mS, _commonSvc, factCompraSvc, _modalSvc, _nombreModalConst, fS) {

    // let accion = JSON.parse(localStorage.getItem("accion"));  
    // if(accion===null){
    //     location.href ="/Home/Index";
    //     return
    // }else{
    //     $scope.accion = accion[0];
    // }

    const TIPO_DOC = _commonSvc.tipoDoc['FC'];
    const { MODAL_FILE_CTRL,
        MODAL_NUEVO} = _nombreModalConst.factura_compra;

    $scope.proveedor = {
        nombreProveedor: ''
    }

    $scope.searchUser = {
        nombreCompleto: ''
    }
    $scope.moreSearchOptions = false;

    $scope.estadoPagos = [];
    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    } 

    $scope.filterLocalFC = async () => {
        let facturas = JSON.parse(JSON.stringify($scope.cloneFacturas));
        $scope.facturas = $filter("filter")(facturas, $scope.txtFilter);
        $scope.getTotalColumna();
    }

    $scope.getTotalColumna = function () {
        let total = 0,
            abono = 0,
            saldo = 0;
        for (let val of $scope.facturas) {
            total += val.total;
            abono += val.abono;
            saldo += val.saldo;
        }
        $scope.total = fS.roundNumber(total, 5);
        $scope.abono = abono || 0;
        $scope.saldo = saldo || 0;
    }


    $scope.getFacturas = function () {
        try {
            showLoader();
            $scope.cloneFacturas = [];
            $scope.facturas = [];
            $scope.getTotalColumna();

            let estado = $scope.estadoPagos.length && $scope.estadoPagos.find(item=>item.codigo === $scope.dataSearch.codEstadoDoc);
            const dataSearch = {
                codEstab: $scope.dataSearch.codEstab,
                tipoFecha: 'FE',
                checkBoxFecha: true,
                fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                checkBoxProveedor: $scope.dataSearch.idProveedor > 0,
                byProveedor: $scope.dataSearch.idProveedor,
                checkBoxEstado: $scope.dataSearch.codEstadoDoc?true: false,
                byEstado: estado && estado.idEstadoPago,
                isSearchNroDoc: $scope.dataSearch.nroSecuencial ? true: false,
                nroSecuencial: $scope.dataSearch.nroSecuencial
                
            }

            factCompraSvc.getAll(dataSearch).then(response => {
                hideLoader();
                $scope.facturas = response || [];
                $scope.cloneFacturas = JSON.parse(JSON.stringify($scope.facturas));
                $scope.getTotalColumna();
            }).catch(error => {
                console.log(error);
                hideLoader();
            })            
        } catch (error) {
            hideLoader();
            console.log(error)
        } 
    }

    $scope.initiload = () => {

        _commonSvc.getEstabAsign().then(response => {
            $scope.establecimientos = response;
            let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
            $scope.dataSearch.codEstab = codEstab;
            $scope.getFacturas();
        })

        _commonSvc.getEstadoDocByCodDoc(TIPO_DOC.codigo).then(response => {
            $scope.estadoPagos = response;
        })
    }
    $scope.initiload();


    //----------------------------------------------FILTROS ----------------------------------------
    $scope.resultRangeFilter = function (item) {
        $scope.dataSearch.fechaInicio = item.startDate,
        $scope.dataSearch.fechaFin = item.endDate
        $scope.getFacturas();
    }

    //====================Cliente===========
    $scope.onKeyupProveedor= function(){
        if(!$scope.proveedor.nombreProveedor){
            $scope.dataSearch.idProveedor = 0;
        }
    }
    $scope.onSelectProveedor = function(item){
        $scope.dataSearch.idProveedor = item.idProveedor;
        $scope.getFacturas();
    }

    $scope.onKeyupUser = function(){
        if(!$scope.searchUser.nombreCompleto){
            $scope.dataSearch.idUsuario = 0;
        }
    }
    $scope.onSelectUser = function(item) {
        $scope.dataSearch.idUsuario = item.idUsuario;
        $scope.getFacturas();
    }

    $scope.onClickBtnMore = function () {
        $scope.moreSearchOptions = !$scope.moreSearchOptions;
    }  

     
    $scope.openModalNew = async () => {
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
            } = _nombreModalConst.factura_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
            let template = MODAL_DETALLE['template'];

            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idFacturaCompra,
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
            } = _nombreModalConst.factura_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
            let template = MODAL_EDITAR['template'];

            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idFacturaCompra,
                codigoDocumento: TIPO_DOC.codigo
            })

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
            windowClass: 'uibModalFullScreen',
            isRenderRazorPartial: true,
        }).result.then(result => {
            if (typeof result === 'object') {
                $scope.getFacturas()
            }
        })
    }



    $scope.askToDelete = async (item) => {

        try {
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
                showLoader();
                factCompraSvc.delete(item.idFacturaCompra).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        hideLoader();
                        fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        $scope.getFacturas();
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            }
        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }

    //Reporte 
    $scope.getReport = function (item) {
        let dataParms = {
            codEstab: item.codEstab,
            id: item.idFacturaCompra,
            isReportImported: false
        }

        let parameters = {
            hasService: true,
            reportParams: JSON.stringify({
                codigo: 'RFC',
                codEstab: item.codEstab,
                format: 'pdf',
                aditionalParams: []
            }),
            dataParams: JSON.stringify(dataParms),            
        }
    
        _commonSvc.getReport({
            parameters,
            formatType: 'pdf'
        })
    }





}