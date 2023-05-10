
(function(){

    'use strict';

    app.factory('articuloService', function(mainService){

        let url = 'Articulo/';

        return {
            search: function(query){
                return mainService.getData('get', url + query).hen(response=>{

                })
            },
            findForPurchase: function(query){
                return mainService.getData('get', url + 'FindForPurchase?json='+ JSON.stringify(query), null, true).then(response=>{
                    if(response.code==='0'){
                        throw response;
                    }

                    if(response.code==='1'){
                        let dataRepository = JSON.parse(response.payload);
                        let dataArticulo = dataRepository[0][0];
                        let medidas = dataRepository[1] || []; 
                        let etiquetas = dataRepository[2] || [];               
                        let articuloMapper = {
                            codIce:  dataArticulo.codIce,
                            codImpuesto: dataArticulo.codImpuesto,
                            codigoArticulo: dataArticulo.codigoArticulo,
                            codigoAuxiliar: dataArticulo.codigoAuxiliar,
                            codigoPorcentaje: dataArticulo.codigoPorcentaje,
                            codigoPrincipal: dataArticulo.codigoPrincipal,
                            costoNeto: dataArticulo.costoNeto,
                            datosAdicionales: dataArticulo.datosAdicionales,
                            descripcion: dataArticulo.descripcion,
                            idArticulo: dataArticulo.idArticulo,
                            idTipoIva: dataArticulo.idTipoIva,
                            llevaInventario: dataArticulo.llevaInventario,
                            nombreTipoIva: dataArticulo.nombreTipoIva,
                            productoFraccionable: dataArticulo.productoFraccionable,
                            stock: dataArticulo.stock,
                            tarifa: dataArticulo.tarifa,
                            valorIce: dataArticulo.valorIce,
                        }    
                        
                        let medidasMapper = medidas.map(item=>({
                            idMedida: item.idMedida,
                            descripcion: item.descripcion,
                            precioCosto: item.precioCosto
                        }))

                        let etiquetasMapper = etiquetas.map(item => ({
                            idEtiqueta: item.idEtiqueta,
                            descripcion: item.descripcion,
                            etiquetas: item.etiquetas.split(';'),
                        }))

                        return {
                            articulo: articuloMapper,
                            medidas: medidasMapper,
                            etiquetas: etiquetasMapper
                        }                        
                    }
                })
            },
            findForSale: function(query){
                return mainService.getData('get', url + 'FindForSale/'+ JSON.stringify(query), null, true).then(response=>{
                    if(response.code==='0'){
                        throw response;
                    }

                    if(response.code==='1'){
                        console.log(response)
                    }
                })
            },

            
        }

    })

})(window.angular)