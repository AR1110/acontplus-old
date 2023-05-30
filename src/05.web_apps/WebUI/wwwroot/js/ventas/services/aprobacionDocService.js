
(function(){

    'use strict';

    app.factory('aprobacionDocService', function($injector){
        let url = 'AprobacionDocumento/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        let service = {}

        service.getAll = function(query){
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true)
                .then(response => {
                    
                    if(response.code==="0"){
                        throw response;
                    }
                    if(response.code==="1"){
                        let aprobComprobantes = JSON.parse(response.payload) || [];
                        
                        return aprobComprobantes.map(item => {
                            return {
                                idAprob_Document: item.idAprob_Document,
                                uniqueId: item.uniqueId,
                                docOrigen: item.docOrigen,
                                codDoc: item.codDoc,
                                docDestino: item.codDoc,
                                docOrigenDesc: item.docOrigenDesc,
                                docDestinoDesc: item.docDestinoDesc,
                                fechaEmision: item.fechaEmision,
                                serie: item.serie,                                
                                serieComprobante: item.serie,
                                identificacionComprador: item.identificacionComprador,
                                razonSocialComprador: item.razonSocialComprador,
                                total: item.total,
                                codEstado: item.codEstado,
                                estado: item.estado,
                                colorFila: item.colorFila,
                            } 
                        })
                    
                    }
                }).catch(error =>{
                console.log('Error get all Aprob. Docs service', error);
                throw error;
            })
        }

        service.findById = function(id){
            return mS.getData('get', url + 'GetId/' + id, null, true).then(response =>{
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let dataRepository = JSON.parse(response.payload)
                    let compRepository = dataRepository[0][0];
                    let clienteRepository = dataRepository[1][0];
                    let detalleRepository = dataRepository[2];
                    let historialRepository = dataRepository[3];
                    let infoAdicionalDocumento = dataRepository[4];
                    let datosAdicionalesArticulo = dataRepository[5];
                    
                    let compMapper = {
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
                        fechaEmision: compRepository.fechaEmision,
                        observacion: compRepository.observacion,
                        codigoPorcentaje: compRepository.codigoPorcentaje,
                        totalSinImpuestos: compRepository.totalSinImpuestos,
                        totalDescuento: compRepository.totalDescuento,
                        totalConImpuestos: compRepository.totalConImpuestos,
                        propina: compRepository.propina,
                        importeTotal: compRepository.importeTotal,
                    }
                    let clienteMapper = {
                        idCliente: clienteRepository.idCliente,
                        nombreComercial: clienteRepository.nombreComercial,
                        nombreFiscal: clienteRepository.nombreFiscal,
                        numeroIdentificacion: clienteRepository.numeroIdentificacion,
                        direccion: clienteRepository.direccion
                    }
                    
                    return {
                        comprobante: compMapper,
                        cliente: clienteMapper,
                        detalles: detalleRepository,              
                        historial: historialRepository,
                        infoAdicionalDocumento: infoAdicionalDocumento,
                        datosAdicionalesArticulo: datosAdicionalesArticulo.map(item=>({
                            idDocumento: item.idDocumento,
                            idHistoryInfoAdicional: item.idHistoryInfoAdicional,
                            idArticulo: item.idArticulo,
                            idEtiqueta: item.idEtiqueta,
                            idInfoAdicional: item.idInfoAdicional,
                            jsonAdicional: JSON.parse(item.jsonAdicional),
                            selected: item.selected,
                            estado: item.estado
                        }))
                    } 
                }
            }).catch(error=>{
                throw error
            })
        }

        
        service.save = function(data){
            return mS.getData('post', url + 'Insert', data, true)
            .then(response => {
                return response;
            }).catch(error=>{
                console.log('Error insert Aprob. Docs service', error);
                throw error;
            })
        }


        service.update = function(id, data){
            return mS.getData('put', url + 'Update/' + id, data, true)
            .then(response => {
                return response;
            }).catch(error=>{
                console.log('Error update Aprob. Docs service', error);
                throw error;
            })
        }

        service.delete = function(id){
            return mS.getData('delete', url + 'Delete/' + id, null, true)
            .then(response => {
                return response;
            }).catch(error=>{
                console.log('Error delete Aprob. Docs service', error);
                throw error;
            })
        }

        service.detalleMapperTo = function(detalles, decimal){
            let tempDetail = [];
            let orderIndex = 1;
            for (let item of detalles) {

                let precioTotalSinImpuesto = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                let obj = {
                    orderIndex: orderIndex++,
                    idAprob_Document_Detailt: item.idAprob_Document_Detailt || 0,
                    idTarifa: item.idTarifa,
                    idArticulo: item.idArticulo,
                    idTipoIva: item.idTipoIva,
                    idMedida: item.idMedida,
                    cantidad: item.cantidad,
                    descripcion: item.descripcion,
                    precioUnitario: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    valorDescuento: item.valorDescuento,
                    descuento: item.valorDescuento,
                    precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, decimal.nroTotalDetalle),
                    baseImponible: fS.roundNumber(precioTotalSinImpuesto, decimal.nroTotalDetalle),
                    nota: item.nota,
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa
                }
                tempDetail.push(obj);
            }
            return tempDetail;
        }

        /**
         * 
         * @param {object} params_objecr(detalles, fS(formularioSvc), decimal, findForPurchase 
         * @returns detalles []
         */
        service.detalleMapperFrom = function({detalles, fS, decimal, idBodega, findForSale}) {
            let enumeracion = 1;
                for (let item of detalles) {                    
                    item.enumeracion = enumeracion++;
                    item.valorDescuento = item.descuento;
                    item.ice = 0;
                    item.nota = null;
        
                 //   let total = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                // let totalDescuento = item.cantidad * item.valorDescuento;
                    let subTotal = item.cantidad * item.precioUnitario;
        
        
                    item.totalDescuento = fS.roundNumber(item.totalDescuento, decimal.nroDescuentoDetalle)
                    item.subTotal = fS.roundNumber(subTotal, 5);
                    item.total = fS.roundNumber(item.precioTotalSinImpuesto, decimal.nroTotalDetalle);
        
                    findForSale({idArticulo: item.idArticulo}).then(response => {
                        
                        let  {articulo, medidas, datosAdicionalesArticulo} = response;
                        item.medidas = medidas;
                        item.datosAdicionalesArticulo = datosAdicionalesArticulo;
    
                        let dataMedida = medidas.find(m => m.idMedida === item.idMedida) || {};
                        item.articuloTarifas = JSON.parse(dataMedida.tarifas);
                    })

                    item.idBodega = idBodega
                }
                
            return detalles;
        }


        service.addRow = function() {
            return {
                idAprob_Document_Detailt: 0,
                idFacturaDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 1,
                nombreMedida: "",
                codigoPorcentaje: "",
                tarifa: 0,
                nombreTipoIva: "",
                articuloTarifas: [],
                idTarifa: 0,
                precioUnitario: 0,
                precioConIva: 0,
                porcentajeDescuento: 0,
                valorDescuento: 0,
                totalDescuento: 0,
                ice: 0,
                idBodega: 0,
                subTotal: 0,
                total: 0,
                nota: "S/N",
                llevaInventario: false,
                datosAdicionales: false
            }        
        }
        

        return service;

    })




})(window.angular)