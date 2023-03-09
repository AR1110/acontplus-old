app.controller('pagoCtrl', pagoCtrl);

pagoCtrl.$inject = [
    '$timeout',
    '$http',
    '$filter',
    '$scope',
    'mainService',
    'commonService',    
    'toastService', 
    'modalService',
    'nombreModal',
    'formulario'
];

function pagoCtrl($timeout, $http, $filter, $scope, mS, _commonSvc, toast, _modalSvc, _nombreModal, form) {
    'use strict'
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    };
    $scope.data = {};         
    $scope.bancos=[];
    $scope.banco = {};
    $scope.cuentaBancaria = {};

    $scope.pageIndex=1;
    $scope.pageSize=10000;

    $scope.options = {
        limitOptions: [5, 10, 15],
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true,
        order: '',
        limit: 5,
        page: 1
    };
    // $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
    
    //Filtros          
    $scope.meses = form.meses();
    $scope.mes   = new Date().getMonth() + 1;

    $scope.dataSearch = {};
    $scope.dataSearch.pageIndex = 1;
    $scope.dataSearch.pageSize = 1000000;
    $scope.dataSearch = {};

    $scope.listDocuments = []
            
    
    $scope.pagos=[];
    $scope.getPagos=function(){
        try {
            showLoader();
            $scope.pagos = [];

            mS.getData('get','/ComprobanteEgreso/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.id=="0"){
                    hideLoader();
                    $scope.pagos = [];
                    console.log(response)
                    return
                }
                $scope.pagos = JSON.parse(response.data) || []; 
                console.log(JSON.parse(response.data))                                       
                hideLoader();
            }).catch(error=>{
                $scope.pagos = [];
                hideLoader();
                console.log(error)
            })
        } catch (error) {
            $scope.pagos = [];
            hideLoader();
        }
    }
    $scope.getPagos();
    
    $scope.init = function() {

        _commonSvc.getEstabAsign().then(response=>{
            $scope.establecimientos = response;
            if($scope.establecimientos.length>0){
                $scope.dataSearch.codEstab = $scope.establecimientos[0].codEstab;
                $scope.codEstab = $scope.dataSearch.codEstab;
                $scope.cloneCodEstab = $scope.dataSearch.codEstab;
            }else{                
                toast.toastr('warning', 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO')
            }
        })

        $http.get('/EntidadFinanciera/OptionEntidadFinanciera').then(({data:response}) => {
            $scope.entidadesFinancieras = response.data;
            $scope.entidadFinanciera = response.data.find(val => val.codigo == 'EFE');
            $scope.getSubEntidadByIdEntFinanciera($scope.entidadFinanciera.idEntidadFinanciera);
        }, error => console.log(error));

        //Estado pago 
        $http.get('/EstadoPago/Get').then(({data:response})=>{
            $scope.paymentStatus = response.data;
            $scope.estadoPago = {};
            angular.forEach(response.data, val => {
                $scope.estadoPago[val.codigo] = val.descripcion;
            })
        }, error => console.log(error));

        $http.get('/Banco/GetByAll').then(({data:response}) => {
            if (response.id == "0") {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            $scope.bancos = response.data;                
        }, error => console.log(error));

        $http.get('/Ciudad/ReadCiudadProvincia').then(({data:response}) => {
            if (response.id == 0) {
                toast.toastr('warning', response.message, response.titleSms);
                return;
            };               
            $scope.ciudadPronvincias=response.data;                                                           
        });
    };
    $scope.init();
    
    //Get Sub Entidad Financiera 
    $scope.getSubEntidadByIdEntFinanciera = function(id) {
        $http.get('/SubEntidadFinanciera/GetByIdEntidadFinanciera?idEntidadFinanciera=' + id)
        .then(({data:response}) => {
            if (response.id == "0") {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            $scope.subEntidades = response.data;
            $scope.subEntidad = response.data[0];
        }, error => console.log(error));
    }


    $scope.newPayment= async()=>{
        //  const {pago} = _nombreModal             
        //  const {ModalPagoDocumentoCtrl} = await import('./../../modal/' + pago.MODAL_PAGO_DOCUMENTO_CTRL);
        //  const modalRef = _modalSvc.openModalSecond(ModalPagoDocumentoCtrl, 'Shared/Pago/' + pago.MODAL_PAGO_DOCUMENTO_CSHTML, 'xl');
        //  modalRef.opened.then(response=>{                
        //      console.log(response)
        //  })
        $scope.showFooterStepUno=true;
        $scope.showFooterStepDos=false;
        $scope.pago.total = 0;         
        $scope.pago.abono = 0;
        $scope.pago.abonoPosfechado = 0;
        $scope.pago.totalPago = 0;
        $scope.pago.saldo = 0;
        $scope.pago.valorCambio=0;
        $scope.pago.posFechado = false;
        $("#modalPayment").modal('show');            
    };

    //Focus en input del Buscador del Cliente 
    $("#modalPayment").on('shown.bs.modal',e=>{
        $("input[name='autocompleteSupplier']").focus();
    });


    //-------------------------------MODAL FILTRO----------------------------
    $scope.openModalPagoFiltro = ()=>{
        $("#modalPagoFiltro").modal('show');
    }


    $scope.onChangeFechaFiltro =()=>{            
        $scope.mes = new Date().getMonth() +1;
        $scope.getFechaInicioFinFilter($scope.mes)
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Buscador AVanzado
    $scope.getFechaInicioFinFilter = (mes)=> {
        let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter(mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
    }

    $scope.proveedorFiltro = {};
    $scope.proveedorSearch = (textSearch)=>{
        return _commonSvc.proveedorSearch(textSearch).then(response=>response)
    }

    $scope.onKeyupProvedorAutocompleteFiltro = ()=>{
        if(form.campo($scope.proveedorFiltro.nombreFiscal)) {
            $scope.dataSearch.byPersona = null;                
        }
    }

    $scope.selectProveedorFiltro = (item)=>{            
        $scope.dataSearch.byPersona = item.proveedor.numeroIdentificacion
    }

    $scope.onKeyupSearchEmpleadoFiltro = ()=>{
        if(form.campo($scope.selectedEmpleadoFiltro)){
            $scope.dataSearch.byPersona = null;   
        }
    }

    $scope.searchEmpleadoFilter = (textSearch)=>{
        return $http.get('/Empleado/Search?busqueda=' + textSearch).then(({data:response})=>{
            return response.data;
        })
    }


    $scope.selectedEmpleadoFiltroChange = (item)=>{
        $scope.dataSearch.byPersona = item.nroIdentificacion;            
    }

    $scope.dataUsuarioSearch = {}
    $scope.usuarioSearch = (textSearch) => {
        return _commonSvc.usuarioSearch({
            idRol: document.getElementById('idRol').value,
            busqueda: textSearch
        })
    }

    $scope.onKeyupUsuarioSearchFilter = () => {
        if (form.campo($scope.dataUsuarioFilter.nombreCompleto)) {
            $scope.dataSearch.byUsuario = null;
        }
    }

    $scope.selectedUsuarioSearchFilter = (item) => {
        $scope.dataSearch.byUsuario = item.idUsuario;
    }

    $scope.onChangeDocumentoFiltro = ()=>{
        $scope.dataSearch.checkBoxPersona = false;
    }

    $scope.onChangeTipoDocumento = ()=>{
        $scope.dataSearch.byComprobante = null
        $scope.dataSearch.byTipoDocumento = null;

        if($scope.dataSearch.tipoDocumento==='FC'){
            $scope.getFacturaCompras();
        }

        if($scope.dataSearch.tipoDocumento==='IB'){
            $scope.getIngresoBodegas();
        }

        if($scope.dataSearch.tipoDocumento==='LC'){
            $scope.getLiquidacionCompras();
        }

    }
            
    //Get Factura Compra
    $scope.getFacturaCompras = function() {           
        showLoader();
        $http.get('/FacturaCompra/Get?json=' + JSON.stringify({})).then(({data:response}) => {
            if (response.id == "0") {
                hideLoader();
                form.sweetAlert('warning', response.message, response.titleSms);
                return
            }  
            $scope.facturas = JSON.parse(response.data) || [];   
            hideLoader();
        }).catch(error=>{
            hideLoader();
            const msg = error.config?error.config.url: error
            toastr.error(msg)
        })
    }

    //-------------------GET INGRESO BODEGAS-----------------------
    $scope.getIngresoBodegas = function () {
        showLoader();
        $http.get('/IngresoBodega/Get?json=' + JSON.stringify({})).then(({data:response}) => {
            if (response.id == "0") {
                hideLoader();
                toast.toastr('warning', response.message, response.titleSms);
                return
            }                                          
            $scope.ingresoBodegas = JSON.parse(response.data) || [];                
            hideLoader();
        }).catch(error=>{
            hideLoader();
            const msg = error.config?error.config.url:error
            toastr.error(msg)
        })
    }


    //---------------------------GET LIQUIDACIÓN DE COMPRAS-------------------------------
    $scope.getLiquidacionCompras = ()=> {
        showLoader();
        $http.get('/LiquidacionCompra/Get?json=' + JSON.stringify({})).then(({data:response}) => {
            if (response.id == "0") {
                hideLoader();
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            hideLoader();                
            $scope.liquidacionCompras = JSON.parse(response.data) || [];                 
        }, error => console.log(error));
    }



    $scope.onChangeSelectDocumentoFiltro = (item)=>{            
        $scope.dataSearch.byTipoDocumento = item.idTipoDocumento;            
        if($scope.dataSearch.tipoDocumento==='FC'){
            $scope.dataSearch.byComprobante = item.idFacturaCompra;                
        }

        if($scope.dataSearch.tipoDocumento==='IB'){
            $scope.dataSearch.byComprobante = item.idIngresoBodega;                
        } 
        
        if($scope.dataSearch.tipoDocumento==='LC'){
            $scope.dataSearch.byComprobante = item.idLiquidacionCompra;                
        } 
    }

    $scope.buscarPago = ()=>{
        if($scope.dataSearch.checkBoxFecha){
            if(form.campo($scope.dataSearch.fechaInicio)){
                toastr.warning('Seleccione la Fecha de Inicio');
                return
            }
            if(form.campo($scope.dataSearch.fechaFin)){
                toastr.warning('Seleccione la Fecha Fin');
                return
            }
        }

        if($scope.dataSearch.checkBoxPersona){
            if(form.campo($scope.dataSearch.byTipoPersona)) {
                toastr.warning('Seleccione el Tipo Persona (Proveedor/Empleado)');
                return
            }

            if(form.campo($scope.dataSearch.byPersona)){
                toastr.warning('Seleccione la Persona');
                return
            }
        }

        if($scope.dataSearch.checkBoxUsuario){
            if(form.campo($scope.dataSearch.byUsuario)){
                toastr.warning('Seleccione el Usuario');
                return
            }
        }

        if($scope.dataSearch.checkBoxEstado){
            if(form.campo($scope.dataSearch.byEstado)){
                toastr.warning('Seleccione el Estado');
                return
            }
        }

        if($scope.dataSearch.checkBoxDocumento){
            if(form.campo($scope.dataSearch.tipoDocumento)){
                toastr.warning('Seleccione el Tipo Documento');
                return
            }

            if(form.campo($scope.dataSearch.byTipoDocumento) || form.campo($scope.dataSearch.byComprobante)){
                toastr.warning('Seleccione el Documento');
                return
            }


        }

        $scope.getPagos();
        $("#modalPagoFiltro").modal('hide');

    }

    //-------------------------------------------------------------------------------------------------

    $scope.onChangeEstablecimiento = async function(){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger ml-2'
            },
            buttonsStyling: false
        })
          
        let {isConfirmed} = await  swalWithBootstrapButtons.fire({
            title: '<small>Cambiar el Establecimiento?</small>',
            html: "<small>Esta seguró de cambiar el Establecimiento</small>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, cambiar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: false
        })

        if(isConfirmed){
            $scope.cloneCodEstab = $scope.codEstab;
            $scope.getDocumentsBySupplier();
            
        }else{
            $scope.codEstab = $scope.cloneCodEstab;
            
        }
    }
    
    //Search Supplier
    $scope.proveedor={};
    $scope.searchSupplier = function(searchText) {
        let search_response = $http.get('/Proveedor/SearchProveedor?busqueda=' + searchText).then(({data:response}) => {                
            if (response.data.id == "0") {
                console.log(response.data);
                return
            }
            return response.data;
        },error=>{
            throw error;
        });
        return search_response;
    };

    $scope.onKeyupSearchSupplier = function() {
        if ($scope.selectedSupplier === undefined || $scope.selectedSupplier === null){
            $scope.proveedor={};
            $scope.listDocuments=[];
            $scope.selectedDocs=[];
            $scope.listaPagos=[];
            $scope.cuotasAfectados=[];
        }
    }

    //Selected Supplier Change         
    $scope.selectedSupplierChange = function(data) {                      
        $scope.proveedor = data.proveedor;                                                        
        $scope.getDocumentsBySupplier(data.proveedor.idProveedor)
    };

    $scope.listDocuments= [];
    $scope.getDocumentsBySupplier=function(){
        try {
            if(!$scope.codEstab){
                toast.toastr('warning', 'Seleccione el Establecimiento');
                return
            }

            if(!($scope.proveedor.idProveedor>0)){
                toast.toastr('warning', 'Seleccione el Proveedor');
                return
            }

            let json = {
                codEstab: $scope.codEstab,
                idProveedor: $scope.proveedor.idProveedor
            }

            showLoader();
            mS.getData('get', '/GestionFinanciera/GetDocumentsPay?json='+ JSON.stringify(json)).then(response=>{
                if(response.id==="0"){
                    hideLoader();
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if(response.data.length===0){
                    hideLoader();
                    Swal.fire({
                        icon:'warning',
                        html:`<small>No se encontró ningun Tipo de Documento con este Proveedor: <b>${$scope.proveedor.nombreComercial}</b></small>`
                    });
                    return
                }
                if(response.id==="1"){  
                    hideLoader();
                    $scope.listDocuments=response.data;                    
                }
            }).catch(error=>{
                hideLoader();
                console.error(error)
            })

        } catch (error) {
            console.log(error)
        }       
    }

    $scope.selectedDocs = [];   
    $scope.getCuota=function(data){  
        $scope.listaPagos=[];
        $scope.cuotasAfectados=[];

        showLoader();
        mS.getData('get', `/CuotaXPagar/GetForPay?idComprobante=${data.idComprobante}&idTipoDocumento=${data.idTipoDocumento}`)
        .then(response=>{                
            if(response.id==="0"){
                hideLoader();
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            if(response.id==="1"){                    
                data.display=true; //Mostrar las cuotas del documento 
                data.cuotaOriginal = JSON.parse(JSON.stringify(response.data));
                data.cuotas = response.data;
                hideLoader();
            }
            hideLoader();
        }).catch(error=>{
            hideLoader();
            console.error(error)                
        })
    };

    $scope.paymentStepUno=function(){
        $("#newPaymentForm-head-2").removeClass('active');                
        $("#newPaymentForm-step-2").hide();            
        $("#newPaymentForm-step-1").show();
        $("#newPaymentForm-head-1").addClass('active'); 
        
        $scope.showFooterStepUno=true;
        $scope.showFooterStepDos=false;
    };

    $scope.paymentStepDos=function(){
        if($scope.selectedDocs.length===0){
            toast.toastr('warning', 'Seleccione al Menos un Tipo de Documento');                            
            return
        }
        $("#newPaymentForm-head-1").removeClass('active');                
        $("#newPaymentForm-step-1").hide();            
        $("#newPaymentForm-step-2").show();
        $("#newPaymentForm-head-2").addClass('active'); 

        //Ordenamos los documentos seleccionados 
        $scope.selectedDocs = $filter('orderBy')($scope.selectedDocs, 'fechaEmision'); 
        $scope.showFooterStepUno=false;
        $scope.showFooterStepDos=true;
        $scope.getTotalesCuotas();
    };           


    $scope.pago={};
    $scope.getTotalesCuotas=function(){  
        let total=0,totalAbonoAnterior=0, saldo=0;

        for(var i=0; i< $scope.selectedDocs.length; i++){                
            if($scope.selectedDocs[i].cuotas===undefined){                    
                form.sweetAlert(
                    'warning', 
                    `Tipo Documento <b>${$scope.selectedDocs[i].tipoDocumento}</b> con Nro. Doc.: <b>${$scope.selectedDocs[i].nroDocumento}</b> no tiene cuotas </br>`
                    );                   
                $scope.paymentStepUno(); //Step 1
                return
            }    
            for(var val of $scope.selectedDocs[i].cuotas ){
                total += val.cxp.cuota;                                        
                totalAbonoAnterior += val.abono;                                                        
                saldo += val.saldo;
            }                                                        
        }
        $scope.pago.total = form.roundNumber(total,5);
        $scope.pago.totalAbonoAnterior = form.roundNumber(totalAbonoAnterior,5)
        $scope.pago.saldo = form.roundNumber(saldo,5);
        $scope.pago.saldoOriginal = form.roundNumber(saldo,5);
    }


    //Filtrar el estado de la Cuota 
    $scope.estadoAbonoCuota = function(cuota){
        let estado = ''; 
        if (cuota.cxp.cuota === (cuota.abono + cuota.abonoPosfechado)) {
              estado = "Cobrada";
        } 
        if (cuota.saldo > 0){                
            estado = "Pendiente Parcial"
        } 
        if (cuota.cxp.cuota === cuota.saldo){
            estado = "Pendiente";
        } 
        return estado;        
    }

    //Mostrar u Ocultar las cuotas de cada documento 
    $scope.displayCuota=function(data){
        data.display=!data.display;
    }

    //Añadir nuevo pago a la cuota
    $scope.newPayMoney=function(){  
        if($scope.pago.saldo==0){
            form.sweetAlert('warning', 'No hay cuotas pendientes.');               
            return
        }
        $scope.pago.fechaEmision = new Date();
        $scope.resetDataFormaPago();
        $("#modalPayMoney").modal('show');
        return
    };
    
    //Click sobre Entidad Financiera 
    $scope.onClickTabEntidadFinanciera=function(ef){
        if($scope.entidadFinanciera.codigo!==ef.codigo){
            $scope.entidadFinanciera=ef;
            $scope.resetDataFormaPago();                
            $scope.getSubEntidadByIdEntFinanciera(ef.idEntidadFinanciera);

            if(ef.codigo==='CHE'){
                $scope.pago.referencia = $scope.proveedor.nombreFiscal;
            }
        }                        
    };

    $scope.resetDataFormaPago=function(){
        $scope.pago.valorPago = $scope.pago.saldo;
        $scope.pago.idCiudad = undefined;
        $scope.pago.nro = '';
        $scope.pago.posFechado = false;
        $scope.pago.aprobacion = '';
        $scope.pago.lote = '';
        $scope.pago.referencia = '';
        $scope.banco = {};
    }
            
    //Validar Forma Pago 
    $scope.listaPagos=[];
    $scope.abonoMain = 0;
    $scope.validarFormaPago=function(){
        try {
            if($scope.validarAbono($scope.entidadFinanciera, $scope.pago, $scope.banco)){
                let secuencial = $scope.listaPagos.length + 1; 
                
                $scope.pago.valorPago = Number($scope.pago.valorPago);
                $scope.abonoMain = $scope.pago.valorPago;

            
                $scope.agregarFormaPago(secuencial, $scope.pago.posFechado); 
                
                $scope.getValorAbonoFormaPago(secuencial);                                             
                
                $scope.calculoTotales();
                
                $("#modalPayMoney").modal('hide');                
            }
        } catch (error) {
            console.log(error);
        }                                    
    }

    $scope.validarAbono = function(entidadFinanciera, pago, banco, ){
        //Si el abono es Cheque            
        if (entidadFinanciera.codigo === "CHE") {
            if (form.campo(banco.idBanco)) {
                toast.toastr('warning', 'Seleccione el Banco', 'Pago');
                return
            }
            if (form.campo(pago.nro)) {
                toast.toastr('warning', 'Ingrese el Número', 'Pago');
                return
            }
        }
        //Si es tarjeta de credito 
        if (entidadFinanciera.codigo === "TAR") {
            if (form.campo(pago.valorPago)) {
                toast.toastr('warning', 'Ingrese el Valor del Abono', 'Pago');
                return
            }
            if (form.campo(pago.nro)) {
                toast.toastr('warning', 'Ingrese el Número', 'Pago');
                return
            }
            if (form.campo(pago.idCiudad)) {
                toast.toastr('warning', 'Seleccione la Ciudad', 'Pago');
                return
            }
            if (form.campo(pago.referencia)) {
                toast.toastr('warning', 'Ingrese la Referencia', 'Pago');
                return
            }
            if (form.campo(pago.aprobacion)) {
                toast.toastr('warning', 'Ingrese la Aprobación', 'Pago');
                return
            }
            if (form.campo(pago.lote)) {
                toast.toastr('warning', 'Ingrese el Lote', 'Pago');
                return
            }
            
        }

        //Si es tranferencia 
        if (entidadFinanciera.codigo == "TRA") {
            if (form.campo(pago.valorPago)) {
                toast.toastr('warning', 'Ingrese un Valor a Cancelar', 'Pago');
                return
            }
            if (form.campo(banco.idBanco)) {
                toast.toastr('warning', 'Seleccione el Banco', 'Pago');
                return
            }
            if (form.campo(pago.nro)) {
                toast.toastr('warning', 'Ingrese el Número', 'Pago');
                return
            }
        }

        if (form.campo(pago.valorPago)) {
            toast.toastr('warning', 'Ingrese un Valor a Cancelar', 'Pago');
            return
        }
        if (Number(pago.valorPago) === 0) {
            toast.toastr('warning', 'El Valor a cancelar debe ser mayor 0', 'Pago');
            return
        };

        return true
    }

    $scope.calculoTotales=function(){
        let totalAbono = 0, abonoPosfechado = 0, valorSaldo = 0;
        $scope.pago.totalPago = $scope.listaPagos.map(val => val.valor).reduce((prev, curr) => prev + curr, 0);
        
        totalAbono = $scope.cuotasAfectados.map(val=>val.detalle.abono).reduce((prev, curr)=>prev + curr, 0);    
        $scope.pago.abono = form.roundNumber(totalAbono, 5); 
        
        abonoPosfechado = $scope.selectedDocs.flatMap(item=>item.cuotas).map(val=>val.abonoPosfechado).reduce((prev, curr)=>prev+curr, 0);

        $scope.pago.abonoPosfechado = form.roundNumber(abonoPosfechado, 5);
        
        valorSaldo = $scope.selectedDocs.flatMap(item=>item.cuotas).map(val=>val.saldo).reduce((prev, curr)=>prev+curr, 0)
        $scope.pago.saldo = form.roundNumber(valorSaldo, 5);
        
        $scope.pago.valorCambio = $scope.getValorCambio($scope.pago.totalPago, $scope.pago.saldoOriginal);
    }

    $scope.getValorCambio = function(totalPago, saldoOriginal){
        let valorCambio = 0;            
        if (totalPago >= saldoOriginal) {
            valorCambio = totalPago -   saldoOriginal;
        }
        return form.roundNumber(valorCambio,5);            
    }



    $scope.verificarEstadoSaldo = function(val) {
        let total = val.abono + val.abonoPosfechado;            
        return form.roundNumber(total, 5) === form.roundNumber(val.cxp.cuota, 5) ? 0 : form.roundNumber(val.saldo, 5);
    }

    $scope.agregarFormaPago = function(secuencial, isPosFechado) {
        let valorPago = 0;

        for (var i = 0; i < $scope.selectedDocs.length; i++) {

            for (var val of $scope.selectedDocs[i].cuotas) {

                valorPago = $scope.abonoMain //Recuperamos el valor del Pago
                
                if (valorPago === 0) return;

                if ((val.cxp.cuota === val.saldo) && (val.abono === 0 || val.abonoPosfechado === 0)) {
                    
                    $scope.nonePayment(val, valorPago, secuencial, isPosFechado); //Cuando la cuota no tiene ningun abono 

                } else if (val.cxp.cuota !== val.saldo && val.saldo > 0) {

                    $scope.hasPayment(val, valorPago, secuencial, isPosFechado); //Cuando la cuota tiene el abono 
                }

                val.cxp.cuota = form.roundNumber(val.cxp.cuota, 5);
                val.abono = form.roundNumber(val.abono, 5);
                val.abonoPosfechado = form.roundNumber(val.abonoPosfechado, 5);
                val.saldo =  $scope.verificarEstadoSaldo(val);
                val.cuotaAfectado = true;
            }

        }
    };


        //Si la cuota no tiene ningun Pago 
    $scope.nonePayment = function(val, valorPago, secuencial, isPosFechado) {
        if (val.saldo >= valorPago) {
            val.abono = isPosFechado ? 0 : valorPago; //Si el pago no es Poserfechado
            val.abonoPosfechado = isPosFechado ? valorPago : 0; //Si el Pago es Posfechado 
            val.saldo -= valorPago;
            $scope.abonoMain = 0;
            $scope.setPagoCuota(val, valorPago, secuencial, isPosFechado);
        } else if (val.saldo <= valorPago) {
            val.abono = isPosFechado ? 0 : val.cxp.cuota; //Si el pago no es Poserfechado;
            val.abonoPosfechado = isPosFechado ? val.cxp.cuota : 0; //Si el Pago es Posfechado ;
            val.saldo = valorPago -= val.saldo;

            $scope.abonoMain = valorPago; //Set valor Abono restante
            $scope.setPagoCuota(val, val.cxp.cuota, secuencial, isPosFechado);
        }
    }

    //cuando una cuota tiene mas de un abono;
    $scope.hasPayment = function(val, valorPago, secuencial, isPosFechado) {
        let resultAbono = 0;
        //si el valor pago es menor al saldo 
        if (val.saldo >= valorPago) {
            if (isPosFechado) {
                val.abonoPosfechado = valorPago + val.abonoPosfechado;
            } else {
                val.abono = valorPago + val.abono;
            }

            val.saldo = val.saldo - valorPago;
            $scope.abonoMain = 0; //Set valor Abono en 0
            $scope.setPagoCuota(val, valorPago, secuencial, isPosFechado);

        } else if (val.saldo <= valorPago) { //si el valor abono es mayor al saldo 
            if (isPosFechado) {
                val.abonoPosfechado = val.abonoPosfechado + val.saldo;
            } else {
                val.abono = val.abono + val.saldo;
            }

            resultAbono = valorPago -= val.saldo;
            valorPago = form.roundNumber(resultAbono, 5);

            $scope.abonoMain = valorPago; //Set valor Abono restante            
            $scope.setPagoCuota(val, val.saldo, secuencial, isPosFechado);
        }
    }

        //Set Cuotas Afectas
    $scope.cuotasAfectados = [];
    $scope.setPagoCuota = function(val, valor, secuencial, isPosfechado) {
       
        if (val.cxp.cuota !== 0) {
            $scope.cuotasAfectados.push({
                detalle: {
                    idCuotaXPagar: val.cxp.idCuotaXPagar,
                    abono: form.roundNumber(Number(valor), 5),
                },
                cuota: form.roundNumber(val.cxp.cuota, 5),
                saldo: $scope.verificarEstadoSaldo(val),
                isPosfechado,
                secuencial
            });
        }
    };

    $scope.getValorAbonoFormaPago=function(secuencial){
        let total = $scope.cuotasAfectados.filter(val=>val.secuencial==secuencial)
                                            .map(val=>val.detalle.abono)
                                            .reduce((prev, curr)=>prev+curr,0);

        $scope.setListaPago(total);                    
    }

    $scope.setListaPago = function(abono) {
        $scope.listaPagos.push({                
            entidad                : $scope.entidadFinanciera.descripcion,
            subEntidad             : $scope.subEntidad.descripcion,
            idEntidadFinanciera    : $scope.entidadFinanciera.idEntidadFinanciera,
            idSubEntidadFinanciera : $scope.subEntidad.idSubEntidadFinanciera,
            idBanco                : form.campo($scope.banco.idBanco) ? 0 : $scope.banco.idBanco,
            idCuentaBancaria       : form.campo($scope.cuentaBancaria.idCuentaBancaria) ? 0 : $scope.cuentaBancaria.idCuentaBancaria,                
            valor                  : Number($scope.pago.valorPago),
            posFechado             : $scope.pago.posFechado,
            fechaEmision           : new Date($scope.pago.fechaEmision),
            nro                    : form.campo($scope.pago.nro) ? null : $scope.pago.nro,
            referencia             : form.campo($scope.pago.referencia) ? null : $scope.pago.referencia,
            aprobacion             : form.campo($scope.pago.aprobacion) ? null : $scope.pago.aprobacion,
            lote                   : form.campo($scope.pago.lote) ? null : $scope.pago.lote,
            idCiudad               : form.campo($scope.pago.idCiudad) ? 0 : $scope.pago.idCiudad,                    
            secuencial             : $scope.listaPagos.length + 1,  
            controlCaja            : $scope.subEntidad.controlCaja,
            abono                                                          
        });
    }             

    //Ver cuotas afectados 
    $scope.viewCuotaPago = function(data) {            
        $scope.viewCuotaAbonos = $scope.cuotasAfectados.filter(val => val.detalle.idCuotaXPagar === data.cxp.idCuotaXPagar);
    };


        //Eliminar Pago 
        $scope.validateDeletePagoCuota = function(pago) {
        Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        }).then(result => {
            if (result.value) {
                $timeout($scope.eliminarPagoCuota(pago), 50);
            }
        });
    };

    $scope.eliminarPagoCuota = function(pago) {
        let secuencial = 0, total=0,totalAbonoAnterior=0, saldo=0;
        $scope.cuotasAfectados = []; //Limpiamos todas las cuotas afectadas            
        $scope.listaPagos.splice($scope.listaPagos.indexOf(pago), 1); //Eliminamos abono agregado                         
        
        //Todas las cuotas en su estado original 
        for (var i = 0; i < $scope.selectedDocs.length; i++) {
            $scope.selectedDocs[i].cuotas = JSON.parse(JSON.stringify($scope.selectedDocs[i].cuotaOriginal));
            for(var val of $scope.selectedDocs[i].cuotaOriginal ){
                total += val.cxp.cuota;                                        
                totalAbonoAnterior += val.abono;                                                        
                saldo += val.saldo;
            }                                 
        };

        $scope.pago.total = form.roundNumber(total,5);
        $scope.pago.totalAbonoAnterior = form.roundNumber(totalAbonoAnterior,5)
        $scope.pago.saldo = form.roundNumber(saldo,5);
        $scope.pago.saldoOriginal = form.roundNumber(saldo,5);
        $scope.pago.abono=0;
        $scope.pago.abonoPosfechado=0;
        $scope.pago.totalPago=0;
        $scope.pago.valorCambio=0; 

        if($scope.listaPagos.length===0) return
        
        //Recalculamos las cuotas con los abonos restantes   
        for (var i = 0; i < $scope.listaPagos.length; i++) {
            secuencial++;

            $scope.abonoMain =  $scope.listaPagos[i].valor; //Set valor de abono 
            $scope.agregarFormaPago(secuencial, $scope.listaPagos[i].posFechado);
        }           
        $scope.calculoTotales();            
    }

    
    //Guardar Pago
    $scope.finalizar = function() {
        if ($scope.listaPagos.length === 0) {
            toast.toastr('warning', 'Agregue al menos un Pago', 'Pago');
            return
        }
        Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de guardar este pago ahora?`,
            showConfirmButton: true,
            confirmButtonText: 'Si, Guardar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) {
                $scope.postPayment();
            }
        });
    }

    $scope.postPayment = function() {
        try {
            let data = {   
                codEstab: $scope.codEstab,             
                idProveedor: $scope.proveedor.idProveedor,
                total: $scope.pago.abono,
                idCaja: 0
            }

            $scope.data.comprobanteEgreso = data;
            $scope.data.pagos = $scope.listaPagos;
            $scope.data.pagoDetalle = $scope.cuotasAfectados;
            showLoader();
            mS.getData('post', '/ComprobanteEgreso/Post?idTipoDoc=0' + '&idComprobante=0', $scope.data).then(response => {
                if (response.id == "0") {
                    hideLoader();
                    form.sweetAlert('warning', response.message);
                    return                                        
                }
                if (response.id == "1") {
                    hideLoader();
                    form.sweetAlert('success', response.message, response.titleSms, 1000);
                    $scope.getPagos();
                    $("#modalPayment").modal('hide');                    
                    return
                }
            }).catch(error=>{
                toastr.error(error)
            })
            
        } catch (error) {
            toastr.error(error)
        }
        
    }

    $scope.deletePayment = function(item) {
        Swal.fire({
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
                    return 'La observación tiene que tener al menos 15 caracteres!'
                }
            }
        }).then(result => {
            if (result.isConfirmed) {
                $scope.postDelete(item.idComprobanteEgreso, result);
            };
        })
        return
    };

    $scope.postDelete = function(id, result) {
        mS.getData('get', '/ComprobanteEgreso/Eliminar?idComprobanteEgreso=' + id + '&observacion=' + result.value).then(response => {
            if (response.id == "0") {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            if (response.id == "1") {
                toast.toastr('success', response.message, response.titleSms);
                $scope.getPagos();
                return
            }
        }, error => console.log(error));
    }



    //----------------------------Detalle Comprobante Ingreso ---------------------
    $scope.openModalHistorialPago=function(item){
        Swal.fire({
            icon:'warning',
            html:'En proceso'
        });
        $("modalHistorialPago").modal('show');
        return
    }


    $scope.getReport = async(item)=>{                      
        const formatType = 'pdf'

        const parameters = {
            reportParams: JSON.stringify({
                codEstab: item.codEstab,
                codigo: "RCEGR", 
                format: formatType,
                aditionalParams: []
            }),
            dataParams: JSON.stringify({
                codEstab: item.codEstab,
                idComprobanteEgreso: item.idComprobanteEgreso
            })
        }

        _commonSvc.getReport({
            url: '/Reporte/Download',
            parameters,
            formatType
        })    
    }










    $("#modalPayment").on('hide.bs.modal',e=>{
        $scope.data={};
        $scope.listDocuments=[];
        $scope.selectedDocs = [];  
        $scope.proveedor={};                        
        $scope.listaPagos=[];
        $scope.cuotasAfectados=[];
        $scope.selectedSupplier ='';
        $("#newPaymentForm-head-2").removeClass('active');                
        $("#newPaymentForm-step-2").hide();            
        $("#newPaymentForm-step-1").show();
        $("#newPaymentForm-head-1").addClass('active');             
        $scope.showFooterStepUno=true;
        $scope.showFooterStepDos=false;
    });

    
        
    
}

