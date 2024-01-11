(function () {
    'use strict'

    const TEMPLATE_URL = '~/Pages/Compras/DocumentoRecibido/Shared/'
    let docRecibidoSvc = {}
    let tS = {}
    let modalSvc = {};
    let dataEstab = {}



    app.controller('documentoRecibidoCtrl', documentoRecibidoCtrl)

    documentoRecibidoCtrl.$inject = ['$filter', '$scope', '$injector', '$q'];

    function documentoRecibidoCtrl($filter, $scope, $injector, $q) {
        const mS = $injector.get('mainService');
        const commonSvc = $injector.get('commonService');
        docRecibidoSvc = $injector.get('docRecibidoService');
        tS = $injector.get('toastService');
        modalSvc = $injector.get('modalService');
        const nameModalConst = $injector.get('nombreModal');
        const nombreModalInventario = $injector.get('nombreModalInventario');
        const articuloSvc = $injector.get('articuloService');
        const proveedorSvc = $injector.get('proveedorService');
        const fS = $injector.get('formulario');

        $scope.establecimientos = [];
        $scope.tipoComprobantes = [];

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            maxSize: 5,
            checkBoxFecha: true
        };
        $scope.moreOptionsFilter = false;
        $scope.recordsQuantity = [25, 50, 100];

        $scope.comprobantes = [];
        $scope.cloneComprobantes = [];

        $scope.proveedor = {};
        $scope.claveAccesoLongitud = null;

        $scope.onKeyupSearchFilter = () => {
            let comprobantes = JSON.parse(JSON.stringify($scope.cloneComprobantes))
            $scope.comprobantes = $filter("filter")(comprobantes, $scope.search)
        }

        $scope.getComprobantes = function () {
            try {

                if ($scope.dataSearch.claveAcceso && $scope.dataSearch.claveAcceso.toString().length !== 49) {
                    tS.toastr('warning', 'El clave de acceso tiene que tener 49 dígitos!');
                    return
                }
                let dataSearch = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: $scope.dataSearch.codEstab,
                    rucProveedor: fS.isValidField($scope.dataSearch.rucProveedor),
                    claveAcceso: fS.isValidField($scope.dataSearch.claveAcceso),
                    ckBoxFecha: $scope.dataSearch.checkBoxFecha,
                    startDate: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    endDate: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    codDoc: fS.isValidField($scope.dataSearch.codDoc)
                }
                $scope.comprobantes = [];
                showLoader();
                docRecibidoSvc.getAll(dataSearch).then(response => {
                    $scope.comprobantes = response;
                    $scope.cloneComprobantes = structuredClone($scope.comprobantes);
                    $scope.dataSearch.totalRecords = $scope.comprobantes.length > 0 ? $scope.comprobantes[0].totalRecords : 0;
                    $scope.onKeyupSearchFilter();
                }).catch(error => {
                    console.log(error)
                    $scope.dataSearch.totalRecords = 0;
                }).finally(() => hideLoader());

            } catch (error) {

            }
        }

        initialLoad();
        function initialLoad() {
            try {
                showLoader();
                docRecibidoSvc.getDataFilter().then(response => {
                    const { establecimientos, tipoComprobantes } = response;
                    $scope.establecimientos = establecimientos;
                    $scope.tipoComprobantes = tipoComprobantes;
                    if ($scope.establecimientos.length > 0) {
                        console.log($scope.establecimientos)
                        dataEstab = $scope.establecimientos[0];
                        if (dataEstab) {
                            $scope.dataSearch.codEstab = dataEstab.codEstab;
                        }
                    }
                    $scope.getComprobantes();
                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    hideLoader();
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.onChangeEstab = function () {
            dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            $scope.getComprobantes();
        }

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
            $scope.getComprobantes();
        };

        $scope.pagechanged = function () {
            $scope.getComprobantes();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getComprobantes();
        };


        $scope.onClickBtnMore = function () {
            $scope.moreOptionsFilter = !$scope.moreOptionsFilter;
        }

        $scope.onKeyupProveedor = function () {
            if (!$scope.proveedor.nombreProveedor) {
                $scope.dataSearch.rucProveedor = null;
            }
        };
        $scope.onSelectProveedor = function (item) {
            console.log(item)
            $scope.dataSearch.rucProveedor = item.idProveedor;
            $scope.getComprobantes();
        };

        $scope.onChangeClaveAcceso = function () {
            $scope.claveAccesoLongitud = null;
            if ($scope.dataSearch.claveAcceso) {
                $scope.claveAccesoLongitud = $scope.dataSearch.claveAcceso.toString().length
            }
        }



        async function alertEstabSelected() {
            if ($scope.establecimientos.length === 0) {
                tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }
            let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
            let { isConfirmed } = await Swal.fire({
                title: 'Estab.: ' + dataEstab.nombreComercial,
                text: "Esta seguro de realizar una nueva importación de comprobantes en este establecimiento?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Proceder',
                cancelButtonText: 'No, cancelar'
            })
            return isConfirmed;
        }


        $scope.openModalImportacionAutomatica = async function () {
            try {

                if (!await alertEstabSelected()) return;

                tS.toastr('warning', 'Recuerde no haber modificado el archivo de texto descargado del SRI')

                console.log('test')
                modalSvc.openModalCustom({
                    controller: 'modalImportacionAutomaticaCtrl',
                    template: `${TEMPLATE_URL}_NewImport.cshtml`,
                    size: 'xl',
                    params: {},
                    isRenderRazorPartial: true
                }).result.then(result => {

                    if (typeof result == 'object') {
                        $scope.getFacturas();
                    }
                })

            } catch (error) {
                console.log(error)
            }
        }


        $scope.openModalImportacionManual = function () {
            try {
                modalSvc.openModalCustom({
                    controller: 'modalFacturaCompraCtrl',
                    template: `${TEMPLATE_URL}_ModalAddUpdate.cshtml`,
                    size: 'xl',
                    params: {},
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }).result.then(result => {

                    if (typeof result == 'object') {
                        $scope.getFacturas();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }


























    }

    /**
     * Importacion Automatica 
     */

    app.controller('modalImportacionAutomaticaCtrl', modalImportacionAutomaticaCtrl)
    modalImportacionAutomaticaCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];
    function modalImportacionAutomaticaCtrl($scope, $uibModalInstance, params) {

        $scope.dataEstab = dataEstab;
        console.log($scope)
        $scope.fileTxt = null;
        $scope.compFounded = [];
        $scope.compToImport = [];

        //let paymentStep = null;
        let importarXMLRef = null;
        let stepCompFoundedRef = null;

        $scope.stepImportTxt = function () {
            $scope.footerActionStepUno = true;
            $scope.footerActionStepDos = false;

            $("#importarXML a:first-child").addClass('active');
            $("#importarXML a:last-child").removeClass('active');

            importarXMLRef.style.display = 'block';
            stepCompFoundedRef.style.display = 'none';
        }



        $uibModalInstance.rendered.then(() => {
            importarXMLRef = document.getElementById('stepImportarXML');
            stepCompFoundedRef = document.getElementById('stepCompFounded');
            $scope.stepImportTxt();
        })

        $scope.stepGoToImportTxt = function () {
            $scope.stepImportTxt();
        }

        $scope.stepCompFoundedGoTo = function () {
            if ($scope.compFounded.length === 0) {
                tS.toastr('warning', 'Importe Txt', 'Siguiente');
                return
            }

            $scope.footerActionStepUno = false;
            $scope.footerActionStepDos = true;

            $("#importarXML a:first-child").removeClass('active');
            $("#importarXML a:last-child").addClass('active');

            importarXMLRef.style.display = 'none';
            stepCompFoundedRef.style.display = 'block';

        }

        $scope.readFileTxt = function () {
            try {
                if ([null, undefined, ""].includes($scope.fileTxt)) {
                    tS.toastr('warning', 'No has seleccionado ningún archivo');
                    return
                }

                showLoader();
                docRecibidoSvc.readFileTxt($scope.fileTxt).then(response => {
                    if (response.code == 0) {
                        hideLoader()
                        tS.toastr('warning', response.message)
                        return;
                    }
                    if (response.code == 1) {

                        tS.toastr('success', response.message);
                        $scope.compFounded = JSON.parse(response.payload) || [];
                        $scope.fileTxt = null;
                        $scope.stepCompFoundedGoTo();

                        // $('#newImportModal').modal('hide');
                        // $("#compFounded").modal('show');  

                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.askToSaveFounded = function () {
            try {

                if ($scope.compToImport.length === 0) {
                    tS.toastr('warning', 'Seleecione al menos un comprobante');
                    return
                }

                Swal.fire({
                    title: 'Esta seguro de guardar los comprobantes seleccionados?',
                    text: "Esta seguro de guardar los comprobantes seleccionados?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, guardar!',
                    cancelButtonText: 'No, cancelar'
                }).then(result => {
                    if (result.isConfirmed) {
                        $scope.post();
                    }
                })

            } catch (error) {
                console.log(error);
            }

        }

        //Guardar Documentos importados
        $scope.post = function () {

            let data = {
                codEstab: $scope.dataEstab.codEstab,
                comprobantes: $scope.compToImport
            }
            showLoader();
            docRecibidoSvc.post(data).then(
                response => {
                    if (response.code == 0) {
                        tS.toastr('warning', response.message);
                    }
                    if (response.code == 1) {
                        tS.toastr('success', response.message)
                        $uibModalInstance.close(response)
                    }
                }
            ).catch(error => {
                console.log(error);
            }).finally(() => hideLoader())

        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }
    }


    /**
     * Importacion Manual 
     */

    modalImportacionManualCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];
    function modalImportacionManualCtrl($scope, $uibModalInstance, params) {

        console.log($scope)
    }







})(window.angular)
