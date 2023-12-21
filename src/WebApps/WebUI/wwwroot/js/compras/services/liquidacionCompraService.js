(function () {

    'use strict';

    app.factory('liquidacionCompraService', function ($injector) {
        const url = 'Compra/LiquidacionCompra/'
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');

        return {
            getDataForm,
            getDataFilter,
            getAll,
            generateSerieComprobante,
            queryMapper,
            post,
            getId
        }

        function getDataForm() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ tipo: 2 })}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload) || [];
                    const { configDecimales, estab, impuestos, ptoEmi, tiempoCredito } = results;


                    let dataToGroup = {
                        estabs: ptoEmi, //Establecimientos con puntos de emision
                        bodegas: estab, // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
                    let decimal = configDecimales[0];
                    let tarifasImpuesto = impuestos;

                    return {
                        estabs,
                        decimal,
                        tarifasImpuesto,
                        tiemposCredito: tiempoCredito
                    }
                }
            })
        }

        function getDataFilter() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ tipo: 3 })}`, null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    let results = JSON.parse(response.payload) || [];
                    const { ptoEmision, estadoDocumento } = results;

                    let dataToGroup = {
                        estabs: ptoEmision, //Establecimientos con puntos de emision 
                    }
                    let estabs = fS.groupingEstab(dataToGroup);

                    return {
                        estabs,
                        estadosDoc: estadoDocumento
                    }

                }
            })
        }

        function getAll(query) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ ...query, tipo: 1 })}`, null, true).then(response => {
                if (typeof response === 'object') {
                    const { liquidaciones } = JSON.parse(response.payload);
                    console.log(liquidaciones)
                    return liquidaciones.map(item => ({
                        codEstab: item.codEstab,
                        idLiquidacionCompra: item.idLiquidacionCompra,
                        fechaEmision: item.fechaEmision,
                        total: item.total,
                        saldo: item.saldo,
                        abono: item.abono,
                        nroDocumento: item.nroDocumento,
                        serieComprobante: item.nroDocumento,
                        nombreFiscal: item.nombreFiscal,
                        estadoFinanciero: item.estadoFinanciero,
                        style: item.style,
                        usuario: item.usuario,
                        codDoc: item.codDoc,
                        codEstado: item.codDoc,
                        totalRecords: item.totalRecords || 0
                    }))
                }
                return [];
            })
        }

        function generateSerieComprobante(query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, { tipo: 4 })), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let { serieComprobante } = JSON.parse(response.payload);
                    let data = serieComprobante[0];
                    return data.serieComprobante;
                }
            })
        }

        function queryMapper(obj) {
            const { comprobante, items, itemsDeleted, infoAdicionalDocumento } = obj;

            const comprobanteMapper = infoComprobanteMapperTo(comprobante);
            const itemsMainMapper = detalleMapperTo(items);
            const itemsDeletedMapper = detalleMapperTo(itemsDeleted)

            const impuestos = fS.impuestoTarifaMapperTo(items);

            const mergeItems = [
                ...itemsMainMapper,
                ...itemsDeletedMapper
            ]
            return {
                infoLiquidacion: comprobanteMapper,
                detalles: mergeItems,
                impuestos,
                infoAdicional: infoAdicionalDocumento
            }
        }


        function infoComprobanteMapperTo(data) {
            const result = {
                idProveedor: data.idProveedor,
                idTiempoCredito: data.idTiempoCredito,
                idPuntoEmision: data.idPuntoEmision,
                fechaEmision : fS.formatDateTimeZone(data.fechaEmision),
                fechaVencimiento : fS.formatDateTimeZone(data.fechaVencimiento),                                
                subTotalSinImpuestos: data.subTotalSinImpuestos,
                porcentajeDescuento: data.porcentajeDescuento,
                totalDescuento: data.totalDescuento,
                propina: data.propina || 0,
                recargo: data.recargo || 0,
                transporte: data.transporte || 0,
                total: data.total,
                observacion: data.observacion || null,
            }
            return result;
        }

        function detalleMapperTo(items) {
            let tempDetail = [];
            let orderIndex = 1;
            for (let item of items) {
                let cantidadTransaccion = item.cantidad * (item.conversion || 1)
                const obj = {
                    orderIndex: orderIndex + 1,
                    idArticulo: item.idArticulo,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
                    ice: item.ice,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    valorDescuento: item.valorDescuento,
                    porcentajeDescuento: item.porcentajeDescuento,
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa,
                    valorImpuesto: item.valorImpuesto,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto,
                    nota: item.nota,
                    descripcion: item.descripcion,
                    llevaInventario: item.llevaInventario,
                    cantidadTransaccion: cantidadTransaccion,
                }

                tempDetail.push(obj);
            }
            return tempDetail;
        }


        function post(data) {
            return mS.getData('post', `${url}Insert`, { data }, true)
        }
        function getId(id){
            return mS.getData('get', `${url}GetId/${id}`, null, true).then(
                response=>{
                    if(response.code=="0"){
                        throw response
                    }
                    if(response.code==="1"){
                        const mainData = JSON.parse(response.payload);
                        const [comprobanteApi, proveedorApi, detalleApi, infoAdicionalDocumento ] = mainData;
                        
                        console.log(comprobanteApi)
                        console.log(proveedorApi)
                        console.log(detalleApi)
                        console.log(mainData)

                    }
                }
            )
        }
    })



})(window.angular)