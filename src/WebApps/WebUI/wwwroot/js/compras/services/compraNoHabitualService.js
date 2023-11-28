
(function(){

    'use strict';

    app.factory('compraNoHabitualService', function($injector){        
       
        let url = 'Compra/CompraNoHabitual/'
        let mS = $injector.get('mainService');

        let service = {};

        /**
         * 
         * @param {*} params 
         * - tipo 1: listado general 
         * - tipo 2: datos para el formulario (create, update)
         * - tipo 4: datos para actualizar 
         * @returns 
         */
        service.get = (params)=>{
            return mS.getData('get', `${url}${JSON.stringify(params)}`, null, true).then(response=>{
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let mainData = JSON.parse(response.payload) || [];

                    if(params.typeList===1){
                        let results = mainData[0];
                        return results.map(item => ({
                            colorRow: item.colorRow,
                            estado: item.estado,
                            fechaEmision: item.fechaEmision,
                            idDocumentoIngreso: item.idDocumentoIngreso,
                            importeTotal: item.importeTotal,
                            nombreFiscal: item.nombreFiscal,
                            serieComprobante: item.serieComprobante, 
                            usuario: item.usuario
                        })) 
                    }

                    if(params.typeList===2){
                        let estabs = mainData[0];
                        let puntosEmision = mainData[1];
                        let bodegas = mainData[2];
                        let decimal = mainData[3][0];
                        let tarifasImpuesto =mainData[4]
                        let tarifasImpuestoVigente = mainData[5];
                        let config = mainData[6][0];
                        return {
                            estabs,
                            puntosEmision,
                            bodegas,
                            decimal,
                            tarifasImpuesto,
                            tarifasImpuestoVigente,
                            config,
                        } 
                    }
                    if(params.typeList===4){
                        return mainData;
                    }
                }
            })
        } 

        service.create = function(query){                                        
            return mS.getData('post', url, query, true).then(response=>{
                return response
            })
        }
        
        service.update = function(id, query){
            return mS.getData('put', url + id, query, true).then(response=>{
                return response;
            })
        } 

        service.updateStatus = (id)=>{
            return mS.getData('put', `${url}Cancel/${id}`, null, true).then(response=>{
                return response;
            })
        }

        service.findById = function(id){
            let query = JSON.stringify({
                idDocumentoIngreso: id,
                typeList: 4
            })
            return mS.getData('get', url + query, null, true).then(response=>{
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let dataRepository = JSON.parse(response.payload);

                    let comprobante = dataRepository[0][0];
                    let proveedor = dataRepository[1][0];
                    let detalles = dataRepository[2];
                    let taxes = dataRepository[3];
                    let bodegas = dataRepository[4];
                    let decimal = dataRepository[5][0];
                    let tipoIvas = dataRepository[6];
                    let inventario = dataRepository[7][0];
                    let datosAdicionales = dataRepository[8].map(item=>{
                        return {
                            idArticulo: item.idArticulo,
                            idEtiqueta: item.idEtiqueta,
                            idInfoAdicional: item.idInfoAdicional,
                            adicionales: JSON.parse(item.jsonAdicional),
                            estado: item.estado,
                        }
                    })
               
                    // let datosAdicionales = dataRepository[8].map(item=>{
                    //     if(typeof item.info=='string'){
                    //         item.info = JSON.parse(item.info).map(item=>{
                    //             let adicionales = JSON.parse(item.adicionales)
                    //             return {
                    //                 ...item,
                    //                 adicionales
                    //             }
                    //         })
                    //     }
                    //     return item;
                    // }) 
                    return {
                        comprobante,
                        proveedor,
                        detalles,
                        taxes,
                        bodegas,
                        decimal,
                        tipoIvas,
                        inventario,
                        datosAdicionales
                    }
                }
            })
        }

        /**
         * 
         * @param {*} param0 object
         * @returns object
         */
        service.queryMapper = function({data, details, proveedor, idEstablecimiento, estab, ptoEmi, datosAdicionalesArticulo}){
            let comprobante ={
                idEstablecimiento,
                idPuntoEmision: data.idPuntoEmision,
                idProveedor: proveedor.idProveedor,
                estab,
                ptoEmi,
                fechaEmision: moment(data.fechaEmision).format('YYYY-MM-DD HH:mm:ss A'),
                totalSinImpuestos: data.subTotalSinImpuestos,
                importeTotal: data.total,
                inventory: data.inventory,
                tarifa: data.tarifa,
                observacion: data.observacion              
            };

            let query =  {
                comprobante: JSON.stringify(comprobante),
                detalles: JSON.stringify(service.detalleMapTo(details)),
                impuestos: JSON.stringify(service.taxesMapTo(details)),
                artInfoAdicionales: JSON.stringify(service.dataAdicionalMapTo(datosAdicionalesArticulo))
            }

            return JSON.stringify(query)
        }

        service.detalleMapTo = function(detalles){
            let index = 0;
    
            return detalles.map(item => {
                let obj = {
                    index: index++,
                    idDocumentoIngresoDetail: item.idDocumentoIngresoDetail || 0,
                    idArticulo: item.idArticulo,
                    idMedida: item.idMedida,
                    idBodega: item.idBodega,
                    codigoPrincipal: item.codigoPrincipal,
                    codigoAuxiliar: item.codigoAuxiliar,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    costoNeto: item.costoNeto,
                    descuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.total,
                    codigoPorcentaje: item.codigoPorcentaje,
                    adicionales: item.adicionales
                }
                return obj;
            })
        }

        service.taxesMapTo = function (detalles){         
            let index = 1
            return detalles.map(item => {
                let obj = {
                    index: index++,
                    idArticulo: item.idArticulo,
                    codigo: "2",
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa,
                    baseImponible: item.total,
                    valor: (item.tarifa / 100) * item.total,
                }
                return obj;
            })
            
        }     
        
        service.dataAdicionalMapTo = function(datosAdicionales){
            // let results = []
            // for(let item of datosAdicionales){
            //     for(let dataAdd of item.adicionales){
            //         results.push({
            //             idArticulo: item.idArticulo,
            //             idEtiqueta: item.idEtiqueta,
            //             idInfoAdicional: item.idInfoAdicional || 0,
            //             jsonAdicional: angular.copy(dataAdd)
            //         })
            //     }
            // }
            
            return datosAdicionales.map(item=>{
                return {
                    idArticulo: item.idArticulo,
                    idEtiqueta: item.idEtiqueta,
                    idInfoAdicional: item.idInfoAdicional || 0,
                    jsonAdicional: item.adicionales
                }
            });
        }

        service.generateNroSecuencial = function (idPuntoEmision){
            let query = JSON.stringify({
                idPuntoEmision,
                typeList: 3
            })
            return mS.getData('get', `${url}${query}`, null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    return JSON.parse(response.payload)[0][0].serieComprobante
                }
            })
        }
        return service;
    })
})(window.angular)