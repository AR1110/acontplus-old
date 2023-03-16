
(function () {
    'use strict';

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl)

    cuentaPorPagarCtrl.$inject = ['$scope', 'toastService', 'mainService', 'screenSize', '$timeout' ,'modalService', 'nombreModal', 'formulario']

    function cuentaPorPagarCtrl($scope, _tS, _mS, _sS, $timeout, _modalSvc, _nombreModalConst, _form) {

        $scope.selectedDocumentos = [];

        let {MODAL_PAGO_LOTE}= _nombreModalConst.pago;
        const FILE_PATH_PARTIAL_UI = '~/Areas/CuentaPorPagar/Pages/'

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
                        console.log('iniy')
                        $scope.cuentasPorPagar = JSON.parse(response.payload)
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
                    let cuotas = response.payload ? JSON.parse(response.payload) : []
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
                $scope.getCuota(item)
                
                let modalRef = _modalSvc.openModalCustom({
                    controller: 'modalPagoCtrl',
                    template: FILE_PATH_PARTIAL_UI + 'Shared/_ModalPago.cshtml',
                    size: 'xl',
                    params: {
                        name: 'hola'
                    },
                  //  windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })

                modalRef.result.then(result=>{
                    console.log(result)
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

    modalPagoCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalPagoCtrl($scope, $uibModalInstance, params){
        
        $scope.selectedDocumentos = [];
        $scope.formaPagos = [];
        $scope.detallePagos = [];


        
        $scope.closeModal = ()=>{
            $uibModalInstance.close();
        }



        $scope.save = ()=>{

        }
    }
    //--------------------------------------------END PAYMENT------------------------------------------------------




    //--------------------------------------------START FORMA PAGO--------------------------------------------------
    app.controller("formaPagoCtrl", formaPagoCtrl);

    formaPagoCtrl.$inject = ["$scope", "$uibModalInstance", "params"];

    function formaPagoCtrl($scope, $uibModalInstance, params){



    }



})(window.angular)
