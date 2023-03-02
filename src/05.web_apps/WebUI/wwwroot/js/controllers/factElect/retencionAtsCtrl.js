(function () {
    'use strict';

    app.controller('retencionAtsCtrl', retencionAtsCtrl);

    retencionAtsCtrl.$inject = ['$scope', 'mainService', 'toastService', '$element', '$cookies', 'uuid2', '$window', 'FileSaver', 'Blob'];

    function retencionAtsCtrl($scope, mS, tS, $element, $cookies, uuid2, $window, FileSaver, Blob) {
        /**Initial Load */

        $scope.genericAnswer = [{ codigo: 'SI' }, { codigo: 'NO' }]

        $scope.infoCompRet = {}
        $scope.infoCompRet.parteRel = 'NO'
        $scope.tiposIdentificacion = []
        $scope.tiposSujRetenido = []
        $scope.docSustento = {}
        $scope.docSustento.pagoLocExt = '01'
        $scope.documentos = []
        $scope.sustentos = []
        $scope.sustentosFiltered = []
        $scope.tiposPago = []
        $scope.tiposRegimenFE = []
        $scope.paises = []
        $scope.paraisosFiscales = []

        $scope.impuestos = []
        $scope.tarifasImp = []
        $scope.impuestosRet = []
        $scope.porcentajesRetIva = []
        $scope.codigosRetencion = []
        $scope.formasPago = []

        $scope.establecimientos = []
        $scope.puntosEmisionTemp = []

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
                $scope.isMobile = false;
            }
        }
        $scope.detectMobilDevice();
        function formatDateTimeZone(fecha) {
            const formatDateMoment = moment.tz(fecha, "America/Guayaquil")
            return formatDateMoment.format("YYYY-MM-DD");
        }
        const getUTCDate = (date) => {
            const d = new Date(date);
            const utcDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
            return utcDate;
        }

        function formatDate(fecha) {
            let _getFecha = new Date(fecha)
            //let _getFecha = getUTCDate(fecha)
            _getFecha.setMinutes(_getFecha.getMinutes() + _getFecha.getTimezoneOffset());
            return _getFecha;
        }

        const idDocumentoElectronico = document.getElementById("idDocumentoElectronico").value
        //console.log(idDocumentoElectronico)
        const _urlService = document.getElementById("urlGateway").value + 'api/'

        $scope.retencionesTemp = []

        $scope.initialLoad = () => {
            try {
                let token = $cookies.get('ck_token')
                if (!token) {
                    let expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.put('ck_token', uuid2.newguid(), { expires: expireDate });
                    console.log($cookies.get('ck_token'))
                }
                //console.log($cookies.get('ck_token'))
                let data = { tipo: 1 }
                mS.getData('get', _urlService + 'RetencionAts/' + JSON.stringify(data)).then(
                    response => {
                        if (response.code == '1') {
                            let tempArray = JSON.parse(response.payload)
                            $scope.tiposIdentificacion = tempArray[0]
                            $scope.tiposSujRetenido = tempArray[1]
                            $scope.documentos = tempArray[2]
                            $scope.sustentos = tempArray[3]
                            $scope.tiposPago = tempArray[4]
                            $scope.tiposRegimenFE = tempArray[5]
                            $scope.paises = tempArray[6]
                            $scope.paraisosFiscales = tempArray[7]
                            $scope.impuestos = tempArray[8]
                            $scope.tarifasImp = tempArray[9]
                            $scope.impuestosRet = tempArray[10]
                            $scope.porcentajesRetIva = tempArray[11]
                            $scope.codigosRetencion = tempArray[12]
                            $scope.formasPago = tempArray[13]
                            $scope.establecimientos = tempArray[14]
                            $scope.puntosEmisionTemp = tempArray[15]
                            $scope.infoCompRet.fechaEmision = new Date()
                            $scope.getPeriod(null, new Date())
                            //Only if is new
                            if (!idDocumentoElectronico) {
                                $scope.infoCompRet.codEstab_Asig = $scope.establecimientos.find(item => item.predeterminado).codEstab_Asig
                                $scope.onChangeEstablecimiento()
                            }
                            //console.log(tempArray)
                        }
                        if (!$scope.isMobile) {
                            document.getElementById('menu_toggle').click();
                        };
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
        //FOR EDIT
        if (idDocumentoElectronico) {
            try {
                showLoader()
                let data = { tipo: 2, idDoc: idDocumentoElectronico }
                mS.getData('get', _urlService + 'RetencionAts/' + JSON.stringify(data)).then(
                    response => {
                        let tempArray = JSON.parse(response.payload)
                        console.log('this is for edit')
                        console.log(tempArray)
                        $scope.initialLoad()
                        setTimeout(() => {
                            $scope.infoCompRet = tempArray[0][0]
                            $scope.infoCompRet.fechaEmision = formatDate(tempArray[0][0].fechaEmision)
                            $scope.infoCompRet.codEstab_Asig = $scope.establecimientos.find(item => (item.codEstab == $scope.infoCompRet.codEstab)).codEstab_Asig
                            $scope.onChangeEstablecimiento()
                            $scope.subContribuyente = tempArray[0].subContribuyente

                            $scope.tempTaxes = tempArray[2]
                            $scope.retencionesTemp = tempArray[3]
                            $scope.paymentsTemp = tempArray[4]
                            let totalDocsSust = 0
                            for (const d of tempArray[1]) {
                                $scope.docSustento = d
                                $scope.selectSutento($scope.docSustento.codDocSustento)
                                $scope.addDocSustento(false)
                                totalDocsSust++
                            }
                            if (tempArray[1].length == totalDocsSust) {
                                $scope.tempTaxes = []
                                $scope.retencionesTemp = []
                                $scope.paymentsTemp = []
                            }
                            $scope.infoAdded = tempArray[5]
                            hideLoader()
                            $scope.$apply()
                        }, 2000)


                    }, error => {
                        console.log(error)
                    }
                )

            } catch (error) {
                console.log(error)
            }
        } else {
            $scope.initialLoad()
        }


        /**End Initial Load */

        /**Info Comp Retencion */

        $scope.getPeriod = (item = null, aut = null) => {
            let date = aut ? aut : item.infoCompRet.fechaEmision
            let month = ('0' + (date.getMonth() + 1)).slice(-2);
            let year = date.getFullYear();
            $scope.infoCompRet.periodoFiscal = month.toString() + '/' + year.toString()
        }



        $scope.enableTipoSujRet = (item) => {
            console.log(item)
        }

        $scope.isNotForeign = true

        $scope.showTipoSujetoRetenido = (codDoc) => {
            switch (codDoc) {
                case "06":
                    $scope.isNotForeign = false
                    break
                case "08":
                    $scope.isNotForeign = false
                    break
                default:
                    $scope.isNotForeign = true
                    break
            }
            $scope.infoCompRet.razonSocialSujetoRetenido = ''
            $scope.infoCompRet.identificacionSujetoRetenido = ''
        }




        $scope.onChangeEstablecimiento = () => {
            $scope.puntosEmision = []
            $scope.infoCompRet.ptoEmi = ''
            $scope.puntosEmision = $scope.puntosEmisionTemp.filter(item => (item.codEstab_Asig === $scope.infoCompRet.codEstab_Asig))
            $scope.infoCompRet.ptoEmi = $scope.puntosEmision.find(item => item.predeterminado).ptoEmi
            let temp = $scope.establecimientos.find(item => (item.codEstab_Asig === $scope.infoCompRet.codEstab_Asig))
            $scope.infoCompRet.codEstab = temp.codEstab
            $scope.infoCompRet.estab = temp.estab
            $scope.infoCompRet.dirEstablecimiento = temp.dirEstablecimiento
            $scope.infoCompRet.contribuyenteEspecial = temp.contribuyenteEspecial
            $scope.infoCompRet.obligadoContabilidad = temp.obligadoContabilidad
            $scope.infoCompRet.dirEstablecimiento = temp.dirEstablecimiento
            console.log($scope.puntosEmision)
            console.log($scope.infoCompRet)
        }

        /**End Info Comp Retencion */

        /** Proveedor*/
        $scope.proveedores = []
        $scope.selectSujetoRetenido = (item, fromModal = null) => {
            $scope.infoCompRet.tipoIdentificacionSujetoRetenido = item.tipoIdentificacion
            $scope.infoCompRet.razonSocialSujetoRetenido = item.razonSocial
            $scope.infoCompRet.identificacionSujetoRetenido = item.numeroIdentificacion
            $scope.subContribuyente = item.subContribuyente
            if (fromModal) {
                $('#searchProvModal').modal('hide')
            }
        }
        $scope.getProveedor = (item) => {
            try {
                $scope.proveedores = []

                if (item == 1 && !$scope.infoCompRet.razonSocialSujetoRetenido) {
                    tS.toastr('warning', 'Ingresa un texto de busqueda correcto')
                    return
                }
                if (item == 1 && $scope.infoCompRet.razonSocialSujetoRetenido.length < 3) {
                    tS.toastr('warning', 'Ingresa al menos tres caracteres de busqueda')
                    return
                }
                if (item == 2 && !$scope.infoCompRet.identificacionSujetoRetenido) {
                    tS.toastr('warning', 'Ingresa un texto de busqueda correcto')
                    return
                }
                if (!item && $scope.infoCompRet.razonSocialSujetoRetenido) {
                    item = 1
                }
                if (!item && $scope.infoCompRet.identificacionSujetoRetenido) {
                    item = 2
                }
                let json = {
                    tipo: '2',
                    textSearch: (item == 1 ? $scope.infoCompRet.razonSocialSujetoRetenido : $scope.infoCompRet.identificacionSujetoRetenido)
                }
                console.log($scope.infoCompRet)

                console.log(item)
                console.log(json)
                mS.getData('get', '/Proveedor/Get?json=' + JSON.stringify(json)).then(
                    response => {
                        if (response.code == '0') {
                            if (item == 2) {
                                $scope.infoCompRet.identificacionSujetoRetenido = ''
                            }
                            tS.toastr('warning', response.message)
                        }
                        if (response.code == '1') {
                            $scope.proveedores = JSON.parse(response.payload)
                            if ($scope.proveedores.length == 1) {
                                $scope.selectSujetoRetenido($scope.proveedores[0], false)
                            }
                            else {
                                $('#searchProvModal').modal('show')
                            }
                            //console.log($scope.proveedores)
                        }
                    }, error => {
                        console.log(error)
                    }
                )

            } catch (error) {
                console.log(error)
            }
        }
        /** End Proveedor */

        /**Documentos de Sustento */
        /****************************************************************************** */
        $scope.docsFounded = []
        $scope.searchDocs = () => {
            try {
                showLoader()
                let json = {
                    tipo: '7',
                    textSearch: $scope.infoCompRet.identificacionSujetoRetenido
                }
                mS.getData('get', '/FacturaCompra/Get?json=' + JSON.stringify(json)).then(
                    response => {
                        if (response.code == '0') {
                            tS.toastr('warning', response.message)
                        }
                        if (response.code == '1') {
                            $scope.docsFounded = JSON.parse(response.payload)
                            $('#docsModal').modal('show')
                            console.log($scope.docsFounded)
                        }
                        hideLoader()
                    }, error => {
                        hideLoader()
                        console.log(error)
                    }
                )
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }
        $scope.tempTaxes = []
        $scope.paymentsTemp = []
        $scope.totalSinImpuestos = 0.00
        $scope.selectDoc = (item) => {
            try {
                showLoader()
                let json = {
                    tipo: '3',
                    id: item.id
                }
                mS.getData('get', '/FacturaCompra/Get?json=' + JSON.stringify(json)).then(
                    response => {
                        if (response.code == '0') {
                            tS.toastr('warning', response.message)
                        }
                        if (response.code == '1') {
                            let temp = JSON.parse(response.payload)
                            if (temp) {
                                $scope.docData = JSON.parse(temp[0].doc)[0]
                                $scope.tempTaxes = JSON.parse(temp[0].taxes)
                                $scope.paymentsTemp = JSON.parse(temp[0].payments)
                                console.log($scope.docData)

                                console.log($scope.tempTaxes)
                                console.log($scope.paymentsTemp)
                                $scope.totalSinImpuestos = $scope.docData.totalSinImpuestos
                                $scope.docSustento.codDocSustento = $scope.docData.codDocSustento
                                $scope.selectSutento($scope.docSustento.codDocSustento)
                                $scope.docSustento.numDocSustento = $scope.docData.numDocSustento.split('-').join('')
                                $scope.docSustento.fechaEmisionDocSustento = formatDate($scope.docData.fechaEmisionDocSustento)
                                $scope.docSustento.numAutDocSustento = $scope.docData.numAutDocSustento
                            } else {
                                tS.toastr('warning', 'Impuestos no encontrados')
                            }
                            $('#docsModal').modal('hide')
                            console.log(temp[0].doc)
                        }
                        hideLoader()
                    }, error => {
                        hideLoader()
                        console.log(error)
                    }
                )

            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }

        $scope.docPreview = (item) => {
            try {
                if (!item) {
                    tS.toastr('warning', 'Este documento no ha sido registrado desde el modulo de recepcion de documentos')
                    return
                }
                mS.getData('get', _urlService + 'DocumentoRecibido/Preview/' + item).then(
                    response => {
                        $('#facturaModal').modal('show')
                        $('#bodyFactura').html(response.payload)
                        console.log(response)
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }

        /**Validations */

        $scope.validateDocSust = () => {
            if (!$scope.docSustento.codDocSustento) {
                tS.toastr('warning', 'Debe seleccionar un documento de sustento')
                $scope.docSustIsValid = false
            }
            if (!$scope.docSustento.codSustento && $scope.sustentosFiltered.length > 0) {
                tS.toastr('warning', 'Debe seleccionar un sustento tributario')
                $scope.docSustIsValid = false
            }
            if ($scope.docSustento.numDocSustento && $scope.docSustento.numDocSustento.length < 15) {
                tS.toastr('warning', 'El número del documento debe completar 15 caracteres')
                $scope.docSustIsValid = false
            }
            if (!$scope.docSustento.fechaEmisionDocSustento) {
                tS.toastr('warning', 'Debe ingresar la fecha de emisión del documento de sustento')
                $scope.docSustIsValid = false
            }
            if (!$scope.docSustento.pagoLocExt) {
                tS.toastr('warning', 'Debe seleccionar el tipo de pago local o exterior')
                $scope.docSustIsValid = false
            }
            if ($scope.docSustento.pagoLocExt == '02' && !$scope.docSustento.paisEfecPago) {
                tS.toastr('warning', 'Debe seleccionar el país donde se efectua el pago')
                $scope.docSustIsValid = false
            }
            if ($scope.docSustento.pagoLocExt == '02' && !$scope.docSustento.aplicConvDobTrib) {
                tS.toastr('warning', 'Debe seleccionar aplica convenio doble tributación')
                $scope.docSustIsValid = false
            }
            if ($scope.docSustento.aplicConvDobTrib == 'NO' && !$scope.docSustento.pagExtSujRetNorLeg) {
                tS.toastr('warning', 'Debe seleccionar el pago al exterior del sujeto retenido')
                $scope.docSustIsValid = false
            }
            if ($scope.docSustento.pagoLocExt == '02' && !$scope.docSustento.pagoRegFis) {
                tS.toastr('warning', 'Debe seleccionar el pago de regimen fiscal')
                $scope.docSustIsValid = false
            }
            return true
        }

        /**End Validations */
        $scope.selectSutento = (item) => {
            $scope.sustentosFiltered = []
            for (const sustento of $scope.sustentos) {
                if (sustento.codDocSustento == item) {
                    $scope.sustentosFiltered.push(sustento)
                }
            }
            if ($scope.sustentosFiltered.lenth == 0) {
                $scope.docSustento.codSustento = '00'
                $scope.sustentosFiltered.push({ codSustento: '00', descripcion: 'ninguno' })
            }
        }

        $scope.isPagoResidente = true

        $scope.enableControls = (item) => {
            $scope.isPagoResidente = item == "02" ? false : true
        }
        $scope.countries = []
        $scope.getCountries = (item) => {
            $scope.countries = []
            switch (item) {
                case "02":
                    for (const country of $scope.paraisosFiscales) {
                        $scope.countries.push(country)
                    }
                    break;
                case "03":
                    for (const country of $scope.paises) {
                        if (country.codigo != "593") {
                            $scope.countries.push(country)
                        }
                    }
                    break;
                default:
                    for (const country of $scope.paises) {
                        $scope.countries.push(country)
                    }
                    break;
            }
        }

        $scope.docSustento = {}
        $scope.docsAdded = []
        $scope.addDocSustento = (toBd) => {
            $scope.docSustIsValid = true
            $scope.validateDocSust()
            if ($scope.docSustIsValid) {
                let guid = ''
                if ($scope.docSustento.uniqueIdDoc) {
                    guid = $scope.docSustento.uniqueIdDoc
                } else {
                    guid = uuid2.newguid()
                }
                let indexxT = 0
                if ($scope.tempTaxes.length > 0) {
                    for (const t of $scope.tempTaxes) {
                        if (idDocumentoElectronico > 0) {
                            if (t.uniqueIdDoc == guid) {
                                $scope.tax = t
                                $scope.addTax(guid, false)
                            }
                        } else {
                            $scope.tax = t
                            $scope.addTax(guid, false)
                            indexxT++
                            if ($scope.tempTaxes.length == indexxT) {
                                $scope.tempTaxes = []
                            }
                        }
                    }
                }
                let indexxR = 0

                if ($scope.retencionesTemp.length > 0) {
                    for (const r of $scope.retencionesTemp) {
                        if (idDocumentoElectronico > 0) {
                            if (r.uniqueIdDoc == guid) {
                                $scope.retencion = r
                                if (r.codigo == '1') {
                                    $scope.porcentajeRetener = $scope.codigosRetencion
                                }
                                if (r.codigo == '2') {
                                    $scope.porcentajeRetener = $scope.porcentajesRetIva
                                }
                                $scope.addRetencion(guid, false)
                            }
                        } else {
                            $scope.retencion = r
                            if (r.codigo == '1') {
                                $scope.porcentajeRetener = $scope.codigosRetencion
                            }
                            if (r.codigo == '2') {
                                $scope.porcentajeRetener = $scope.porcentajesRetIva
                            }
                            $scope.addRetencion(guid, false)
                            indexxR++
                            if ($scope.retencionesTemp.length == indexxR) {
                                $scope.retencionesTemp = []
                            }
                        }

                    }
                }
                let indexP = 0
                if ($scope.paymentsTemp.length > 0) {
                    for (const p of $scope.paymentsTemp) {
                        if (idDocumentoElectronico > 0) {
                            if (p.uniqueIdDoc == guid) {
                                $scope.payment = p
                                $scope.addPayment(guid, false)
                            }
                        } else {
                            $scope.payment = p
                            $scope.addPayment(guid, false)
                            indexP++
                            if ($scope.paymentsTemp.length == indexP) {
                                $scope.paymentsTemp = []
                            }
                        }
                    }
                }
                if (toBd) {
                    if ($scope.infoCompRet.idRetencionAts > 0) {
                        $scope.docSustento.uniqueIdDoc = guid
                        $scope.docSustento.totalBaseImponibleReembolso = 0.00
                        $scope.docSustento.totalImpuestoReembolso = 0.00
                        $scope.docSustento.totalSinImpuestos = 0.00
                        $scope.docSustento.importeTotal = 0.00
                        mS.getData('post', _urlService + 'DocSustento/' + $scope.infoCompRet.idRetencionAts + '?json=' + JSON.stringify($scope.docSustento)).then(
                            response => {
                                if (response.code == '0') {
                                    tS.toastr('warning', response.message)
                                }
                                if (response.code == '1') {
                                    //$scope.tax = {}
                                    tS.toastr('success', response.message)
                                }
                            }, error => {
                                console.log(error)
                            }
                        )
                    }
                }

                $scope.docsAdded.push({
                    idRetAtsDocSustento: (idDocumentoElectronico) ? $scope.docSustento.idRetAtsDocSustento : 0,
                    uniqueIdDoc: guid,
                    codDocSustento: $scope.docSustento.codDocSustento,
                    docSustento: $scope.documentos.find(item => item.codDocSustento === $scope.docSustento.codDocSustento).descripcion,
                    codSustento: $scope.docSustento.codSustento,
                    sustento: $scope.docSustento.codSustento ? $scope.sustentosFiltered.find(item => item.codSustento === $scope.docSustento.codSustento).descripcion : '',
                    numDocSustento: $scope.docSustento.numDocSustento,
                    fechaEmisionDocSustento: $scope.docSustento.fechaEmisionDocSustento,
                    fechaRegistroContable: $scope.docSustento.fechaRegistroContable,
                    numAutDocSustento: $scope.docSustento.numAutDocSustento,
                    pagoLocExt: $scope.docSustento.pagoLocExt,
                    tipoRegi: $scope.docSustento.tipoRegi,
                    paisEfecPago: $scope.docSustento.paisEfecPago,
                    aplicConvDobTrib: $scope.docSustento.aplicConvDobTrib,
                    pagExtSujRetNorLeg: $scope.docSustento.pagExtSujRetNorLeg,
                    pagoRegFis: $scope.docSustento.pagoRegFis,
                    totalBaseImponibleReembolso: 0.00,
                    totalImpuestoReembolso: 0.00,
                    totalSinImpuestos: 0.00,
                    importeTotal: 0.00
                })
                //console.log($scope.docsAdded)
                $scope.docSustento = {}

                if ($scope.taxesAdded.length > 0) {
                    angular.forEach($scope.docsAdded, (value, key) => {
                        for (const taxxx of $scope.taxesAdded) {
                            if (taxxx.uniqueIdDoc == guid) {
                                value.totalSinImpuestos += Number(taxxx.baseImponible)
                                value.importeTotal += (Number(taxxx.baseImponible) + Number(taxxx.valorImpuesto))
                            }
                        }
                    })
                }
                if (toBd && idDocumentoElectronico > 0) {
                    setTimeout(() => {
                        $window.location.reload()
                    }, 2200)
                }
            }
        }

        /**Impuestos */
        $scope.tax = {}

        $scope.taxesAdded = []

        $scope.payment = {}
        $scope.paymentsAdded = []

        $scope.setTarifaImp = (item) => {
            let obj = $scope.tarifasImp.find(imp => imp.codigo == item)
            console.log(obj)
            $scope.tax.tarifa = obj.porcentaje
        }
        $scope.setTaxValue = (item) => {
            $scope.tax.valorImpuesto = ((item.tax.baseImponible * $scope.tax.tarifa) / 100).toFixed(2)
        }
        $scope.taxValid = (toBd) => {
            if (!toBd) {
                return true
            }
            if (!$scope.tax.codImpuestoDocSustento) {
                tS.toastr('warning', 'Debe seleccionar un impuesto')
                return false
            }
            if (!$scope.tax.codigoPorcentaje) {
                tS.toastr('warning', 'Debe seleccionar un porcentaje')
                return false
            }
            if (!$scope.tax.baseImponible) {
                tS.toastr('warning', 'Ingrese la base imponible')
                return false
            }
            if (Number($scope.tax.baseImponible) == 0) {
                tS.toastr('warning', 'La base imponible no puede ser cero')
                return false
            }
            return true
        }

        $scope.addTax = (uniqueIdDoc, toBd) => {
            if ($scope.taxValid(toBd)) {
                if (toBd) {
                    let idRetAtsDocSustento = $scope.docsAdded.find(item => (item.uniqueIdDoc == uniqueIdDoc)).idRetAtsDocSustento
                    if (idRetAtsDocSustento > 0) {
                        $scope.tax.uniqueIdDoc = uniqueIdDoc
                        mS.getData('post', _urlService + 'DocSustImpuesto/' + idRetAtsDocSustento + '?json=' + JSON.stringify($scope.tax)).then(
                            response => {
                                if (response.code == '0') {
                                    tS.toastr('warning', response.message)
                                }
                                if (response.code == '1') {
                                    if ($scope.retencionAdded.length > 0) {
                                        for (const ret of $scope.retencionAdded) {
                                            if (ret.codigo == '1' && ret.uniqueIdDoc == uniqueIdDoc) {
                                                ret.baseImponible = $scope.tax.baseImponible
                                                ret.valorRetenido = (ret.porcentajeRetener / 100) * $scope.tax.baseImponible
                                            }
                                            if (ret.codigo == '2' && ret.uniqueIdDoc == uniqueIdDoc) {
                                                ret.baseImponible = $scope.tax.valorImpuesto
                                                ret.valorRetenido = (ret.porcentajeRetener / 100) * $scope.tax.valorImpuesto
                                            }
                                        }
                                    }
                                    if ($scope.paymentsAdded.length > 0) {
                                        for (const payment of $scope.paymentsAdded) {
                                            if (payment.uniqueIdDoc == uniqueIdDoc) {
                                                payment.total = (Number($scope.tax.baseImponible) + Number($scope.tax.valorImpuesto))
                                            }
                                        }
                                    }

                                    //$scope.tax = {}
                                    tS.toastr('success', response.message)
                                }
                            }, error => {
                                console.log(error)
                            }
                        )
                    }
                }
                $scope.taxesAdded.push({
                    uniqueIdDoc: uniqueIdDoc,
                    idRetAtsImpDocSustento: (idDocumentoElectronico) ? $scope.tax.idRetAtsImpDocSustento : 0,
                    codImpuestoDocSustento: $scope.tax.codImpuestoDocSustento,
                    impuesto: $scope.impuestos.find(item => item.codigo == $scope.tax.codImpuestoDocSustento).descripcion,
                    codigoPorcentaje: $scope.tax.codigoPorcentaje,
                    porcentaje: $scope.tarifasImp.find(item => item.codigo == $scope.tax.codigoPorcentaje).descripcion,
                    baseImponible: $scope.tax.baseImponible,
                    tarifa: $scope.tax.tarifa,
                    valorImpuesto: $scope.tax.valorImpuesto
                })


                $scope.tax = {}
                //console.log($scope.docsAdded)
                console.log($scope.taxesAdded)
            }
        }
        $scope.editTax = (item, t, d) => {
            $scope.indexTax = item
            $scope.tax = $scope.taxesAdded[item]
            document.getElementById(d.uniqueIdDoc + '-btnAddTax').style.display = 'none'
            document.getElementById(d.uniqueIdDoc + '-btnEditTax').style.display = 'block'
        }
        $scope.updateTax = (uniqueIdDoc) => {
            if ($scope.taxValid()) {
                if ($scope.tax.idRetAtsImpDocSustento > 0) {
                    mS.getData('put', _urlService + 'DocSustImpuesto/' + $scope.tax.idRetAtsImpDocSustento + '?json=' + JSON.stringify($scope.tax)).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                angular.forEach($scope.taxesAdded, (value, index) => {
                                    if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexTax == index) {
                                        value.codImpuestoDocSustento = $scope.tax.codImpuestoDocSustento
                                        value.codigoPorcentaje = $scope.tax.codigoPorcentaje
                                        value.baseImponible = $scope.tax.baseImponible
                                        value.tarifa = $scope.tax.tarifa
                                        value.valorImpuesto = $scope.tax.valorImpuesto
                                    }
                                })
                                for (const ret of $scope.retencionAdded) {
                                    if (ret.codigo == '1' && ret.uniqueIdDoc == uniqueIdDoc) {
                                        ret.baseImponible = $scope.tax.baseImponible
                                        ret.valorRetenido = (ret.porcentajeRetener / 100) * $scope.tax.baseImponible
                                    }
                                    if (ret.codigo == '2' && ret.uniqueIdDoc == uniqueIdDoc) {
                                        ret.baseImponible = $scope.tax.valorImpuesto
                                        ret.valorRetenido = (ret.porcentajeRetener / 100) * $scope.tax.valorImpuesto
                                    }
                                }
                                for (const payment of $scope.paymentsAdded) {
                                    if (payment.uniqueIdDoc == uniqueIdDoc) {
                                        payment.total = (Number($scope.tax.baseImponible) + Number($scope.tax.valorImpuesto))
                                    }
                                }
                                $scope.tax = {}
                                document.getElementById(uniqueIdDoc + '-btnAddTax').style.display = 'block'
                                document.getElementById(uniqueIdDoc + '-btnEditTax').style.display = 'none'
                                tS.toastr('success', response.message)
                            }
                        }, error => {
                            console.log(error)
                        }
                    )
                } else {
                    angular.forEach($scope.taxesAdded, (value, index) => {
                        if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexTax == index) {
                            value.codImpuestoDocSustento = $scope.tax.codImpuestoDocSustento
                            value.codigoPorcentaje = $scope.tax.codigoPorcentaje
                            value.baseImponible = $scope.tax.baseImponible
                            value.tarifa = $scope.tax.tarifa
                            value.valorImpuesto = $scope.tax.valorImpuesto
                        }
                    })
                    $scope.tax = {}
                }
            }
        }
        $scope.askToRemoveTax = (index, item) => {
            if (item.idRetAtsImpDocSustento > 0) {
                Swal.fire({
                    title: '¿Está seguro de eliminar este impuesto?',
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
                        $scope.removeTax(index, item)
                    }
                })
            } else {
                $scope.removeTax(index, item)
            }
        }
        $scope.removeTax = (index, item) => {
            if (item.idRetAtsImpDocSustento > 0) {
                try {
                    mS.getData('delete', _urlService + 'DocSustImpuesto/' + item.idRetAtsImpDocSustento).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
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
            $scope.taxesAdded.splice(index, 1)
        }

        $scope.removeTaxTemp = (item) => {
            $scope.tempTaxes.splice(item, 1)
        }
        /**End Impuestos */
        /**Retenciones */
        $scope.porcentajesRet = []
        $scope.retencion = {}
        $scope.retencionAdded = []

        $scope.setPorcentajesRet = (item, uniqueIdDoc) => {
            // $scope.retencion.baseImponible = ''
            // $scope.retencion.porcentajeRetener = ''
            // $scope.retencion.valorRetenido = ''
            switch (item) {
                case '1':
                    // $scope.retencion.baseImponible = $scope.taxesAdded.find(tax => (tax.uniqueIdDoc == uniqueIdDoc)).baseImponible
                    $scope.retencion.baseImponible = $scope.totalSinImpuestos  //$scope.taxesAdded.filter(({ uniqueIdDoc }) => uniqueIdDoc === uniqueIdDoc).reduce((valorActual, previous) => valorActual + previous.baseImponible, 0)
                    $scope.porcentajeRetener = $scope.codigosRetencion
                    console.log($scope.codigosRetencion)
                    break
                case '2':
                    //console.log('yes')
                    $scope.retencion.baseImponible = $scope.taxesAdded.find(tax => (tax.codImpuestoDocSustento == 2 && tax.uniqueIdDoc == uniqueIdDoc)).valorImpuesto
                    $scope.porcentajeRetener = $scope.porcentajesRetIva
                    console.log($scope.porcentajesRetIva)
                    break
                default:
                    break
            }
        }

        $scope.setPorcentajeRet = (item, isPorcentaje) => {
            if (isPorcentaje) {
                $scope.retencion.porcentajeRetener = item.retencion.porcentajeRetener
            } else {
                $scope.retencion.porcentajeRetener = $scope.porcentajeRetener.find(p => p.codigo == item).porcentaje
                $scope.retencionCodigoSearch = $scope.porcentajeRetener.find(p => p.codigo == item)
                $scope.retencion.codigoRetencion = $scope.retencionCodigoSearch.codigo
            }
            if (Number($scope.retencion.baseImponible)) {
                $scope.calculateRet($scope.retencion.baseImponible)
            }
        }
        $scope.setValueRet = (item) => {
            $scope.calculateRet(item.retencion.baseImponible)
        }
        $scope.calculateRet = (baseImponible) => {
            $scope.retencion.valorRetenido = ((baseImponible * $scope.retencion.porcentajeRetener) / 100).toFixed(2)
        }

        $scope.retencionValid = (toBd) => {
            if (!toBd) {
                return true
            }
            if ($scope.taxesAdded.length == 0) {
                tS.toastr('warning', 'Debe agregar al menos un impuesto al documento de sustento')
                return false
            }
            if (!$scope.retencion.codigo) {
                tS.toastr('warning', 'Debe seleccionar un impuesto')
                return false
            }
            if (!$scope.retencion.baseImponible) {
                tS.toastr('warning', 'Ingrese la base imponible')
                return false
            }
            if (Number($scope.retencion.baseImponible) == 0) {
                tS.toastr('warning', 'La base imponible no puede ser cero')
                return false
            }
            if (!$scope.retencion.codigoRetencion) {
                tS.toastr('warning', 'Debe seleccionar un porcentaje')
                return false
            }
            return true
        }
        $scope.addRetencion = (uniqueIdDoc, toBd) => {

            if ($scope.retencionValid(toBd)) {
                //console.log($scope.retencion)
                if (toBd) {
                    let idRetAtsDocSustento = $scope.docsAdded.find(item => (item.uniqueIdDoc == uniqueIdDoc)).idRetAtsDocSustento
                    if (idRetAtsDocSustento > 0) {
                        $scope.retencion.uniqueIdDoc = uniqueIdDoc
                        mS.getData('post', _urlService + 'DocSustRetencion/' + idRetAtsDocSustento + '?json=' + JSON.stringify($scope.retencion)).then(
                            response => {
                                if (response.code == '0') {
                                    tS.toastr('warning', response.message)
                                }
                                if (response.code == '1') {
                                    //$scope.retencion = {}
                                    tS.toastr('success', response.message)
                                }
                            }, error => {
                                console.log(error)
                            }
                        )
                    }
                }
                $scope.retencionAdded.push({
                    uniqueIdDoc: uniqueIdDoc,
                    idRetencionAtsRet: (idDocumentoElectronico) ? $scope.retencion.idRetencionAtsRet : 0,
                    codigo: $scope.retencion.codigo,
                    impuesto: $scope.impuestosRet.find(item => item.codigo == $scope.retencion.codigo).descripcion,
                    codigoRetencion: $scope.retencion.codigoRetencion,
                    codRet: $scope.porcentajeRetener.find(item => item.codigo == $scope.retencion.codigoRetencion).descripcion,
                    baseImponible: $scope.retencion.baseImponible,
                    porcentajeRetener: $scope.retencion.porcentajeRetener,
                    valorRetenido: $scope.retencion.valorRetenido
                })
                $scope.retencion = {}
            }
        }
        //$scope.retencionCodigoSearch = {}
        $scope.editRetencion = (item, ret, d) => {
            $scope.indexRet = item
            $scope.retencion = $scope.retencionAdded[item]

            $scope.setPorcentajesRet($scope.retencion.codigo, d.uniqueIdDoc)
            $scope.setPorcentajeRet($scope.retencion.codigoRetencion, false)
            document.getElementById(d.uniqueIdDoc + '-btnAddRet').style.display = 'none'
            document.getElementById(d.uniqueIdDoc + '-btnEditRet').style.display = 'block'
        }
        $scope.updateRet = (uniqueIdDoc) => {
            if ($scope.retencionValid()) {
                if ($scope.retencion.idRetencionAtsRet > 0) {
                    mS.getData('put', _urlService + 'DocSustRetencion/' + $scope.retencion.idRetencionAtsRet + '?json=' + JSON.stringify($scope.retencion)).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                angular.forEach($scope.retencionAdded, (value, index) => {
                                    if (value.idRetencionAtsRet == $scope.retencion.idRetencionAtsRet) {
                                        value.codigo = $scope.retencion.codigo
                                        value.codigoPorcentaje = $scope.retencion.codigoPorcentaje
                                        value.baseImponible = $scope.retencion.baseImponible
                                        value.porcentajeRetener = $scope.retencion.porcentajeRetener
                                        value.valorRetenido = $scope.retencion.valorRetenido
                                    }
                                })
                                $scope.retencion = {}
                                document.getElementById(uniqueIdDoc + '-btnAddRet').style.display = 'block'
                                document.getElementById(uniqueIdDoc + '-btnEditRet').style.display = 'none'
                                tS.toastr('success', response.message)
                            }
                        }, error => {
                            console.log(error)
                        }
                    )
                } else {
                    angular.forEach($scope.retencionAdded, (value, index) => {
                        if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexRet == index) {
                            value.codigo = $scope.retencion.codImpuestoDocSustento
                            value.codigoPorcentaje = $scope.retencion.codigoPorcentaje
                            value.baseImponible = $scope.retencion.baseImponible
                            value.porcentajeRetener = $scope.retencion.porcentajeRetener
                            value.valorRetenido = $scope.retencion.valorRetenido
                        }
                    })
                    $scope.retencion = {}
                }
            }
        }
        $scope.askToRemoveRet = (index, item) => {
            if (item.idRetencionAtsRet > 0) {
                Swal.fire({
                    title: '¿Está seguro de eliminar esta retención?',
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
                        $scope.removeRet(index, item)
                    }
                })
            } else {
                $scope.removeRet(index, item)
            }
        }
        $scope.removeRet = (index, item) => {
            if (item.idRetencionAtsRet > 0) {
                try {
                    mS.getData('delete', _urlService + 'DocSustRetencion/' + item.idRetencionAtsRet).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
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

            $scope.retencionAdded.splice(index, 1)
        }
        /**End Retenciones */

        /**Reembolsos */
        /*********************************************** */


        /**Impuestos Reembolsos */

        /**End Impuestos Reembolsos */
        /*********************************************** */
        /**End Reembolsos */
        /**Pagos */


        $scope.paymentValid = (toBd) => {
            if (!toBd) {
                return true
            }
            if ($scope.taxesAdded.length == 0) {
                tS.toastr('warning', 'Primero debe agregar los impuestos del documento')
                return false
            }
            if (!$scope.payment.formaPago) {
                tS.toastr('warning', 'Debe seleccionar una forma de pago')
                return false
            }
            if (!$scope.payment.total) {
                tS.toastr('warning', 'Ingrese el total')
                return false
            }
            if (Number($scope.payment.total) == 0) {
                tS.toastr('warning', 'El total no puede ser cero')
                return false
            }
            return true
        }
        $scope.addPayment = (uniqueIdDoc, toBd) => {
            if ($scope.paymentValid(toBd)) {
                if (toBd) {
                    let data = {
                        uniqueIdDoc: uniqueIdDoc,
                        formaPago: $scope.payment.formaPago,
                        total: $scope.payment.total
                    }

                    let totalBaseImp = $scope.taxesAdded.map(item => (item.baseImponible)).reduce((valorActual, previous) => (valorActual + previous), 0)
                    let totalImpuesto = $scope.taxesAdded.map(item => (item.valorImpuesto)).reduce((valorActual, previous) => (Number(valorActual) + Number(previous)), 0)
                    let importeTotal = (totalBaseImp + totalImpuesto)

                    console.log(importeTotal)

                    let totalFp = $scope.paymentsAdded.map(item => (item.total)).reduce((valorActual, previous) => (valorActual + previous), 0)
                    totalFp = totalFp + $scope.payment.total

                    if (importeTotal != totalFp) {
                        tS.toastr('warning', 'El total de formas de pago es diferente al importe total del documento de sustento')
                        return
                    }
                    let idRetAtsDocSustento = $scope.docsAdded.find(item => (item.uniqueIdDoc == uniqueIdDoc)).idRetAtsDocSustento
                    if (idRetAtsDocSustento > 0) {
                        mS.getData('post', _urlService + 'DocSustPago/' + idRetAtsDocSustento + '?json=' + JSON.stringify(data)).then(
                            response => {
                                if (response.code == '0') {
                                    tS.toastr('warning', response.message)
                                }
                                if (response.code == '1') {
                                    //$scope.payment = {}
                                    tS.toastr('success', response.message)
                                }
                            }, error => {
                                console.log(error)
                            }
                        )
                    }
                }
                $scope.paymentsAdded.push({
                    uniqueIdDoc: uniqueIdDoc,
                    idRetencionAtsPago: (idDocumentoElectronico) ? $scope.payment.idRetencionAtsPago : 0,
                    formaPago: $scope.payment.formaPago,
                    descripcion: $scope.formasPago.find(fp => fp.formaPago == $scope.payment.formaPago).descripcion,
                    total: $scope.payment.total
                })
                $scope.payment = {}
            }
        }

        $scope.editPayment = (item, p, d) => {
            $scope.indexPayment = item
            $scope.payment = $scope.paymentsAdded[item]
            console.log($scope.payment)
            document.getElementById(d.uniqueIdDoc + '-btnAddPaymentAdd').style.display = 'none'
            document.getElementById(d.uniqueIdDoc + '-btnEditPaymentSave').style.display = 'block'
            document.getElementById(d.uniqueIdDoc + '-totalPago').disabled = true
        }
        $scope.updatePayment = (uniqueIdDoc) => {
            if ($scope.paymentValid()) {
                try {
                    if ($scope.payment.idRetencionAtsPago > 0) {
                        mS.getData('put', _urlService + 'DocSustPago/' + $scope.payment.idRetencionAtsPago + '?json=' + JSON.stringify($scope.payment)).then(
                            response => {
                                if (response.code == '0') {
                                    tS.toastr('warning', response.message)
                                }
                                if (response.code == '1') {
                                    angular.forEach($scope.paymentsAdded, (value, index) => {
                                        if (value.idRetencionAtsPago == $scope.payment.idRetencionAtsPago) {
                                            value.formaPago = $scope.payment.formaPago
                                            value.descripcion = $scope.formasPago.find(fp => fp.formaPago == $scope.payment.formaPago).descripcion
                                            value.total = $scope.payment.total
                                        }
                                    })
                                    $scope.payment = {}
                                    document.getElementById(uniqueIdDoc + '-btnAddPaymentAdd').style.display = 'block'
                                    document.getElementById(uniqueIdDoc + '-btnEditPaymentSave').style.display = 'none'
                                    document.getElementById(uniqueIdDoc + '-totalPago').disabled = false
                                    tS.toastr('success', response.message)
                                }
                            }, error => {
                                console.log(error)
                            }
                        )
                    } else {
                        angular.forEach($scope.paymentsAdded, (value, index) => {
                            if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexPayment == index) {
                                value.formaPago = $scope.payment.formaPago
                                value.descripcion = $scope.formasPago.find(fp => fp.formaPago == $scope.payment.formaPago).descripcion
                                value.total = $scope.payment.total
                            }
                        })
                        $scope.payment = {}
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        $scope.askToRemovePayment = (index, item) => {
            if (item.idRetencionAtsPago > 0) {
                Swal.fire({
                    title: '¿Está seguro de eliminar este pago?',
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
                        $scope.removePayment(index, item)
                    }
                })
            } else {
                $scope.removePayment(index, item)
            }
        }
        $scope.removePayment = (index, item) => {

            if (item.idRetencionAtsPago > 0) {
                try {
                    mS.getData('delete', _urlService + 'DocSustPago/' + item.idRetencionAtsPago).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
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

            $scope.paymentsAdded.splice(index, 1)
        }
        /**End Pagos */




        $scope.editDocSust = (item) => {
            $scope.indexDoc = item
            $scope.docSustento = $scope.docsAdded[item]
            $scope.docSustento.fechaEmisionDocSustento = formatDate($scope.docsAdded[item].fechaEmisionDocSustento)
            if ($scope.docsAdded[item].fechaRegistroContable) {
                $scope.docSustento.fechaRegistroContable = formatDate($scope.docsAdded[item].fechaRegistroContable)
            }
            $scope.selectSutento($scope.docSustento.codDocSustento)
            document.getElementById('btnAddDocSust').style.display = 'none'
            document.getElementById('btnEditDocSust').style.display = 'block'
        }

        $scope.updateDocSustento = () => {
            if ($scope.validateDocSust()) {
                if ($scope.docSustento.idRetAtsDocSustento > 0) {
                    mS.getData('put', _urlService + 'DocSustento/' + $scope.docSustento.idRetAtsDocSustento + '?json=' + JSON.stringify($scope.docSustento)).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                angular.forEach($scope.docsAdded, (value, index) => {
                                    if ($scope.indexDoc == index) {
                                        value.codDocSustento = $scope.docSustento.codDocSustento
                                        value.docSustento = $scope.documentos.find(item => item.codDocSustento === $scope.docSustento.codDocSustento).descripcion
                                        value.codSustento = $scope.docSustento.codSustento
                                        value.sustento = $scope.docSustento.codSustento ? $scope.sustentosFiltered.find(item => item.codSustento == $scope.docSustento.codSustento).descripcion : ''
                                        value.numDocSustento = $scope.docSustento.numDocSustento
                                        value.fechaEmisionDocSustento = $scope.docSustento.fechaEmisionDocSustento
                                        value.fechaRegistroContable = $scope.docSustento.fechaRegistroContable
                                        value.numAutDocSustento = $scope.docSustento.numAutDocSustento
                                        value.pagoLocExt = $scope.docSustento.pagoLocExt
                                        value.tipoRegi = $scope.docSustento.tipoRegi
                                        value.paisEfecPago = $scope.docSustento.paisEfecPago
                                        value.aplicConvDobTrib = $scope.docSustento.aplicConvDobTrib
                                        value.pagExtSujRetNorLeg = $scope.docSustento.pagExtSujRetNorLeg
                                        value.pagoRegFis = $scope.docSustento.pagoRegFis
                                        //     idRetAtsDocSustento: (idDocumentoElectronico) ? $scope.docSustento.idRetAtsDocSustento : 0,
                                        // uniqueIdDoc: guid,

                                        // totalBaseImponibleReembolso: 0.00,
                                        // totalImpuestoReembolso: 0.00,
                                        // totalSinImpuestos: 0.00,
                                        // importeTotal: 0.00
                                    }
                                })
                                $scope.docSustento = {}
                                document.getElementById('btnAddDocSust').style.display = 'block'
                                document.getElementById('btnEditDocSust').style.display = 'none'
                                tS.toastr('success', response.message)
                            }
                        }, error => {
                            console.log(error)
                        }
                    )
                } else {
                    angular.forEach($scope.docsAdded, (value, index) => {
                        if ($scope.indexDoc == index) {
                            value.codDocSustento = $scope.docSustento.codDocSustento
                            value.docSustento = $scope.documentos.find(item => item.codDocSustento === $scope.docSustento.codDocSustento).descripcion
                            value.codSustento = $scope.docSustento.codSustento
                            value.sustento = $scope.docSustento.codSustento ? $scope.sustentosFiltered.find(item => item.codSustento === $scope.docSustento.codSustento).descripcion : ''
                            value.numDocSustento = $scope.docSustento.numDocSustento
                            value.fechaEmisionDocSustento = $scope.docSustento.fechaEmisionDocSustento
                            value.fechaRegistroContable = $scope.docSustento.fechaRegistroContable
                            value.numAutDocSustento = $scope.docSustento.numAutDocSustento
                            value.pagoLocExt = $scope.docSustento.pagoLocExt
                            value.tipoRegi = $scope.docSustento.tipoRegi
                            value.paisEfecPago = $scope.docSustento.paisEfecPago
                            value.aplicConvDobTrib = $scope.docSustento.aplicConvDobTrib
                            value.pagExtSujRetNorLeg = $scope.docSustento.pagExtSujRetNorLeg
                            value.pagoRegFis = $scope.docSustento.pagoRegFis
                            //     idRetAtsDocSustento: (idDocumentoElectronico) ? $scope.docSustento.idRetAtsDocSustento : 0,
                            // uniqueIdDoc: guid,

                            // totalBaseImponibleReembolso: 0.00,
                            // totalImpuestoReembolso: 0.00,
                            // totalSinImpuestos: 0.00,
                            // importeTotal: 0.00
                        }
                    })
                    $scope.docSustento = {}
                }
            }
        }

        $scope.deleteDocSust = (item) => {
            let uniqueIdDoc = $scope.docsAdded[item].uniqueIdDoc
            if ($scope.taxesAdded.length > 0) {
                for (let t = 0; t < $scope.taxesAdded.length; t++) {
                    if (t.uniqueIdDoc == uniqueIdDoc) {
                        $scope.taxesAdded.splice(t, 1)
                    }
                }
            }
            if ($scope.retencionAdded.length > 0) {
                for (let r = 0; r < $scope.retencionAdded.length; r++) {
                    if (r.uniqueIdDoc == uniqueIdDoc) {
                        $scope.retencionAdded.splice(r, 1)
                    }
                }
            }
            if ($scope.paymentsAdded.length > 0) {
                for (let pay = 0; pay < $scope.taxesAdded.length; pay++) {
                    if (pay.uniqueIdDoc == uniqueIdDoc) {
                        $scope.taxesAdded.splice(pay, 1)
                    }
                }
            }
            $scope.docsAdded.splice(item, 1)
        }

        /**************************************************************************************** */
        /**End Documentos Sustento */

        /**************************/
        /**Info Adicional */
        $scope.additionalInfo = {}
        $scope.infoAdded = []

        $scope.additionalInfoValid = () => {
            if (!$scope.additionalInfo.nombre) {
                tS.toastr('warning', 'Debe seleccionar un nombre')
                return false
            }
            if (!$scope.additionalInfo.valor) {
                tS.toastr('warning', 'Ingrese un valor')
                return false
            }
            return true
        }
        $scope.addAdditionalInfo = () => {
            try {
                if ($scope.additionalInfoValid()) {

                    if (idDocumentoElectronico) {
                        let data = {
                            idRetencionAts: $scope.infoCompRet.idRetencionAts,
                            nombre: $scope.additionalInfo.nombre,
                            valor: $scope.additionalInfo.valor
                        }
                        mS.getData('post', _urlService + 'RetAtsInfoAdicional/?json=' + JSON.stringify(data)).then(
                            response => {
                                if (response.code == '0') {
                                    tS.toastr('warning', response.message)
                                }
                                if (response.code == '1') {
                                    $scope.additionalInfo = {}
                                    tS.toastr('success', response.message)
                                }
                            }, error => {
                                console.log(error)
                            }
                        )
                    }

                    $scope.infoAdded.push({
                        idRetAtsInfoAdicional: (idDocumentoElectronico) ? $scope.additionalInfo.idRetAtsInfoAdicional : 0,
                        nombre: $scope.additionalInfo.nombre,
                        valor: $scope.additionalInfo.valor
                    })
                    $scope.additionalInfo = {}
                }
            } catch (error) {

            }

        }
        $scope.editAdditionalInfo = (item) => {
            $scope.additionalInfo = $scope.infoAdded[item]
            //console.log($scope.additionalInfo)
            document.getElementById('btnAddInfoAdd').style.display = 'none'
            document.getElementById('btnEditInfoSave').style.display = 'block'
        }
        $scope.updateAdditionalInfo = () => {
            if ($scope.additionalInfoValid()) {
                try {
                    let data = {
                        nombre: $scope.additionalInfo.nombre,
                        valor: $scope.additionalInfo.valor
                    }
                    mS.getData('put', _urlService + 'RetAtsInfoAdicional/' + $scope.additionalInfo.idRetAtsInfoAdicional + '?json=' + JSON.stringify(data)).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
                                $scope.additionalInfo = {}
                                angular.forEach($scope.infoAdded, (value, index) => {
                                    if (value.idRetAtsInfoAdicional == $scope.additionalInfo.idRetAtsInfoAdicional) {
                                        value.nombre = $scope.additionalInfo.idRetAtsInfoAdicional.nombre
                                        value.valor = $scope.additionalInfo.idRetAtsInfoAdicional.valor
                                    }
                                })
                                document.getElementById('btnAddInfoAdd').style.display = 'block'
                                document.getElementById('btnEditInfoSave').style.display = 'none'
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
        }
        $scope.askToDeleteAdditionalInfo = (index, item) => {
            if (item.idRetAtsInfoAdicional > 0) {
                Swal.fire({
                    title: '¿Está seguro de eliminar esta información?',
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
                        $scope.removeAdditionalInfo(index, item);
                    }
                })
            } else {
                $scope.removeAdditionalInfo(index, item);
            }
        }
        $scope.removeAdditionalInfo = (index, item) => {
            if (item.idRetAtsInfoAdicional > 0) {
                try {
                    mS.getData('delete', _urlService + 'RetAtsInfoAdicional/' + item.idRetAtsInfoAdicional).then(
                        response => {
                            if (response.code == '0') {
                                tS.toastr('warning', response.message)
                            }
                            if (response.code == '1') {
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
            $scope.infoAdded.splice(index, 1)
        }
        /**End Info Adicional */
        /*************************/


        /**OPERATIONS */
        /************************************************ */
        $scope.validateSave = () => {
            if (!$scope.infoCompRet.estab) {
                tS.toastr('warning', 'Seleccione el establecimiento')
                return false
            }
            if (!$scope.infoCompRet.ptoEmi) {
                tS.toastr('warning', 'Seleccione el punto de emisión')
                return false
            }
            if (!$scope.infoCompRet.fechaEmision) {
                tS.toastr('warning', 'Ingrese la fecha emisión')
                return false
            }
            if (!$scope.infoCompRet.tipoIdentificacionSujetoRetenido) {
                tS.toastr('warning', 'Seleccione el tipo de identificacion del sujeto retenido')
                return false
            }
            if ($scope.infoCompRet.tipoIdentificacionSujetoRetenido === '06' || $scope.infoCompRet.tipoIdentificacionSujetoRetenido === '08') {
                if (!$scope.infoCompRet.tipoSujetoRetenido) {
                    tS.toastr('warning', 'Seleccione el tipo sujeto retenida')
                    return false
                }
            }
            if (!$scope.infoCompRet.parteRel) {
                tS.toastr('warning', 'Seleccione la parte relacionada')
                return false
            }
            if (!$scope.infoCompRet.identificacionSujetoRetenido) {
                tS.toastr('warning', 'Ingrese el número de identificación del sujeto retenido')
                return false
            }
            if ($scope.docsAdded.length === 0) {
                tS.toastr('warning', 'Ingrese al menos un documento de sustento')
                return false
            }
            // let countDocs = 0
            // let countImp = 0
            // angular.forEach($scope.docsAdded, (value, key) => {
            //     angular.forEach($scope.retencionAdded, (ret, keyRet) => {
            //         if (value.uniqueIdDoc == ret.uniqueIdDoc) {
            //             countImp++
            //         }
            //     })
            //     countDocs++
            //     if (countDocs > 0) {
            //         if (countImp === 0) {
            //             tS.toastr('warning', 'Ingrese al menos un impuesto')
            //             return false;
            //         }
            //     }
            // })
            // if ($scope.taxesAdded.length === 0) {
            //     tS.toastr('warning', 'Ingrese al menos un impuesto')
            //     return false
            // }
            return true
        }


        $scope.save = () => {
            try {
                $scope.removeCookies()
                showLoader()
                if (!$scope.validateSave()) {
                    hideLoader()
                    return
                }

                let infoComp = Object.assign({}, $scope.infoCompRet)
                infoComp.fechaEmision = formatDateTimeZone($scope.infoCompRet.fechaEmision)

                let data = {}
                if (idDocumentoElectronico) {
                    data = {
                        infoCompRet: JSON.stringify(infoComp)
                    }
                } else {
                    data = {
                        infoCompRet: JSON.stringify(infoComp),
                        docsSust: JSON.stringify($scope.docsAdded),
                        impuestos: JSON.stringify($scope.taxesAdded),
                        retenciones: JSON.stringify($scope.retencionAdded),
                        payments: JSON.stringify($scope.paymentsAdded),
                        infoAdicional: JSON.stringify($scope.infoAdded)
                    }
                }
                //console.log(data)
                let method = (idDocumentoElectronico) ? 'put' : 'post'
                let url = (idDocumentoElectronico) ? _urlService + 'RetencionAts/' + $scope.infoCompRet.idRetencionAts : _urlService + 'RetencionAts'
                mS.getData(method, url, data).then(
                    response => {
                        if (response.code == '0') {
                            tS.toastr('warning', response.message)
                        }
                        if (response.code == '1') {
                            tS.toastr('success', response.message)
                            $scope.infoCompRet = {}
                            $scope.docsAdded = []
                            $scope.taxesAdded = []
                            $scope.retencionAdded = []
                            $scope.paymentsAdded = []
                            if ($scope.infoAdded.length > 0) {
                                $scope.infoAdded = []
                            }
                            setTimeout(() => {
                                if (idDocumentoElectronico) {
                                    location.href = '/DocumentoElectronico/Index'
                                } else {
                                    $window.location.reload();
                                }
                            }, 2500)
                        }
                        hideLoader()
                    }, error => {
                        hideLoader()
                        console.log(error)
                    }
                )
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }
        $scope.cancel = () => {
            $window.location.reload();
        }
        $scope.back = () => {
            location.href = '/DocumentoElectronico/Index'
        }
        /************************************************ */
        /** */

        $scope.removeCookies = () => {
            let cookies = $cookies.getAll();
            angular.forEach(cookies, function (value, key) {
                $cookies.remove(key);
            });
        }

        //
        $scope.exportPdf = (item) => {
            try {
                mS.getFile('get', _urlService + 'DocumentoRecibido/Export/' + item).then(response => {
                    if (response.id == 0) {
                        tS.toastr('warning', response.message)
                        return
                    }
                    if (response.data.size > 0) {
                        let serverData = new Blob([response.data], { type: response.headers()['content-type'] });
                        // console.log(response.headers())
                        // console.log(response)
                        let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1];
                        // let fileName = 'factura.pdf'
                        FileSaver.saveAs(serverData, fileName);

                        // let element = document.createElement('a');
                        // let fileBlob = new Blob([response.data], {
                        //     type: response.data.type
                        // });
                        // let url = URL.createObjectURL(fileBlob);
                        // element.href = url;
                        // element.setAttribute('download', 'fileName.xml');
                        // document.body.appendChild(element); 
                        // element.click();
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }

        
    }
})(window.angular);
