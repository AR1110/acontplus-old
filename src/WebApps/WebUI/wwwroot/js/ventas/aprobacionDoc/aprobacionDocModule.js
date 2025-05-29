//@ts-check

class ListAprobacionDocMapper {
    static toJson(params) {
        return JSON.stringify({
            ...params,
            tipo: 1
        })
    }


    static fromJson(response) {
        const results = {
            data: [],
            totalRecords: 0,
        }

        if (response.code === "1") {
            let [payload = []] = JSON.parse(response.payload);

            results.data = payload.map(item => {
                return {
                    id: item.idAprob_Document,
                    codEstab: item.codEstab,
                    docOrigenDesc: item.docOrigenDesc,
                    docDestinoDesc: item.docDestinoDesc,
                    fechaEmision: item.fechaEmision,
                    serieDoc: item.serie,
                    identificacionComprador: item.identificacionComprador,
                    razonSocialComprador: item.razonSocialComprador,
                    total: item.total,
                    codEstado: item.codEstado,
                    nombreEstado: item.estado,
                    totalRecords: item.totalRecords,
                    userName: item.userName,
                    docDestino: item.docDestino,// codigo del documento destino

                    // idAprob_Document: item.idAprob_Document,
                    // uniqueId: item.uniqueId,
                    // codEstab: item.codEstab,
                    // docOrigen: item.docOrigen,
                    // codDoc: item.codDoc,
                    // docDestino: item.codDoc,
                    // docOrigenDesc: item.docOrigenDesc,
                    // docDestinoDesc: item.docDestinoDesc,
                    // fechaEmision: item.fechaEmision,
                    // serie: item.serie,
                    // serieComprobante: item.serie,
                    // identificacionComprador: item.identificacionComprador,
                    // razonSocialComprador: item.razonSocialComprador,
                    // total: item.total,
                    // codEstado: item.codEstado,
                    // estado: item.estado,
                    // colorFila: item.colorFila,
                    // userName: item.userName,
                    // totalRecords: item.totalRecords,
                }
            })

            results.totalRecords = results.data.length > 0 ? results.data[0].totalRecords : 0;
        }
        return results;
    }
}


class FilterDataAprobacionDocMapper {
    static toJson() {
        return JSON.stringify({
            tipo: 3
        })
    }
    static fromJson(response, fS) {
        const results = {
            estabs: [],
            estadoDocs: []
        }
        if (response.code === "1") {
            let [tempEstabsAndPtosEmision, estadoDocs] = JSON.parse(response.payload);
            let dataToGroup = {
                estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision 
            }
            let estabs = fS.groupingEstab(dataToGroup);
            return {
                estabs,
                estadoDocs
            }

        }
        return results;
    }
}

class GetFormDataAprobacionDocMapper {
    static toJson() {
        return JSON.stringify({
            tipo: 2,
        });
    }

    static fromJson(response, { userCustomerPermissionSvc, fS }) {
        if (response.code == "0") {
            throw response;
        }
        if (response.code === "1") {
            const mainData = JSON.parse(response.payload);

            let decimal = mainData[0][0];
            let tarifasImpuesto = mainData[1];
            let tarifas = mainData[2];
            let tiemposCredito = mainData[3];

            let tempEstabsAndPtosEmision = mainData[4];
            let tempBodegas = mainData[5];
            let vendedores = mainData[6];
            let config = mainData[7][0];
            let tiposDoc = mainData[8];
            let { sales: permisoVenta } = userCustomerPermissionSvc.userPermissionAdapter();

            let dataToGroup = {
                estabs: tempEstabsAndPtosEmision, //Establecimientos con puntos de emision
                bodegas: tempBodegas, // Establecimientos con bodegas
                isGroupBodega: true
            }
            let estabs = fS.groupingEstab(dataToGroup);

            return {
                estabs,
                tarifasImpuesto,
                tiemposCredito,
                tarifas,
                permisoVenta,
                decimal,
                vendedores,
                config,
                tiposDoc
            }
        }
    }


}

