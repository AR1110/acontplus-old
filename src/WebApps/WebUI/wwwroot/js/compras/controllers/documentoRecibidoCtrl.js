(
    function () {
        'use strict'



        app.controller('documentoRecibidoCtrl', documentoRecibidoCtrl)

        documentoRecibidoCtrl.$inject = ['$filter', '$scope', '$injector', '$q'];

        function documentoRecibidoCtrl($filter, $scope, $injector, $q) {
            const mS = $injector.get('mainService');
            const commonSvc = $injector.get('commonService');
            const docRecibidoSvc = $injector.get('docRecibidoService');
            const tS = $injector.get('toastService');
            const modalService = $injector.get('modalService');
            const nameModalConst = $injector.get('nombreModal');
            const nombreModalInventario = $injector.get('nombreModalInventario');
            const articuloSvc = $injector.get('articuloService');
            const proveedorSvc = $injector.get('proveedorService');

            const URL_TEMPLATE = '~/Pages/DocumentoRecibido/Shared/'

            $scope.title = 'documentoRecibidoCtrl';
            mS.detectDevice()

            $scope.compFounded = [];
            $scope.compToImport = [];


            $scope.comprobantes = [];
            $scope.idProveedor = 0;

            $scope.tiposDocumento = [];
            $scope.doc = {};

            $scope.tempDetail = [];
            $scope.fullComprobante = [];
            $scope.comprobante = {};
            $scope.infoComprobante = {};
            $scope.payments = [];
            $scope.totalTaxes = [];
            $scope.infoTributaria = {};
            $scope.infoAdicional = [];
            $scope.provCliente = {};


            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-dark btn-sm'
                },
                buttonsStyling: false,
            })

            // var start = moment().subtract(29, 'days')
            // var end = moment()

            let thisMoment = moment()
            let endOfMonth = moment(thisMoment).endOf('month')
            let startOfMonth = moment(thisMoment).startOf('month')
            //https://www.daterangepicker.com/
            $scope.dateRangePicker = {
                date: { startDate: startOfMonth, endDate: endOfMonth },
                picker: null,
                options: {
                    pickerClasses: 'custom-display', //angular-daterangepicker extra
                    buttonClasses: 'btn',
                    applyButtonClasses: 'btn-success',
                    cancelButtonClasses: 'btn-danger',
                    locale: {
                        applyLabel: "Aplicar",
                        cancelLabel: 'Cancelar',
                        customRangeLabel: 'Rango Personalizado',
                        separator: ' - ',
                        format: "YYYY-MM-DD", //will give you 2017-01-06
                        //format: "D-MMM-YY", //will give you 6-Jan-17
                        //format: "D-MMMM-YY", //will give you 6-January-17
                    },
                    ranges: {
                        'Hoy': [moment(), moment()],
                        'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                        'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                        'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                        'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                    },
                    eventHandlers: {
                        'apply.daterangepicker': function () {
                            $scope.getComprobantes()
                            //console.log('applied')
                        }
                    }
                }
            };

            //console.log(_urlService)

            $scope.selected = [];
            $scope.pages = [50, 100];
            $scope.query = {
                orderBy: '',
                sortBy: '',
                limit: 50,
                page: 1,
                codDoc: '',
                codEstab: '',
                startDate: '',
                endDate: '',
                rucProveedor: ''
            }

            $scope.getDocs = function (doc) {
                $scope.query.codDoc = doc.codigoSri
                $scope.getComprobantes()
            }
            function isDocVenta(codDoc) {
                switch (codDoc) {
                    case "01":
                        return true;
                    case "04":
                        return true;
                    case "07":
                        return true;
                    default:
                        return false
                }
            }

            $scope.getComprobantes = function () {
                try {
                    $scope.estabToWork = $scope.establecimientos.find(x => x.codEstab == $scope.query.codEstab).nombreComercial
                    $scope.comprobantes = []
                    $scope.query.startDate = $scope.dateRangePicker.date.startDate
                    $scope.query.endDate = $scope.dateRangePicker.date.endDate
                    //console.log($scope.query)

                    showLoader()
                    docRecibidoSvc.get($scope.query).then(response => {
                        $scope.comprobantes = response;
                        $scope.cloneComprobantes = JSON.parse(JSON.stringify($scope.comprobantes))
                        $scope.onKeyupSearchFilter();
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            }
            $scope.estabToWork = ""
            $scope.initialLoad = function () {
                commonSvc.getEstabAsign().then(response => {
                    $scope.establecimientos = response
                    let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0
                    $scope.query.codEstab = codEstab
                    $scope.estabToWork = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].nombreComercial : ""
                    $scope.getComprobantes()
                })
                try {
                    mS.getData('get', '/TipoDocumento/Get').then(
                        response => {
                            let tempDocs = JSON.parse(response.data)
                            for (const doc of tempDocs) {
                                if (isDocVenta(doc.codigoSri)) {
                                    $scope.tiposDocumento.push(doc)
                                }
                            }
                        }, error => {
                            console.log(error)
                        }
                    )

                } catch (error) {
                    console.log(error)
                }

            }
            $scope.initialLoad()

            $scope.onKeyupSearchFilter = () => {
                let comprobantes = JSON.parse(JSON.stringify($scope.cloneComprobantes))
                $scope.comprobantes = $filter("filter")(comprobantes, $scope.search)
            }

            // Para redondeo de los decimales en lo precios unitarios
            // const roundNumber = (number, max) => {
            //     let factor = Math.pow(10, max)
            //     let tempNumber = number * factor;
            //     let roundedTempNumber = Math.round(tempNumber)
            //     return roundedTempNumber / factor;
            // }



            /*
            $scope.setOrder = function (event) {
                let classOrder = event.target.className;
                let order = classOrder.substr(-3)
                let orderBy = order ? "ASC" : "DESC";;
                $scope.query.orderBy = orderBy;
            }*/
            $scope.onPaginate = function () {
                $scope.selected = [];
            }
            $scope.showOptions = function () {
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
                }).then(function () {
                    //console.log('Confirm')
                })



                if ($scope.selected[0].complete) {
                    document.getElementById("btnDelete").style.display = "none";
                }
                document.getElementById("btnImportar").onclick = function (event) {
                    $scope.getId()
                    Swal.close()
                    event.preventDefault()
                }
                document.getElementById("btnGetXml").onclick = function (event) {
                    $scope.putXml()
                    event.preventDefault()
                }
                document.getElementById("btnDelete").onclick = function (event) {
                    $scope.askToDelete()
                    event.preventDefault()
                }
                document.getElementById("btnDocRel").onclick = function (event) {
                    $scope.getMergedDocs()
                    event.preventDefault()
                }

                //Reporte 
                if ($scope.selected[0].codDoc !== '01') {
                    document.getElementById("btnReport").style.display = "none";
                } else {
                    document.getElementById("btnReport").onclick = function () {
                        $scope.getReport();
                    }
                }

            }

            $scope.selectImport = async () => {
                const inputOptions = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            '1': 'Automatica',
                            '2': 'Manual'
                        })
                    }, 1000)
                })

                const { value: tipo } = await Swal.fire({
                    title: 'Tipo de Importación',
                    input: 'radio',
                    inputOptions: inputOptions,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Debe seleccionar una opción!'
                        }
                    }
                })
                return tipo
            }
            $scope.tipoImportacion = 0
            $scope.askToNewImport = (item) => {
                if ($scope.establecimientos.length > 1) {
                    //$scope.tipoImportacion = await $scope.selectImport()

                    Swal.fire({
                        title: 'Estab.: ' + $scope.estabToWork,
                        text: "Esta seguro de realizar una nueva importación de comprobantes en este establecimiento?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, Proceder',
                        cancelButtonText: 'No, cancelar'
                    }).then(result => {
                        if (result.isConfirmed) {
                            $scope.newImport(item)
                        }
                    })

                } else {
                    //$scope.tipoImportacion = await $scope.selectImport()
                    $scope.newImport(item)
                }
            }

            $scope.newImport = (tipo) => {
                if (tipo == 1) {
                    tS.toastr('warning', 'Recuerde no haber modificado el archivo de texto descargado del SRI')
                    $('#newImportModal').modal('show')
                } else {
                    $('#modalNewManual').modal('show')
                }
            }
            $scope.mainform = {}
            $scope.mainform.option = false
            $scope.log = ''
            $scope.$watch('files', function () {
                $scope.uploadXml($scope.files);
            });
            $scope.$watch('file', function () {
                if ($scope.file != null) {
                    $scope.files = [$scope.file];
                }
            });
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
                var uploadPromises = [];
                angular.forEach(files, function (file) {
                    var uploadPromise = docRecibidoSvc.uploadXml({ codEstab: $scope.query.codEstab }, file).then(function (response) {
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
                        tS.toastr("danger", "Error al cargar el archivo: " + error)
                        //console.log('Error al cargar el archivo:', error);
                    });
                    uploadPromises.push(uploadPromise);
                });

                $q.all(uploadPromises)
                    .then(function () {
                        // Todas las peticiones se han completado con éxito
                        //tS.toastr("info", "Todas las peticiones se han completado")
                        //console.log('Todas las peticiones se han completado');
                    })
                    .catch(function () {
                        // Al menos una de las peticiones ha fallado
                        tS.toastr("danger", "Al menos una de las peticiones ha fallado")
                        //console.log('Al menos una de las peticiones ha fallado:', error);
                    });
            };
            // $scope.uploadXml = async (files) => {
            //     try {
            //         showLoader()
            //         if (files && files.length) {
            //             for (var i = 0; i < files.length; i++) {
            //                 var file = files[i];
            //                 if (!file.$error) {
            //                     await mS.getDataFile('DocumentoRecibido/UploadXml/?json=' + JSON.stringify({ codEstab: $scope.query.codEstab }), file, null, true).then(
            //                         response => {
            //                             if (response.code == 0) {
            //                                 tS.toastr('warning', response.message)
            //                             }
            //                             if (response.code == 1) {
            //                                 tS.toastr('success', response.message)
            //                                 $timeout(function () {
            //                                     $scope.log = 'file: ' +
            //                                         response.config.data.file.name +
            //                                         ', Response: ' + JSON.stringify(response.data) +
            //                                         '\n' + $scope.log;
            //                                 })
            //                             }
            //                         }, null, (evt) => {
            //                             var progressPercentage = parseInt(100.0 *
            //                                 evt.loaded / evt.total);
            //                             $scope.log = 'progress: ' + progressPercentage +
            //                                 '% ' + evt.config.data.file.name + '\n' +
            //                                 $scope.log;
            //                         }
            //                     ).catch(error => {
            //                         console.log(error)
            //                     })
            //                 }
            //             }
            //         }
            //     } catch (error) {
            //         console.log(error)
            //     } finally {
            //         hideLoader()
            //     }
            // }

            //Read File tXT 
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
                            $('#newImportModal').modal('hide');
                            $("#compFounded").modal('show');
                            hideLoader();
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    })
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

            //Guardar Documentos importados
            $scope.post = function () {

                let data = {
                    codEstab: $scope.query.codEstab,
                    comprobantes: $scope.compToImport
                }
                showLoader();
                docRecibidoSvc.post(data).then(
                    response => {
                        if (response.code == 0) {
                            tS.toastr('warning', response.message);
                        }
                        if (response.code == 1) {
                            $scope.getComprobantes()
                            if ($scope.tipoImportacion == 1) {
                                $("#compFounded").modal('hide')
                            } else {
                                $("#modalNewManual").modal('hide')
                            }

                            tS.toastr('success', response.message)
                        }
                    }
                ).catch(error => {
                    console.log(error);
                }).finally(() => hideLoader())

            }

            $scope.mergedDocs = []
            $scope.showOptionsMergeDoc = false;
            $scope.getMergedDocs = () => {

                try {
                    $scope.mergedDocs = []
                    let data = {
                        tipo: 3,
                        idDocumento: $scope.selected[0].idDocumento,
                        codDoc: $scope.selected[0].codDoc,
                        claveAcceso: $scope.selected[0].claveAcceso
                    }
                    showLoader();
                    docRecibidoSvc.get(data).then(response => {
                        let arrTemp = response;
                        $scope.mergedDocs = arrTemp;
                    }
                    ).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                    Swal.close()
                    $('#docRelModal').modal('show');
                } catch (error) {
                    console.log(error)
                }
            }

            $("#docRelModal").on('hide.bs.modal', () => {

            })

            $scope.putXml = function () {
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
                                $scope.askToUploadXml() //call to manual xml update
                            }
                        }
                    ).finally(() => hideLoader())

                } catch (e) {
                    hideLoader()
                    console.log(e)
                }
            }
            $scope.askToUploadXml = () => {
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
                    if (result.value) {
                        $('#xmlIndividualModal').modal('show')
                    }
                })
            }
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
                                $('#xmlIndividualModal').modal('hide')
                                tS.toastr('success', response.message)
                                $scope.showOptions()
                                return;
                            }
                        }
                    ).finally(() => hideLoader());
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.askToDelete = function () {
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

            $scope.delete = function (item) {
                try {
                    showLoader();
                    docRecibidoSvc.delete(item).then(
                        response => {
                            if (response.code == 0) {
                                tS.toastr('warning', response.message)
                                return;
                            }
                            if (response.code == 1) {
                                $scope.getComprobantes()
                                $('#newImportModal').modal('hide')
                                tS.toastr('success', response.message)
                            }
                        }
                    ).finally(() => hideLoader())
                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            }

            $scope.limitOptions = [50, 100];

            $scope.options = {
                rowSelection: true,
                multiSelect: true,
                autoSelect: true,
                decapitate: false,
                largeEditDialog: false,
                boundaryLinks: false,
                limitSelect: true,
                pageSelect: true
            };
            $scope.details = {
                limit: 5,
                page: 1
            };
            $scope.toggleLimitOptions = function () {
                $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
            };
            $scope.logPagination = function (page, limit) {
                console.log('page: ', page)
                console.log('limit: ', limit)
            }
            $scope.arraysForm = [];
            $scope.sustentos = [];
            $scope.tiemposCredito = [];
            $scope.categories = [];
            $scope.bodegas = [];
            $scope.medidas = [];
            $scope.getFormData = function () {
                try {
                    showLoader();
                    let params = { tipo: '1', codEstab: $scope.query.codEstab }
                    docRecibidoSvc.get(params).then(response => {
                        $scope.arraysForm = response;
                        $scope.sustentos = $scope.arraysForm[0];
                        $scope.tiemposCredito = $scope.arraysForm[1]
                        $scope.categories = $scope.arraysForm[2];
                        $scope.bodegas = $scope.arraysForm[3];
                        if ($scope.selectedEstab.codEstab) {
                            $scope.filterBodega()
                        }
                        $scope.medidas = $scope.arraysForm[4];
                        $scope.getProv()

                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())

                } catch (error) {
                    console.log(error)
                }
            }

            $scope.totalTaxesRide = {
                iva0: 0.00,
                noObjetoIva: 0.00,
                excentoIva: 0.00,
                ice: 0.00,
                iva12: 0.00,
                irbpnr: 0.00
            }
            $scope.getBarcode = function (item) {
                JsBarcode("#barcodeImg", item, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 1,
                    height: 40,
                    displayValue: false
                })
                // let barcodeData = $('#barcode').attr('src').replace(/^data:image\/[a-z]+;base64,/, "")
                //console.log(strImage)
                // return barcodeData;
            }
            $scope.totalTaxesRide.iva12 = 0.00
            $scope.totalTaxesRide.descuento = 0.00
            $scope.setTaxes = () => {
                // console.log($scope.totalTaxes)
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



                $scope.modalRef.rendered.then(() => {
                    $("#tbodyTaxes").html(trTaxes)
                    // const table = document.getElementById("tbdoyTaxes")
                    // table.innerHTML = trTaxes
                })

            }
            $scope.invoiceDetail = []
            $scope.getNotaCreditoDetalle = (item) => {
                try {
                    let data = {
                        tipo: 2,
                        claveAcceso: item
                    }
                    mS.getData('get', 'FacturaDetalle/' + JSON.stringify(data), null, true).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                $scope.invoiceDetail = JSON.parse(response.payload)
                            }
                        }
                    ).catch((error) => {
                        console.log(error)
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            $scope.selectedEstab = {}
            $scope.customDetailTemp = []
            $scope.getId = () => {
                try {
                    showLoader();
                    docRecibidoSvc.getId($scope.selected[0].idDocumento).then(response => {
                        if (!response.payload) {
                            tS.toastr('warning', "Aun no se actualizado el Xml del SRI")
                        } else {
                            $scope.selectedEstab.codEstab = $scope.query.codEstab
                            $scope.getFormData()
                            $scope.fullComprobante = response.payload;
                            //poner condicionales de acuerdo al tipo de documento
                            let codDoc = $scope.fullComprobante.infoTributaria.codDoc
                            $scope.infoTributaria = $scope.fullComprobante.infoTributaria
                            $scope.infoAdicional = $scope.fullComprobante.infoAdicional
                            $scope.getBarcode($scope.infoTributaria.claveAcceso)
                            let idDetalle = 0
                            switch (codDoc) {
                                case "01":
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
                                    $scope.getTempDetails()

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

                                    $scope.modalRef = modalService.openModalCustom({
                                        template: `${URL_TEMPLATE}_ModalComprobante.cshtml`,
                                        size: 'xl',
                                        windowClass: 'uibModalFullScreen',
                                        scope: $scope,
                                        isRenderRazorPartial: true
                                    })

                                    $scope.modalRef.result.then(() => {
                                        $scope.resetMainModal()
                                    })
                                    $scope.setTaxes()

                                    break;
                                case "04":
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
                                    $scope.getTempDetails()
                                    $scope.provCliente.razonSocial = $scope.infoTributaria.razonSocial
                                    $scope.provCliente.nombreComercial = $scope.infoTributaria.nombreComercial
                                    $scope.provCliente.ruc = $scope.infoTributaria.ruc
                                    $scope.provCliente.dirMatriz = $scope.infoTributaria.dirMatriz

                                    //Adding by Emilio Senguana 
                                    $scope.provCliente.isImport = true;

                                    $scope.modalRef = modalService.openModalCustom(
                                        {
                                            template: `${URL_TEMPLATE}_ModalComprobante.cshtml`,
                                            size: 'xl',
                                            windowClass: 'uibModalFullScreen',
                                            scope: $scope,
                                            isRenderRazorPartial: true
                                        })

                                    $scope.modalRef.result.then(() => {
                                        $scope.resetMainModal()
                                    })
                                    $scope.setTaxes()
                                    break;
                                case "07":
                                    $scope.infoCompRetencion = $scope.fullComprobante.infoCompRetencion
                                    $('#retencionModal').modal('show')
                                    break;
                                default:
                                    break;
                            }
                            /** Info Adicional */
                            // if ($scope.fullComprobante.infoAdicional) {
                            // }

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
            $scope.bodegasFiltered = []

            $scope.filterBodega = () => {
                $scope.bodegasFiltered = []
                for (let i = 0; i < $scope.bodegas.length; i++) {
                    if ($scope.selectedEstab.codEstab == $scope.bodegas[i].codEstab) {
                        $scope.bodegasFiltered.push($scope.bodegas[i])
                    }
                }
                // $scope.comprobanteForm.idBodega = $scope.bodegasFiltered[0].idBodega
                if ($scope.comprobanteForm.idBodega > 0) {
                    $scope.addBodega()
                }
            }
            /** Provedor */

            $scope.tipoProv = {}
            $scope.tipoEntidad = {}


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

            $scope.getProv = () => {
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

            $scope.btnProvIsEnable = false;
            $scope.resultModalProveedor = function (result) {
                if (typeof result === 'object' && result.idProveedor > 0) {
                    $scope.idProveedor = result.idProveedor
                    $scope.comprobanteForm.idTiempoCredito = result.idTiempoCredito
                    $scope.btnProvIsEnable = true
                }
            }

            /** Articulo Temp */

            $scope.articleFinded = {
                loading: 'Buscando...',
                descripcion: ''
            }

            $scope.searchArticleCustomDetail = (item) => {
                try {
                    let data = {
                        condicion: false,
                        busqueda: item
                    }
                    //Api Inventario
                    return articuloSvc.search(data)
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.clearSearch = () => {

            }

            $scope.selectArticleSearch = (item, itemDetail) => {
                try {
                    //Inventario 
                    showLoader();
                    articuloSvc.findById(item.idArticulo).then(response => {
                        $scope.articleFinded = { descripcion: '' }
                        const objArticle = response.data;
                        // $scope.customDetail.idArticulo = item.idArticulo
                        // $scope.customDetail.codigoPrincipal = objArticle.codigo
                        // $scope.customDetail.codigoAuxiliar = objArticle.codigoAuxiliar
                        // $scope.customDetail.descripcion = objArticle.descripcion
                        itemDetail.idArticulo = item.idArticulo
                        itemDetail.codigoPrincipal = objArticle.codigo
                        itemDetail.codigoAuxiliar = objArticle.codigoAuxiliar
                        itemDetail.descripcion = objArticle.descripcion;
                        itemDetail.datosAdicionales = objArticle.datosAdicionales;

                    }).catch((error) => {
                        console.log(error)
                    }).finally(() => hideLoader())
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.openModalNewArticle = async () => {

                let { MODAL_CTRL, MODAL_NUEVO_CSHTML } = nameModalConst.articulo;
                let { ModalArticuloCtrl } = await import('../../modal/' + MODAL_CTRL);

                let modalRef = modalService.openModalCustom({
                    controller: ModalArticuloCtrl,
                    template: 'Articulo/' + MODAL_NUEVO_CSHTML,
                    size: 'xl',
                })

                modalRef.result.then(response => {
                    if (typeof (response) == "object") {
                        $scope.idArticulo = response.idArticulo
                        $scope.selectArticleSearch(response)
                    }
                })
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


            $scope.datosAdicionalesArticulo = [];
            $scope.getTempDetails = function () {
                try {
                    $scope.tempDetail = []
                    mS.getData('get', 'Compra/Doc_Rec_DetailTemp/' + $scope.selected[0].idDocumento, null, true).then(
                        response => {
                            if (response.code == "1") {
                                let tempDetail = JSON.parse(response.payload);

                                $scope.tempDetail = tempDetail.map(item => {
                                    let tempEtiquetas = JSON.parse(item.etiquetas) || [];

                                    let etiquetasMapper = tempEtiquetas.map(etiquet => {
                                        return {
                                            ...etiquet,
                                            etiquetas: etiquet.etiquetas.split(';')
                                        }
                                    })

                                    return {
                                        ...item,
                                        etiquetas: etiquetasMapper
                                    }
                                })

                            }
                        }).catch(error => {
                            console.log(error)
                        })

                    if ($scope.selected[0].codDoc === '01') {
                        $scope.getDatoAdicionalArticulo();
                    }
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.getDatoAdicionalArticulo = function () {
                try {
                    mS.getData('get', 'Compra/DatoAdicionalArticulo/Get?json=' + JSON.stringify({
                        idDocumento: $scope.selected[0].idDocumento
                    }), null, true).then(response => {
                        if (response.code == '0') {
                            //console.log(response)
                        }
                        if (response.code == '1') {
                            let dtAdicional = JSON.parse(response.payload);
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

                console.log(datosAdicionales)

                mS.getData('post', `Compra/DatoAdicionalArticulo/Insert/${$scope.selected[0].idDocumento}/?json=${encodeURIComponent(JSON.stringify(datosAdicionales))}`, null, true).then(response => {
                    if (response.code === '0') {
                        tS.toastr('warning', response.message);
                    }
                    if (response.code === '1') {
                        tS.toastr('success', response.message);
                        let dtAdicional = JSON.parse(response.payload);

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
                //console.log(item)
            }

            $scope.saveArticleTemp = function (tipo, data) {
                try {
                    let method = '';
                    if (tipo == 1) {
                        method = "post"
                    } else {
                        method = "put"
                    }
                    mS.getData(method, "Compra/Doc_Rec_DetailTemp/", { data: data }, true).then(
                        response => {
                            if (response.code == '1') {
                                $scope.tempDetail = []
                                $scope.showFormCustomDetails = false
                                $scope.customDetailTemp = []
                                tS.toastr('success', response.message)

                                $scope.getTempDetails();
                                // $scope.tempDetail = JSON.parse(response.payload)
                                // console.log($scope.tempDetail)
                            } else {
                                tS.toastr('warning', response.message)
                            }
                        }
                    ).catch(error => {
                        console.log(error)
                    })
                } catch (error) {
                    console.log(error)
                }
            }

            /** End Articulo Temp */

            /** Articulo */
            $scope.articleSelected = {};
            $scope.openMerge = function (item) {
                if ($scope.idProveedor > 0) {
                    $scope.articleSelected = item
                    // if (!item.idMedida || item.idMedida == 0) {
                    //     Swal.fire({ title: 'Aviso', text: 'Debe Seleccionar una medida', icon: 'warning' })
                    //     return
                    // }
                    $scope.searchArticle()

                    $scope.modalRefArtMerg = modalService.openModalCustom({
                        template: `${URL_TEMPLATE}_ModalArticuloMerge.cshtml`,
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                        scope: $scope,
                        isRenderRazorPartial: true
                    })

                    $scope.modalRefArtMerg.result.then(() => {

                    })

                } else {
                    Swal.fire({ title: 'Aviso', text: 'Aun no ha guardado el proveedor', icon: 'warning' })
                }
            }
            $scope.idArticulo = 0;
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
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params: dataNew,
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })
                    modalDialogRef.result.then(response => {
                        if (typeof (response) == "object") {
                            $scope.idArticulo = response.idArticulo
                            if ($scope.idArticulo > 0) {
                                let articleToSave = {
                                    idArticulo: $scope.idArticulo,
                                    idMedida: response.idMedida,
                                    codArticulo: (($scope.articleSelected.codigoPrincipal) ? $scope.articleSelected.codigoPrincipal : response.codigoPrincipal),
                                    idProveedor: $scope.idProveedor,
                                    ruc: $scope.infoTributaria.ruc
                                }
                                $scope.saveCH(articleToSave)
                            }
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.articlesTemp = [];
            $scope.articleNotFound = false;
            $scope.searchArticle = function () {
                try {
                    $scope.articlesTemp = [];
                    showLoader()
                    let jsonData = {
                        codigoPrincipal: $scope.articleSelected.codigoPrincipal,
                        codigoAuxiliar: $scope.articleSelected.codigoAuxiliar,
                        descripcion: $scope.articleSelected.descripcion
                    }
                    mS.getData('get', 'Recepcion/Articulo/?json=' + encodeURIComponent(JSON.stringify(jsonData)), null, true).then(
                        response => {
                            if (response.code == '1') {
                                $scope.articleNotFound = true;
                                $scope.articlesTemp = JSON.parse(response.payload)
                            } else {
                                $scope.articleNotFound = true;
                                tS.toastr('info', response.message)
                            }
                        }, error => {
                            hideLoader()
                            console.log(error)
                        }
                    )
                    hideLoader()
                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            }

            $scope.articleMergeSearch = {}
            $scope.articleMergeSearch.tipo = "D"
            $scope.searchArticleMerge = function () {
                try {
                    showLoader()
                    $scope.articlesTemp = []
                    let tipo = $scope.articleMergeSearch.tipo
                    if (!$scope.articleMergeSearch.textSearch) {
                        hideLoader()
                        tS.toastr('warning', 'Ingrese un valor valido')
                        return
                    }
                    if ($scope.articleMergeSearch.textSearch.length < 3) {
                        hideLoader()
                        tS.toastr('warning', 'Ingrese un mínimo tres caracteres')
                        return
                    }
                    let jsonData = {
                        isSearch: true,
                        codigoPrincipal: '',
                        codigoAuxiliar: '',
                        descripcion: $scope.articleMergeSearch.textSearch,
                        tipo: tipo
                    }
                    //Recepcion/Articulo
                    mS.getData('get', 'Recepcion/Articulo/?json=' + encodeURIComponent(JSON.stringify(jsonData)), null, true).then(
                        response => {
                            if (response.code == '1') {
                                // if ($scope.articleNotFound) {
                                //     $scope.articleNotFound = false
                                // }
                                hideLoader()
                                $scope.articleMergeSearch = {}
                                $scope.articleMergeSearch.tipo = tipo
                                $scope.articlesTemp = JSON.parse(response.payload)
                                $scope.articleNotFound = true
                            } else {
                                hideLoader()
                                $scope.articleNotFound = true
                                tS.toastr('info', response.message)
                            }
                        }, error => {
                            hideLoader()
                            console.log(error)
                        }
                    )
                    hideLoader()
                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            }

            $scope.articleHistory = []
            $scope.getArticleHistory = (item) => {
                try {
                    showLoader()
                    $scope.articleHistory = []
                    $scope.articleName = item.descripcion
                    let data = {
                        id: item.idArticulo,
                        tipo: 'H'
                    }
                    mS.getData('get', 'Recepcion/Articulo/?json=' + JSON.stringify(data), null, true).then(
                        response => {
                            if (response.code == '1') {
                                $scope.articleHistory = JSON.parse(response.payload)
                                $scope.modalRefArticleHistory = modalService.openModalCustom({
                                    template: `${URL_TEMPLATE}_ArticleHistory.cshtml`,
                                    size: 'xl',
                                    windowClass: 'uibModalFullScreen',
                                    scope: $scope,
                                    isRenderRazorPartial: true
                                }
                                )

                            } else {
                                tS.toastr('info', "Aun no existen ingresos de este articulo.")
                            }
                            hideLoader()
                        }, error => {
                            hideLoader()
                            console.log(error)
                        }
                    )
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.addBodega = () => {
                try {
                    if ($scope.comprobanteForm.idBodega) {
                        let data = {
                            todos: true,
                            idDocumento: $scope.selected[0].idDocumento,
                            idBodega: $scope.comprobanteForm.idBodega
                        }
                        $scope.saveArticleTemp(3, data)
                    }
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.updateSizeArticles = (item) => {
                try {
                    console.log(item)
                    let data = {
                        todos: true,
                        idDocumento: $scope.selected[0].idDocumento,
                        idMedida: item
                    }
                    $scope.saveArticleTemp(2, data)
                } catch (error) {
                    console.log(error)
                }
            }
            $scope.updateArticleTemp = (item) => {
                if ($scope.idProveedor > 0 && item.idArticulo > 0) {
                    let data = {
                        idDocumento: $scope.selected[0].idDocumento,
                        idMedida: item.idMedida,
                        idProveedor: $scope.idProveedor,
                        ruc: $scope.infoTributaria.ruc,
                        idArticulo: item.idArticulo,
                        codArticulo: item.codigoPrincipal,
                        idDetalle: item.idDetalle
                    }
                    $scope.saveArticleTemp(2, data)
                }
                else {
                    //tS.toastr('warning', 'Primero debe guardar el proveedor y el articulo')
                }
            }

            /** End Articulo **/

            /** Compra Habitual **/
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
                        $scope.saveCH(item)
                    }
                })
            }


            $scope.saveCH = function (item) {

                try {
                    showLoader()
                    $scope.idArticulo = 0
                    let data = {
                        idDetalle: $scope.articleSelected.idDetalle,
                        idDocumento: $scope.selected[0].idDocumento,
                        idMedida: item.idMedida,
                        idProveedor: $scope.idProveedor,
                        ruc: $scope.infoTributaria.ruc,
                        idArticulo: item.idArticulo,
                        codArticulo: (($scope.articleSelected.codigoPrincipal) ? $scope.articleSelected.codigoPrincipal : item.codigoPrincipal)
                    }
                    mS.getData('post', 'Compra/CompraHabitual/Post', { data: data }, true).then(
                        response => {
                            if (response.code == '0') {
                                hideLoader()
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                hideLoader()
                                $scope.saveArticleTemp(2, data)
                                $scope.modalRefArtMerg.close()
                                tS.toastr('success', response.message)
                            }
                        }, error => {
                            hideLoader()
                            console.log(error)
                        }
                    )
                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            };

            $scope.getArticleHC = async (result) => {
                try {
                    if (typeof result === 'object') {
                        $scope.getTempDetails()
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            /** End Compra Habitual **/

            /** Comprobante */
            $scope.customDetail = [];
            $scope.showFormCustomDetails = false;
            $scope.askToAddCustomDetails = function (event) {
                Swal.fire({
                    title: 'Detalles personalizados',
                    text: "¿Está seguro/a de cambiar los detalles de este comprobante?'",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si!',
                    cancelButtonText: 'No',
                    allowOutsideClick: false
                }).then((result) => {
                    event.stopPropagation()
                    if (result.value) {
                        $scope.tempDetail = []
                        $scope.showFormCustomDetails = true
                        // $scope.customDetail.cantidad = 1
                        // $scope.customDetail.precioUnitario = $scope.infoComprobante.totalSinImpuestos
                        // $scope.customDetail.descuento = 0.00 //$scope.infoComprobante.totalDescuento
                        // $scope.customDetail.total = $scope.infoComprobante.importeTotal
                        $scope.$digest()
                    }
                })
            }
            $scope.addCustomDetail = function () {
                if ($scope.tempDetail.length > 0) {
                    for (const t of $scope.tempDetail) {
                        if (t.idArticulo === $scope.customDetail.idArticulo) {
                            tS.toastr('warning', 'Articulo existente')
                            return
                        }
                    }
                }

                angular.forEach($scope.customDetailTemp, (value) => {
                    //console.log(key, value)
                    if (!value.codigoPrincipal) {
                        tS.toastr('warning', 'Por favor ingrese un código')
                        return;
                    }
                    if (!value.descripcion) {
                        tS.toastr('warning', 'Por favor ingrese una descripción')
                        return;
                    }
                    if (!value.precioUnitario || value.precioUnitario == 0) {
                        tS.toastr('warning', 'Por favor ingrese un precio unitario valido')
                    }
                })
                // if (!$scope.customDetail.cantidad || $scope.customDetail.cantidad == 0) {
                //     tS.toastr('warning', 'Por favor ingrese una cantidad valida')
                //     return;
                // }
                // if (!$scope.customDetail.codigoPrincipal) {
                //     tS.toastr('warning', 'Por favor ingrese un código')
                //     return;
                // }
                // if (!$scope.customDetail.descripcion) {
                //     tS.toastr('warning', 'Por favor ingrese una descripción')
                //     return;
                // }
                // if (!$scope.customDetail.precioUnitario || $scope.customDetail.precioUnitario == 0) {
                //     tS.toastr('warning', 'Por favor ingrese un precio unitario valido')
                //     return;
                // }

                // $scope.tempDetail.push({
                //     idDocumento: $scope.selected[0].idDocumento,
                //     idArticulo: $scope.customDetail.idArticulo,
                //     cantidad: $scope.customDetail.cantidad,
                //     codigoPrincipal: $scope.customDetail.codigoPrincipal,
                //     codigoAuxiliar: $scope.customDetail.codigoAuxiliar,
                //     descripcion: $scope.customDetail.descripcion,
                //     precioUnitario: $scope.customDetail.precioUnitario,
                //     descuento: $scope.customDetail.descuento,
                //     total: $scope.customDetail.total
                // })

                //let totalCustomDetails = 0.00;
                //angular.forEach($scope.tempDetail, function (value, key) {
                //    totalCustomDetails += value.total;
                //})
                //console.log(totalCustomDetails)
                //if (totalCustomDetails != $scope.infoComprobante.importeTotal) {
                //    tS.toastr('warning', 'El total de los detalles no debe ser diferente al del comprobante')
                //    return;
                //}

                $scope.saveArticleTemp(1, $scope.customDetailTemp)
            }
            $scope.cancelCustomDetails = function () {
                $scope.showFormCustomDetails = false;
            }
            $scope.comprobanteForm = {}

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
                        $scope.addStock(item)
                    }
                })
            }

            $scope.addStock = (item) => {
                try {
                    if ($scope.tempDetail.some(item => (["", 0, null, undefined, "0"].includes(item.idBodega)))) {
                        tS.toastr('warning', 'Agregue la bodega a los Artículos')
                        return
                    }
                    mS.getData('post', 'Compra/DocumentoDetalle/' + $scope.selected[0].idDocumento + '/' + item.idArticulo, null, true).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                $scope.getTempDetails()
                                tS.toastr('success', response.message)
                            }
                        }
                    ).catch(error => {
                        console.log(error)
                    })
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
                    if (result.value) {
                        $scope.deleteStock(item)
                    }
                })
            }

            $scope.deleteStock = (item) => {
                try {
                    mS.getData('delete', 'Compra/DocumentoDetalle/' + item.idDocumentoDetalle, null, true).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                $scope.getTempDetails()
                                tS.toastr('success', response.message)
                            }
                        }
                    ).catch(error => {
                        console.log(error)
                    })
                } catch (error) {
                    console.log(error)
                }
            }

            $scope.detailValid = () => {
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
                if ($scope.detailValid()) {
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
                        if (result.value) {
                            $scope.saveComp()
                        }
                    })
                }
            }

            $scope.saveComp = () => {
                try {
                    if ($scope.selected[0].complete) {
                        tS.toastr('warning', 'Imposible guardar, este documento ya fue modificado!')
                        return
                    }
                    showLoader()
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

                    mS.getData('post', url, null, true).then(response => {
                        if (response.code == '0') {
                            tS.toastr('warning', response.message)
                        }
                        if (response.code == "1") {
                            $scope.initialLoad()
                            $scope.comprobanteForm = {}
                            $scope.idProveedor = 0
                            $scope.modalRef.close()
                            tS.toastr("success", response.message)
                        }
                        hideLoader()
                    }).catch(error => {
                        hideLoader()
                        console.log(error)
                    })
                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            }

            /** End Comprobante */

            $scope.resetMainModal = () => {
                $scope.showFormCustomDetails = false
                $scope.customDetailTemp = [];
                $scope.comprobanteForm.idBodega = 0;
            }

            $scope.closeMainModal = () => {
                $scope.fullComprobante = ''
                $scope.customDetailTemp = []
                $scope.modalRef.close()
            }
            //**Config */



            const COD_REPORTS = {
                "07": 'RCR',
                '01': 'RFC'
            }
            $scope.getReport = () => {
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

            $scope.refresh = () => {
                // $scope.proveedorFiltro = null
                // $scope.query.rucProveedor = ''
                $scope.getComprobantes()
            }

            $scope.onKeyupProvedorAutocompleteFiltro = function () {
                if (!$scope.proveedorFiltro.nombreFiscal) {
                    $scope.proveedorFiltro = null
                    $scope.query.rucProveedor = ''
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
         
            $scope.selectProveedorFiltro = (item) => {
                $scope.query.rucProveedor = item.proveedor.numeroIdentificacion
                $scope.getComprobantes()
            }

            $scope.comprobantesTempToMigrate = []
            $scope.comprobantesToMigrate = []
            $scope.establecimientosToMigrate = []
            $scope.openMigrate = () => {
                if ($scope.comprobantes.length == 0) {
                    tS.toastr('warning', 'No se encontraron registros para migrar')
                    return
                }
                for (const c of $scope.comprobantes) {
                    if (!c.complete) {
                        $scope.comprobantesTempToMigrate.push(c)
                    }
                }
                for (const e of $scope.establecimientos) {
                    if (e.codEstab != $scope.query.codEstab) {
                        $scope.establecimientosToMigrate.push(e)
                    }
                }
                $('#migrateEstabModal').modal('show')
                //tS.toastr('info', 'Gracias por su comprensión!', 'Funcionalidad en construcción')
            }
            $scope.migrate = {}
            $scope.askToMigrate = () => {

                if (!$scope.migrate.codEstab) {
                    tS.toastr("warning", 'Por favor seleccione el establecimiento de destino')
                    return
                }
                if ($scope.query.codEstab === $scope.migrate.codEstab) {
                    tS.toastr("warning", 'El establecimiento de destino, no puede ser el mismo al de origen')
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
                        $scope.migrate();
                    }
                })
            }

            $scope.migrate = () => {
                try {
                    let data = { codEstab: $scope.migrate.codEstab, jsonData: $scope.comprobantesToMigrate };
                    showLoader();
                    docRecibidoSvc.migrate(data).then(response => {
                        if (response.code == '0') {
                            tS.toastr('warning', response.message)
                        }
                        if (response.code == "1") {
                            $scope.initialLoad()
                            $('#migrateEstabModal').modal('hide')
                            tS.toastr("success", response.message)
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
                } catch (error) {
                    hideLoader()
                    console.log(error)
                }
            }

            $('#compFounded').on('hidden.bs.modal', () => {
                $scope.compToImport = []
                $scope.compFounded = []
            })
            $('#modalNewManual').on('hidden.bs.modal', () => {
                $scope.compToImport = []
                $scope.files = []
            })
            $('#migrateEstabModal').on('hidden.bs.modal', () => {
                $scope.comprobantesTempToMigrate = []
                $scope.comprobantesToMigrate = []
                $scope.establecimientosToMigrate = []
            })
        }

    }

)(window.angular)
