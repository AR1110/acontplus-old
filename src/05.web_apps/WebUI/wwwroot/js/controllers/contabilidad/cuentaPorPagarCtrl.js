(function () {
    'use strict';

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl)

    cuentaPorPagarCtrl.$inject = ['$scope', 'toastService', 'mainService', 'screenSize', '$timeout' ,'modalService', 'nombreModal', 'formulario']

    function cuentaPorPagarCtrl($scope, _tS, _mS, _sS, $timeout, _modalSvc, _nombreModalConst, _form) {

        $scope.hola ='khkjhk hola'
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
                _mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({ tipo: 1 }), null, true).then((response) => {
                    if (response.code == '0') {
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        console.log('iniy')
                        $scope.cuentasPorPagar = JSON.parse(response.payload)
                    }
                    else
                    {
                        _tS.toastr('warning', response.message)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
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
    }
})(window.angular)