class CreateUpdtateAprobacionDocMapper {
    static toJson(data, options) {
        let { selectedDocshistorial, infoAdicionalDocumento, datosAdicionalesArticulo } = data;


        const impuestos = options.fS.impuestoTarifaMapperTo(data.detalles);

        const {
            idCliente,
            idTiempoCredito,
            idPuntoEmision,
            fechaEmision,
            subTotalSinImpuestos,
            totalDescuento,
            propina,
            total,
            observacion,
            idUsuario,
            idTipoDocDestino,
            idTipoDocOrigen,
        } = data.comprobante;
        const comprobante = {
            idCliente,
            idTiempoCredito,
            idPuntoEmision,
            fechaEmision: options.fS.formatDateTimeZone(fechaEmision),
            subTotalSinImpuestos,
            totalDescuento,
            importeTotal: total,
            propina,
            observacion,
            idUsuario,
            idTipoDocumento: idTipoDocDestino,
            idTipoDocOrigen,
        }

        const detalles = data.detalles.map((item, index) => {

            return {
                orderIndex: index++,
                idAprob_Document_Detailt: item.idAprob_Document_Detailt || 0,
                idTarifa: item.idTarifa,
                idArticulo: item.idArticulo,
                idTipoIva: item.idTipoIva,
                idMedida: item.idMedida,
                cantidad: item.cantidad,
                descripcion: item.descripcion,
                precioUnitario: item.precioUnitario,
                precioConIva: item.precioConIva,
                descuento: item.valorDescuento,
                precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                nota: item.nota,
                codigoPorcentaje: item.codigoPorcentaje, //✅
                tarifa: item.tarifa,//✅
                valorImpuesto: item.valorImpuesto,//✅
                llevaInventario: item.llevaInventario,
                idBodega: item.idBodega,
                fechaEmision: options.fS.formatDateTimeZone(item.fechaEmision),
                estado: item.estado
            }

        })

        return {
            comprobante,
            detalles,
            impuestos,
            historial: selectedDocshistorial,
            infoAdicional: infoAdicionalDocumento,
            infoAdicionalArticulo: datosAdicionalesArticulo
        }
    }


}

class DetalleAprobacionDocMapper {
    static toJson(id) {
        return JSON.stringify({
            id,
            tipo: 4
        });
    }
    static fromJson(response, options) {
        let mainDataApi = JSON.parse(response.payload);

        let dataTemp = mainDataApi[0][0];
        let cliente = mainDataApi[1][0];
        let itemsTemp = mainDataApi[2];
        let historialRepository = mainDataApi[3];
        let tarifasImpuesto = mainDataApi[4];
        let { nombreComercial, fechaEmision, ...restData } = dataTemp;
        let data = {
            ...restData,
            establecimiento: nombreComercial,
            fechaEmision: options.fS.formatDate(fechaEmision),
            fechaEmisionEscrita: options.fS.getFechaEscrita(options.fS.formatDate(fechaEmision)),
        }


        let resultsItems = itemsTemp.map(item => {
            let precioConIva = options.pricingUtils.calcularPrecioConIva(item.precioUnitario, item.tarifa);
            return {
                ...item,
                precioConIva
            }
        })

        return {
            comprobante: data,
            cliente,
            items: resultsItems,
            historial: historialRepository || [],
            tarifasImpuesto
        }

    }
}

class GetIdAprobacionDocMapper {

