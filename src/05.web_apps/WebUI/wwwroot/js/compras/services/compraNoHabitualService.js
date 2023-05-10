
(function(){

    'use strict';

    app.factory('compraNoHabitualService', function($injector){        
       
        let url = 'CompraNoHabitual/'
        let mS = $injector.get('mainService');

        let service = {};

        service.getAll = function(query){
            return mS.getData('get', url  + JSON.stringify(query), null, true).then(response=>{
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let results = JSON.parse(response.payload)[0] || [];
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
            })
        }

        service.create = function({data, detalles}){
            
                                    

            return mS.getData(method, url, data, true).then(response=>{
                return response
            })
        }
        
        service.update = function(id, data){

        }

        service.delete = function(id){

            
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
                }
                return obj;
            })
        }

        service.taxesMapTo = function (detalles){
            
        }

        return service;
    })
})(window.angular)