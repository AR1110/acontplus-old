(function () {
    'use strict';

    app.controller('retencionAtsCtrl', retencionAtsCtrl);

    retencionAtsCtrl.$inject = ['$scope', 'mainService', 'toastService', '$element', '$cookies', 'uuid2', '$window', 'FileSaver', 'Blob'];

    function retencionAtsCtrl($scope, mS, tS, $element, $cookies, uuid2, $window, FileSaver, Blob) {
        /**Initial Load */

        $scope.genericAnswer = [{ codigo: 'SI' }, { codigo: 'NO' }]

        $scope.infoCompRet = {}

        $scope.tiposIdentificacion = []
        $scope.tiposSujRetenido = []
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

        function formatDate(fecha) {
            let _getFecha = new Date(fecha);
            _getFecha.setMinutes(_getFecha.getMinutes() + _getFecha.getTimezoneOffset());
            return _getFecha;
        }

        const _urlService = document.getElementById("urlGateway").value + 'api/'
        const _idRol = document.getElementById("idRol").value


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
                mS.getData('get', _urlService + 'RetencionAts/' + _idRol + '/' + JSON.stringify(data)).then(
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
                            $scope.infoCompRet.fechaEmision = formatDate(new Date())
                            $scope.getPeriod(null, formatDate(new Date()))
                            $scope.infoCompRet.codEstab_Asig = $scope.establecimientos.find(item => item.predeterminado).codEstab_Asig
                            $scope.onChangeEstablecimiento()
                            console.log(tempArray)
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

                                $scope.docSustento.codDocSustento = $scope.docData.codDocSustento
                                $scope.selectSutento($scope.docSustento.codDocSustento)
                                $scope.docSustento.numDocSustento = $scope.docData.numDocSustento
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
                mS.getData('get', _urlService + 'DocumentoRecibido/Preview/' + _idRol + '/' + item).then(
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
        $scope.addDocSustento = () => {
            $scope.docSustIsValid = true
            $scope.validateDocSust()
            if ($scope.docSustIsValid) {
                let guid = uuid2.newguid()
                let countTax = 0
                if ($scope.tempTaxes.length > 0) {
                    for (const t of $scope.tempTaxes) {
                        $scope.tax = t
                        $scope.addTax(guid)
                        countTax++
                    }
                    if (countTax == $scope.tempTaxes.length) {
                        $scope.tempTaxes = []
                    }
                }
                let countPayments = 0

                if ($scope.paymentsTemp.length > 0) {
                    for (const p of $scope.paymentsTemp) {
                        $scope.payment = p
                        $scope.addPayment(guid)
                        countPayments++
                    }
                    if (countPayments == $scope.paymentsTemp.length) {
                        $scope.paymentsTemp = []
                    }
                }

                $scope.docsAdded.push({
                    uniqueIdDoc: guid,
                    codDocSustento: $scope.docSustento.codDocSustento,
                    docSustento: $scope.documentos.find(item => item.codDocSustento === $scope.docSustento.codDocSustento).descripcion,
                    codSustento: $scope.docSustento.codSustento,
                    sustento: !$scope.docSustento.codSustento ? $scope.sustentosFiltered.find(item => item.codSustento === $scope.docSustento.codSustento).descripcion : '',
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
                console.log($scope.docsAdded)
                $scope.docSustento = {}
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
        $scope.taxValid = () => {
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

        $scope.addTax = (uniqueIdDoc) => {
            if ($scope.taxValid()) {
                $scope.taxesAdded.push({
                    uniqueIdDoc: uniqueIdDoc,
                    codImpuestoDocSustento: $scope.tax.codImpuestoDocSustento,
                    impuesto: $scope.impuestos.find(item => item.codigo == $scope.tax.codImpuestoDocSustento).descripcion,
                    codigoPorcentaje: $scope.tax.codigoPorcentaje,
                    porcentaje: $scope.tarifasImp.find(item => item.codigo == $scope.tax.codigoPorcentaje).descripcion,
                    baseImponible: $scope.tax.baseImponible,
                    tarifa: $scope.tax.tarifa,
                    valorImpuesto: $scope.tax.valorImpuesto
                })
                angular.forEach($scope.docsAdded, (value, key) => {
                    if (value.uniqueIdDoc == uniqueIdDoc) {
                        value.totalSinImpuestos += Number($scope.tax.baseImponible)
                        value.importeTotal += (Number($scope.tax.baseImponible) + Number($scope.tax.valorImpuesto))
                    }
                    $scope.payment.total += value.importeTotal
                })

                $scope.tax = {}
                console.log($scope.docsAdded)
                console.log($scope.taxesAdded)
            }
        }
        $scope.editTax = (item) => {
            $scope.indexTax = $scope.taxesAdded.findIndex(item)
            $scope.tax = item
            $scope.showBtnTaxEdit = true
            $scope.hideBtnTaxAdd = true
        }
        $scope.updateTax = (uniqueIdDoc) => {
            if ($scope.taxValid()) {
                angular.array.forEach($scope.taxesAdded, (value, index) => {
                    if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexTax == index) {
                        value.codImpuestoDocSustento = $scope.tax.codImpuestoDocSustento
                        value.codigoPorcentaje = $scope.tax.codigoPorcentaje
                        value.baseImponible = $scope.tax.baseImponible
                        value.tarifa = $scope.tax.tarifa
                        value.valorImpuesto = $scope.tax.valorImpuesto
                    }
                });
                $scope.tax = {}
            }
        }
        $scope.removeTax = (index) => {
            alert('falta recalcular totales')
            $scope.taxesAdded.splice(index, 1)
        }
        /**End Impuestos */
        /**Retenciones */
        $scope.porcentajesRet = []
        $scope.retencion = {}
        $scope.retencionAdded = []

        $scope.setPorcentajesRet = (item) => {
            $scope.retencion.baseImponible = ''
            $scope.retencion.porcentajeRetener = ''
            $scope.retencion.valorRetenido = ''
            switch (item) {
                case '1':
                    $scope.retencion.baseImponible = $scope.taxesAdded.find(tax => tax.codImpuestoDocSustento == 2).baseImponible
                    $scope.porcentajeRetener = $scope.codigosRetencion
                    console.log($scope.codigosRetencion)
                    break
                case '2':
                    //console.log('yes')
                    $scope.retencion.baseImponible = $scope.taxesAdded.find(tax => tax.codImpuestoDocSustento == 2).valorImpuesto
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

        $scope.retencionValid = () => {
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
        $scope.addRetencion = (uniqueIdDoc) => {
            if ($scope.retencionValid()) {
                console.log($scope.retencion)
                $scope.retencionAdded.push({
                    uniqueIdDoc: uniqueIdDoc,
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
        $scope.editRetencion = (item) => {
            $scope.indexRet = $scope.retencionAdded.findIndex(item)
            $scope.retencion = item
            $scope.showBtnRetEdit = true
            $scope.hideBtnRetAdd = true
        }
        $scope.updateRet = (uniqueIdDoc) => {
            if ($scope.retencionValid()) {
                angular.array.forEach($scope.retencionAdded, (value, index) => {
                    if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexRet == index) {
                        value.codigo = $scope.retencion.codImpuestoDocSustento
                        value.codigoPorcentaje = $scope.retencion.codigoPorcentaje
                        value.baseImponible = $scope.retencion.baseImponible
                        value.porcentajeRetener = $scope.retencion.porcentajeRetener
                        value.valorRetenido = $scope.retencion.valorRetenido
                    }
                });
                $scope.retencion = {}
            }
        }
        $scope.removeRet = (index) => {
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


        $scope.paymentValid = () => {
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
        $scope.addPayment = (uniqueIdDoc) => {
            if ($scope.paymentValid()) {
                $scope.paymentsAdded.push({
                    uniqueIdDoc: uniqueIdDoc,
                    formaPago: $scope.payment.formaPago,
                    descripcion: $scope.formasPago.find(fp => fp.formaPago == $scope.payment.formaPago).descripcion,
                    total: $scope.payment.total
                })
                $scope.payment = {}
            }
        }
        $scope.editPayment = (item) => {
            $scope.indexPayment = $scope.paymentsAdded.findIndex(item)
            $scope.payment = item
            $scope.showBtnPayEdit = true
            $scope.hideBtnPayAdd = true
        }
        $scope.updatePayment = (uniqueIdDoc) => {
            if ($scope.paymentValid()) {
                angular.array.forEach($scope.paymentsAdded, (value, index) => {
                    if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexPayment == index) {
                        value.formaPago = $scope.payment.formaPago
                        vaue.descripcion = $scope.formasPago.find(fp => fp.formaPago == $scope.payment.formaPago).descripcion
                        value.total = $scope.payment.total
                    }
                });
                $scope.payment = {}
            }
        }
        $scope.removePayment = (index) => {
            $scope.paymentsAdded.splice(index, 1)
        }
        /**End Pagos */
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
        $scope.addAdditionalInfo = (uniqueIdDoc) => {
            if ($scope.additionalInfoValid()) {
                $scope.infoAdded.push({
                    uniqueIdDoc: uniqueIdDoc,
                    nombre: $scope.additionalInfo.nombre,
                    valor: $scope.additionalInfo.valor
                })
                $scope.additionalInfo = {}
            }
        }
        $scope.editAdditionalInfo = (item) => {
            $scope.indexInfo = $scope.infoAdded.findIndex(item)
            $scope.additionalInfo = item
            $scope.showBtnInfoEdit = true
            $scope.hideBtnInfoAdd = true
        }
        $scope.updateAdditionalInfo = (uniqueIdDoc) => {
            if ($scope.retencionValid()) {
                angular.array.forEach($scope.infoAdded, (value, index) => {
                    if (value.uniqueIdDoc == uniqueIdDoc && $scope.indexPayment == index) {
                        value.nombre = $scope.additionalInfo.nombre
                        value.valor = $scope.additionalInfo.valor
                    }
                });
                $scope.additionalInfo = {}
            }
        }
        $scope.removeAdditionalInfo = (index) => {
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
            } if (!$scope.infoCompRet.ptoEmi) {
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

                let data = {
                    infoCompRet: JSON.stringify(infoComp),
                    docsSust: JSON.stringify($scope.docsAdded),
                    impuestos: JSON.stringify($scope.taxesAdded),
                    retenciones: JSON.stringify($scope.retencionAdded),
                    payments: JSON.stringify($scope.paymentsAdded),

                    infoAdicional: JSON.stringify($scope.infoAdded)
                }
                console.log(data)
                mS.getData('post', _urlService + 'RetencionAts/' + _idRol, data).then(
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
                                $window.location.reload();
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
                mS.getFile('get', _urlService + 'DocumentoRecibido/Export/' + _idRol + '/' + item).then(response => {
                    if (response.id == 0) {
                        tS.toastr('warning', response.message)
                        return;
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
