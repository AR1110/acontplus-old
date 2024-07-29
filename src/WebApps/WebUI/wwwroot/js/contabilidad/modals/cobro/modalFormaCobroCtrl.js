export {
    modalFormaCobroCtrl
}
modalFormaCobroCtrl.$inject = [
    '$scope', 
    '$uibModalInstance', 
    '$injector', 
    'params'
]

function modalFormaCobroCtrl($scope, $uibModalInstance, $injector, params) {
    let {
        dataFormaCobro,
        comprobante,
        saldo,
        datosCobro
    } = params;

    let {
        documentos,
        entidadesFinanciera,
        bancos,
        ciudades
    } = dataFormaCobro;

    const fS = $injector.get('formulario');
    const tS = $injector.get('toastService');

    const modalCobroSvc = $injector.get('modalCobroService');

    const VALOR_ABONO_ORIGINAL = fS.roundNumber(saldo, 3);

    $scope.data = {
        posfechado: false
    }

    $scope.comprobante = comprobante;

    $scope.data.fechaEmision = new Date();
    $scope.data.valorAbono = saldo;

    //Entidad Financiera Documento 
    $scope.documentosElectronicos = [];
    $scope.selectedDocElectronico = []

    $scope.options = {
        rowSelection: true,
        multiSelect: false,
    }

    //False en caso de ser Entidad Financiera (Documento) 
    $scope.showBtnAdd = true;

    $scope.selectedIndexTab = 0;

    $scope.onChangeTabEntidadFinanciera = onChangeTabEntidadFinanciera;
    $scope.addFormaPago = addFormaPago;
    $scope.addDocumentoElectronico = addDocumentoElectronico;

    initiateLoad();

    function initiateLoad() {
        try {
            $scope.entidadesFinanciera = entidadesFinanciera;
            $scope.selectedIndexTab = $scope.entidadesFinanciera.findIndex(item => item.codigo === 'EFE');

            $scope.bancos = bancos;
            $scope.ciudades = ciudades;

            $scope.documentosElectronicos = documentos;
        } catch (error) {
            console.log(error)
        }
    }

    function onChangeTabEntidadFinanciera() {
        try {

            let {
                descripcion,
                idEntidadFinanciera,
                codigo,
                subEntidadesFinanciera
            } = $scope.entidadesFinanciera.at($scope.selectedIndexTab)
            let btnAddFormaPago = document.getElementById('btnAddFormaPago');

            if (codigo === 'DOC' && btnAddFormaPago) {
                btnAddFormaPago.style.display = 'none';
            } else if (btnAddFormaPago) {

                btnAddFormaPago.style.display = 'block';
            }

            $scope.subEntidadesFinanciera = subEntidadesFinanciera;

            $scope.data.idEntidadFinanciera = idEntidadFinanciera;
            if ($scope.subEntidadesFinanciera.length > 0) {
                $scope.data.idSubEntidadFinanciera = $scope.subEntidadesFinanciera[0].idSubEntidadFinanciera;
            } else {
                tS.toastr(`${descripcion}: No tiene SubEntidad Financiera creda`);
            }

            $scope.data.valorAbono = VALOR_ABONO_ORIGINAL
            $scope.data.idBanco = 0;
            $scope.data.idCiudad = 0;
            $scope.data.referencia = null;
            $scope.data.nro = null;
            $scope.data.lote = null;
            $scope.data.aprobacion = null;
            $scope.data.posFechado = false;
            $scope.selectedDocElectronico = [];
            $scope.data.fechaEmision = new Date();

            if (codigo === 'CHE') {
                $scope.data.referencia = $scope.comprobante.razonSocialComprador;
            }

        } catch (error) {
            console.log(error);
        }
    }



    function addFormaPago() {
        try {
            let codigo = $scope.entidadesFinanciera[$scope.selectedIndexTab].codigo;
            if (!modalCobroSvc.isValidForm($scope.data, codigo)) throw 'Form Invalid';

            $uibModalInstance.close(getDataPago());

        } catch (error) {
            console.log(error)
        }

    }

    function getDataPago(item = {}) {
        try {
            let entidadFinanciera = $scope.entidadesFinanciera.find(item => item.idEntidadFinanciera === $scope.data.idEntidadFinanciera);
            let subEntidadFinanciera = entidadFinanciera.subEntidadesFinanciera.find(item => item.idSubEntidadFinanciera === $scope.data.idSubEntidadFinanciera);

            let ciudad = $scope.ciudades.find(item => item.idCiudad === $scope.data.idCiudad);
            let banco = $scope.bancos.find(item => item.idBanco === $scope.data.idBanco);

            let formattedDateTime = fS.formatDateMoment($scope.data.fechaEmision);

            return {
                //Info
                entidadFinanciera: entidadFinanciera.descripcion,
                subEntidadFinanciera: subEntidadFinanciera.descripcion,

                ciudad: ciudad && ciudad.descripcion,
                banco: banco && banco.descripcion,

                //Data
                idEntidadFinanciera: entidadFinanciera.idEntidadFinanciera,
                idSubEntidadFinanciera: subEntidadFinanciera.idSubEntidadFinanciera,
                codEntidadFinanciera: entidadFinanciera.codigo,
                idBanco: $scope.data.idBanco,
                idCiudad: $scope.data.idCiudad,
                fechaEmision: formattedDateTime,
                posfechado: $scope.data.posFechado,

                cobro: !$scope.data.posFechado,
                referencia: $scope.data.referencia,
                aprobacion: $scope.data.aprobacion,
                lote: $scope.data.lote,

                //Data Documento 
                nro: item.serieComprobante || $scope.data.nro,
                idTipoDocumento: item.idTipoDocumento,
                idComprobante: item.idDocumento,
                tipoDocumento: item.tipoDocumento || item.codDoc,
                valorAbono: item.saldo || $scope.data.valorAbono,
                controlCaja: subEntidadFinanciera.controlCaja,
                observacion: $scope.data.observacion
            }
        } catch (error) {
            console.log(error);
        }
    }


    function addDocumentoElectronico(item) {
        if (item.saldo === 0) {
            tS.toastr('warning', 'El Valor de Abono tiene que ser mayor a 0', 'Cobro');
            return
        }

        if (datosCobro.some(dataCobro => dataCobro.idTipoDocumento === item.idTipoDocumento && dataCobro.idComprobante === item.idDocumento)) {
            $scope.selectedDocElectronico = [];
            fS.sweetAlert('warning', 'Este documento ya fue aplicado al cobro');
            $(".swal2-container").css("z-index", "999999");
            return
        }
        Swal.fire({
            html: `<small>Abonar el valor <h3>$${item.saldo}</h3> del Documento ${item.codDoc == 'A' ? item.serieComprobante : item.tipoDoc}?</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, abonar',
            cancelButtonText: 'No, cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                $uibModalInstance.close(getDataPago(item))
            } else {
                $scope.selectedDocElectronico = [];
                $scope.$apply();
            }
        })
        $(".swal2-container").css("z-index", "999999");
    }



    $scope.closeModal = function () {
        $uibModalInstance.close();
    }


}
