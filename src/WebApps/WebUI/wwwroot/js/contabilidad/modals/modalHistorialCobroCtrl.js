export {
    ModalCobroDetalleCtrl
}
ModalCobroDetalleCtrl.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'comprobanteIngresoService', 'toastService', 'params']

function ModalCobroDetalleCtrl($scope, $rootScope, $uibModalInstance, comprobanteIngresoSvc, tS, params) {
    $scope.showDetalleCompIngreso = false;
    $scope.showDetalleCompIngresoByDoc = false;

    $scope.comprobante = {};
    $scope.cobros = [];
    $scope.cobroDetalles = [];

    let isRefreshPage = false;  

 
    $scope.accion = $rootScope.accion;
    initialLoad();
    function initialLoad() {
        try {
            if (params && params.idComprobanteIngreso > 0) {
                $scope.showDetalleCompIngreso = true;

                showLoader();
                comprobanteIngresoSvc.getHistorialCobrosById(params.idComprobanteIngreso).then(response => {
                    const {
                        comprobante,
                        cobros,
                        cobroDetalles
                    } = response;

                    $scope.comprobante = comprobante;
                    $scope.cobros = cobros;
                    $scope.cobroDetalles = cobroDetalles;
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } else if (params && params.idCuentaPorCobrar > 0) {
                $scope.showDetalleCompIngresoByDoc = true;
                showLoader();
                comprobanteIngresoSvc.getHistorialCobrosByDoc(params.idCuentaPorCobrar).then(response => {
                    const {
                        comprobante,
                        cobroDetalles,
                        comprobanteIngresos
                    } = response;

                    $scope.comprobante = comprobante;
                    $scope.cobroDetalles = cobroDetalles;
                    $scope.comprobanteIngresos = comprobanteIngresos;
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            }

            

        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }
    // let {comprobante, cobros, cobroDetalles} = params;
    // $scope.comprobante = comprobante;

    // $scope.cobros = cobros;


    $scope.expandDetalle = (data) => {
        data.showDetalle = !data.showDetalle;
    }

    $scope.showInfo = function (item) {
        let info = item.infoCobro && item.infoCobro[0] || {};

        Swal.fire({
            icon: 'info',
            html: `<div class="table-responsive">
            <table class="table table-hover table-borderless table-sm">
                <tbody>
                    <tr>
                        <td><b>Número:</b></td>
                        <td>${info.nro || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Referencia:</b></td>
                        <td>${info.referencia || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Lote:</b></td>
                        <td>${info.lote || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Aprobación:</b></td>
                        <td>${info.aprobacion || '...'}</td>
                    </tr>                       
                </tbody>
            </table>
        </div>`
        })

    }

    $scope.showCuotas = function (data) {
        let cobroDetalles = $scope.cobroDetalles.filter(item => item.idCobro === data.idCobro);

        let html = `<div class="table-responsive">
                    <table class="table table-hover table-bordered table-sm">
                        <thead>
                            <tr>
                                <th><small>N°</small></th>                              
                                <th><small>Nro. Cuota</small></th>                              
                                <th><small>Fecha Vcto.</small></th>
                                <th><small>Cuota</small></th>
                                <th><small>Abono</small></th>
                                <th><small>Saldo</small></th>
                            </tr>
                        </thead>
                        <tbody>`;

        let index = 1;
        for (let itemDetalle of cobroDetalles) {
            html += ` <tr>
                        <td>${index++}</td>
                        <td>${itemDetalle.nroCuota}</td>
                        <td>${itemDetalle.fechaVencimiento}</td>
                        <td>$${itemDetalle.cuota}</td>
                        <td>$${itemDetalle.abono}</td>
                        <td>$${itemDetalle.saldo}</td>
                    </tr>
                `
        }
        html += '</tbody></table></div>'
        Swal.fire({
            title: '<small>Detalle Cobro</small>',
            icon: 'info',
            html,
            width: 700
        })

    }

    async function messageQtyDoc() {
        let isConfirmed = await Swal.fire({
            icon: 'warning',
            text: 'Este anulación de comprobante afectará mas de un doc. porque se ha realizado cobro por lote ¿Desea continuar? '
        })
        return isConfirmed;
    }

    $scope.askToDelete = async (item) => {

        try {

            let isContinue = true;

            if (item.cantDocs > 1) {
                isContinue = await messageQtyDoc();
            }

            if (!isContinue) return

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

            if (!isConfirmed) return


            let params = {
                idComprobanteIngreso: item.idComprobanteIngreso,
                observacion: value
            }
            showLoader();
      
            comprobanteIngresoSvc.cancel(params).then(response => {
                if (response.code == "0") {
                    tS.toastr('warning', response.message, response.titleSms);
                }
                if (response.code == "1") {
                    tS.toastr('success', response.message, response.titleSms);
                    initialLoad()
                    isRefreshPage = true;
                    // $uibModalInstance.close(response)
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader())
        } catch (error) {
            hideLoader();
            console.log(error)
        }

    }


    $scope.closeModal = function () {
        if (isRefreshPage) {
            $uibModalInstance.close({ response: 1 });
        } else {
            $uibModalInstance.close();

        }
    };
}

