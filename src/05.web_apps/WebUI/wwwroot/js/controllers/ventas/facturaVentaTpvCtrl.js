
app.controller("facturaVentaTpv", facturaVentaTpv);

facturaVentaTpv.$inject = ['$scope','mainService', 'commonService', 'modalService', 'nombreModal'];

function facturaVentaTpv($scope, _mS, _commonSvc, _modalSvc, _nombreModal){

    $scope.openModal = async()=>{
        const {MODAL_CTRL, MODAL_FACTURA_TPV_CSHTML} = _nombreModal.factura_venta;
        const {FacturaTpvCtrl} = await import("./../../modal/" + MODAL_CTRL);
        const _modalRef = _modalSvc.openModalCustom({
            controller: FacturaTpvCtrl,
            template: MODAL_FACTURA_TPV_CSHTML,
            //windowClass: 'uibModalFullScreen'
            size:'xl'
        })
    }

    $scope.data = {};
    $scope.dataRow = {
        idFacturaDetalle: 0,       
        codigo: "",
        idArticulo: 0,
        descripcion: "",
        cantidad: 1,
        nombreMedida: "",
        codigoTipoIva: "",
        nombreTipoIva: "",
        articuloTarifas:[],
        idTarifa: 0,
        precioVenta: 0,
        precioConIva: 0,
        porcentajeDescuento: 0,
        valorDescuento: 0,
        totalDescuento: 0,
        ice: 0,
        idBodega: 0,
        subTotal: 0,
        total: 0,
        nota: "",
        llevaInventario: false,
        datosAdicionales: false,
        idTipoIva: 0,
        porcentajeTipoIva: 0,
        productoFraccionable: false,
        medidas:[],
        idMedida: 13,
        adicional: [],        
    }

    $scope.initiload = async()=>{
       let results = JSON.parse(await  _commonSvc.getAsignacionByRol());
       $scope.sucursales      = results[0];
       $scope.puntosEmisiones = results[1]
       $scope.bodegas         = results[3];
       
       $scope.tiempoCreditos  = await _commonSvc.getAllTiempoCredito(true);
       $scope.tipoIvas        = await _commonSvc.getAllTipoIva();
       $scope.tarifas         = await _commonSvc.getAllTarifa();
    }
    $scope.initiload();


    $scope.searchCustomer = (textSearch)=>{    
        if(textSearch===null || textSearch===undefined || textSearch==="") return
        return _commonSvc.clienteSearch(textSearch);
    }

    $scope.selectedItemChangeCliente = (item)=>{   
        if(!item) return
        _commonSvc.getDataCliente(item.idCliente).then(
            response=>{
                $scope.cliente = response;
                $scope.searchText = $scope.cliente.nombreFiscal;
                $scope.$apply();
            }
        )             
    }

    $scope.openModalCliente = async(item)=>{
        const { MODAL_CTRL, MODAL_CSHTML} = _nombreModal.cliente;
        const { ModalClienteCtrl } = await import('./../../modal/' + MODAL_CTRL);
        let _modalRef = _modalSvc.openModalCustom({
            controller: ModalClienteCtrl,
            template: 'Cliente/'+ MODAL_CSHTML,
            size:'xl',
            params: item
        })   
        _modalRef.result.then(
            response=>{
                if(typeof response==='object'){
                    $scope.selectedItemChangeCliente(response)
                }
            }
        )
    }

    $scope.openModalClienteLista = async () => {
        const { MODAL_CTRL, MODAL_LISTA_CSHTML } = _nombreModal.cliente;
        const { ModalClienteListaCtrl } = await import('./../../modal/' + MODAL_CTRL);
        let _modalRef = _modalSvc.openModalCustom({
            controller: ModalClienteListaCtrl,
            template: 'Cliente/'+ MODAL_LISTA_CSHTML,
            size:'xl'         
        }) 
        _modalRef.result.then(
            response=>{
                if(typeof response==='object'){
                    $scope.selectedItemChangeCliente(response)
                }
            }
        )    
    }


}