    static fromJson(response, { fS, pricingUtils }) {
        let dataRepository = JSON.parse(response.payload);

        let compRepository = dataRepository[0][0];
        let clienteRepository = dataRepository[1][0];
        let detalleRepository = dataRepository[2];
        let historialRepository = dataRepository[3];
        let infoAdicionalDocumento = dataRepository[4];
        //let datosAdicionalesArticulo = dataRepository[5];
        let formasPago = dataRepository[5];
        let config = dataRepository[6] ? dataRepository[6][0] : {}

        let clienteMapper = {
            idCliente: clienteRepository.idCliente,
            nombreComercial: clienteRepository.nombreComercial,
            nombreFiscal: clienteRepository.nombreFiscal,
            numeroIdentificacion: clienteRepository.numeroIdentificacion,
            direccion: clienteRepository.direccion,

            idTipoIdentificacion: clienteRepository.idTipoIdentificacion,
            codigoSriTipoIdentificacion: clienteRepository.tipoIdentificacion,
            identificacionComprador: clienteRepository.numeroIdentificacion,
            razonSocialComprador: clienteRepository.nombreFiscal,

            idFormaPagoSri: clienteRepository.idFormaPagoSri
        }

        let compMapper = {
            idCliente: clienteMapper.idCliente,
            idAprob_Document: compRepository.idAprob_Document,
            uniqueId: compRepository.uniqueId,
            idTiempoCredito: compRepository.idTiempoCredito,
            idPuntoEmision: compRepository.idPuntoEmision,
            estab: compRepository.estab,
            ptoEmi: compRepository.ptoEmi,
            serieComprobante: compRepository.serieComprobante,
            identificacionComprador: compRepository.identificacionComprador,
            codDoc: compRepository.codDoc,
            docDestino: compRepository.codDoc,
            docOrigen: compRepository.docOrigen,
            observacion: compRepository.observacion,
            totalDescuento: compRepository.totalDescuento,
            propina: compRepository.propina,
            importeTotal: compRepository.importeTotal,
            total: compRepository.importeTotal,

            puntoEmision: `${compRepository.estab}-${compRepository.ptoEmi}`,
            fechaEmision: fS.formatDate(compRepository.fechaEmision),
            fechaEmisionDocCreado: fS.formatDate(compRepository.fechaEmision),
            idUsuario: compRepository.idUsuario
        }


        let items = detalleRepository.map((itemPrincipal, index) => {

            const { fraccionado, principal, consolidacion, fechaEmision, ...restItem } = itemPrincipal;

            let consolidacionesFechaTemp = consolidacion && JSON.parse(consolidacion) || [];
            let consolidacionesFecha = consolidacionesFechaTemp.map((data) => ({
                ...data,
                fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
            }))

            const medidas = fS.processAndSortMeasures(principal, fraccionado);

            let dataMedida = medidas.find(m => m.idMedida === restItem.idMedida) || {};


            let precioConIva = pricingUtils.calcularPrecioConIva(itemPrincipal.precioUnitario, itemPrincipal.tarifa);

            let obj = {
                uniqueRowDetalle: fS.generateUuidv4(),
                n: index + 1,
                idAprob_Document_Detailt: restItem.idAprob_Document_Detailt,
                cantidad: restItem.cantidad,
                cantidadOriginal: restItem.cantidad,
                codigo: restItem.codigo,
                codigoPorcentaje: restItem.codigoPorcentaje,//✅
                descripcion: restItem.descripcion,
                ice: restItem.ice || 0,
                idArticulo: restItem.idArticulo,
                idBodega: restItem.idBodega,
                idImpuesto: restItem.idImpuesto,
                idMedida: restItem.idMedida,
                idTarifa: restItem.idTarifa,
                idTipoIva: restItem.idTipoIva,
                llevaInventario: restItem.llevaInventario,
                porcentajeDescuento: restItem.porcentajeDescuento || 0,
                precioSinSubsidio: restItem.precioSinSubsidio || 0,
                precioCosto: dataMedida.precioCosto,
                precioCostoFraccionado: dataMedida.precioCostoFraccionado,
                precioUnitario: restItem.precioUnitario,
                precioConIva: precioConIva || 0,
                tarifa: restItem.tarifa,//✅
                valorDescuento: restItem.descuento,
                valorImpuesto: restItem.valorImpuesto,//✅
                precioTotalSinImpuesto: restItem.precioTotalSinImpuesto,
                medidas,
                conversion: dataMedida.conversion,
                articuloTarifas: dataMedida.tarifas,
                consolidacionesFecha,
                estado: 1,
                datosAdicionalesArticulo: restItem.datosAdicionalesArticulo || [],
                fechaEmision: fechaEmision && fS.formatDate(fechaEmision) || null,
                datosAdicionales: restItem.datosAdicionales,
                nota: restItem.nota || null
            }

            return obj;
        });

        return {
            comprobante: compMapper,
            cliente: clienteMapper,
            detalles: items,
            historial: historialRepository,
            infoAdicionalDocumento: infoAdicionalDocumento,
            datosAdicionalesArticulo: [],
            formasPago: fS.mapperFromFormaPago(formasPago),
            config
        }
    }
}


