
(function(){

    'use strict';

    app.factory('articuloService', function(mainService){

        let url = 'Articulo/';

        return {
            getAll: function(query){
                return mainService.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response=>{
                    if(response.code==="0"){
                        throw response;
                    }

                    if(response.code==="1"){
                        let articulos = JSON.parse(response.payload) || [];
                        return articulos.map(item=>{
                            
                            return { 
                                idArticulo: item.idArticulo,
                                idMedida: item.idMedida,
                                code_unique: item.code_unique,
                                codigo: item.codigo,
                                descripcion: item.descripcion,
                                precioCosto: item.precioCosto,
                                estado: item.estado,
                                stock: item.stock,
                                observaciones: item.observaciones,
                                imagen: item.imagen,
                                subFamilia: item.subFamilia,
                                medida: item.medida,
                                tipoIva: item.tipoIva,
                                tipoArticulo: item.tipoArticulo,
                                totalRecords: item.totalRecords,
                                style: item.style
                            }
                        })
                    }
                })
            },

            getDataForm: function(query){
                return mainService.getData('get', url + 'GetDataForm/' + JSON.stringify(query), null, true).then(response=>{
                    if(response.code==="0"){
                        throw response;
                    }

                    if(response.code==="1"){
                        console.log(response)
                    }
                })
            },
            insert: function(data){
                return mainService.getData('post', url  + 'Insert/', data, true).then(response=>{
                    if(response.code==="0"){
                        throw response;
                    }

                    if(response.code==="1"){
                        console.log(response)
                    }
                })

            },

            update: function(id, data){
                return mainService.getData('put', url + 'Update/' + id, data, true).then(response=>{
                    if(response.code==="0"){
                        throw response;
                    }

                    if(response.code==="1"){
                        console.log(response)
                    }
                })
            },

            search: function(query){
                return mainService.getData('get', url + 'Search?json=' + JSON.stringify(query), null, true).then(response=>{
                    if(response.code==="0"){
                        throw response;
                    }
                    if(response.code==="1"){
                        let articulos = JSON.parse(response.payload) || [];

                        return articulos.map(item=>{
                            let priceSales = JSON.parse(item.priceSale) || [];
                            let warehouses = JSON.parse(item.warehouses) || [];
                            
                            return {
                                codigo: item.codigo,
                                descripcion: item.descripcion,
                                idArticulo: item.idArticulo,
                                iva: item.iva,
                                marca: item.marca,
                                medida: item.medida,
                                stock: item.stock,
                                stockMinimo: item.stockMinimo,
                                style: item.style,
                                subFamilia: item.subFamilia,
                                priceSales: priceSales.map(item=>{
                                    return {
                                        tarifa: item.tarifa,
                                        precio: item.precio,
                                    }
                                }),
                                warehouses
                            }
                        })                       
                    }
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