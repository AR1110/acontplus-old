

(function () {

    'use strict';

    const FILE_PATH_PARTIAL_UI = '~/Areas/CuentaPorPagar/Pages/'

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl)

    cuentaPorPagarCtrl.$inject = ['$scope', 'toastService', 'mainService', 'screenSize', '$timeout' ,'modalService', 'nombreModal', 'formulario']

    function cuentaPorPagarCtrl($scope, _tS, _mS, _sS, $timeout, _modalSvc, _nombreModalConst, _form) {

        $scope.selectedDocumentos = [];

        let {MODAL_PAGO_LOTE}= _nombreModalConst.pago;
        

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

        
        $scope.isMobile = _sS.on('xs, sm', function (isMatch) {
            $scope.isMobile = isMatch
        })

        if ($scope.isMobile) {
            Swal.fire(
                'Dispositivo Movil Detectado!',
                'Para una mejor comodidad, le recomendamos usar una Laptop o PC.',
                'success'
            )
        } else {
            $timeout(() => {
                document.getElementById('menu_toggle').click()
            }, 1100)
        }

        $scope.cuentasPorPagar = []


        $scope.initialLoad = () => {
            try {
                showLoader();
                $scope.cuentasPorPagar = [];
                _mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({ tipo: 1 }), null, true).then((response) => {
                    if (response.code == '0') {
                        hideLoader();
                        $scope.cuentasPorPagar = [];
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {  
                        console.log(response.payload)                      
                        $scope.cuentasPorPagar = JSON.parse(response.payload)[0]
                        hideLoader();
                    }                    
                }).catch((error) => {
                    $scope.cuentasPorPagar = [];
                    console.log(error)
                })
            } catch (error) {
                $scope.cuentasPorPagar = [];
                console.log(error)
            }
        }

        $scope.initialLoad()

         //======================================MODAL CUOTA================================================
      
        $scope.openModalCuota = async(item)=>{    
            try {
                let {MODAL_FILE_CUOTA, MODAL_COMPRA_CUOTA} = _nombreModalConst.pago;
                let controller = (await import('./../../' + MODAL_FILE_CUOTA))[MODAL_COMPRA_CUOTA['controller']] 
                let template   = MODAL_COMPRA_CUOTA['template'];
                
                let params = {}

                showLoader();
                await _mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({ idCuentaPorPagar : item.idCuentaPorPagar, tipo: 2 }), null, true).then(response => {
                    let cuotas = response.payload ? JSON.parse(response.payload)[0] : []
                    params = {
                        cuotas,
                        data: {
                            ...item,
                            id: item.idCuentaPorPagar,  
                            codPago : item.codPago,              
                            numeroIdentificacion: item.identificacion
                        },
                    }  
                })

                const modalRef = _modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params
                })         
                modalRef.result.then(res=>{
                    if(typeof res ==='object'){
                        $scope.initialLoad();                    

                    }
                })

            } catch (error) {
                console.log(error)
            }finally{
                hideLoader()
            }
            
        }


        $scope.getCuota = (item) =>{
            console.log(item)
        }

        $scope.openModalPago = async(item)=>{
            try {
                
                //Params Modal
                let modalParams = {
                    controller: 'modalPagoCtrl',
                    template: FILE_PATH_PARTIAL_UI + 'Shared/_ModalPago.cshtml',
                    size: 'xl',                   
                  //  windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }

                //Params APi 
                let spParams = JSON.stringify({
                    idCuentaPorPagar: item.idCuentaPorPagar,
                    codPago: 'PE',
                    tipo: 2
                })
                
                _mS.getData('get', 'CuentaPorPagar/' + spParams, null, true).then(response =>{
                    
                    if(response.code==="0"){
                        _form.sweetAlert('warning', response.message)
                    }

                    if(response.code==="1"){
                       
                        let cuotas = JSON.parse(response.payload)[0] || [];
                       
                        modalParams.params = {
                            data: item,
                            cuotas
                        }
                        
                        //Open Modal 
                        let modalRef = _modalSvc.openModalCustom(modalParams)
                        modalRef.result.then(result=>{
                            console.log(result)
                        })
                    }

                })
                
               

                
            } catch (error) {
                console.log(error)
            }
        }


    }




    




    //---------------------------------------------START CUOTAS----------------------------------------------------
    app.controller("modalCuotaCtrl", modalCuotaCtrl);

    modalCuotaCtrl.$inject = ["$scope", "$uibModalInstance", "params"];

    function modalCuotaCtrl($scope, $uibModalInstance, params){

    }


    //---------------------------------------------END CUOTAS--------------------------------------------------





    //---------------------------------------------START PAYMENT--------------------------------------

    app.controller("modalPagoCtrl", modalPagoCtrl);

    modalPagoCtrl.$inject = ['$scope', '$uibModalInstance', 'modalService',  'params'];

    function modalPagoCtrl($scope, $uibModalInstance, _modalSvc, params){

        let {data, cuotas}  = params;

        $scope.data = Object.assign({}, data);
        

        
        $scope.selectedDocumentos = [{
            ...data,
            cuotas,
        }];

        console.log($scope.selectedDocumentos)

        
        $scope.formaPagos = [];
        $scope.detallePagos = [];


        $scope.displayCuota = (item)=>{
            item.display = !item.display
        }

        
        $scope.closeModal = ()=>{
            $uibModalInstance.close();
        }


        $scope.openModalFormaPago = ()=>{
            try {
                let modalRef = _modalSvc.openModalCustom({
                    controller: 'formaPagoCtrl',
                    template: FILE_PATH_PARTIAL_UI + 'Shared/_ModalFormaPago.cshtml',
                    size: 'lg',   
                    isRenderRazorPartial: true                 
                })
                modalRef.result.then(result => {

                })
            } catch (error) {
                
            }
        }


        $scope.save = ()=>{

        }
    }
    //--------------------------------------------END PAYMENT------------------------------------------------------




    //-----------------------------------------START FORMA PAGO--------------------------------------------------
    app.controller("formaPagoCtrl", formaPagoCtrl);

    formaPagoCtrl.$inject = ["$scope", "$uibModalInstance", "mainService", "params"];

    function formaPagoCtrl($scope, $uibModalInstance, mS, params){

        $scope.data = {};

        $scope.data.fechaEmision = new Date();

        console.log(params);


        //Se inicializa al abrir modal 
        $scope.initialLoad = ()=>{

            mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({tipo: 3}), null, true).then(response=>{
              
                if(response.code==="0"){
                    console.log(response)
                }
              
                if(response.code==="1"){
                    
                    let tempData = JSON.parse(response.payload);
                    
                    $scope.entidadesFinancieras = tempData[0];
                    $scope.tempSubEntidadesFinancieras = tempData[1];

                    $scope.dataEntidadFinanciera = $scope.entidadesFinancieras.find(item=>item.codigo==='EFE');
                                      
                    $scope.bancos = tempData[2];
                    $scope.ciudades = tempData[3];

                    $scope.onChangeTabEntidadEntifiera();
                    console.log($scope.ciudades)
                    console.log($scope.entidadesFinancieras)
                    console.log($scope.subEntidadesFinancieras)
                }
            })
        }

        $scope.initialLoad();


        $scope.onChangeTabEntidadEntifiera = (item)=>{
           if(!item){
               $scope.selectedIndexTab = $scope.entidadesFinancieras.indexOf($scope.dataEntidadFinanciera); 
               $scope.data.idEntidadFinanciera = $scope.dataEntidadFinanciera.idEntidadFinanciera;
            }else{
                $scope.data.idEntidadFinanciera = item.idEntidadFinanciera;
            }
                    
            $scope.subEntidadesFinancieras = $scope.tempSubEntidadesFinancieras.filter(item=>item.idEntidadFinanciera===$scope.data.idEntidadFinanciera)                    
            $scope.data.idSubEntidadFinanciera = $scope.subEntidadesFinancieras[0].idSubEntidadFinanciera;            
            console.log($scope.data.idSubEntidadFinanciera, $scope.subEntidadesFinancieras)
        }

        $scope.closeModal = ()=>{
            $uibModalInstance.close();
        }

    }



})(window.angular)
