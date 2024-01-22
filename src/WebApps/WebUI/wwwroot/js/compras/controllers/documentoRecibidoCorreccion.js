(function () {
    'use strict'

    const TEMPLATE_URL = '~/Pages/Compras/DocumentoRecibido/Shared/'
    let docRecibidoSvc = {}
    let tS = {}
    let fS = {};
    let modalSvc = {};
    let dataEstab = {};
    let proveedorSvc = {};
    let nombreModalInventario = {};
    let commonSvc = {};



    app.controller('documentoRecibidoCtrl', documentoRecibidoCtrl)

    documentoRecibidoCtrl.$inject = ['$filter', '$scope', '$injector', '$q'];

    function documentoRecibidoCtrl($filter, $scope, $injector, $q) {
        const mS = $injector.get('mainService');
        commonSvc = $injector.get('commonService');
        docRecibidoSvc = $injector.get('docRecibidoService');
        tS = $injector.get('toastService');
        modalSvc = $injector.get('modalService');
        const nameModalConst = $injector.get('nombreModal');
        nombreModalInventario = $injector.get('nombreModalInventario');
        const articuloSvc = $injector.get('articuloService');
        proveedorSvc = $injector.get('proveedorService');
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
            $scope.comprobantes = $filter("filter")(comprobantes, $scope.dataSearch.textSearch)
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



        $scope.showOptions = function () {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-dark btn-sm'
                },
                buttonsStyling: false,
            })

            swalWithBootstrapButtons.fire({
                title: 'Comprobante',
                html: `<div> ${$scope.selected[0].comprobante} <strong> ${$scope.selected[0].serieComprobante} </strong> </div>
                            <div class="btn btn-group btn-group-xs" role="group">
                                <button type="button" id="btnImportar" class="btn btn-info btn-sm" title="Importar Comprobante"><i class="ti-upload"></i> Visualizar</button>
                                <button type="button" id="btnGetXml" class="btn btn-success btn-sm" title="Actualizar Xml Sri"><i class="ti-download"></i> Actualizar Xml</button>
                                <button type="button" id="btnDelete" class="btn btn-danger btn-sm" title="Eliminar"><i class="ti-trash"></i> Eliminar</button>
                                <button type="button" id="btnDocRel" class="btn btn-primary btn-sm" title="Documentos relacionados"><i class="fa fa-link"></i> Docs. Rel.</button>
                                <button type="button" id="btnReport" class="btn btn-secondary btn-sm" title="PDF"><i class="mdi mdi-file-pdf"></i> Reporte</button>
                            </div>`,
                width: 600,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            })



            if ($scope.selected[0].complete) {
                document.getElementById("btnDelete").style.display = "none";
            }
            document.getElementById("btnImportar").onclick = function (event) {
                getId()
                Swal.close()
                event.preventDefault()
            }
            document.getElementById("btnGetXml").onclick = function (event) {
                putXml()
                event.preventDefault()
            }
            document.getElementById("btnDelete").onclick = function (event) {
                askToDelete()
                event.preventDefault()
            }
            document.getElementById("btnDocRel").onclick = function (event) {
                getMergedDocs()
                event.preventDefault()
            }

            //Reporte 
            if ($scope.selected[0].codDoc !== '01') {
                document.getElementById("btnReport").style.display = "none";
            } else {
                document.getElementById("btnReport").onclick = function () {
                    getReport();
                }
            }

        }

        function getId() {
            try {
                showLoader();
                docRecibidoSvc.getId($scope.selected[0].idDocumento).then(response => {
                    // if (response.code === "0") {
                    //     tS.toastr('warning', response.message);
                    //     return
                    // }
                    if (!response.payload) {
                        tS.toastr('warning', "Aun no se actualizado el Xml del SRI");
                        return
                    }


                    if ($scope.selected[0].codDoc === "07") {

                        modalSvc.openModalCustom({
                            controller: ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {
                                const { selected } = params;
                                $scope.selected = selected;
                                $scope.dataEstab = dataEstab;
                                $scope.fullComprobante = params;
                                //let codDoc = $scope.fullComprobante.infoTributaria.codDoc
                                $scope.infoTributaria = $scope.fullComprobante.infoTributaria
                                $scope.infoAdicional = $scope.fullComprobante.infoAdicional;

                                $scope.infoCompRetencion = $scope.fullComprobante.infoCompRetencion;


                                $uibModalInstance.rendered.then(() => {
                                    getBarcode($scope.infoTributaria.claveAcceso)
                                })

                                docRecibidoSvc.getDataForm().then(response => {
                                    const { bodegas, categoriasCompra, sustentosTributario, medidas } = response;

                                    $scope.categoriasCompra = categoriasCompra;
                                    $scope.sustentosTributario = sustentosTributario;
                                    $scope.medidas = medidas;
                                    $scope.bodegasFiltered = bodegas.filter(estab => estab.codEstab === $scope.dataEstab.codEstab);

                                })

                                $scope.getReport = function () {
                                    getReport();
                                }

                                $scope.closeModal = function () {
                                    $uibModalInstance.close();
                                }
                            }],
                            template: `${TEMPLATE_URL}_Retencion.cshtml`,
                            size: 'xl',
                            params: {
                                ...response.payload,
                                selected: $scope.selected
                            },
                            isRenderRazorPartial: true,
                        })

                    } else {
                        modalSvc.openModalCustom({
                            controller: 'modalComprobanteCtrl',
                            template: `${TEMPLATE_URL}_ModalComprobante.cshtml`,
                            size: 'xl',
                            params: {
                                ...response.payload,
                                selected: $scope.selected
                            },
                            isRenderRazorPartial: true,
                            windowClass: 'uibModalFullScreen',
                        }).result.then(result => {

                            if (typeof result === 'object') {
                                initialLoad();
                            }
                        })
                    }

                }).catch((error) => {
                    hideLoader()
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader()
                console.log(error)
            }

        }


        function putXml() {
            try {
                showLoader()
                docRecibidoSvc.putXml($scope.selected[0].idDocumento).then(
                    response => {
                        if (response.code == 0) {
                            tS.toastr('warning', response.message)
                            return;
                        }
                        if (response.code == 1) {
                            tS.toastr('success', response.message)
                            return;
                        }
                        if (response.code == 2) {
                            askToUploadXml() //call to manual xml update
                        }
                    }
                ).finally(() => hideLoader())

            } catch (e) {
                hideLoader()
                console.log(e)
            }
        }

        function askToUploadXml() {
            Swal.fire({
                title: 'Xml no encontrado!',
                text: "Desea subir el xml manualmente?",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {

                    modalSvc.openModalCustom({
                        controller: 'modalXmlIndividualCtrl',
                        template: `${TEMPLATE_URL}_ModalXmlIndividual.cshtml`,
                        size: 'md',
                        params: {
                            selected: $scope.selected
                        },
                        isRenderRazorPartial: true,
                    }).result.then(result => {
                        if (typeof result === 'object') {
                            $scope.showOptions()
                        }
                    })
                }
            })
        }


        function askToDelete() {
            $scope.itemToDelete = $scope.selected[0];
            Swal.fire({
                title: '¿Está seguro de eliminar este comprobante?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    $scope.delete($scope.itemToDelete.idDocumento)
                }
            })
        }

        $scope.delete = function (idDocumento) {
            try {
                showLoader();
                docRecibidoSvc.deleteDoc(idDocumento).then(
                    response => {
                        if (response.code == 0) {
                            tS.toastr('warning', response.message)
                            return;
                        }
                        if (response.code == 1) {
                            $scope.getComprobantes()
                            tS.toastr('success', response.message)
                        }
                    }
                ).finally(() => hideLoader())
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }


        function getMergedDocs() {
            try {
                Swal.close();
                modalSvc.openModalCustom({
                    controller: ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {
                        const { selected } = params;
                        $scope.selected = selected;

                        $scope.mergedDocs = [];
                        $scope.showOptionsMergeDoc = false;
                        let data = {
                            id: selected[0].idDocumento,
                            codDoc: selected[0].codDoc,
                            claveAcceso: selected[0].claveAcceso
                        }
                        showLoader();
                        docRecibidoSvc.getDocRelacionado(data).then(response => {
                            $scope.mergedDocs = response;
                        }).catch(error => {
                            console.log(error)
                        }).finally(() => hideLoader())

                        $scope.closeModal = function () {
                            $uibModalInstance.close();
                        }
                    }],
                    template: `${TEMPLATE_URL}_Doc_Relacionado.cshtml`,
                    size: 'xl',
                    params: {
                        selected: $scope.selected
                    },
                    isRenderRazorPartial: true,
                })


                // Swal.close()                
            } catch (error) {
                console.log(error)
            }
        }



        const COD_REPORTS = {
            "07": 'RCR',
            '01': 'RFC'
        }
        function getReport() {
            try {
                let format = 'pdf';
                let codDoc = $scope.selected[0].codDoc;
                let id = $scope.selected[0].idDocumento;
                let codEstab = $scope.selected[0].codEstab;

                if (!['01', '07'].includes(codDoc)) {
                    tS.toastr('warning', 'Reporte no disponible')
                    return
                }

                let parameters = {
                    dataParams: JSON.stringify({
                        id,
                        codigo: COD_REPORTS[codDoc],
                        isReportImported: true,
                    }),
                    reportParams: JSON.stringify({
                        codigo: COD_REPORTS[codDoc],
                        codEstab,
                        format,
                        aditionalParams: []
                    }),
                    hasService: true,
                }


                commonSvc.getReport({
                    parameters,
                    formatType: format
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
                        tS.toastr('success', "Comprobantes cargados correctamente!");
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


    app.controller('modalXmlIndividualCtrl', modalXmlIndividualCtrl);
    modalXmlIndividualCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];
    function modalXmlIndividualCtrl($scope, $uibModalInstance, params) {

        const { selected } = params;
        $scope.selected = selected;
        $scope.fileXml = null;


        $scope.putXmlManual = () => {
            try {
                let file = $scope.fileXml;
                if (file === null || file === undefined) {
                    hideLoader()
                    alert('No ha seleccionado ningun archivo')
                    return;
                }

                docRecibidoSvc.putXmlManual($scope.selected[0].idDocumento, $scope.selected[0].claveAcceso, file).then(
                    response => {
                        if (response.code == 0) {
                            tS.toastr('warning', response.message)
                            return;
                        }
                        if (response.code == 1) {
                            tS.toastr('success', response.message);
                            $uibModalInstance.close(response)
                        }
                    }
                ).finally(() => hideLoader());
            } catch (error) {
                console.log(error)
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }
    }


    /**
     * Migrate Docs
     */

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
            if ($scope.comprobantesToMigrate.length === 0) {
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

        function migrate() {
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


    app.controller('modalComprobanteCtrl', modalComprobanteCtrl);

    modalComprobanteCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];
    function modalComprobanteCtrl($scope, $uibModalInstance, params) {

        $scope.dataEstab = dataEstab; //Establecimiento 

        const { infoTributaria, infoAdicional, selected } = params;

        $scope.selected = selected;

        $scope.comprobanteName = '';
        $scope.fullComprobante = params;
        //poner condicionales de acuerdo al tipo de documento
        let codDoc = infoTributaria.codDoc
        $scope.infoTributaria = infoTributaria
        $scope.infoAdicional = infoAdicional

        $scope.categoriasCompra = [];
        $scope.sustentosTributario = [];
        $scope.medidas = [];
        $scope.bodegasFiltered = [];

        $scope.payments = [];
        $scope.provCliente = {};


        $scope.tempDetail = [];
        $scope.customDetailTemp = [];
        $scope.datosAdicionalesArticulo = [];

        $scope.comprobanteForm = {
            idMedida: 0
        };

        $scope.showFormCustomDetails = false;


        $scope.btnProvIsEnable = false;
        $scope.resultModalProveedor = function (result) {
            if (typeof result === 'object' && result.idProveedor > 0) {
                $scope.idProveedor = result.idProveedor
                $scope.comprobanteForm.idTiempoCredito = result.idTiempoCredito
                $scope.btnProvIsEnable = true
            }
        }



        onLoad();
        function onLoad() {
            try {
                docRecibidoSvc.getDataForm().then(response => {
                    const { bodegas, categoriasCompra, sustentosTributario, medidas } = response;

                    $scope.categoriasCompra = categoriasCompra;
                    $scope.sustentosTributario = sustentosTributario;
                    $scope.medidas = medidas;
                    $scope.bodegasFiltered = bodegas.filter(estab => estab.codEstab === $scope.dataEstab.codEstab);

                    // $uibModalInstance.rendered.then(() => {
                    //     getBarcode($scope.infoTributaria.claveAcceso);
                    // })

                    if (codDoc === "01") {
                        setDataFactura();
                    }
                    if (codDoc === "04") {
                        setDataNotaCreditoProveedor();
                    }
                    isRegisteredSupplier();

                })
            } catch (error) {
                console.log(error)
            }
        }

        function isRegisteredSupplier() {
            try {
                showLoader();
                proveedorSvc.checkByID($scope.infoTributaria.ruc).then(response => {
                    if (response.idProveedor > 0) {
                        $scope.idProveedor = response.idProveedor
                        $scope.comprobanteForm.idTiempoCredito = response.idTiempoCredito
                        $scope.txtBtnProv = 'Actualizar'
                        handleBtnProv(1)
                    } else {
                        $scope.txtIconModalProv = 'ti-plus';
                        $scope.txtTitleModalProv = 'Registrar Proveedor';
                        $scope.txtBtnProv = 'Guardar';
                        handleBtnProv(2)
                    }
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                console.log(error)
            }
        }

        function handleBtnProv(tipo) {
            let btnProv = document.getElementById('btnProv')
            if (btnProv) {
                if (tipo == 1) {
                    btnProv.style.display = "none"
                    btnProv.setAttribute('disabled', 'disabled')
                } else {
                    btnProv.style.display = "block"
                    btnProv.removeAttribute('disabled')
                }
            }
        }


        //Factura 
        let idDetalle = 0;
        function setDataFactura() {
            $scope.comprobanteName = 'Factura de Compra'
            $scope.infoComprobante = $scope.fullComprobante.infoFactura
            $scope.totalTaxes = $scope.fullComprobante.infoFactura.totalImpuestos

            for (const det of $scope.totalTaxes) {
                if (Number(det.baseImponible) > 0) {
                    $scope.customDetailTemp.push(
                        {
                            idDetalle: idDetalle,
                            idDocumento: $scope.selected[0].idDocumento,
                            idArticulo: 0,
                            cantidad: 1,
                            codigo: det.codigo, //impuesto
                            codigoPorcentaje: det.codigoPorcentaje, //porcentaje impuesto
                            valor: det.valor, //valor impuesto
                            codigoPrincipal: '',
                            codigoAuxiliar: '',
                            descripcion: '',
                            precioUnitario: det.baseImponible,
                            precioTotalSinImpuesto: det.baseImponible,
                            descuento: (det.descuentoAdicional == '' ? 0.00 : Number(det.descuentoAdicional)),
                            impuesto: (det.codigo) == '2' ? 'iva' : 'ice',
                            valorImpuesto: det.valor,
                            total: ((Number(det.baseImponible) - Number(det.descuentoAdicional)) + Number(det.valor)).toFixed(2)
                        }
                    )
                }
                idDetalle++
            }
            getTempDetails()

            /** End details */

            /** Formas de Pago */
            $scope.payments = $scope.fullComprobante.infoFactura.pagos
            /** End formas de pago */

            /** End Info Adicional */

            $scope.provCliente.razonSocial = $scope.infoTributaria.razonSocial
            $scope.provCliente.nombreComercial = $scope.infoTributaria.nombreComercial
            $scope.provCliente.ruc = $scope.infoTributaria.ruc
            $scope.provCliente.dirMatriz = $scope.infoTributaria.dirMatriz;

            //Adding by Emilio Senguana 
            $scope.provCliente.isImport = true;

            setTaxes()
        }

        //Nota Credito Proveedor 
        function setDataNotaCreditoProveedor() {
            try {
                $scope.comprobanteName = 'Nota de Crédito Proveedor'
                // $scope.infoNotaCredito = $scope.fullComprobante.infoNotaCredito
                // $scope.totalTaxes = $scope.fullComprobante.infoNotaCredito.totalImpuestos
                //$scope.getNotaCreditoDetalle($scope.fullComprobante.numeroAutorizacion)
                //$('#notaCreditoModal').modal('show')
                $scope.infoComprobante = $scope.fullComprobante.infoNotaCredito
                $scope.totalTaxes = $scope.fullComprobante.infoNotaCredito.totalImpuestos
                for (const det of $scope.totalTaxes) {
                    if (Number(det.baseImponible) > 0) {
                        $scope.customDetailTemp.push(
                            {
                                idDetalle: idDetalle,
                                idDocumento: $scope.selected[0].idDocumento,
                                idArticulo: 0,
                                cantidad: 1,
                                codigo: det.codigo, //impuesto
                                codigoPorcentaje: det.codigoPorcentaje, //porcentaje impuesto
                                valor: det.valor, //valor impuesto
                                codigoPrincipal: '',
                                codigoAuxiliar: '',
                                descripcion: '',
                                precioUnitario: det.baseImponible,
                                precioTotalSinImpuesto: det.baseImponible,
                                descuento: (det.descuentoAdicional == '' ? 0.00 : Number(det.descuentoAdicional)),
                                impuesto: (det.codigo) == '2' ? 'iva' : 'ice',
                                valorImpuesto: det.valor,
                                total: ((Number(det.baseImponible) - Number(det.descuentoAdicional)) + Number(det.valor)).toFixed(2)
                            }
                        )
                    }
                    idDetalle++
                }
                getTempDetails()
                $scope.provCliente.razonSocial = $scope.infoTributaria.razonSocial
                $scope.provCliente.nombreComercial = $scope.infoTributaria.nombreComercial
                $scope.provCliente.ruc = $scope.infoTributaria.ruc
                $scope.provCliente.dirMatriz = $scope.infoTributaria.dirMatriz

                //Adding by Emilio Senguana 
                $scope.provCliente.isImport = true;
            } catch (error) {
                console.log(error)
            }
        }

        function getTempDetails() {
            try {
                docRecibidoSvc.getTempDetails($scope.selected[0].idDocumento).then(
                    response => {
                        $scope.tempDetail = response;
                    }).catch(error => {
                        console.log(error)
                    })

                if ($scope.selected[0].codDoc === '01') {
                    getDatoAdicionalArticulo();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function getDatoAdicionalArticulo() {
            try {
                docRecibidoSvc.getDatoAdicionalArticulo($scope.selected[0].idDocumento).then(response => {
                    $scope.datosAdicionalesArticulo = response;
                }).catch(error => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }


        function setTaxes() {
            let trTaxes = ''
            for (const element of $scope.totalTaxes) {
                if (element.codigo == '2' && element.codigoPorcentaje == '2') {
                    trTaxes += `<tr><td class="text-right"><strong>SubTotal 12%</strong></td>`
                    trTaxes += `<td class="text-right"> ${parseFloat(element.baseImponible).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
                }
                if (element.codigo == '2' && element.codigoPorcentaje == '0') {
                    trTaxes += `<tr><td class="text-right"><strong>SubTotal Iva 0%</strong></td>`
                    trTaxes += `<td class="text-right"> ${parseFloat(element.baseImponible).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
                }
                if (element.codigo == '2' && (element.codigoPorcentaje == '6')) {
                    trTaxes += `<tr><td class="text-right"><strong>SubTotal No Objeto Iva</strong></td>`
                    trTaxes += `<td class="text-right"> ${parseFloat(element.baseImponible).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
                }

                if (element.codigo == '2' && element.codigoPorcentaje == '7') {
                    trTaxes += `<tr><td class="text-right"><strong>SubTotal Excento Iva</strong></td>`
                    trTaxes += `<td class="text-right"> ${parseFloat(element.baseImponible).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
                }
                if (element.codigo == '3') {
                    trTaxes += `<tr><td class="text-right"><strong>ICE</strong></td>`
                    trTaxes += `<td class="text-right"> ${parseFloat(element.valor).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
                }
                if (element.codigo == '2' && element.codigoPorcentaje == '2') {
                    trTaxes += `<tr><td class="text-right"><strong>Iva 12%</strong></td>`
                    trTaxes += `<td class="text-right"> ${parseFloat(element.valor).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
                }
                if (element.codigo == '5') {
                    trTaxes += `<tr><td class="text-right"><strong>IRBPNR</strong></td>`
                    trTaxes += `<td class="text-right"> ${parseFloat(element.valor).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
                }
            }

            trTaxes += `<tr><td class="text-right"><strong>Total Sin Impuestos</strong></td>`
            trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.totalSinImpuestos).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`

            if ($scope.fullComprobante.codDoc == '01') {

                trTaxes += `<tr><td class="text-right"><strong>Descuento</strong></td>`
                trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.totalDescuento).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`

                trTaxes += `<tr><td class="text-right"><strong>Propina</strong></td>`
                trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.propina).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`

                trTaxes += `<tr><td class="text-right"><strong>Importe Total</strong></td>`
                trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.importeTotal).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
            }
            if ($scope.fullComprobante.codDoc == '04') {

                trTaxes += `<tr><td class="text-right"><strong>Importe Total</strong></td>`
                trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.valorModificacion).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`
            }



            $uibModalInstance.rendered.then(() => {
                $("#tbodyTaxes").html(trTaxes)
            })

        }



        $scope.addBodega = async () => {
            try {
                if (!($scope.comprobanteForm.idBodega > 0)) {

                    return
                }
                let { isConfirmed } = await Swal.fire({
                    title: "Cambiar bodega",
                    html: "¿Esta seguro de cambiar la bodega?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si!",
                    cancelButtonText: 'No!'
                })

                if (!isConfirmed) {
                    $scope.comprobanteForm.idBodega = 0;
                    $scope.$apply()
                    return
                }

                if ($scope.comprobanteForm.idBodega > 0) {
                    let data = {
                        todos: true,
                        idDocumento: $scope.selected[0].idDocumento,
                        idBodega: $scope.comprobanteForm.idBodega
                    }
                    saveArticleTemp(3, data)
                }
            } catch (error) {
                console.log(error)
            }
        }

        function saveArticleTemp(tipo, data) {
            try {
                let method = '';
                if (tipo == 1) {
                    method = "post"
                } else {
                    method = "put"
                }

                showLoader();
                docRecibidoSvc.saveArticleTemp(data, method).then(
                    response => {
                        if (response.code == '1') {
                            tS.toastr('success', response.message)
                            $scope.tempDetail = []
                            $scope.showFormCustomDetails = false
                            $scope.customDetailTemp = [];
                            getTempDetails();
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }
                ).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.updateSizeArticles = async () => {
            try {

                let { isConfirmed } = await Swal.fire({
                    title: "Cambiar Medida",
                    html: "¿Esta seguro de cambiar la Medida?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si!",
                    cancelButtonText: 'No!'
                })

                if (!isConfirmed) {
                    $scope.comprobanteForm.idMedida = 0;
                    $scope.$apply()
                    return
                }

                let data = {
                    todos: true,
                    idDocumento: $scope.selected[0].idDocumento,
                    idMedida: $scope.comprobanteForm.idMedida
                }
                saveArticleTemp(2, data)
            } catch (error) {
                console.log(error)
            }
        }


        $scope.updateArticleTemp = (item) => {
            if (!($scope.idProveedor > 0)) {
                tS.toastr('warning', 'Primero debe guardar el proveedor!')
                return
            }
            if (!(item.idArticulo > 0 > 0)) {
                tS.toastr('warning', 'Primero debe guardar el Artículo!')
                return
            }

            let data = {
                idDocumento: $scope.selected[0].idDocumento,
                idMedida: item.idMedida,
                idProveedor: $scope.idProveedor,
                ruc: $scope.infoTributaria.ruc,
                idArticulo: item.idArticulo,
                codArticulo: item.codigoPrincipal,
                idDetalle: item.idDetalle
            }
            saveArticleTemp(2, data)
        }


        $scope.openMerge = function (item) {
            if (!($scope.idProveedor > 0)) {
                Swal.fire({ title: 'Aviso', text: 'Aun no ha guardado el proveedor', icon: 'warning' })
                return
            }

            // $scope.articleSelected = item

            // $scope.searchArticle()

            let modalRef = modalSvc.openModalCustom({
                controller: 'modalArticuloMergeCtrl',
                template: `${TEMPLATE_URL}_ModalArticuloMerge.cshtml`,
                size: 'xl',
                windowClass: 'uibModalFullScreen',
                params: {
                    idProveedor: $scope.idProveedor,
                    data: item,
                    infoTributaria: $scope.infoTributaria,
                    selected: $scope.selected
                },
                isRenderRazorPartial: true
            })

            modalRef.result.then(data => {
                if (typeof data === 'object') {
                    saveArticleTemp(2, data)
                }
            })
        }


        $scope.getArticleHC = async (result) => {
            try {
                console.log(result)
                if (typeof result === 'object') {
                    getTempDetails()
                }
            } catch (error) {
                console.log(error)
            }
        }


        $scope.articleHistory = []
        $scope.getArticleHistory = (item) => {
            try {

                $scope.articleHistory = []
                $scope.articleName = item.descripcion
                let data = {
                    id: item.idArticulo,
                    tipo: 'H'
                }

                showLoader()
                docRecibidoSvc.searchArticle(data).then(response => {
                    if (response.code == '1') {
                        $scope.articleHistory = JSON.parse(response.payload)
                        $scope.modalRefArticleHistory = modalSvc.openModalCustom({
                            template: `${TEMPLATE_URL}_ArticleHistory.cshtml`,
                            size: 'xl',
                            windowClass: 'uibModalFullScreen',
                            scope: $scope,
                            isRenderRazorPartial: true
                        })
                    } else {
                        tS.toastr('info', "Aun no existen ingresos de este articulo.")
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.askToAddStok = (item) => {
            Swal.fire({
                text: "¿Está seguro/a de añadir este articulo al stock?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    addStock(item)
                }
            })
        }

        function addStock(item) {
            try {
                if ($scope.tempDetail.some(item => (["", 0, null, undefined, "0"].includes(item.idBodega)))) {
                    tS.toastr('warning', 'Agregue la bodega a los Artículos')
                    return
                }

                showLoader();
                docRecibidoSvc.addStock({
                    idDocumento: $scope.selected[0].idDocumento,
                    idArticulo: item.idArticulo
                }).then(response => {
                    if (response.code == '0') {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        tS.toastr('success', response.message)
                        getTempDetails()
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {
                console.log(error)
            }
        }

        $scope.askToDeleteStok = (item) => {
            Swal.fire({
                title: '¿Está seguro/a de eliminar este articulo del stock?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteStock(item)
                }
            })
        }

        function deleteStock(item) {
            try {
                showLoader();
                docRecibidoSvc.deleteStock(item.idDocumentoDetalle).then(response => {
                    if (response.code == '0') {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        getTempDetails()
                        tS.toastr('success', response.message)
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.resultModalArticleEdit = function (dataArticulo) {
            try {
                for (let item of $scope.tempDetail) {
                    if (dataArticulo.idArticulo === item.idArticulo) {
                        item.etiquetas = dataArticulo.etiquetas;
                        item.datosAdicionales = dataArticulo.datosAdicionales;
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }


        $scope.resultModalDatoAdicional = function (item) {
            let datosAdicionales = item.map(item => {
                return {
                    idArticulo: item.idArticulo,
                    idEtiqueta: item.idEtiqueta,
                    idInfoAdicional: item.idInfoAdicional || 0,
                    jsonAdicional: item.adicionales
                }
            })

            showLoader();
            docRecibidoSvc.postDatoAdicionalArticulo($scope.selected[0].idDocumento, datosAdicionales).then(response => {
                if (response.code === '0') {
                    tS.toastr('warning', response.message);
                }
                if (response.code === '1') {
                    tS.toastr('success', response.message);
                    let dtAdicional = JSON.parse(response.payload) || [];

                    $scope.datosAdicionalesArticulo = dtAdicional.map(item => {
                        return {
                            idArticulo: item.idArticulo,
                            idEtiqueta: item.idEtiqueta,
                            idInfoAdicional: item.idInfoAdicional,
                            adicionales: JSON.parse(item.jsonAdicional),
                            estado: item.estado,
                        }
                    })
                }
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader());
        }


        function detailValid() {
            if ($scope.idProveedor < 1) {
                tS.toastr('warning', 'Primero debe Guardar el proveedor')
                return
            }
            // if (!$scope.comprobanteForm.idSustentoTributario) {
            //     tS.toastr('warning', 'Seleccione el sustento tributario')
            //     return
            // }
            // if (!$scope.comprobanteForm.idCategoria) {
            //     tS.toastr('warning', 'Seleccione una categoría')
            //     return
            // }
            // if (!$scope.comprobanteForm.idTiempoCredito) {
            //     tS.toastr('warning', 'Seleccione el tiempo de crédito')
            //     return
            // }

            if ($scope.tempDetail.some(item => (["", 0, null, undefined, "0"].includes(item.idMedida)))) {
                tS.toastr('warning', 'Agregue la medida a los Artículos')
                return
            }
            if ($scope.tempDetail.some(item => (["", 0, null, undefined, "0"].includes(item.idBodega)))) {
                tS.toastr('warning', 'Agregue la bodega a los Artículos')
                return
            }
            return true
        }

        $scope.askToSave = () => {
            try {
                if (detailValid()) {
                    let message = '', title = ''
                    if ($scope.tempDetail.some(item => (["", 0, null, undefined, "0"].includes(item.idArticulo)))) {
                        message = `<table class="table table-bordered"><thead><tr class="small"><th>Cod</th><th>Descripción</th></tr></thead><tbody>`
                        for (const art of $scope.tempDetail) {
                            if (!art.idArticulo || art.idArticulo == 0) {
                                message += `<tr class="small"><td>${art.codigoPrincipal}</td><td>${art.descripcion}</td></tr>`
                            }
                        }
                        message += `</tbody></table>`
                        title = 'Posee articulos sin vincular, ¿Está seguro/a de completar la importación?'
                    } else {
                        title = 'Advertencia'
                        message += "¿Está seguro/a de completar la importación?"
                    }
                    Swal.fire({
                        title: title,
                        html: message,
                        icon: 'warning',
                        width: '700px',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si!',
                        cancelButtonText: 'No',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            saveComp()
                        }
                    })
                }
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        function saveComp() {
            try {
                if ($scope.selected[0].complete) {
                    tS.toastr('warning', 'Imposible guardar, este documento ya fue modificado!')
                    return
                }
                // let data = {
                //     idDocumento: $scope.selected[0].idDocumento,
                //     secuencial: $scope.infoTributaria.secuencial,
                //     estab: $scope.infoTributaria.estab,
                //     ptoEmi: $scope.infoTributaria.ptoEmi,
                //     claveAcceso: $scope.selected[0].claveAcceso,
                //     fechaEmision: $scope.infoComprobante.fechaEmision,
                //     codDoc: $scope.infoTributaria.codDoc,
                //     idSustentoTributario: Number($scope.comprobanteForm.idSustentoTributario),
                //     idProveedor: Number($scope.idProveedor),
                //     idCategoriaCompra: Number($scope.comprobanteForm.idCategoria),
                //     idBodega: Number($scope.comprobanteForm.idBodega),
                //     idTiempoCredito: Number($scope.comprobanteForm.idTiempoCredito),
                //     totalSinImpuestos: parseFloat($scope.infoComprobante.totalSinImpuestos),
                //     totalDescuento: 0.00,// parseFloat($scope.infoComprobante.totalDescuento),
                //     propina: $scope.infoComprobante.propina,
                //     importeTotal: parseFloat($scope.infoComprobante.importeTotal),
                //     observacion: $scope.comprobanteForm.observacion,
                //     payments: JSON.stringify($scope.payments)

                // }
                let url = ''
                url = 'Compra/DocumentoDetalle/' + $scope.selected[0].idDocumento + '/' + 0
                //url = _urlService + 'Factura?json=' + JSON.stringify(data)

                showLoader()
                docRecibidoSvc.saveDocumentoDetalle($scope.selected[0].idDocumento).then(response => {
                    if (response.code == '0') {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == "1") {
                        tS.toastr("success", response.message);
                        $uibModalInstance.close(response);
                    }

                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }



        $scope.exportToExcel = () => {
            try {
                let format = 'excel';
                const parameters = {
                    dataParams: JSON.stringify({
                        isReportImport: true,
                        id: $scope.selected[0].idDocumento,
                        codDoc: $scope.selected[0].codDoc,
                    }),
                    reportParams: JSON.stringify({
                        codigo: 'RCD',
                        codEstab: $scope.selected[0].codEstab,
                        format,
                    }),
                    hasService: true,
                }


                commonSvc.getReport({ parameters, formatType: format })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

    }




    app.controller('modalArticuloMergeCtrl', modalArticuloMergeCtrl);

    modalArticuloMergeCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];
    function modalArticuloMergeCtrl($scope, $uibModalInstance, params) {
        let { data, idProveedor, infoTributaria, selected } = params

        $scope.selected = selected;
        $scope.articleSelected = data;
        console.log(params)

        $scope.articlesTemp = [];
        $scope.articleNotFound = false;

        $scope.idArticulo = 0;

        $scope.articleMergeSearch = {
            tipo: "D"
        };

        searchArticle();
        function searchArticle() {
            try {
                let jsonData = {
                    codigoPrincipal: $scope.articleSelected.codigoPrincipal,
                    codigoAuxiliar: $scope.articleSelected.codigoAuxiliar,
                    descripcion: $scope.articleSelected.descripcion
                }
                showLoader()
                docRecibidoSvc.searchArticle(jsonData).then(response => {
                    if (response.code == '1') {
                        $scope.articleNotFound = true;
                        $scope.articlesTemp = JSON.parse(response.payload)
                    } else {
                        $scope.articleNotFound = true;
                        tS.toastr('info', response.message)
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }


        $scope.addArticle = async function () {
            try {
                let dataNew = {
                    isImport: true,
                    idArticulo: 0,
                    idMedida: $scope.articleSelected.idMedida,
                    codigo: $scope.articleSelected.codigoPrincipal,
                    codigoAuxiliar: $scope.articleSelected.codigoAuxiliar,
                    descripcion: $scope.articleSelected.descripcion,
                    precioCosto: parseFloat($scope.articleSelected.costoNeto)
                }

                const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
                let ctrl = (await import(fileCtrl))[controllers['M']];
                let template = templates['M'];
                const modalDialogRef = modalSvc.openModalCustom({
                    controller: ctrl,
                    template,
                    size: 'xl',
                    params: dataNew,
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })

                modalDialogRef.result.then(response => {
                    if (typeof response !== 'object') return
                    if (!(response.idArticulo > 0)) return

                    $scope.idArticulo = response.idArticulo;
                    let codArticulo = $scope.articleSelected.codigoPrincipal ? $scope.articleSelected.codigoPrincipal : response.codigoPrincipal;
                    let articleToSave = {
                        idArticulo: $scope.idArticulo,
                        idMedida: response.idMedida,
                        codArticulo,
                        idProveedor: idProveedor,
                        ruc: infoTributaria.ruc
                    }
                    saveCH(articleToSave)
                })
            } catch (error) {
                console.log(error)
            }
        }


        function saveCH(item) {
            try {
                $scope.idArticulo = 0
                let data = {
                    idDetalle: $scope.articleSelected.idDetalle,
                    idDocumento: $scope.selected[0].idDocumento,
                    idMedida: item.idMedida,
                    idProveedor: idProveedor,
                    ruc: infoTributaria.ruc,
                    idArticulo: item.idArticulo,
                    codArticulo: (($scope.articleSelected.codigoPrincipal) ? $scope.articleSelected.codigoPrincipal : item.codigoPrincipal)
                }
                showLoader();
                docRecibidoSvc.saveCompraHabitual(data).then(response => {
                    if (response.code == '0') {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {
                        tS.toastr('success', response.message)
                        $uibModalInstance.close(data)
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }


        $scope.searchArticleMerge = function () {
            try {

                $scope.articlesTemp = []
                let tipo = $scope.articleMergeSearch.tipo
                if (!$scope.articleMergeSearch.textSearch) {
                    tS.toastr('warning', 'Ingrese un valor valido')
                    return
                }
                if ($scope.articleMergeSearch.textSearch.length < 3) {
                    tS.toastr('warning', 'Ingrese un mínimo tres caracteres')
                    return
                }
                let jsonData = {
                    isSearch: true,
                    codigoPrincipal: '',
                    codigoAuxiliar: '',
                    descripcion: $scope.articleMergeSearch.textSearch,
                    tipo
                }

                showLoader();
                docRecibidoSvc.searchArticle(jsonData).then(response => {
                    if (response.code === "0") {
                        hideLoader()
                        $scope.articleNotFound = true
                        tS.toastr('info', response.message)
                        return
                    }
                    if (response.code == '1') {
                        $scope.articleMergeSearch = {}
                        $scope.articleMergeSearch.tipo = tipo
                        $scope.articlesTemp = JSON.parse(response.payload)
                        $scope.articleNotFound = true
                    }
                })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                hideLoader()
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }


        $scope.askToSaveCH = function (item) {
            Swal.fire({
                title: '¿Está seguro/a de guardar este articulo existente como compra habitual?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    saveCH(item);
                }
            })
        }

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }
    }



    function getBarcode(item) {
        JsBarcode("#barcodeImg", item, {
            format: "CODE128",
            lineColor: "#000",
            width: 1,
            height: 40,
            displayValue: false
        })
    }

})(window.angular)
