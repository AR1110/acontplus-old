

(function () {

    'use strict';

    app.factory('transferenciaBodegaService', function ($injector) {
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        let url = 'TransferenciaBodega/';


        return {
            getDataFilter,
            getDataForm,
            generateSerieComprobante,
            getAll,
            insert,
            update,
            anular,
            getId,
            getIdDetalle
        }


        function getDataFilter() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ tipo: 2 })}`, null, true).then(response => {
                if (response.code == "0") {
                    throw response;
                }
                if (response.code == "1") { 
                    let results = JSON.parse(response.payload) || [];
                    let dataToGroup = {
                        estabs: results[0], //Establecimientos con puntos de emision 
                    }
                    let estabs = fS.groupingEstab(dataToGroup);

                    return {
                        estabs
                    }          

                }
            }) 
        }

        function getDataForm() {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({ tipo: 3 })}`, null, true).then(response => {
                if (response.code == "0") {
                    throw response;
                }
                if (response.code == "1") {
                    let results = JSON.parse(response.payload) || [];
                    let dataToGroup = {
                        estabs: results[0], //Establecimientos con puntos de emision
                        bodegas: results[1], // Establecimientos con bodegas
                        isGroupBodega: true
                    }
                    let estabs = fS.groupingEstab(dataToGroup);
                    
                    return {
                        estabs
                    }                    

                }
            }) 
        }
        function generateSerieComprobante (query) {
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
        function getAll(query) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify({
                ...query,
                tipo: 1
            })}`, null, true).then(response => {
                if (response.code == "0") {
                    throw response;
                }
                if (response.code == "1") {
                    let results = JSON.parse(response.payload) || [];
                    const transferenciaProductos = results[0];

                    return transferenciaProductos.map(item => ({
                        idTransferenciaBodega: item.idTransferenciaBodega,
                        idTipoDocumento: item.idTipoDocumento,
                        nroDoc: item.nroDoc,
                        fechaEmision: item.fechaEmision,
                        estadoDesc: item.estadoDesc,
                        estadoCodigo: item.estadoCodigo,
                        total: item.total,
                        bodegaOrigen: item.bodegaOrigen,
                        bodegaDestino: item.bodegaDestino,
                        rowColor: item.rowColor,
                        codEstab: item.codEstab,
                    }))
                }
            }).catch(err => {
                throw err;
            })
        }

        function insert(query) {
            return mS.getData('post', `${url}`, query, true).then(response => {
                if (response.code == "0") {
                    throw response;
                }
                return response;
            }).catch(err => {
                throw err;
            })
        }


        function update(id, query) {
            return mS.getData('put', `${url}?id=` + id, query, true).then(response => {
                if (response.code == "0") {
                    throw response;
                }
                return response;
            }).catch(err => {
                throw err;
            })
        }

        function anular(id) {
            return mS.getData('delete', `${url}?id=` + id, null, true).then(response => {
                // if(response.code=="0"){
                //     throw response;
                // }
                return response;
            }).catch(err => {
                throw err;
            })
        }


        function getId(id){

            return mS.getData('get', `${url}GetId?id=` + id, null, true).then(response=>{
                if (response.code === "0") { 
                    throw response.message
                }

                if (response.code === "1") {
                    
                    let dataMain = JSON.parse(response.payload);
                    let [dataTemp, itemsTemp] = dataMain;
                    console.log(dataMain)

                    let dataDocumento = dataTemp[0];
                    dataDocumento.fechaEmision = fS.formatDate(dataDocumento.fechaEmision);

                    const detalleDocumento = itemsTemp.map(item=>{
                        const { medidasFraccionado, medidasPrincipal, ...restItem } = item;

                        // Medidas del artículo fraccionado del principal
                        let medidasFraccionadoTemp = JSON.parse(medidasFraccionado) || [];

                        // Medida principal con las tarifas
                        let medidasPrincipalTemp = JSON.parse(medidasPrincipal) || []; 

                        const medidasPrincipalMap = medidasPrincipalTemp.map(medidaPrincipal => ({
                            ...medidaPrincipal,
                            tipo: 'PRINCIPAL'
                        }))
                        const medidasFraccionadoMap = medidasFraccionadoTemp.map(medidaFraccionado => ({
                            ...medidaFraccionado,
                            tipo: 'FRACCIONADO'
                        }))


                        /**
                         * Combinar los dos arrays de medidas en uno solo
                         *
                         * Parámetros:
                         *  - mergedMedidasArray: El array resultante de la combinación de los dos arrays de medidas
                         */
                        const mergedMedidasArray = [...medidasFraccionadoMap, ...medidasPrincipalMap];

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

                        restItem.medidas = orderMedidaArray;
                        return restItem; 
                    }) 


                    return {
                        dataDocumento, 
                        detalleDocumento, 
                    }
                }

            })

        }
        
        function getIdDetalle(id){
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign({id}, { tipo: 5 })), null, true).then(response => {
                if (response.code === "0") {
                    throw response.message
                }

                if (response.code === "1") {
                    let dataMain = JSON.parse(response.payload);
                    let [dataTemp, detalleDocumento] = dataMain;

                    let dataDocumento = dataTemp[0];
                    dataDocumento.fechaEmision = fS.formatDate(dataDocumento.fechaEmision); 


                    return {
                        dataDocumento,
                        detalleDocumento,
                    }
                }

            })
        }

    })


})(window.angular)