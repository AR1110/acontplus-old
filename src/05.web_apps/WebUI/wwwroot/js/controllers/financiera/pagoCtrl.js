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
    'formulario',
    'decodeToken'
];

function pagoCtrl($timeout, $http, $filter, $scope, mS, _commonSvc, toast, _modalSvc, _nombreModal, form, decodeToken) {
    'use strict'
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    };

    let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

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
            idRol: idUsuarioRol,
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

  
    $scope.askToCancel = function(item) {
        try {
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
                    mS.getData('post', '/ComprobanteEgreso/Cancel?id=' + item.idComprobanteEgreso + '&observacion=' + result.value).then(response => {
                        if (response.code == "0") {
                            form.sweetAlert('warning', response.message, response.titleSms)                           
                        }
                        if (response.code == "1") {
                            form.sweetAlert('success', response.message, response.titleSms, 1000)                           
                            $scope.getPagos();                            
                        }
                    }).catch(error => {
                        console.log(error);
                    })                  
                }
            })
        } catch (error) {
            console.log(error)
        }                
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
    
        
    
}

