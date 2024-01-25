(function () {

    'use strict';

    app.controller('cuentaPorCobrarCtrl', ['$scope', '$injector', function ($scope, $injector) {
        const cuentaPorCobrarSvc = $injector.get('cuentaPorCobrarService');
        const fS = $injector.get('formulario');
        const tS = $injector.get('toastService');
        const DOC_TYPE = $injector.get('DOC_TYPE');
        const modalSvc = $injector.get("modalService");
        const nombreModalContabilidad = $injector.get("nombreModalContabilidad");

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            maxSize: 5,
            totalVenta: 0,
            totalAbono: 0,
            totalSaldo: 0,
            idTipoDocumento: 0,
            codDoc: 0,
            checkBoxFecha: true,
            fechaInicio: new Date(),
            fechaFin: new Date(),
            codEstado: 0
        }
        $scope.cliente = {};

        $scope.cuentasPorCobrar = [];
        $scope.recordsQuantity = [25, 50, 100]

        let selectedDocumentosTemp = [];
        $scope.selectedDocumentos = [];

        $scope.tableOptions = {
            sortBy: '',
            rowSelection: true,
            multiSelect: true
        }

        $scope.establecimientos = [];
        $scope.estadosDoc = [];
        $scope.tiposDoc = [];


        initiload();


        function initiload() {
            try {
                showLoader();
                cuentaPorCobrarSvc.getDataFilter().then(response => {
                    console.log(response)
                    const { estabs, estadosDoc, tiposDoc } = response;
                    $scope.establecimientos = estabs;
                    $scope.estadosDoc = estadosDoc;
                    $scope.tiposDoc = tiposDoc;
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => estab.defaultEstab);
                        $scope.dataSearch.codEstab = dataEstab.codEstab;
                        getCuentasPorCobrar();
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {
                console.log(error)
            }
        }

        function getCodigoTipoDoc() {
            let dataDoc = $scope.tiposDoc.find(doc => doc.idTipoDocumento === $scope.dataSearch.idTipoDocumento);
            let codigo;
            if (dataDoc) {
                if (dataDoc.codigo === DOC_TYPE.FV) codigo = DOC_TYPE.FV_SRI;
                if (dataDoc.codigo === DOC_TYPE.NE) codigo = DOC_TYPE.NE
            }
            return codigo;
        }

        function getCuentasPorCobrar() {
            let params = {
                codEstab: $scope.dataSearch.codEstab,
                pageIndex: $scope.dataSearch.pageIndex,
                pageSize: $scope.dataSearch.pageSize,
                ckFecha: $scope.dataSearch.checkBoxFecha,
                fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                codEstado: fS.isValidField($scope.dataSearch.codEstado),
                idCliente: fS.isValidField($scope.dataSearch.idCliente),
                codDoc: fS.isValidField(getCodigoTipoDoc())
            }
            $scope.selectedDocumentos = [];
            $scope.cuentasPorCobrar = [];
            selectedDocumentosTemp = [];
            showLoader();
            cuentaPorCobrarSvc.getAll(params).then(response => {
                const { cuentasPorCobrar, totalRecords, totalVenta, totalAbono, totalSaldo } = response;
                console.log(response)
                $scope.cuentasPorCobrar = cuentasPorCobrar;
                $scope.dataSearch.totalRecords = totalRecords;
                $scope.dataSearch.totalVenta = totalVenta;
                $scope.dataSearch.totalAbono = totalAbono;
                $scope.dataSearch.totalSaldo = totalSaldo;

            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader());
        }

        //=========================START FILTERS =======================================
        $scope.estabFilter = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.puntosEmision = dataEstab.puntosEmision;
            $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
            getCuentasPorCobrar();
        }

        $scope.callGetCuentasPorCobrar = function () {
            getCuentasPorCobrar();
        }
        $scope.refresh = function () {
            getCuentasPorCobrar();
        }
        $scope.onClickMoreFilter = function () {
            $scope.dataSearch.showMoreFilter = !$scope.dataSearch.showMoreFilter;
        }

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
            getCuentasPorCobrar();
        };

        //====================Cliente===========
        $scope.onKeyupCliente = function () {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.idCliente = 0;
                $scope.dataSearch.checkBoxFecha = true;
            }
        }
        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.idCliente = item.idCliente;
            $scope.dataSearch.checkBoxFecha = true;
            getCuentasPorCobrar();
        }

        $scope.pagechanged = function () {
            getCuentasPorCobrar();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            getCuentasPorCobrar();
        };

        //=========================END FILTERS =======================================

        $scope.rowEnabledPayment = function (item) {
            return !(["PP", "PE"].includes(item.codEstado))
        }

        $scope.selectedRow = function (item) {

        }

        function deleteDocSeleted(item) {
            let index = $scope.selectedDocumentos.indexOf(item);
            $scope.selectedDocumentos.splice(index, 1);
        }


        $scope.onSelectDoc = function (item) {

        }


        $scope.onDesSelectDoc = function (item) {
            let index = selectedDocumentosTemp.indexOf(item);
            selectedDocumentosTemp.splice(index, 1);
        }


        // Función para verificar si los valores de razonSocialComprador son los mismos
        function verificarRazonSocialCompradorIgual() {
            const primeraRazonSocial = $scope.selectedDocumentos[0].razonSocialComprador;

            // Verificar si todas las demás entradas tienen la misma razonSocialComprador
            const sonIguales = $scope.selectedDocumentos.every(cuenta => cuenta.razonSocialComprador === primeraRazonSocial);

            return sonIguales;
        }

        $scope.openDocPaymentModal = function () {
            if ($scope.selectedDocumentos.length === 0) {
                tS.toastr('warning', 'Seleccione al menos un documento!');
                return
            }

            if (!verificarRazonSocialCompradorIgual()) {
                tS.toastr('warning', 'Seleccione documentos que pertenezca al mismo cliente');
                return
            }


            const selectedDocumentos = structuredClone($scope.selectedDocumentos);
            // Crear un array de promesas para cada solicitud
            const promises = selectedDocumentos.map(cxc => cuentaPorCobrarSvc.getCuotasById(cxc.idCuentaPorCobrar));

            // Utilizar Promise.all para ejecutar las promesas concurrentemente
            showLoader();
            Promise.all(promises)
                .then(results => {
                    hideLoader();
                    console.log(results)
                    let mergeWithCuotas = mergeCuotas(selectedDocumentos, results);
                    openModalCobroLote(mergeWithCuotas);
                })
                .catch(error => {
                    console.error('Al menos una solicitud falló:', error);
                    // Manejar el error
                }).finally(() => hideLoader());

        }

        function mergeCuotas(selectedDocumentos, results) {
            return selectedDocumentos.map(cxc => {
                const cuotasFiltradas = results.filter(item =>
                    item.cuotas.some(cuota => cuota.idCuentaPorCobrar === cxc.idCuentaPorCobrar)
                ).map(c => c.cuotas);

                return {
                    ...cxc,
                    cuotas: structuredClone(cuotasFiltradas),
                    cuotasOriginal: structuredClone(cuotasFiltradas)
                };
            });
        }




        async function openModalCobroLote(selectedDocumentos) {
            try {
                let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
                let ctrl = nombreModalContabilidad.COBRO.controllers['CL'];
                let template = nombreModalContabilidad.COBRO.templates['CL'];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    params: {
                        selectedDocumentos
                    },
                    size: 'xl',
                    isRenderRazorPartial: true
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getCobros();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }





    }])


})(window.angular)