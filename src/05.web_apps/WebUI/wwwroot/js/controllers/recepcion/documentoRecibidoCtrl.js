app.controller('documentoRecibidoCtrl', documentoRecibidoCtrl);

documentoRecibidoCtrl.$inject = [
    '$filter',
    '$scope',
    'mainService',
    'commonService',
    'toastService',
    'modalService',
    'nombreModal',
    'uuid2'
];

function documentoRecibidoCtrl(
    $filter,
    $scope,
    mS,
    _commonSvc,
    tS,
    modalService,
    nameModalConst,
    uuid2
    ) {

    'use strict';
    $scope.title = 'documentoRecibidoCtrl';
    $scope.comprobantes = [];
    $scope.totalRecords = 0;
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

    $scope.isMobile = true;

    //DETECT MOBILE DEVICE
    $scope.detectMobilDevice = function () {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            Swal.fire(
                'Dispositivo Movil Detectado!',
                'Para una mejor comodidad, le recomendamos usar una Laptop o PC.',
                'success'
            )
        } else {
            $scope.isMobile = false
        }
    }
    $scope.detectMobilDevice()

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-dark btn-sm'
        },
        buttonsStyling: false,
    });

    // var start = moment().subtract(29, 'days');
    // var end = moment();

    let thisMoment = moment();
    let endOfMonth = moment(thisMoment).endOf('month');
    let startOfMonth = moment(thisMoment).startOf('month');
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
                'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                'Ultimos 30 Días': [moment().subtract(29, 'days'), moment()]
            },
            eventHandlers: {
                'apply.daterangepicker': function (event, picker) {
                    $scope.getComprobantes()
                    console.log('applied')
                }
            }
        }
    };
    // console.log(jwtDecoded)

    const _urlService = document.getElementById("urlGateway").value + 'api/'

    //console.log(_urlService)

    $scope.selected = [];
    $scope.pages = [50, 100];
    $scope.query = {
        orderBy: '',
        sortBy: '',
        limit: 50,
        page: 1,
        codDoc: '',
        startDate: '',
        endDate: ''
    };
    $scope.getDocs = function (doc) {
        $scope.query.codDoc = $scope.doc.codigoSri;
        $scope.getComprobantes();
        debugger;
        console.log(doc);
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
            $scope.comprobantes = [];
            showLoader();
            $scope.query.startDate = $scope.dateRangePicker.date.startDate
            $scope.query.endDate = $scope.dateRangePicker.date.endDate
            console.log($scope.query)
            mS.getData('get', _urlService + 'DocumentoRecibido/Get/' + JSON.stringify($scope.query)).then(response => {
                if (response.code == "1") {
                    $scope.comprobantes = JSON.parse(response.payload)[0];

                    console.log($scope.comprobantes);

                    $scope.cloneComprobantes = JSON.parse(JSON.stringify($scope.comprobantes))
                    //$scope.totalRecords = $scope.comprobantes[0].totalRecords;
                }
                
            }, error => {
                if (error.data) {
                    tS.toastr('error', error.data.message)
                }
                console.log(error.data)
            })
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }

    $scope.initialLoad = function () {
        $scope.getComprobantes();
        try {
            mS.getData('get', '/TipoDocumento/Get').then(
                response => {
                    let tempDocs = JSON.parse(response.data)
                    for (const doc of tempDocs) {
                        if (isDocVenta(doc.codigoSri)) {
                            $scope.tiposDocumento.push(doc);
                        }
                    }
                    if (!$scope.isMobile) {
                        document.getElementById('menu_toggle').click();
                    }
                }, error => {
                    console.log(error);
                }
            ) 

            
        } catch (error) {
            console.log(error);
        }


        //Configuracion de Decimal 
        _commonSvc.getGestionConfig().then(
            response => {
                $scope.decimal = response[1][0];
            }
        )
            
    }

    $scope.onKeyupSearchFilter = () => {
        let comprobantes = JSON.parse(JSON.stringify($scope.cloneComprobantes));
        $scope.comprobantes = $filter("filter")(comprobantes, $scope.search);
    }

    // Para redondeo de los decimales en lo precios unitarios
    const roundNumber = (number, max) => {
        let factor = Math.pow(10, max);
        let tempNumber = number * factor;
        let roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    }


    $scope.initialLoad();

    /*
    $scope.setOrder = function (event) {
        let classOrder = event.target.className;
        let order = classOrder.substr(-3);
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
                    <div class="btn btn-group btn-group-sm" role="group">
                        <button type="button" id="btnImportar" class="btn btn-info btn-sm" title="Importar Comprobante"><i class="ti-upload"></i> Visualizar</button>
                        <button type="button" id="btnGetXml" class="btn btn-success btn-sm" title="Actualizar Xml Sri"><i class="ti-download"></i> Actualizar Xml</button>
                        <button type="button" id="btnDelete" class="btn btn-danger btn-sm" title="Eliminar"><i class="ti-trash"></i> Eliminar</button>
                    </div>`,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        }).then(function () {
            console.log('Confirm');
        });
        //if ($scope.selected[0].hasXml) {
        //    document.getElementById("btnGetXml").style.display = "none";
        //}
        if ($scope.selected[0].complete) {
            document.getElementById("btnDelete").style.display = "none";
        }
        document.getElementById("btnImportar").onclick = function (event) {
            // if ($scope.selected[0].comprobante != 'Factura') {
            //     Swal.fire({ title: "Info", text: "Documento aun no disponible, para importar" })
            //     return
            // }
            $scope.getId();
            Swal.close();
            event.preventDefault();
        }

        document.getElementById("btnGetXml").onclick = function (event) {
            $scope.putXml();
            event.preventDefault();
        };
        document.getElementById("btnDelete").onclick = function (event) {
            $scope.askToDelete();
            event.preventDefault();
        };
    }

    $scope.newImport = function () {
        tS.toastr('warning', 'Recuerde no haber modificado el archivo de texto descargado del SRI');
        $('#newImportModal').modal('show');
    }

    $scope.post = function () {
        try {
            showLoader();
            let file = $scope.fileTxt;
            if (file === null || file === undefined) {
                hideLoader();
                alert('No ha seleccionado ningun archivo');
                return;
            }
            mS.getDataFile(_urlService + 'DocumentoRecibido', file).then(
                response => {
                    if (response.code == 0) {
                        hideLoader();
                        tS.toastr('warning', response.message);
                        return;
                    }
                    if (response.code == 1) {
                        $scope.getComprobantes();
                        $('#newImportModal').modal('hide');
                        tS.toastr('success', response.message);
                        $scope.fileTxt = '';
                    }
                }, error => {
                    hideLoader();
                    console.log(error);
                }
            );
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }

    $scope.putXml = function () {
        try {
            showLoader();
            mS.getData('put', _urlService + 'DocumentoRecibido/Put/' + $scope.selected[0].idDocumento).then(
                response => {
                    hideLoader();
                    if (response.code == 0) {
                        hideLoader();
                        tS.toastr('warning', response.message)
                        return;
                    }
                    if (response.code == 1) {
                        hideLoader();
                        tS.toastr('success', response.message)
                        return;
                    }
                    if (response.code == 2) {
                        $scope.askToUploadXml() //call to manual xml update
                    }
                    hideLoader();
                }
            );

        } catch (e) {
            hideLoader();
            console.log(e);
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
        });
    }
    $scope.putXmlManual = () => {
        try {
            let file = $scope.fileXml;
            if (file === null || file === undefined) {
                hideLoader();
                alert('No ha seleccionado ningun archivo');
                return;
            }
            console.log(file)
            mS.getDataFile(_urlService + 'DocumentoRecibido/' + $scope.selected[0].idDocumento + '/' + $scope.selected[0].claveAcceso, file).then(
                response => {
                    hideLoader();
                    if (response.code == 0) {
                        hideLoader();
                        tS.toastr('warning', response.message)
                        return;
                    }
                    if (response.code == 1) {
                        hideLoader();
                        $('#xmlIndividualModal').modal('hide')
                        tS.toastr('success', response.message)
                        $scope.showOptions()
                        return;
                    }
                    hideLoader();
                }
            );
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
                $scope.delete($scope.itemToDelete.idDocumento);
            }
        });
    }

    $scope.delete = function (item) {
        try {
            showLoader();
            mS.getData('delete', _urlService + 'DocumentoRecibido/' + item).then(
                response => {
                    if (response.code == 0) {
                        hideLoader();
                        tS.toastr('warning', response.message);
                        return;
                    }
                    if (response.code == 1) {
                        hideLoader();
                        $scope.getComprobantes();
                        $('#newImportModal').modal('hide');
                        tS.toastr('success', response.message);
                    }
                }
            );
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error);
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
        console.log('page: ', page);
        console.log('limit: ', limit);
    }
    $scope.arraysForm = [];
    $scope.sustentos = [];
    $scope.tiemposCredito = [];
    $scope.categories = [];
    $scope.bodegas = [];
    $scope.medidas = [];
    $scope.getFormData = function () {
        try {
            mS.getData('get', _urlService + 'DocumentoRecibido/Get/' + JSON.stringify({ tipo: '1' })).then(
                response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message);
                    }
                    if (response.code == "1") {
                        $scope.arraysForm = JSON.parse(response.payload);
                        $scope.sustentos = $scope.arraysForm[0];

                        $scope.tiemposCredito = $scope.arraysForm[1]
                        // for (const tc of tempCredito) {
                        //     if (!tc.gestion) {
                        //         $scope.tiemposCredito.push(tc)
                        //     }
                        // }

                        $scope.categories = $scope.arraysForm[2];
                        $scope.bodegas = $scope.arraysForm[3];
                        $scope.medidas = $scope.arraysForm[4];
                        $scope.getProv();
                    }
                }, error => {
                    console.log(error);
                });

        } catch (error) {
            console.log(error);
        }
    }

    $scope.impuestos = []
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
        });
        // let barcodeData = $('#barcode').attr('src').replace(/^data:image\/[a-z]+;base64,/, "")
        //console.log(strImage);
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

        trTaxes += `<tr><td class="text-right"><strong>Descuento</strong></td>`
        trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.totalDescuento).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`

        trTaxes += `<tr><td class="text-right"><strong>Propina</strong></td>`
        trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.propina).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`

        trTaxes += `<tr><td class="text-right"><strong>Importe Total</strong></td>`
        trTaxes += `<td class="text-right"> ${parseFloat($scope.infoComprobante.importeTotal).toLocaleString('en', { style: 'currency', currency: 'USD' })} </td></tr>`


        $scope.modalRef.rendered.then(res => {
            $("#tbodyTaxes").html(trTaxes)
            // const table = document.getElementById("tbdoyTaxes");
            // table.innerHTML = trTaxes
        })

    }
    $scope.customDetailTemp = []
    $scope.getId = () => {
        try {
            showLoader();
            mS.getData('get', _urlService + 'DocumentoRecibido/GetId/' + $scope.selected[0].idDocumento).then(response => {
                if (!response.payload) {
                    tS.toastr('warning', "Aun no se actualizado el Xml del SRI");
                } else {
                    $scope.getFormData();
                    $scope.fullComprobante = response.payload;
                    console.log($scope.fullComprobante)
                    //poner condicionales de acuerdo al tipo de documento
                    let codDoc = $scope.fullComprobante.infoTributaria.codDoc
                    $scope.infoTributaria = $scope.fullComprobante.infoTributaria
                    $scope.infoAdicional = $scope.fullComprobante.infoAdicional
                    $scope.getBarcode($scope.infoTributaria.claveAcceso)
                    console.log($scope.infoTributaria);
                    switch (codDoc) {
                        case "01":

                            $scope.infoComprobante = $scope.fullComprobante.infoFactura;
                            // console.log($scope.infoComprobante);

                            $scope.totalTaxes = $scope.fullComprobante.infoFactura.totalImpuestos;
                            let idDetalle = 0
                            for (const det of $scope.totalTaxes) {
                                // if (det.codigo == '2' && (det.codigoPorcentaje == '2')) {

                                // }
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
                            console.log($scope.totalTaxes)
                            console.log($scope.customDetailTemp)
                            $scope.getTempDetails();

                            // $scope.tempDetail = $scope.fullComprobante.detalles;
                            // console.log($scope.fullComprobante.detalles);

                            for (const tax of $scope.fullComprobante.detalles) {
                                $scope.impuestos.push(tax.impuestos)
                            }
                            // console.log($scope.impuestos);
                            /** End details */

                            /** Formas de Pago */
                            $scope.payments = $scope.fullComprobante.infoFactura.pagos
                            // console.log($scope.payments);
                            /** End formas de pago */


                            /** End Info Adicional */
                            $scope.provCliente.razonSocial = $scope.infoTributaria.razonSocial
                            $scope.provCliente.nombreComercial = $scope.infoTributaria.nombreComercial
                            $scope.provCliente.ruc = $scope.infoTributaria.ruc
                            $scope.provCliente.dirMatriz = $scope.infoTributaria.dirMatriz

                            $scope.modalRef = modalService.openModalSecond(null, 'DocumentoRecibido/_ModalComprobante.cshtml', 'xl', null, true, 'uibModalFullScreen', $scope)

                            $scope.modalRef.result.then(res => {
                                $scope.resetMainModal()
                            })
                            $scope.setTaxes()

                            break;
                        case "04":
                            $scope.infoNotaCredito = $scope.fullComprobante.infoNotaCredito
                            $scope.totalTaxes = $scope.fullComprobante.infoNotaCredito.totalImpuestos;
                            //$scope.setTaxes()
                            $('#notaCreditoModal').modal('show')
                            // console.log($scope.comprobante);
                            break;
                        case "07":
                            $scope.infoCompRetencion = $scope.fullComprobante.infoCompRetencion
                            console.log($scope.infoRetencion);
                            $('#retencionModal').modal('show')
                            break;
                        default:
                            break;
                    }
                    /** Info Adicional */
                    if ($scope.fullComprobante.infoAdicional) {
                        console.log($scope.fullComprobante.infoAdicional);
                    }
                }
                hideLoader();
            }, error => {
                hideLoader();
                console.log(error);
            })
        } catch (error) {
            hideLoader();
            console.log(error)
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
            mS.getData('get', _urlService + 'Proveedor/' + JSON.stringify({ tipo: 1, ruc: $scope.infoTributaria.ruc })).then(
                response => {
                    if (response.code == "0") {
                        $scope.txtIconModalProv = 'ti-plus';
                        $scope.txtTitleModalProv = 'Registrar Proveedor';
                        $scope.txtBtnProv = 'Guardar';
                        handleBtnProv(2);
                    }
                    if (response.code == "1") {
                        let respArray = JSON.parse(response.payload)
                        $scope.idProveedor = respArray[0][0].idProveedor
                        $scope.comprobanteForm.idTiempoCredito = respArray[0][0].idTiempoCredito
                        $scope.txtBtnProv = 'Actualizar'
                        handleBtnProv(1);
                    }
                }, error => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }
    $scope.arraysProvClient = [];
    $scope.addProvClient = function () {
        try {
            mS.getData('get', _urlService + 'Proveedor/' + JSON.stringify({ tipo: 2 })).then(
                response => {
                    $scope.arraysProvClient = JSON.parse(response.payload);
                    $scope.tiposIdentificacion = $scope.arraysProvClient[0]
                    $scope.tiposProveedor = $scope.arraysProvClient[1];
                    $scope.tiposEntidad = $scope.arraysProvClient[2];
                    $scope.contribuyentes = $scope.arraysProvClient[3];
                    $scope.tiemposCredito = $scope.arraysProvClient[4];
                    $scope.ciudades = $scope.arraysProvClient[5];

                    $scope.provCliente.idTipoEntidad = 7
                    $scope.provCliente.idTipoClienteProveedor = 2
                    for (const element of $scope.tiposIdentificacion) {
                        if ($scope.provCliente.ruc.length == 10 && element.codigoSri == "05") {
                            $scope.provCliente.idTipoIdentificacion = element.idTipoIdentificacion;
                            console.log('yes');
                        }
                        if ($scope.provCliente.ruc.length == 13 && element.codigoSri == "04") {
                            $scope.provCliente.idTipoIdentificacion = element.idTipoIdentificacion;
                            console.log('yes');
                        }
                    }
                    if ($scope.provCliente.ruc.length < 10 || $scope.provCliente > 13) {
                        document.getElementById('idTipoIdentificacionProv').removeAttribute('disabled');
                    }
                    console.log($scope.arraysProvClient);
                    $scope.modalRefProv = modalService.openModalSecond(null, 'DocumentoRecibido/_CompImpProveedor.cshtml', 'xl', null, true, 'uibModalFullScreen', $scope)

                    $scope.modalRefProv.result.then(res => {

                    })
                }, error => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }

    let warningFrmProv = false
    $scope.validateFrmProv = function () {
        try {
            warningFrmProv = false
            if (!$scope.provCliente.idTipoClienteProveedor) {
                tS.toastr('warning', 'Seleccione un tipo de proveedor');
                warningFrmProv = true;
            }
            if (!$scope.provCliente.idTipoEntidad) {
                tS.toastr('warning', 'Seleccione un tipo de entidad');
                warningFrmProv = true;
            }
            if (!$scope.provCliente.idSubContribuyente) {
                tS.toastr('warning', 'Seleccione un contribuyente');
                warningFrmProv = true;
            }
            if (!$scope.provCliente.razonSocial) {
                tS.toastr('warning', 'La razón social no puede estar vacia');
                warningFrmProv = true;
            }
            if (!document.getElementById('idTipoIdentificacionProv').value) {
                tS.toastr('warning', 'El no puede estar vacio');
                warningFrmProv = true;
            }
            if (!$scope.provCliente.ruc) {
                tS.toastr('warning', 'El no puede estar vacio');
                warningFrmProv = true;
            }
            if (!$scope.provCliente.dirMatriz) {
                tS.toastr('warning', 'La dirección no puede estar vacia');
                warningFrmProv = true;
            }
        } catch (error) {
            console.log(error);
        }

    }
    $scope.btnProvIsEnable = false;
    $scope.saveProv = function () {
        try {
            // $scope.provCliente.idCiudad = $scope.ciudadProv.idCiudad;
            $scope.provCliente.idCiudad = 0;
            $scope.validateFrmProv();
            if (warningFrmProv) {
                return;
            }
            showLoader();
            mS.getData('post', _urlService + 'Proveedor?json=' + JSON.stringify($scope.provCliente)).then(
                response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == "1") {
                        let arrayResp = JSON.parse(response.payload)
                        $scope.idProveedor = arrayResp[0].idProveedor
                        $scope.comprobanteForm.idTiempoCredito = arrayResp[0].idTiempoCredito
                        $scope.btnProvIsEnable = true
                        $scope.modalRefProv.close()
                        tS.toastr('success', 'Proveedor guardado exitosamente');
                    }
                    hideLoader();
                }, error => {
                    hideLoader();
                    console.log(error);
                });
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }
    /** End Proveedor */

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
            return mS.getData('get', '/Articulo/Search?json=' + JSON.stringify(data)).then(
                response => {
                    return JSON.parse(response.data)
                }
                , error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    $scope.clearSearch = () => {

    }

    $scope.selectArticleSearch = (item, itemDetail) => {
        try {
            mS.getData('get', '/Articulo/GetId?id=' + item.idArticulo).then(
                response => {
                    if (response.id == "1") {
                        $scope.articleFinded = { descripcion: '' }
                        const results = JSON.parse(response.payload)
                        const objArticle = results[0][0]
                        // $scope.customDetail.idArticulo = item.idArticulo
                        // $scope.customDetail.codigoPrincipal = objArticle.codigo
                        // $scope.customDetail.codigoAuxiliar = objArticle.codigoAuxiliar
                        // $scope.customDetail.descripcion = objArticle.descripcion
                        itemDetail.idArticulo = item.idArticulo
                        itemDetail.codigoPrincipal = objArticle.codigo
                        itemDetail.codigoAuxiliar = objArticle.codigoAuxiliar
                        itemDetail.descripcion = objArticle.descripcion
                    }
                }
                , error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    $scope.openModalNewArticle = async (event) => {

        const { articulo } = nameModalConst;
        const { ModalArticuloCtrl } = await import('../../modal/' + articulo.MODAL_CTRL)
        const modalRef = modalService.openModalSecond(ModalArticuloCtrl, 'Articulo/' + articulo.MODAL_NUEVO_CSHTML, 'xl')
        modalRef.result.then(response => {
            if (typeof (response) == "object") {
                $scope.idArticulo = response.idArticulo
                $scope.selectArticleSearch(response)
            }
        });
    }

    $scope.getTempDetails = function () {
        try {
            mS.getData('get', _urlService + 'Doc_Rec_DetailTemp/' + $scope.selected[0].idDocumento).then(
                response => {
                    if (response.code == "1") {
                        $scope.tempDetail = JSON.parse(response.payload);
                    }
                }
                , error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    $scope.saveArticleTemp = function (tipo, data) {
        try {
            let method = '', url = ''
            if (tipo == 1) {
                method = "post"
                url = _urlService + "Doc_Rec_DetailTemp?json="
            } else {
                method = "put"
                url = _urlService + "Doc_Rec_DetailTemp?json="
            }
            mS.getData(method, url + JSON.stringify(data)).then(
                response => {
                    if (response.code == '1') {
                        $scope.tempDetail = []
                        $scope.showFormCustomDetails = false
                        $scope.customDetailTemp = []
                        tS.toastr('success', response.message)
                        $scope.tempDetail = JSON.parse(response.payload)
                    } else {
                        tS.toastr('warning', response.message)
                    }
                }, error => {
                    console.log(error)
                }
            )
        } catch (error) {
            console.log(error);
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

            $scope.modalRefArtMerg = modalService.openModalSecond(null, 'DocumentoRecibido/_ModalArticuloMerge.cshtml', 'xl', null, true, 'uibModalFullScreen', $scope)

            $scope.modalRefArtMerg.result.then(res => {

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

            const { articulo } = nameModalConst;
            const { ModalArticuloCtrl } = await import('../../modal/' + articulo.MODAL_CTRL)
            const modalRef = modalService.openModalSecond(ModalArticuloCtrl, 'Articulo/' + articulo.MODAL_NUEVO_CSHTML, 'xl', dataNew)
            modalRef.result.then(response => {
                if (typeof (response) == "object") {
                    $scope.idArticulo = response.idArticulo;

                    //Ivan estoy modificando tu Còdigo 


                    if ($scope.idArticulo > 0) {
                        let articleToSave = {
                            idArticulo: $scope.idArticulo,
                            //idMedida: $scope.articleSelected.idMedida,
                            idMedida: response.idMedida,
                            codArticulo: $scope.articleSelected.codigoPrincipal,
                            idProveedor: $scope.idProveedor,
                            ruc: $scope.infoTributaria.ruc
                        }
                        $scope.saveCH(articleToSave)
                    }
                }
            });
        } catch (error) {
            console.log(error);
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
            mS.getData('get', _urlService + 'Articulo?json=' + JSON.stringify(jsonData)).then(
                response => {
                    if (response.code == '1') {
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
            mS.getData('get', _urlService + 'Articulo?json=' + JSON.stringify(jsonData)).then(
                response => {
                    if (response.code == '1') {
                        // if ($scope.articleNotFound) {
                        //     $scope.articleNotFound = false
                        // }
                        hideLoader()
                        $scope.articleMergeSearch = {}
                        $scope.articleMergeSearch.tipo = tipo
                        $scope.articlesTemp = JSON.parse(response.payload)
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
            mS.getData('get', _urlService + 'Articulo?json=' + JSON.stringify(data)).then(
                response => {
                    if (response.code == '1') {
                        $scope.articleHistory = JSON.parse(response.payload)
                        $scope.modalRefArticleHistory = modalService.openModalSecond(null, 'DocumentoRecibido/_ArticleHistory.cshtml', 'xl', null, true, 'uibModalFullScreen', $scope)

                        $scope.modalRefArticleHistory.result.then(res => {

                        })

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
                $scope.saveCH(item);
            }
        })
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
                codArticulo: item.codigoPrincipal
            }
            $scope.saveArticleTemp(2, data)
        }
        else {
            //tS.toastr('warning', 'Primero debe guardar el proveedor y el articulo')
        }
    }

    $scope.saveCH = function (item) {

        try {
            showLoader()
            $scope.idArticulo = 0
            let data = {
                idDocumento: $scope.selected[0].idDocumento,
                // idMedida: $scope.articleSelected.idMedida,
                idMedida: item.idMedida,
                idProveedor: $scope.idProveedor,
                ruc: $scope.infoTributaria.ruc,
                idArticulo: item.idArticulo,
                codArticulo: $scope.articleSelected.codigoPrincipal
            }
            mS.getData('post', '/CompraHabitual/Post?json=' + JSON.stringify(data)).then(
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
                    console.log(error);
                }
            )
        } catch (error) {
            hideLoader()
            console.log(error)
        }
    };

    $scope.historyComprasArticle = []
    $scope.getArticleHC = (item) => {
        try {
            $scope.articleName = item.descripcion
            mS.getData('get', '/CompraHabitual/Get?json=' + JSON.stringify({ tipo: 3, idArticulo: item.idArticulo })).then(
                response => {
                    if (!response.payload) {
                        tS.toastr('warning', 'Este articulo aun no tiene registros de compra habitual')
                    } else {
                        $scope.historyComprasArticle = JSON.parse(response.payload)
                        $scope.modalRefAHC = modalService.openModalSecond(null, 'DocumentoRecibido/_HistoryCompras.cshtml', 'xl', null, true, 'uibModalFullScreen', $scope)
                        $scope.modalRefAHC.result.then(res => { })
                    }
                }, error => {
                    console.log(error)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    $scope.askToDeleteCH = function (item) {
        Swal.fire({
            title: '¿Está seguro/a de desvincular este articulo de compras habituales?',
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
                $scope.deleteCH(item);
            }
        })
    }
    $scope.deleteCH = (item) => {
        try {
            mS.getData('delete', '/CompraHabitual/Delete?id=' + item.idDocumentoraHabitual).then(
                response => {
                    if (response.code == '0') {
                        tS.toastr('warning', response.message)
                        return
                    }
                    if (response.code == '1') {
                        let index = $scope.historyComprasArticle.indexOf(item)
                        $scope.historyComprasArticle.splice(index, 1)
                        tS.toastr('success', response.message)
                    }
                }, error => {
                    console.log(error)
                }
            )
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
            event.stopPropagation();
            if (result.value) {
                $scope.tempDetail = []
                $scope.showFormCustomDetails = true
                // $scope.customDetail.cantidad = 1
                // $scope.customDetail.precioUnitario = $scope.infoComprobante.totalSinImpuestos
                // $scope.customDetail.descuento = 0.00 //$scope.infoComprobante.totalDescuento
                // $scope.customDetail.total = $scope.infoComprobante.importeTotal
                $scope.$digest();
            }
        })
    }
    $scope.addCustomDetail = function () {
        if ($scope.tempDetail.length > 0) {
            for (const t of $scope.tempDetail) {
                if (t.idArticulo === $scope.customDetail.idArticulo) {
                    tS.toastr('warning', 'Articulo existente');
                    return
                }
            }
        }

        angular.forEach($scope.customDetailTemp, (value, key) => {
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
        //     tS.toastr('warning', 'Por favor ingrese una cantidad valida');
        //     return;
        // }
        // if (!$scope.customDetail.codigoPrincipal) {
        //     tS.toastr('warning', 'Por favor ingrese un código');
        //     return;
        // }
        // if (!$scope.customDetail.descripcion) {
        //     tS.toastr('warning', 'Por favor ingrese una descripción');
        //     return;
        // }
        // if (!$scope.customDetail.precioUnitario || $scope.customDetail.precioUnitario == 0) {
        //     tS.toastr('warning', 'Por favor ingrese un precio unitario valido');
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
        //console.log(totalCustomDetails);
        //if (totalCustomDetails != $scope.infoComprobante.importeTotal) {
        //    tS.toastr('warning', 'El total de los detalles no debe ser diferente al del comprobante');
        //    return;
        //}

        $scope.saveArticleTemp(1, $scope.customDetailTemp)
    }
    $scope.cancelCustomDetails = function () {
        $scope.showFormCustomDetails = false;
    }
    $scope.comprobanteForm = {}
    $scope.askToSave = () => {
        if ($scope.idProveedor < 1) {
            tS.toastr('warning', 'Primero debe Guardar el proveedor')
            return
        }
        if (!$scope.comprobanteForm.idSustentoTributario) {
            tS.toastr('warning', 'Seleccione el sustento tributario')
            return
        }
        if (!$scope.comprobanteForm.idCategoria) {
            tS.toastr('warning', 'Seleccione una categoría')
            return
        }
        if (!$scope.comprobanteForm.idTiempoCredito) {
            tS.toastr('warning', 'Seleccione el tiempo de crédito')
            return
        }

        if ($scope.tempDetail.some(item => (["", 0, null, undefined, "0"].includes(item.idMedida)))) {
            tS.toastr('warning', 'Agregue la medida a los Artículos')
            return
        }

        Swal.fire({
            title: '',
            text: "¿Está seguro/a de guardar este comprobante'",
            icon: 'warning',
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

    $scope.saveComp = () => {
        try {
            if ($scope.selected[0].complete) {
                tS.toastr('warning', 'Imposible guardar, este documento ya fue modificado!')
                return
            }
            showLoader()
            let data = {
                idDocumento: $scope.selected[0].idDocumento,
                secuencial: $scope.infoTributaria.secuencial,
                estab: $scope.infoTributaria.estab,
                ptoEmi: $scope.infoTributaria.ptoEmi,
                claveAcceso: $scope.selected[0].claveAcceso,
                fechaEmision: $scope.infoComprobante.fechaEmision,
                codDoc: $scope.infoTributaria.codDoc,
                idSustentoTributario: Number($scope.comprobanteForm.idSustentoTributario),
                idProveedor: Number($scope.idProveedor),
                idCategoriaCompra: Number($scope.comprobanteForm.idCategoria),
                idBodega: Number($scope.comprobanteForm.idBodega),
                idTiempoCredito: Number($scope.comprobanteForm.idTiempoCredito),
                totalSinImpuestos: parseFloat($scope.infoComprobante.totalSinImpuestos),
                totalDescuento: 0.00,// parseFloat($scope.infoComprobante.totalDescuento),
                propina: $scope.infoComprobante.propina,
                importeTotal: parseFloat($scope.infoComprobante.importeTotal),
                observacion: $scope.comprobanteForm.observacion,
                payments: JSON.stringify($scope.payments)

            }
            console.log(data)
            mS.getData('post', _urlService + 'Factura?json=' + JSON.stringify(data)).then(response => {
                if (response.code == '0') {
                    tS.toastr('warning', response.message)
                }
                if (response.code == "1") {
                    $scope.initialLoad()
                    $scope.comprobanteForm = {}
                    $scope.modalRef.close()
                    tS.toastr("success", response.message)
                }
                hideLoader()
            }, error => {
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
        $scope.customDetailTemp = []
    }

    $scope.closeMainModal = () => {
        $scope.fullComprobante = ''
        $scope.customDetailTemp = []
        $scope.modalRef.close()
    }
    //**Config */



    const COD_REPORTS = {
        "07": 'RCR'
    }
    $scope.getReport = () => {
        try {
            let format = 'pdf';
            let dataParms = {                
                id: 142,                            
                codigo: COD_REPORTS['07'],
                format,            
            }
       
            const parameters = {               
                dataParams: JSON.stringify(dataParms)
            }
            console.log(parameters)
            _commonSvc.getReportDynamic({
                parameters, 
                format
            })     
        } catch (error) {
            console.log(error)
        }
    }

}