class ConvertToDocAprobacionDocMapper {
    static toJson(obj, { fS }) {
        let {
            id,
            codDocDestino,
            codDoc,
            comprobante,
            detalles,
            infoAdicionalDocumento,
            cuotas,
            dataFormaPago,
            historyDatosAdicionales
        } = obj;

        let resultComprobante = {
            idAprob_Document: id,
            idTiempoCredito: comprobante.idTiempoCredito,
            idCliente: comprobante.idCliente,
            idPuntoEmision: comprobante.idPuntoEmision,
            idUsuario: comprobante.idUsuario || 0,
            fechaEmision: fS.formatDateMoment(comprobante.fechaEmision),
            fechaVencimiento: fS.formatDateMoment(comprobante.fechaVencimiento),
            subTotalSinImpuestos: comprobante.subTotalSinImpuestos,
            totalDescuento: comprobante.totalDescuento,
            porcentajeDescuento: comprobante.porcentajeDescuento,
            propina: comprobante.propina || 0,
            recargo: comprobante.recargo || 0,
            transporte: comprobante.transporte || 0,
            total: comprobante.total,
            observacion: comprobante.observacion,
            docDestino: codDocDestino,
            codDoc
        }


        const resultDetalles = detalles.map((item, index) => {
            let cantidadTransaccion = item.cantidad * (item.conversion || 1)
            return {
                uuid: item.uniqueRowDetalle,
                orderIndex: index++,
                idArticulo: item.idArticulo,
                idTarifa: item.idTarifa,
                idBodega: item.idBodega,
                idMedida: item.idMedida,
                idTipoIva: item.idTipoIva,
                tarifa: item.tarifa, //✅
                codigoPorcentaje: item.codigoPorcentaje, //✅
                ice: item.ice,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                valorDescuento: item.valorDescuento,
                precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                porcentajeDescuento: item.porcentajeDescuento,
                nota: item.nota || undefined,
                llevaInventario: item.llevaInventario,
                precioCosto: item.precioCosto,
                precioSinSubsidio: item.precioSinSubsidio,
                conversion: item.conversion,
                precioCostoFraccionado: item.precioCostoFraccionado,
                cantidadTransaccion,
                estado: item.estado,
                valorImpuesto: item.valorImpuesto
            }
        })
        const impuestos = fS.impuestoTarifaMapperTo(detalles);

        return {
            comprobante: resultComprobante,
            detalles: resultDetalles,
            impuestos: impuestos,
            infoAdicional: infoAdicionalDocumento || [],
            cuotas,
            formaPago: dataFormaPago,
            infoAdicionalArticulo: historyDatosAdicionales || [],
        }

    }

}

