(function () {
    'use strict'

    const TEMPLATE_URL = '~/Pages/Compras/DocumentoRecibido/Shared/'
    let docRecibidoSvc = {}
    let tS = {}
    let fS = {};
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
        fS = $injector.get('formulario');

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
        $scope.selected = []

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
            $scope.dataSearch.rucProveedor = item.numeroIdentificacion;
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
                        $scope.getComprobantes();
                    }
                })

            } catch (error) {
                console.log(error)
            }
        }


        $scope.openModalImportacionManual = async function () {
            try {

                if (!await alertEstabSelected()) return;

                modalSvc.openModalCustom({
                    controller: 'modalImportacionManualCtrl',
                    template: `${TEMPLATE_URL}_ModalNewManual.cshtml`,
                    size: 'lg',
                    params: {},
                    isRenderRazorPartial: true
                }).result.then(result => {

                    if (typeof result == 'object') {
                        $scope.getComprobantes();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.openModalMigrate = function () {
            try {

                if ($scope.comprobantes.length == 0) {
                    tS.toastr('warning', 'No se encontraron registros para migrar')
                    return
                }

                modalSvc.openModalCustom({
                    controller: 'modalMigrateCtrl',
                    template: `${TEMPLATE_URL}_MigrateEstab.cshtml`,
                    size: 'xl',
                    params: {
                        comprobantesFiltered: $scope.comprobantes.filter(item => !item.complete),
                        establecimientosFiltered: $scope.establecimientos.filter(estab => estab.codEstab !== $scope.dataSearch.codEstab)
                    },
                    isRenderRazorPartial: true
                }).result.then(result => {

                    if (typeof result == 'object') {
                        initialLoad();
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

        $scope.fileTxt = null;
        $scope.compFounded = [];
        $scope.compToImport = [];


        $scope.query = { sortBy: '' }

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

                    }
                }).catch(error => {
                    console.log(error)
                    if (("data" in error) && error.data.code) {
                        tS.toastr('error', error.data.message)
                    }
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

    app.controller('modalImportacionManualCtrl', modalImportacionManualCtrl);
    modalImportacionManualCtrl.$inject = ['$scope', '$q', '$uibModalInstance', 'params'];
    function modalImportacionManualCtrl($scope, $q, $uibModalInstance, params) {

        $scope.dataEstab = dataEstab;
        $scope.mainform = {}
        $scope.mainform.option = false
        $scope.files = [];
        $scope.compToImport = [];
        console.log($scope)




        $scope.$watch('files', function () {
            $scope.uploadXml($scope.files);
        });
        $scope.$watch('file', function () {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });


        $scope.claveAccesoIsValid = false
        $scope.checkExistenceXml = async (item) => {
            if (!item) {
                tS.toastr('warning', 'Clave de acceso incorrecta')
                return
            }
            if (item.length != 49) {
                tS.toastr('warning', 'La Clave de acceso debe poseer 49 digitos')
                return
            }
            $scope.claveAccesoIsValid = false
            showLoader();
            await docRecibidoSvc.checkExistenceXml(item).then(
                response => {
                    if (response.estado != "AUTORIZADO") {
                        if (response.message) {
                            tS.toastr('warning', response.message)
                        } else {
                            tS.toastr("warning", "Clave de acceso no existe en el SRI")
                        }
                    } else {
                        $scope.claveAccesoIsValid = true
                        hideLoader()
                        tS.toastr('info', 'Validacion exitosa')
                    }
                    hideLoader()
                }
            ).catch(error => {
                hideLoader();
                console.log(error);
            })
            return $scope.claveAccesoIsValid
        }


        $scope.addClaveAcceso = async () => {
            if (!$scope.mainform.claveAcceso) {
                tS.toastr("warning", "La clave de acceso no es correcta")
                return
            }
            if ($scope.mainform.claveAcceso.length != 49) {
                tS.toastr("warning", "La clave de acceso debe poseer 49 digitos")
                return
            }
            if ($scope.compToImport.some(x => x.claveAcceso == $scope.mainform.claveAcceso)) {
                tS.toastr("warning", "La clave de acceso ya existe")
                return
            }
            if (!await $scope.checkExistenceXml($scope.mainform.claveAcceso)) {
                return
            }
            $scope.compToImport.push({ claveAcceso: $scope.mainform.claveAcceso })
            $scope.mainform.claveAcceso = ''
            $scope.$apply()
        }
        $scope.removeClaveAcceso = (item) => {
            $scope.compToImport.splice(item, 1)
        }
        $scope.removeFile = (item) => {
            $scope.files.splice(item, 1)
        }
        $scope.uploadXml = function (files) {
            let uploadPromises = [];
            angular.forEach(files, function (file) {

                let uploadPromise = docRecibidoSvc.uploadXml({ codEstab: $scope.dataEstab.codEstab }, file).then(function (response) {
                    // Maneja la respuesta del backend aquí
                    if (response) {
                        if (response.code == "0") {
                            tS.toastr("warning", response.message)
                        }
                        if (response.code == "1") {
                            tS.toastr("success", response.message)
                        }
                    }
                    //console.log('Archivo cargado exitosamente:', response.data);
                }, function (error) {
                    // Maneja el error de carga aquí
                    tS.toastr("error", "Error al cargar el archivo: " + error)
                    //console.log('Error al cargar el archivo:', error);
                });
                uploadPromises.push(uploadPromise);
            });

            $q.all(uploadPromises)
                .then(function (response) {
                    console.log(response)
                    // Todas las peticiones se han completado con éxito
                    //tS.toastr("info", "Todas las peticiones se han completado")
                    //console.log('Todas las peticiones se han completado');
                })
                .catch(function () {
                    // Al menos una de las peticiones ha fallado
                    tS.toastr("danger", "Al menos una de las peticiones ha fallado")
                    //console.log('Al menos una de las peticiones ha fallado:', error);
                });
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




    app.controller('modalMigrateCtrl', modalMigrateCtrl);
    modalMigrateCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalMigrateCtrl($scope, $uibModalInstance, params) {

        const {
            comprobantesFiltered,
            establecimientosFiltered
        } = params;

        $scope.dataEstab = dataEstab;
        $scope.migrate = {};


        $scope.comprobantesTempToMigrate = comprobantesFiltered;
        $scope.establecimientosToMigrate = establecimientosFiltered;

        $scope.comprobantesToMigrate = [];

        $scope.askToMigrate = () => {

            if (!fS.isValidField($scope.migrate.codEstab)) {
                tS.toastr("warning", 'Por favor seleccione el establecimiento de destino')
                return
            }
            if ($scope.comprobantesToMigrate.length===0){
                tS.toastr('warning', 'Seleccione al menos un comprobante!')
                return
            }
            
            Swal.fire({
                //title: 'Estab.: ' + $scope.estabToWork,
                text: "Esta seguro de migrar de establecimiento a los siguientes comprobantes?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Proceder',
                cancelButtonText: 'No, cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    migrate();
                }
            })
        }

        function migrate () {
            try {
                let data = { codEstab: $scope.migrate.codEstab, jsonData: $scope.comprobantesToMigrate };
                showLoader();
                docRecibidoSvc.migrate(data).then(response => {
                    if (response.code == '0') {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == "1") {                         
                        tS.toastr("success", response.message)
                        $uibModalInstance.close(response)
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }
    }





})(window.angular)
