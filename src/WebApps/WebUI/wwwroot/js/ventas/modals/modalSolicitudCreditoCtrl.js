//@ts-check
export {
    modalSolictudCreditoCtrl
}

modalSolictudCreditoCtrl.$inject = ['$scope', '$injector', '$uibModalInstance', 'decodeToken', 'params'];
function modalSolictudCreditoCtrl($scope, $injector, $uibModalInstance, decodeToken, params) {
    let fS = $injector.get('formulario');
    let tS = $injector.get('toastService');
    let clienteSvc = $injector.get("clienteService");
    let creditoGaranteSvc = $injector.get('creditoGaranteService');
    let commonSvc = $injector.get('commonService');
    let CODE_REPORT = $injector.get('CODE_REPORT')

    let { data } = params;

    $scope.dataClienteSearch = {
        name: null
    } 

    $scope.dataForm = structuredClone(data);
    $scope.guarantors = [];
    $scope.guarantorsDeleted = [];


    initiload();
    function initiload() {
        let params = {
            idCuentaPorCobrar: $scope.dataForm.idCuentaPorCobrar
        }
        $scope.guarantors = [];
        creditoGaranteSvc.getAll(params).then(response => { 
            $scope.guarantors = response.guarantors;
        })
            .catch(error => {
                console.log(error)
            }).finally(() => hideLoader())
    }


    $scope.onKeyupClienteSearch = function () {
        if (!fS.isValidField($scope.dataClienteSearch.name)) {

        }
    }

    $scope.onSelectedClienteChange = function (item) {
        $scope.dataClienteSearch.name = null;

        if (item.idCliente === data.idCliente) {
            tS.toastr({
                type: 'warning',
                message: '¡El cliente seleccionado debe ser diferente al cliente facturado!'
            });
            return;
        }

        if ($scope.guarantors.some(g => g.idCliente === item.idCliente)) {
            tS.toastr({
                type: 'warning',
                message: '¡Este cliente ya está agregado como garante!'
            });
            return;
        }

 
        clienteSvc.findById(item.idCliente).then(response => { 

            let dataDeletedFinded = $scope.guarantorsDeleted.find(gd=>gd.idCliente===response.idCliente);
            let obj = {
                ...response
            }
            if(dataDeletedFinded){
                tS.toastr({
                    type: 'warning',
                    message: 'El cliente ya se encuentra asignado y has eliminado'
                })
                return  
            } 
            $scope.guarantors.push(obj);
        })
            .catch(error => {
                console.log(error)
            }) 



    }

    $scope.askToDelete = async function (item) {

        Swal.fire({
            title: "Quitar este garante",
            text: "¿Estas seguro de quitar este garante ahora?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
            cancelButtonText: 'No'
        }).then(({ isConfirmed })=> {

            if(isConfirmed) {
                let index = $scope.guarantors.indexOf(item);
                $scope.guarantors.splice(index, 1);
                if(item.idCreditoGarante>0){
                    let obj = {
                        ...item, 
                    }
                    $scope.guarantorsDeleted.push(obj)
                }
                $scope.$apply();
            }
        })



    }

    function isValidForm() {
        if (!($scope.dataForm.idCliente > 0)) {
            tS.toastr({
                type: 'warning',
                message: 'El id cliente no proporcionado'
            })
            return
        }
        if (!($scope.dataForm.idCuentaPorCobrar > 0)) {
            tS.toastr({
                type: 'warning',
                message: 'El id cuenta por cobrar no proporcionado'
            })
            return
        }

        if ($scope.guarantors.length === 0) {
            tS.toastr({
                type: 'warning',
                message: 'Seleccione al menos un garante'
            })
            return
        }


        if ($scope.guarantors.some(g => !(g.idCliente > 0))) {
            tS.toastr({
                type: 'warning',
                message: 'Hay idCliente nulos'
            })
            return
        }

        return true;

    }

    $scope.save = function () {

        if (!isValidForm()) {
            return
        }


        let guarantors = $scope.guarantors.map((item) => {
            return {
                idCreditoGarante: item.idCreditoGarante || 0,
                idCuentaPorCobrar: $scope.dataForm.idCuentaPorCobrar,
                idCliente: item.idCliente,
                estado: 0
            }
        })

        let guarantorsDeleted = $scope.guarantorsDeleted.map((item) => {
            return {
                idCreditoGarante: item.idCreditoGarante || 0,
                idCuentaPorCobrar: $scope.dataForm.idCuentaPorCobrar,
                idCliente: item.idCliente, 
            }
        })

        let mergeGuarantors = [...guarantors, ...guarantorsDeleted]

        try {
        
            let params = {
                guarantors: mergeGuarantors, 
            }
            creditoGaranteSvc.post(params).then(response => {
                if (response.code === "0") {
                    tS.toastr({
                        type: 'warning',
                        message: response.message
                    })
                }
                if (response.code === "1") {
                    tS.toastr({
                        type: 'success',
                        message: response.message
                    })
                    $scope.guarantorsDeleted = [];
                    initiload()
                  //  $uibModalInstance.close(response)
                }
            })
                .catch(error => {
                    console.log(error)
                }) 
        } catch (error) { 
            console.log(error)
        }
    }


    $scope.getReport = function(){
        let format = 'pdf';
        let dataParms = {
            id: $scope.dataForm.idCuentaPorCobrar,
            tipo: 6,
            codEstab: $scope.dataForm.codEstab,
            userRoleId: decodeToken.userRoleId

        }

        const parameters = { 
            reportParams: JSON.stringify({
                hasParams: true,
                codigo: CODE_REPORT.VSC,
                codEstab: $scope.dataForm.codEstab,
                format,
                aditionalParams: [

                ]
            }),
            dataParams: JSON.stringify(dataParms),
            hasService: true

        }

        commonSvc.getReport({
            parameters,
            formatType: format,
            v2: true
        })
    }

    $scope.closeModal = function () {
        $uibModalInstance.close()
    }

}