
(function(){

    'use strict';

    app.factory('facturaCompraService', function($injector){        
       
        let url = 'IngresoFacturaCompra/'
        let mS = $injector.get('mainService');

        let service = {};

        service.getAll = function(query){
            return mS.getData('get', url +'?json=' + JSON.stringify(query), null, true).then(response=>{
              
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let results = JSON.parse(response.payload)[0] || [];
                    
                    return results.map(item => ({
                        abono: item.abono,
                        codDoc: item.codDoc,
                        codEstab: item.codEstab,
                        correo: item.correo,
                        direccion: item.direccion,
                        estadoFinanciero: item.estadoFinanciero,                        
                        fechaEmision: item.fechaEmision,
                        fechaVencimiento: item.fechaVencimiento,
                        idFacturaCompra: item.idFacturaCompra,
                        idProveedor: item.idProveedor,
                        item: item.idTiempoCredito,
                        idTipoDocumento: item.idTipoDocumento,
                        nroDocumento: item.nroDocumento,
                        nroIdentificacion: item.nroIdentificacion,
                        nroRetencion: item.nroRetencion,
                        proveedor: item.proveedor,
                        retencion: item.retencion,                        
                        saldo: item.saldo,
                        total: item.total,
                        usuario: item.usuario
                    }))
                }
            })
        }

        service.save = function(data){                                        
            return mS.getData('post', url + 'Insert', data, true).then(response=>{                
                return response
            })
        }
        
        service.update = function(id, data){
            return mS.getData('put', url  + 'Update/' + id, data, true).then(response=>{
                return response;
            })
        }

        service.delete = function(id){
            return mS.getData('delete', url + id, null, true).then(response=>{
                return response;
            })            
        }

        /**
         * Estte funcion declara se usa en Nota Credito Proveedor, Retencion Compra
         * @param {*} idProveedor 
         * @returns 
         */
        service.findByProveedor = function(idProveedor){
            return mS.getData('get', url + 'FindByProveedor/' + idProveedor, null, true).then(response=>{
                if(response.code==="0"){
                    return response;
                }
                if(response.code==="1"){
                    let facturas = JSON.parse(response.payload) || [];
                    return {
                        code: '1',
                        payload: facturas
                    };

                }
            })               
        }

        service.findById = function(id){
            // let query = JSON.stringify({
            //     idDocumentoIngreso: id,
            //     typeList: 4
            // })
            // return mS.getData('get', url + query, null, true).then(response=>{
            //     if(response.code==='0'){
            //         throw response;
            //     }
            //     if(response.code==='1'){
            //         let dataRepository = JSON.parse(response.payload);

            //         let comprobante = dataRepository[0][0];
            //         let proveedor = dataRepository[1][0];
            //         let detalles = dataRepository[2];
            //         let taxes = dataRepository[3];
            //         let bodegas = dataRepository[4];
            //         let decimal = dataRepository[5][0];
            //         let tipoIvas = dataRepository[6];
            //         let inventario = dataRepository[7][0];

            //         console.log(dataRepository)
            //         let datosAdicionales = dataRepository[8].map(item=>{
            //             if(typeof item.info=='string'){
            //                 item.info = JSON.parse(item.info).map(item=>{
            //                     let adicionales = JSON.parse(item.adicionales)
            //                     return {
            //                         ...item,
            //                         adicionales
            //                     }
            //                 })
            //             }
            //             return item;
            //         })
                   
            //        console.log(datosAdicionales)
            //         return {
            //             comprobante,
            //             proveedor,
            //             detalles,
            //             taxes,
            //             bodegas,
            //             decimal,
            //             tipoIvas,
            //             inventario,
            //             datosAdicionales: datosAdicionales[0]
            //         }
            //     }
            // })
        }

        /**
         * Mappeo de datos necesarios para la factura 
         * 
         * @param {*} param0 object
         * @returns object
         */
        service.queryMapper = function({data, details, proveedor, datosAdicionalesArticulo}){
            data.idProveedor = proveedor.idProveedor;
           
            let query =  {
                factura: data,
                detalle: service.detalleMapTo(details),   
                artInfoAdicionales: JSON.stringify(datosAdicionalesArticulo.map(obj=>{
                    return {
                        idInfoAdicional: obj.idInfoAdicional || 0,
                        idArticulo: obj.idArticulo,
                        idEtiqueta: obj.idEtiqueta,
                        jsonAdicional: obj.adicionales
                    }                   
                }))          
            }

            return JSON.stringify(query)
        }

        service.detalleMapTo = function(detalles){
            let index = 1;
            return detalles.map(item=>{
                let data = {
                    ordeIndex: index++,
                    idFacturaCompraDetalle: item.idFacturaCompraDetalle || 0,
                    idBodega: item.idBodega,
                    idArticulo: item.idArticulo,
                    idMedida: item.idMedida,
                    idTipoIva: item.idTipoIva,
    
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    precioCostoNeto: item.precioCostoNeto,
                    porcentajeDescuento: item.porcentajeDescuento,
                    valorDescuento: item.valorDescuento,
                    ice: item.ice,
                    iva: item.iva,
    
                    codigoPorcentaje: item.codigoPorcentaje,
                    tarifa: item.tarifa,
                    nota: item.nota || null,
                    total: item.total,
                }
                return data;
            })
        }
        return service;
    })
})(window.angular)