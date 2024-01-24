(function(){

    'use strict';

    app.controller('cobroCtrl', cobroCtrl);

    cobroCtrl.$inject = [
        '$scope', 
        '$filter',
        'mainService', 
        'commonService', 
        'modalService', 
        'nombreModal',
        'nombreModalContabilidad' ,
        'formulario', 
        'toastService',  
        '$mdDialog'
    ]

    function cobroCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, nombreModalContabilidad, _form, tS, $mdDialog) { 
        //Filtro y Pagination  
        $scope.moreSearchOptions = false;

        $scope.tiposPersona = [
            {codigo: 1, descripcion: 'Cliente'},
            {codigo: 2, descripcion: 'Empleado'},
        ]

        $scope.tiposDoc = [
            {codigo: 'FV', descripcion: 'Factura Venta'},
            {codigo: 'NE', descripcion: 'Nota Entrega'},
        ]

        $scope.showCliente = false;
        $scope.showEmpleado = false;

        $scope.searchCliente = {
            nombreCliente: ''
        }
        $scope.searchEmpleado = {
            nombreCompleto: ''
        }

        $scope.searchUser = {
            nombreCompleto: ''
        }

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 1000,
            tipo: 1
        }

        $scope.typeSend = 'GenericFile';
        $scope.typeSendMail = 'N';

        
        $scope.openModalCobroLote = async function() {
            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CL'];
                let template = nombreModalContabilidad.COBRO.templates['CL']; 
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = _modalSvc.openModalCustom({
                    controller,
                    template,
                    params: {
                    },
                    size:'xl',
                    isRenderRazorPartial: true
                })  
                modalRef.result.then(result=>{
                    if(typeof result==='object'){
                        $scope.getCobros();
                    }
                })         
            } catch (error) {
                console.log(error)
            }
        }


        //Filters 
        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
            $scope.dataSearch.fechaFin = item.endDate
            $scope.filterValidation();
        }

        $scope.onKeyupUser = function(){
            if(!$scope.searchUser.nombreCompleto){
                $scope.dataSearch.byUsuario = 0;
            }
        }
        $scope.onSelectUser = function(item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            $scope.filterValidation();
        }

        
        
        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.onChangePersona = function () { 
            $scope.showCliente = false;
            $scope.showEmpleado = false;  
            $scope.dataSearch.nroIdentificacion = null;         
            if($scope.dataSearch.byTipoPersona===1){
                $scope.showCliente = true;
                $scope.showEmpleado = false;
            }
            if($scope.dataSearch.byTipoPersona===2){
                $scope.showCliente = false;
                $scope.showEmpleado = true;
            }
        }

        //====================Cliente===========
        $scope.onKeyupCliente= function(){
            if(!$scope.searchCliente.nombreCompleto){
                $scope.dataSearch.nroIdentificacion = null;
            }
        }
        $scope.onSelectCliente= function(item){
            $scope.dataSearch.nroIdentificacion = item.numeroIdentificacion;
            $scope.filterValidation();
        }
        //====================Cliente===========

        //====================Empleado===========
        $scope.onKeyupEmpleado= function(){
            if(!$scope.searchEmpleado.nombreCompleto){
                $scope.dataSearch.nroIdentificacion = null;
            }
        }
        $scope.onSelectEmpleado= function(item){
            $scope.dataSearch.nroIdentificacion = item.nroIdentificacion;
            $scope.filterValidation();
        }
        //====================Empleado===========



        $scope.onChangeTipoDoc = function(){
            if($scope.dataSearch.codTipoDoc)        {
                $scope.disabledTempInputPersona = true; //Bloqueamos tipo persona(buscador cliente y empleado)
            }else{
                $scope.disabledTempInputPersona = false;
                $scope.dataSearch.nroSecuencialTipoDoc = null;
            }
            if(!$scope.dataSearch.nroSecuencialTipoDoc) return;

            $scope.getCobros();
        }

        $scope.filterValidation = function(){
            if($scope.dataSearch.byTipoPersona){
                if(!$scope.dataSearch.nroIdentificacion){
                    tS.toastr('warning', 'Seleccione el cliente o el empleado');
                    return
                }
            }

            if(['FV', 'NE'].includes($scope.dataSearch.codTipoDoc)){
                if(!$scope.dataSearch.nroSecuencialTipoDoc){
                    tS.toastr('warning', 'Ingrese número secuencial de tipo documento (Nota Entrega o Factura)')
                    return
                }
            }

            $scope.getCobros();
        }


        $scope.filterLocal= function(){
            let cobros = JSON.parse(JSON.stringify($scope.cloneCobros));
            $scope.cobros = $filter("filter")(cobros, $scope.dataSearch.bySearch);
            $scope.setTotalsColumn();
        }


        $scope.setTotalsColumn = function(){
            let total = 0, abono = 0, cambio = 0;
            for(let item of $scope.cobros){
                total+=item.total;
                abono+=item.abono;
                cambio+=item.cambio;
            }
            $scope.total = _form.roundNumber(total);
            $scope.abono = _form.roundNumber(abono);
            $scope.cambio = _form.roundNumber(cambio);
        }



        $scope.getCobros = function () {
            try {
                showLoader();
                $scope.cobros = [];
                $scope.cloneCobros  = [];
                $scope.setTotalsColumn();

                const dataSearch = {
                    tipo: 1,
                    codEstab: $scope.dataSearch.codEstab, 
                    fechaInicio: _form.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: _form.formatDateMoment($scope.dataSearch.fechaFin),
                    checkBoxPersona: $scope.tiposPersona.some(item=>item.codigo===$scope.dataSearch.byTipoPersona),
                    nroIdentificacion: $scope.dataSearch.nroIdentificacion,
                    checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                    byUsuario: $scope.dataSearch.byUsuario,
                    checkBoxEstado: [0, 1].includes($scope.dataSearch.byEstado),
                    byEstado: $scope.dataSearch.byEstado,
                    codTipoDoc: $scope.dataSearch.codTipoDoc,
                    nroSecuencialTipoDoc: $scope.dataSearch.nroSecuencialTipoDoc,
                    isSearchNroDoc: $scope.dataSearch.nroSecuencialDoc ? true:false,
                    nroSecuencialDoc: $scope.dataSearch.nroSecuencialDoc
                }
          
                _mS.getData('get', 'Contabilidad/ComprobanteIngreso/?json=' + JSON.stringify(dataSearch), null, true).then(response => {
                    hideLoader();
                    if (response.code === "0") {
                        console.warn(response)
                    }
                    if (response.code === "1") {                        
                        let tempCobros = JSON.parse(response.payload)[0] || [];
                        $scope.cobros = tempCobros.map(item=>({ 
                            ...item,
                            codDoc: 'CI',
                            serieComprobante: item.nroDoc,
                            comprobante: 'Comprobante Ingreso',
                            esAnulado: item.color==='table-danger'
                        }))
                        $scope.cloneCobros = JSON.parse(JSON.stringify(tempCobros))
                        $scope.setTotalsColumn();
                    }

                }).catch(error => {
                    hideLoader();
                    console.error(error)
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.initiload = () => {
            _commonSvc.getEstabAsign().then(response => {
                $scope.establecimientos = response
                let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
                $scope.dataSearch.codEstab = codEstab;
                $scope.getCobros();
            })
        }
        $scope.initiload(); 
        
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
                    $scope.getCobros()
                }
            })
        }



        $scope.askToDelete = async (item) => {

            let {
                isConfirmed,
                value
            } = await Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de Anular este registro ahora?</small>',
                input: 'text',
                inputPlaceholder: 'Ingrese la observación',
                showConfirmButton: true,
                confirmButtonText: 'Si, anular',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Ingrese la Observación!'
                    }
                }
            })

            if (isConfirmed) {
                let data = {
                    idComprobanteIngreso: item.idComprobanteIngreso,
                    observacion: value
                }
                showLoader();
                _mS.getData('put', `Contabilidad/ComprobanteIngreso/Cancel`, {data}, true).then(response => {
                    hideLoader();
                    if (response.code == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getCobros();
                    }
                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                })
            }
        }



        //----------------------------Detalle Comprobante Ingreso ---------------------
        $scope.openModalCobroDetalle = async function (ev, item) {
            try {
                // showLoader();
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CD'];
                let templateUrl = nombreModalContabilidad.COBRO.templates['CD']; 
                let controller = (await import(fileCtrl))[ctrl];                
              
                let config = {
                    controller,
                    templateUrl,
                    // Appending dialog to document.body to cover sidenav in docs app
                    // Modal dialogs should fully cover application to prevent interaction outside of dialog
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false, 
                    fullscreen: true,    
                    params: Object.assign({}, item)                                     
                }

                _modalSvc.openMdDialog(config)              
            } catch (error) {
                hideLoader();
                console.log(error)
            }           
        };


        //Reporte 
        $scope.getReport = function (item) {

            let format = 'pdf';

            let dataParms = {
                id: item.idComprobanteIngreso,
            } 
            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    hasParams: true,
                    codigo: 'RCINGR',
                    format,
                    codEstab: item.codEstab,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataParms)
            }


            _commonSvc.getReport({
                parameters,
                formatType: format
            })
        }

        
        $scope.getParamToSendMail = function(item){
            return {
                codDoc: 'CI',
                serieComprobante: item.nroDoc,
                correo: item.correo,
                subject: 'Acontplus - Comprobante de Cobro N°: ' + item.nroDoc,
                json: {
                    hasFile: true,
                    isReport: "SI",
                    reportParams: {
                        hasParams: true,
                        codEstab: item.codEstab,
                        codigo: "RCINGR",
                        format: "pdf"
                    },
                    spParams: {
                        id: item.idComprobanteIngreso
                    }
                }
            }
        }

    }

})(window.angular)