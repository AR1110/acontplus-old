/**
 * 1. ventaService
 * 2. notaEntregaService
 * 3. clienteService
 * 4. empleadoService 
 * 5. cargoService
 */
(function () {

    'use strict';

    app.factory('ventaService', function ($injector) {
        let service = {};
        let mS = $injector.get('mainService');
        /**
         * 
         * @param {object} query  
         * @returns array
         */
        service.getDataForm = function (query) {
            return mS.getData('get', 'Venta/CatalogoVenta/?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let payload = JSON.parse(response.payload);

                    let estabs = payload[0];
                    let ptosEmision = payload[1];
                    let bodegas = payload[2];
                    let configVenta = payload[3][0]
                    let decimal = JSON.parse(payload[4][0].jsonConfig)
                    let configDetalle = payload[5][0];
                    let tipoIvas = payload[6];
                    let tarifas = payload[7];
                    let tiempoCreditos = payload[8];
                    let articuloPredeterminado = payload[9][0]
                    let clientePredeterminado = payload[10][0];
                    let permisoVenta = JSON.parse(payload[11][0].jsonPermission);
                    let permisoArticulo = payload[12][0];


                    let estabsMapper = estabs.map(item => ({
                        codEstab_Asig: item.codEstab_Asig,
                        codEstab: item.codEstab,
                        predeterminado: item.predeterminado,
                        nombreComercial: item.nombreComercial,
                        estab: item.estab,
                        tarifasImpuestos: JSON.parse(item.tarifasImpuestos)
                    }))

                    let ptosEmisionMapper = ptosEmision.map(item => ({
                        codEstab_Asig: item.codEstab_Asig,
                        idPuntoEmision: item.idPuntoEmision,
                        ptoEmi: item.ptoEmi,
                        predeterminado: item.predeterminado,
                    }))

                    let configVentaMapper = {
                        idCliente: configVenta.idCliente | 0,
                        searchCode: configVenta.searchCode | false,
                        printerAutomatic: configVenta.printerAutomatic | false,
                        payAutomatic: configVenta.payAutomatic | true,
                    }

                    let decimalMapper = {
                        nroPrecio: decimal.nroPrecio || 3,
                        nroCantidad: decimal.nroCantidad || 3,
                        nroIva: decimal.nroIva || 3,
                        nroDescuentoDetalle: decimal.nroDescuentoDetalle || 3,
                        nroTotalDetalle: decimal.nroTotalDetalle || 3,
                        nroTotalSubTotal: decimal.nroTotalSubTotal || 3,
                        nroDescuento: decimal.nroDescuento || 3,
                        nroIce: decimal.nroIce || 3,
                        importeTotal: decimal.importeTotal || 3,
                    }


                    let tipoIvasMapper = tipoIvas.map(item => ({
                        idTipoIva: item.idTipoIva,
                        descripcion: item.descripcion,
                        tarifa: item.tarifa,
                        codigoPorcentaje: item.codigoPorcentaje,
                    }))

                    let tiempoCreditosMapper = tiempoCreditos.map(item => ({
                        idTiempoCredito: item.idTiempoCredito,
                        descripcion: item.descripcion,
                        diasCredito: item.diasCredito,
                        numeroCuota: item.numeroCuota,
                    }))


                    return {
                        establecimientos: estabsMapper,
                        ptosEmision: ptosEmisionMapper,
                        bodegas,
                        configVenta: configVentaMapper,
                        decimal: decimalMapper,
                        configDetalle,
                        tipoIvas: tipoIvasMapper,
                        tarifas,
                        tiempoCreditos: tiempoCreditosMapper,
                        articuloPredeterminado,
                        clientePredeterminado,
                        permisoVenta,
                        permisoArticulo
                    }

                }
            })
        }


        service.getIdNotaEntrega = function (id) {
            return mS.getData('get', "Venta/NotaEntrega/GetId/" + id, null, true).catch(error => {
                console.log('sale service', error)
                throw new Error(error)
            })
            // return mS.getData('get', 'Venta/NotaEntrega/' + 'GetId/' + id, null, true)

            // .catch(error=>{
            //     console.log('sale service', error)
            //     throw new Error(error)
            // })
        }

        service.verifyPendientAccount = (query) => {
            let params = {
                tipo: 5,
                idCliente: query.idCliente
            }
            showLoader();
            return mS.getData('get', 'Contabilidad/CuentaPorCobrar/?json=' + JSON.stringify(params), null, true)
                .then(async response => {
                    hideLoader();
                    if (response.code === "0") {
                        console.log(response)
                        return true;
                    }
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload);
                        let pendientAccounts = mainData[0];

                        if (pendientAccounts.length === 0) return false;

                        let { totalImporteTotal, totalAbono, totalSaldo } = pendientAccounts.reduce((value, item) => {
                            value.totalImporteTotal += item.importeTotal;
                            value.totalAbono += item.abono;
                            value.totalSaldo += item.saldo;
                            return value;

                        }, { totalImporteTotal: 0, totalAbono: 0, totalSaldo: 0 })

                        let html = `<div class="table-responsive">
                    <table class="table table-hover table-bordered table-sm">
                        <thead>
                            <tr>
                                <th><small>N°</small></th>                              
                                <th><small>Tipo. Doc.</small></th>                                                              
                                <th><small>Total</small></th>
                                <th><small>Abono</small></th>
                                <th><small>Saldo</small></th>
                            </tr>
                        </thead>
                        <tbody>`;

                        let index = 1;
                        for (let pendientAccount of pendientAccounts) {
                            html += ` <tr>
                        <td>${index++}</td>
                        <td>${pendientAccount.documento}</td>                        
                        <td>$${pendientAccount.importeTotal}</td>
                        <td>$${pendientAccount.abono}</td>
                        <td>$${pendientAccount.saldo}</td>
                    </tr>
                `
                        }
                        html += `</tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2">Total:</td>
                                <td>${totalImporteTotal.toFixed(2)}</td>
                                <td>${totalAbono.toFixed(2)}</td>
                                <td>${totalSaldo.toFixed(2)}</td>
                            </tr>
                        </tfoot></table></div>`
                        await Swal.fire({
                            title: '<small>Cuentas pendientes</small>',
                            icon: 'info',
                            html,
                            width: 800
                        })

                        return true;
                    }
                })
                .catch(error => {
                    hideLoader();
                    throw error;
                })
        }
        return service;
    })

    /**
     * Nota Entrega 
     */

    app.factory('notaEntregaService', function ($injector) {
        let url = 'Venta/NotaEntrega/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')

        let service = {};

        service.getDataForm = () => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let decimal = mainData[0][0];
                    // let decimal = mainData[1][0];
                    let tarifasImpuesto = mainData[2];
                    let tarifas = mainData[3];
                    let tiemposCredito = mainData[4];
                    // let articuloDefaultTemp = mainData[6];
                    // let articuloDefault = {}
                    // if(articuloDefaultTemp && articuloDefaultTemp.length>0){
                    //     articuloDefault = articuloDefaultTemp[0];
                    // }
                    // let clienteDefaultTemp = mainData[7][0];
                    // let clienteDefault = {};
                    // if(clienteDefaultTemp && clienteDefaultTemp.length>0){
                    //     clienteDefault = clienteDefaultTemp[0];
                    // }
                    let config = mainData[7][0];
                    // let permisosTemp = mainData[9][0];
                    // let permisoJson = JSON.parse(permisosTemp.jsonPermission);
                    // let permisos = permisoJson && permisoJson.additional.requestAuthorizationKey

                    let vendedores = mainData[8];
                    let notificacionVenta = {
                        notificacionVenta: false
                    }
                    let notificacionVentaTemp = mainData[9];
                    notificacionVenta = notificacionVentaTemp.length === 0 ? notificacionVenta : notificacionVentaTemp[0];
                    let tempEstabsAndPtosEmision = mainData[10];
                    let tempBodegas = mainData[11];
                    let tarifaImpuestoVigente = mainData[12][0];
                    let { permisoVenta } = fS.getDataUserRol();
                    console.log(mainData)
                    const tempEstabs = tempEstabsAndPtosEmision.reduce((acc, item) => {
                        const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                        if (!existingItem) {
                            acc.push({
                                idEstablecimiento: item.idEstablecimiento,
                                nombreComercial: item.nombreComercial,
                                codEstab: item.codEstab,
                                defaultEstab: item.defaultEstab,
                                puntosEmision: [{
                                    idPuntoEmision: item.idPuntoEmision,
                                    ptoEmi: item.ptoEmi,
                                    defaultPtoEmi: item.defaultPtoEmi
                                }]
                            });
                        } else {
                            existingItem.puntosEmision.push({
                                idPuntoEmision: item.idPuntoEmision,
                                ptoEmi: item.ptoEmi,
                                defaultPtoEmi: item.defaultPtoEmi
                            });
                        }
                        return acc;
                    }, []);

                    let estabs = tempEstabs.map(estab => ({
                        ...estab,
                        bodegas: tempBodegas.filter(bodega => (bodega.idEstablecimiento === estab.idEstablecimiento))
                            .map(bodega => ({
                                idBodega: bodega.idBodega,
                                bodega: bodega.bodega,
                                descripcion: bodega.bodega,
                                defaultBodega: bodega.defaultBodega,
                            }))
                    }))

                    return {
                        estabs,
                        tarifaImpuestoVigente,
                        tarifasImpuesto,
                        tiemposCredito,
                        tarifas,
                        permisoVenta,
                        notificacionVenta,
                        decimal,
                        config,
                        vendedores
                    }
                }
            })
        }


        /**
         * tipo 1: get notas entrega 
         * tipo 2: get invoices for credit note 
         * tipo 3: get estabs, ptos. emisiones para los filtros
         * @returns 
         */

        service.get = (params) => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    if (params.tipo === 3) {
                        let tempEstabsAndPtosEmision = mainData[0];
                        let estadosDoc = mainData[1];

                        const estabs = tempEstabsAndPtosEmision.reduce((acc, item) => {
                            const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                            if (!existingItem) {
                                acc.push({
                                    idEstablecimiento: item.idEstablecimiento,
                                    nombreComercial: item.nombreComercial,
                                    codEstab: item.codEstab,
                                    defaultEstab: item.defaultEstab,
                                    puntosEmision: [{
                                        idPuntoEmision: item.idPuntoEmision,
                                        ptoEmi: item.ptoEmi,
                                        defaultPtoEmi: item.defaultPtoEmi
                                    }]
                                });
                            } else {
                                existingItem.puntosEmision.push({
                                    idPuntoEmision: item.idPuntoEmision,
                                    ptoEmi: item.ptoEmi,
                                    defaultPtoEmi: item.defaultPtoEmi
                                });
                            }
                            return acc;
                        }, []);


                        return {
                            estabs,
                            estadosDoc
                        }
                    }
                }
            })
        }

        service.getAll = function (query) {

            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 1 })), null, true).then(response => {

                if (!response || response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let notaEntregaRepos = mainData[0];
                    let { totalRecords, totalDocument, totalAbono, totalSaldo } = notaEntregaRepos[0];

                    let notaEntregas = notaEntregaRepos.map(item => {
                        return {
                            comprobante: 'Nota de Entrega',
                            idDocumento: item.idDocumento,
                            idNotaEntrega: item.idNotaEntrega,
                            idCuentaPorCobrar: item.idCuentaPorCobrar,
                            codEstab: item.codEstab,
                            telefonoEstablecimiento: item.telefonoEstablecimiento,
                            nombreComercial: item.nombreComercial,
                            fechaEmision: item.fechaEmision,
                            fechaVencimiento: item.fechaVencimiento,
                            total: item.total,
                            serieComprobante: item.nroDocumento,
                            nombreFiscal: item.nombreFiscal,
                            identificacionComprador: item.identificacionComprador,
                            correo: item.correo,
                            telefono: item.telefono,
                            estadoFinanciero: item.estadoFinanciero,
                            codDoc: item.codDoc,
                            abono: item.abono,
                            saldo: item.saldo,
                            style: item.style,
                            usuario: item.usuario,
                            codEstado: item.codEstado,
                            tiempoCredito: item.tiempoCredito,
                            esContado: item.tiempoCredito,
                        }
                    })


                    return {
                        notaEntregas,
                        dataTotals: { totalRecords, totalDocument, totalAbono, totalSaldo }
                    }
                }
            })
        }

        service.generateSerieComprobante = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 4 })), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let data = mainData[0][0];
                    return data.serieComprobante;
                }
            })
        }

        service.queryMapper = function ({ data, cliente, detalles, itemsDeleted, historyDatosAdicionales }) {
            //
            service.data = Object.assign({}, data);

            let notaEntrega = Object.assign({}, data);
            notaEntrega.fechaEmision = fS.formatDateTimeZone(data.fechaEmision)
            notaEntrega.fechaVencimiento = fS.formatDateTimeZone(data.fechaVencimiento)


            if (cliente.idCliente === 0 && !cliente.razonSocialComprador && !cliente.identificacionComprador) {
                throw new Error("Datos de cliente no proporcionados")
            }

            notaEntrega.idCliente = cliente.idCliente;
            notaEntrega.identificacionComprador = cliente.identificacionComprador;
            notaEntrega.razonSocialComprador = cliente.razonSocialComprador;
            notaEntrega.direccionComprador = cliente.direccionComprador;
            notaEntrega.email = cliente.email;
            notaEntrega.telefono = cliente.telefono;

            const itemsMainMapper = service.detalleMapperTo(detalles);
            const itemsDeletedMapper = service.detalleMapperTo(itemsDeleted)

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]

            return {
                notaEntrega,
                detalles: mergeItems,
                infoAdicionalArticulo: JSON.stringify(historyDatosAdicionales)
            }
        }

        service.detalleMapperTo = function (detalles) {
            let tempDetails = [];
            let orderIndex = 1;

            for (let item of detalles) {

                // Llamar a la función 'getCantidadStock' para obtener la cantidad en stock del elemento actual
                let {
                    cantidadStock,
                    action
                } = service.getCantidadStock(item);


                if (action === 0) {
                    // Comprobar si el elemento tiene un 'idNotaEntregaDetalle' positivo y está en estado 'activo'
                    if (item.idNotaEntregaDetalle > 0 && item.estado) {
                        // Verificar si 'cantidad' es igual a 'cantidadOriginal'
                        if (item.cantidad === item.cantidadOriginal) {
                            cantidadStock = 0;  // Si son iguales, establecer 'cantidadStock' en 0
                        } else {
                            // Calcular 'cantidadStock' en función de la diferencia entre 'cantidadOriginal' y 'cantidad'
                            if (item.cantidad > item.cantidadOriginal) {
                                cantidadStock = item.cantidadOriginal - item.cantidad;
                            } else {
                                cantidadStock = item.cantidadOriginal - item.cantidad;
                            }
                        }
                    }
                    if (item.idNotaEntregaDetalle > 0 && item.estado === 0) {
                        cantidadStock = Math.abs(cantidadStock)
                    }
                }



                tempDetails.push({
                    orderIndex: orderIndex++,
                    idNotaEntregaDetalle: item.idNotaEntregaDetalle || 0,
                    idFacturaDetalle: item.idFacturaDetalle || 0,
                    idArticulo: item.idArticulo,
                    idTarifa: item.idTarifa,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa,
                    codigoPorcentaje: item.codigoPorcentaje,
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioCostoNeto: item.precioCostoNeto, //❌
                    precioUnitario: item.precioUnitario,
                    precioVenta: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    total: item.total,
                    nota: item.nota, //✅
                    cantidadStock, //✅
                    llevaInventario: item.llevaInventario,//✅
                    precioCosto: item.precioCosto,  //✅
                    cantidadTransaccion: item.cantidad * item.conversion, //✅
                    estado: item.estado //✅
                })
            }
            return tempDetails;
        }

        /**
         * 
         * @param {*} rowEntity 
         * @param {*} fechaEmision unicamente se envia desde el controlador de NotaEntregaCtrl
         * @returns 
         */
        service.getCantidadStock = function (rowEntity, fechaEmision) {
            let fechaEmisionValidate = null;
            let cantidadStock = 0;
            let action = 0;

            if (fechaEmision) {
                fechaEmisionValidate = fechaEmision;
            } else {
                fechaEmisionValidate = service.data.fechaEmision;
            }
            if (!fechaEmisionValidate) {
                console.warn('Para validacion del cantidad stock la fecha emision del comprobante es nula')
            }

            let dataConsolidacionFecha = rowEntity.consolidacionesFecha.find(
                cdataFecha => cdataFecha.idBodega === rowEntity.idBodega
            )
            if (dataConsolidacionFecha && fS.isDateValid(dataConsolidacionFecha.fechaConsolidacion)) {
                if (dataConsolidacionFecha.fechaConsolidacion > fechaEmisionValidate) {
                    cantidadStock = 0;
                    action = 1;
                    return {
                        cantidadStock,
                        action
                    };
                } else {
                    action = 2;
                }
            }

            cantidadStock = rowEntity.cantidad * rowEntity.conversion;
            let resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;

            return {
                cantidadStock: resultCantStock,
                action
            };
        }


        service.save = function (data) {
            return mS.getData('post', url + 'Insert/', { data }, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    let dataRepository = JSON.parse(response.payload)[0];

                    let dataResponse = {
                        ...dataRepository,
                        esContado: dataRepository.tiempoCredito,
                    }

                    return {
                        dataResponse,
                        code: '1',
                        message: 'Registrado Correctamente'
                    }
                }
            })
        }

        service.getId = function (id) {
            return mS.getData('get', `${url}GetId/${id}`, null, true).then(response => {
                if (response.code === "0") {
                    console.log(response)
                }
                if (response.code === "1") {
                    let mainDataApi = JSON.parse(response.payload);
                    console.log(mainDataApi)
                    const [
                        comprobanteApi,
                        clienteTempApi,
                        itemsApi,
                        infoAdicionalDocumento,
                        datosAdicionalesArticuloTemp
                    ] = mainDataApi;

                    let comprobanteTemp = comprobanteApi && comprobanteApi[0] || {};
                    let cliente = clienteTempApi && clienteTempApi[0] || {};

                    let items = itemsApi.map(itemPrincipal => {

                        const { fraccionado, principal, consolidacion, ...restItem } = itemPrincipal;

                        // Medidas del artículo fraccionado del principal
                        let medidasFraccionadoTemp = JSON.parse(fraccionado);

                        // Medida principal con las tarifas
                        let medidasPrincipalTemp = JSON.parse(principal);

                        // 
                        let consolidacionesFecha = JSON.parse(consolidacion);

                        /**
                         * Combinar los dos arrays de medidas en uno solo
                         *
                         * Parámetros:
                         *  - mergedMedidasArray: El array resultante de la combinación de los dos arrays de medidas
                         */
                        const mergedMedidasArray = [...medidasFraccionadoTemp, ...medidasPrincipalTemp];

                        /**
                         * Ordenar el array de medidas en función de la propiedad "orden" y
                         * establecer la propiedad "defaultMedida" en falso para todos los elementos
                         *
                         * Parámetros:
                         *  - orderMedidaArray: El array de medidas ordenado
                         */
                        let orderMedidaArray = mergedMedidasArray.sort((a, b) => a.orden - b.orden).map(medida => ({
                            ...medida,
                            defaultMedida: false
                        }));

                        // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
                        orderMedidaArray[0].defaultMedida = true;


                        /**
                         * Obtener los datos de la medida
                         *
                         * Parámetros:
                         *  - orderMedidaArray: El array de medidas ordenado
                         *  - restItem: El artículo
                         *
                         * Devuelve:
                         *  - Los datos de la medida, o un objeto vacío si la medida no se encuentra
                         */
                        let dataMedida = orderMedidaArray.find(m => m.idMedida === restItem.idMedida) || {};

                        // Asignar los datos de la medida al artículo
                        restItem.medidas = orderMedidaArray;
                        restItem.conversion = dataMedida.conversion;
                        // Asignar los datos de las tarifas obtenidos de data medida 
                        restItem.articuloTarifas = dataMedida.tarifas || [];

                        restItem.consolidacionesFecha = consolidacionesFecha.map((data)=>({ 
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }))


                        let subTotal = restItem.cantidad * restItem.precioUnitario || 0;
                        let totalDescuento = restItem.cantidad * restItem.valorDescuento || 0;

                        restItem.subTotal = subTotal || 0;
                        restItem.totalDescuento = totalDescuento || 0;
                        restItem.cantidadOriginal = restItem.cantidad;
                        return restItem;
                    });

                    let comprobante = {
                        ...comprobanteTemp,
                        serieComprobante: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}-${comprobanteTemp.secuencial}`,
                        puntoEmision: `${comprobanteTemp.estab}-${comprobanteTemp.ptoEmi}`,
                        fechaEmision: fS.formatDate(comprobanteTemp.fechaEmision),
                        fechaVencimiento: fS.formatDate(comprobanteTemp.fechaVencimiento),
                        fechaEmisionDocCreado: fS.formatDate(comprobanteTemp.fechaEmision)
                    }

                    let datosAdicionalesArticulo = datosAdicionalesArticuloTemp.map(item => ({
                        idDocumento: item.idDocumento,
                        idHistoryInfoAdicional: item.idHistoryInfoAdicional,
                        idArticulo: item.idArticulo,
                        idEtiqueta: item.idEtiqueta,
                        idInfoAdicional: item.idInfoAdicional,
                        jsonAdicional: item.jsonAdicional && JSON.parse(item.jsonAdicional) || [],
                        selected: item.selected,
                        estado: item.estado
                    }))

                    return {
                        comprobante,
                        cliente,
                        items,
                        infoAdicionalDocumento,
                        datosAdicionalesArticulo
                    }
                }
            })
        }


        service.update = function (id, data) {

            return mS.getData('put', url + 'Update/' + id, { data }, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response
                }
            })
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                if (response.code === "0") {
                    return response;
                }
                if (response.code === "1") {
                    return response
                }
            })
        }

        //Validaciones
        service.getTotales = function (notaEntregas) {
            let total = 0, totalAbono = 0, totalSaldo = 0;
            for (let val of notaEntregas) {
                total += val.total;
                totalAbono += val.abono;
                totalSaldo += val.saldo;
            }
            return {
                total,
                totalAbono,
                totalSaldo
            }
        }

        return service;

    })



    //---------------------------------Cliente------------------------------------------
    app.factory('clienteService', function ($injector) {
        let url = 'Venta/Cliente/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        let tS = $injector.get('toastService');

        let service = {};

        service.getDataForm = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 2 }), null, true)
                .then(response => {
                    if (response.code === '0') {
                        console.log('Status code 0: Get Data Form Customer')
                        throw response
                    }
                    if (response.code === '1') {
                        let mainDataRepository = JSON.parse(response.payload)
                        return {
                            tipoIdentificacion: mainDataRepository[0],
                            tipoContribuyentes: mainDataRepository[1],
                            tiempoCreditos: mainDataRepository[2] || [],
                            ciudades: mainDataRepository[3],
                            tiposCliente: mainDataRepository[4] || [],
                            empresas: mainDataRepository[5] || [],
                            cargos: mainDataRepository[6] || [],
                        }
                    }
                }).catch(response => {
                    throw response;
                })

        }

        service.getAll = function (query) {
            query.tipo = 1;
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true)
                .then(response => {
                    if (response.code == "0") {
                        throw response;
                    }
                    if (response.code == "1") {
                        let clientes = JSON.parse(response.payload)[0] || [];

                        return clientes.map(item => {
                            return {
                                idCliente: item.idCliente,
                                numeroIdentificacion: item.numeroIdentificacion,
                                nombreFiscal: item.nombreFiscal,
                                direccion: item.direccion,
                                telefono: item.telefono,
                                correo: item.correo,
                                estado: item.estado,
                                consumidorFinal: item.consumidorFinal,
                                validationSri: item.validationSri,
                                tipoIdentificacion: item.tipoIdentificacion,
                                esConsumidorFinal: item.codTipoIdentificacion == 'CF',
                                totalRecords: item.totalRecords,
                            }
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    throw error;
                })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true)
                .catch(error => {
                    console.log('Error service save customer: ' + error)
                    throw error;
                })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true)
                .catch(error => {
                    console.log('Error service update customer: ' + error)
                    throw error;
                })
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true)
                .catch(error => {
                    console.log('Error service delete customer: ' + error)
                    throw error;
                })
        }

        service.findById = function (id) {
            return mS.getData('get', url + 'FindById/' + id, null, true)
                .then(response => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let dataRepository = JSON.parse(response.payload)[0];

                        return {
                            idCliente: dataRepository.idCliente,
                            idTipoClienteProveedor: dataRepository.idTipoClienteProveedor,
                            idTipoEntidad: dataRepository.idTipoEntidad,
                            idSubContribuyente: dataRepository.idSubContribuyente,
                            idTiempoCredito: dataRepository.idTiempoCredito,
                            idTipoIdentificacion: dataRepository.idTipoIdentificacion,
                            idCiudad: dataRepository.idCiudad,
                            numeroIdentificacion: dataRepository.numeroIdentificacion,
                            nombreFiscal: dataRepository.nombreFiscal,
                            montoCredito: dataRepository.montoCredito,
                            nombreComercial: dataRepository.nombreComercial,
                            direccion: dataRepository.direccion,
                            telefono: dataRepository.telefono,
                            correo: dataRepository.correo,
                            estado: dataRepository.estado,
                            idEmpleado: dataRepository.idEmpleado,
                            diasCredito: dataRepository.diasCredito,
                            empleado: dataRepository.empleado,
                            idEmpresa: dataRepository.idEmpresa,
                            idCargo: dataRepository.idCargo,
                            placa: dataRepository.placa,
                            validationSri: dataRepository.validationSri,
                            correos: dataRepository.correo ? dataRepository.correo.split(';') : [],
                            telefonos: dataRepository.telefono ? dataRepository.telefono.split(';') : [],
                            placas: dataRepository.placa !== '' ? dataRepository.placa.split(';') : []
                        }
                    }
                })
                .catch(error => {
                    console.log('Error service get customer Find by Id: ' + error)
                    throw error;
                })
        }

        /**
         * 
         * @param {object} query  {textSearch}
         * @returns 
         */
        service.search = function (query) {
            if (!query) {
                throw new Error('No se ha proporcionado ningun parámetro')
            }
            if (!('textSearch' in query)) {
                throw new Error(`La propiedad "textSearch" no se ha proporcionado`)
            }

            let text = query.textSearch ? query.textSearch.replace(/^-+|-+$| [^A-Za-z0-9.-]+/g, "") : ''
            let obj = {
                ...query,
                textSearch: text
            }


            return mS.getData('get', url + 'Search?json=' + JSON.stringify(obj), null, true).then(response => {
                if (response.code === '0') {
                    return response;
                }
                if (response.code === '1') {
                    let clientes = JSON.parse(response.payload) || [];
                    return clientes.map(item => {
                        return {
                            idCliente: item.idCliente,
                            nombreFiscal: item.nombreFiscal,
                            nombreComercial: item.nombreComercial,
                            numeroIdentificacion: item.numeroIdentificacion,
                            direccion: item.direccion,
                            correo: item.correo,
                            idTiempoCredito: item.idTiempoCredito,
                            diasCredito: item.diasCredito,
                            nombreCompleto: item.nombreCompleto,
                            placa: item.placa,
                            validationSri: item.validationSri,
                            tipoIdentificacion: item.tipoIdentificacion
                        }
                    })
                }
            }).catch(error => {
                throw error;
            })
        }




        service.validateForm = function (data) {

            if (!data.numeroIdentificacion) {
                tS.toastr('warning', 'Ingrese Número de Identificación')
                return;
            }

            if ($("#numeroIdentificacion").hasClass('is-invalid')) {
                tS.toastr('warning', 'Ingrese el número de Identificación válido');
                return
            }

            if (data.codigoIdentificacion === "CF" && data.numeroIdentificacion.length !== 13) {
                tS.toastr('warning', 'Número de Consumidor Final tiene que ser de 13 dígitos');
                return
            }

            if (data.codigoIdentificacion === "C" && data.numeroIdentificacion.length !== 10) {
                tS.toastr('warning', 'Número de Cédula tiene que ser de 10 dígitos');
                return
            }

            if (data.codigoIdentificacion === "R" && data.numeroIdentificacion.length !== 13) {
                tS.toastr('warning', 'Número de RUC tiene que ser de 13 dígitos');
                return
            }

            if (data.codigoIdentificacion === "R" && data.numeroIdentificacion.slice(-3) !== '001') {
                tS.toastr('warning', 'Número de RUC tiene que contener 001');
                return
            }

            // if (form.campo(data.idSubContribuyente)) {
            //     tS.toastr('warning', 'Seleccione el Contribuyente', tituloModal)
            //     return
            // }
            if (!data.nombreFiscal) {
                tS.toastr('warning', 'Ingrese el nombre Fiscal')
                return
            }
            if (!data.nombreComercial) {
                tS.toastr('warning', 'Ingrese el nombre Comercial')
                return
            }

            if (data.correos.length > 0) {
                if (!data.correos.every(item => fS.isEmail(item))) {
                    tS.toastr('warning', 'Verifique que los correos  esten ingresado correctamente');
                    return
                }
            }

            if (!(data.idTiempoCredito > 0)) {
                tS.toastr('warning', 'Seleccione el Tiempo Credito');
                return
            }


            data.direccion = data.direccion ? fS.letterInline(data.direccion) : "";
            data.telefono = data.telefonos.length > 0 ? data.telefonos.join(';') : "";
            data.correo = data.correos.length > 0 ? data.correos.join(';') : "";
            data.placa = data.placas.length > 0 ? data.placas.join(';') : "";


            return true;
        }



        service.checkClientByIdentification = function (query, codigoIdentificacion, callback) {
            mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    callback(codigoIdentificacion)
                    // return response;
                }
                if (response.code === "1") {

                    let clienteRepository = JSON.parse(response.payload)[0][0]

                    // return {
                    //     idCliente: clienteRepository.idCliente,
                    //     numeroIdentificacion: clienteRepository.numeroIdentificacion,
                    //     nombreFiscal: clienteRepository.nombreFiscal,
                    //     direccion: clienteRepository.direccion,
                    //     telefono: clienteRepository.telefono,
                    //     correo: clienteRepository.correo,
                    //     estado: clienteRepository.estado,
                    //     consumidorFinal: clienteRepository.consumidorFinal,
                    //     totalRecords: clienteRepository.totalRecords,
                    //     validationSri: clienteRepository.validationSri,
                    //     tipoIdentificacion: clienteRepository.tipoIdentificacion,
                    //     esConsumidorFinal: clienteRepository.tipoIdentificacion=='CF',
                    // }
                    Swal.fire({
                        title: `Cliente Registrado`,
                        html: `
                                <small><strong>Nro. Identificación</strong></small>
                                <br>
                                <p class="text-muted small">${clienteRepository.numeroIdentificacion}</p>
                                <small><strong>Nombre Fiscal</strong></small> <br>
                                <p class="text-muted small">${clienteRepository.nombreFiscal}</p>

                                <small><strong>Nombre Comercial</strong></small> <br>
                                <p class="text-muted small">${clienteRepository.nombreComercial}</p>
                            `,
                        icon: 'info',
                        showCloseButton: true,
                        showCancelButton: true,
                        focusConfirm: true,
                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Validar datos!',
                        confirmButtonAriaLabel: 'Validar datos!',
                        cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancelar',
                        cancelButtonAriaLabel: 'Cancelar'
                    }).then(result => {
                        if (result.isConfirmed) {
                            callback(codigoIdentificacion);
                        }
                    })
                }
            }).catch(error => {
                console.log(error);
                throw error;
            })
        }

        service.checkClientSRIByRUC = function (identificacion) {
            return mS.getData('get', 'Consultas/GetRucSRI?Ruc=' + identificacion, null, true)
        }

        service.checkClientSRIByCedula = function (identificacion) {
            return mS.getData('get', 'Consultas/GetCedulaSri?Ruc=' + identificacion, null, true)
        }


        service.onKeyupEmail = function (item) {
            let textChip = item.target.value || "";
            textChip = fS.removeAccents(textChip);
            item.target.value = textChip.toLowerCase();
        }

        service.transformChipEmail = function (item) {
            let textChip = item || "";
            textChip = fS.removeAccents(textChip);
            item = textChip.toLowerCase();
        }
        return service;

    })


    app.factory('empleadoService', function ($injector) {
        let url = 'Venta/Empleado/';
        let mS = $injector.get('mainService');
        return {
            getAll,
            getDataForm,
            search,
            deleteEmployee,
            save,
            update
        }

        function getAll(query) {
            let spParams = {
                ...query,
                tipo: 1,
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(spParams), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let employeesApi = JSON.parse(response.payload);
                    return employeesApi.map(item => ({
                        idEmpleado: item.idEmpleado,
                        idTipoIdentificacion: item.idTipoIdentificacion,
                        nroIdentificacion: item.nroIdentificacion,
                        nombreCompleto: item.nombreCompleto,
                        estado: item.estado,
                        totalDatos: item.totalDatos,
                    }))
                }
            })
        }

        function getDataForm() {
            let spParams = {
                tipo: 2,
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(spParams), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    return {
                        tiposIdentificacion: mainData
                    }
                }
            })
        }

        function search(json) {
            return mS.getData('get', url + 'Search?json=' + JSON.stringify(json), null, true)
                .then(response => {
                    if (response.code === '0') {
                        throw response;
                    }
                    if (response.code === '1') {
                        let employeesApi = JSON.parse(response.payload);
                        return employeesApi.map(item => ({
                            idEmpleado: item.idEmpleado,
                            idTipoIdentificacion: item.idTipoIdentificacion,
                            nroIdentificacion: item.nroIdentificacion,
                            nombreCompleto: item.nombreCompleto,
                            estado: item.estado,
                        }))
                    }
                })
                .catch(error => {
                    console.log(error)
                    throw error;
                })
        }

        function deleteEmployee(id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true);
        }

        function save(data) {
            return mS.getData('post', url + 'Insert?json=' + JSON.stringify(data), null, true)
                .catch(error => {
                    console.log('Error service save employee: ' + error)
                    throw error;
                })
        }

        function update(id, data) {
            return mS.getData('put', url + 'Update/' + id + '?json=' + JSON.stringify(data), null, true)
                .catch(error => {
                    console.log('Error service update employee: ' + error)
                    throw error;
                })
        }

    })


    app.factory('cargoService', function ($injector) {
        let URL = 'Venta/Cargo/';
        let mS = $injector.get('mainService');

        let service = {}

        service.get = (query) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let cargos = JSON.parse(response.payload);
                    return cargos;

                }
            })
        }

        service.post = (data) => {
            return mS.getData('post', URL + '?json=' + JSON.stringify(data), null, true)
        }

        service.put = (id, data) => {
            return mS.getData('put', URL + id + '?json=' + JSON.stringify(data), null, true)
        }

        service.delete = (id) => {
            return mS.getData('delete', URL + '' + id, null, true)
        }

        return service;

    })


    app.factory('empresaService', function ($injector) {
        let URL = 'Venta/Empresa/';
        let mS = $injector.get('mainService');

        let service = {}

        service.get = (query) => {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let empresas = JSON.parse(response.payload);
                    return empresas;

                }
            })
        }

        service.post = (data) => {
            return mS.getData('post', URL + '?json=' + JSON.stringify(data), null, true)
        }

        service.put = (id, data) => {
            return mS.getData('put', URL + id + '?json=' + JSON.stringify(data), null, true)
        }

        service.delete = (id) => {
            return mS.getData('delete', URL + '' + id, null, true)
        }

        return service;

    })


    app.factory('storageService', storageService)

    storageService.$inject = ['$window']

    function storageService($window) {

        return {
            set: function (key, value) {
                return $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },


            askToSaveDetailDoc: async function (name, valueStorage) {
                let { isConfirmed, value } = await Swal.fire({
                    title: '<small>Apartar Documento</small>',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Apartar',
                    cancelButtonText: 'No, cancelar',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Ingrese la descripción!'
                        }

                        if (Object.keys(this.getObject(name)).length > 0) {
                            if (this.getObject(name)[value]) {
                                return 'Ya existe Documento Apartado con esta descripción';
                            }
                        }
                    },
                })

                if (isConfirmed) {
                    if (Object.keys(this.getObject(name)).length > 0) {
                        let dataInvoiceDetail = this.getObject(name)
                        dataInvoiceDetail[value] = JSON.stringify(valueStorage);
                        this.setObject(name, dataInvoiceDetail)
                        toastr.success('Documento Apartado Correctamente')
                    }

                    if (Object.keys(this.getObject(name)).length === 0) {
                        let objSave = {
                            [value]: JSON.stringify(valueStorage)
                        }
                        this.setObject(name, objSave)
                        toastr.success('Documento Apartado Correctamente')
                    }

                }

                return isConfirmed;


            },

            restoreInvoiceDetail: async function (name) {
                let dataInvoiceDetail = this.getObject(name)

                const { isConfirmed, value } = await Swal.fire({
                    title: '<small>Recuperar Detalle del Documento</small>',
                    input: 'select',
                    inputOptions: Object.keys(dataInvoiceDetail).reduce((obj, cur) => ({ ...obj, [cur]: cur }), {}),
                    inputPlaceholder: 'Seleccionar el documento',
                    showCancelButton: true,
                    confirmButtonText: 'Recuperar detalle',
                    cancelButtonText: 'No, cancelar',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    inputValidator: (value) => {
                        return new Promise((resolve) => {
                            if (value) {
                                resolve()
                            } else {
                                resolve('Seleccione la opción :)')
                            }
                        })
                    }
                })


                return {
                    isConfirmed,
                    value,
                    dataInvoiceDetail
                }
            }

        }
    }

})(window.angular)