const aprobacionDocRepository = {
    url: 'Venta/AprobacionDocumento/',
    filterData(api, options) {
        const json = FilterDataAprobacionDocMapper.toJson();
        return api.getData('get', `${this.url}Get?json=${json}`, null, true).then(response => {
            return FilterDataAprobacionDocMapper.fromJson(response, options.fS);
        });
    },
    list(api, params) {
        const json = ListAprobacionDocMapper.toJson(params);
        return api.getData('get', `${this.url}Get?json=${json}`, null, true).then(response => {
            return ListAprobacionDocMapper.fromJson(response);
        });
    },
    getFormData(api, options) {
        const json = GetFormDataAprobacionDocMapper.toJson();
        return api.getData('get', `${this.url}Get?json=${json}`, null, true).then(response => {
            return GetFormDataAprobacionDocMapper.fromJson(response, {
                userCustomerPermissionSvc: options.userCustomerPermissionSvc,
                fS: options.fS
            });
        });
    },
    create(api, params, options) {
        const data = CreateUpdtateAprobacionDocMapper.toJson(params, {
            fS: options.fS
        });
        return api.getData('post', `${this.url}Insert`, { data }, true)

    },
    update(api, params) {

    },
    getDetalle(api, id, options) {
        const json = DetalleAprobacionDocMapper.toJson(id);
        return api.getData('get', `${this.url}Get?json=${json}`, null, true).then(response => {
            return DetalleAprobacionDocMapper.fromJson(response, {
                fS: options.fS,
                pricingUtils: options.pricingUtils
            });
        });
    },
    getId(api, id, options) {
        return api.getData('get', `${this.url}GetId/${id}`)
            .then(response => GetIdAprobacionDocMapper.fromJson(response, {
                fS: options.fS,
                pricingUtils: options.pricingUtils
            }));
    },
    anular(api, id) {
        return api.getData('delete', `${this.url}Delete/${id}`, null, true)
    },

    convertToDoc(api, data) {
        return api.getData('post', `${this.url}ConvertToDoc`, { data }, true)
    },

    getHistorialConversionDoc(api, id) {
        const json = JSON.stringify({ tipo: 8, id })
        return api.getData('get', `${this.url}Get?json=${json}`).then(response => {
            let results = [];
            if (response.code === "1") {
                let [historialConversion] = JSON.parse(response.payload)
                results = historialConversion;
            }
            return results;
        })
    }



}


app.factory('aprobacionDocService', [
    'mainService',
    'formulario',
    'userCustomerPermissionService',
    'pricingUtils',

    function (api, fS, userCustomerPermissionSvc, pricingUtils) {
        const service = {
            filterData,
            list,
            getFormData,
            create,
            getDetalle,
            getId,
            getHistorialConversionDoc,
            anular,
            convertToDoc,
            convertToDocAprobacionDocMapper,
            addRow
        };

        return service;

        function addRow() {
            return {
                rowguid: fS.generateUuidv4(),
                idAprob_Document_Detailt: 0,
                idFacturaDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 1,
                codigoPorcentaje: "",
                tarifa: 0,
                articuloTarifas: [],
                idTarifa: 0,
                precioUnitario: 0,
                precioConIva: 0,
                porcentajeDescuento: 0,
                valorDescuento: 0,
                totalDescuento: 0,
                ice: 0,
                idBodega: 0,
                total: 0,
                nota: null,
                llevaInventario: false,
                datosAdicionales: false,
                estado: 1
            }
        }

        function filterData() {
            return aprobacionDocRepository.filterData(api, {
                fS
            });
        }

        function list(params) {
            return aprobacionDocRepository.list(api, params);
        }

        function getFormData() {
            return aprobacionDocRepository.getFormData(api, {
                userCustomerPermissionSvc,
                fS
            });
        }

        function create(params) {
            return aprobacionDocRepository.create(api, params, {
                fS
            });
        }

        function getDetalle(id) {
            return aprobacionDocRepository.getDetalle(api, id, {
                fS,
                pricingUtils
            });
        }

        function getId(id) {
            return aprobacionDocRepository.getId(api, id, {
                fS,
                pricingUtils
            });
        }
        function anular(id) {
            return aprobacionDocRepository.delete(api, id);
        }


        function convertToDocAprobacionDocMapper(params) {
            return ConvertToDocAprobacionDocMapper.toJson(params, {
                fS
            });
        }

        function convertToDoc(params) {
            return aprobacionDocRepository.convertToDoc(api, params);
        }

        function getHistorialConversionDoc(id) {
            return aprobacionDocRepository.getHistorialConversionDoc(api, id);
        }


    }]);