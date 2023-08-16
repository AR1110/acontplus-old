

(function() {

    'use strict';

    app.factory('transferenciaBodegaService', function($injector) {
        let mS = $injector.get('mainService'); 
        let url = 'TransferenciaBodega/'
        return {
            getAll,
            insert,
            update,
            anular
        }

        function getAll(query) {
            return mS.getData('get', `${url}Get?json=${JSON.stringify(query)}`, null, true).then(response=>{
                if(response.code=="0"){
                    throw response;
                }
                if(response.code=="1"){
                    let results = JSON.parse(response.payload) || [];
                    
                    return results.map(item=>({
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
            }).catch(err=>{
                throw err;
            })
        }

        function insert(query){
            return mS.getData('post', `${url}`, query, true).then(response=>{
                if(response.code=="0"){
                    throw response;
                }
                return response;
            }).catch(err=>{
                throw err;
            })
        }


        function update(id, query){
            return mS.getData('put', `${url}?id=` + id, query, true).then(response=>{
                if(response.code=="0"){
                    throw response;
                }
                return response;
            }).catch(err=>{
                throw err;
            })
        }

        function anular(id){
            return mS.getData('delete', `${url}?id=` + id, null, true).then(response=>{
                // if(response.code=="0"){
                //     throw response;
                // }
                return response;
            }).catch(err=>{
                throw err;
            })
        }


        // function getId(id){

        //     return mS.getData('get', `${url}/GetId?id=` + id, null, true).then(response=>{
        //         if (response.code === "0") { 
        //             throw response.message
        //         }
    
        //         if (response.code === "1") {
        //             let dataMain = JSON.parse(response.payload);
    
        //             let dataDocumento = dataMain[0][0];
        //             dataDocumento.fechaEmision = fS.formatDate(dataDocumento.fechaEmision);
    
        //             let establecimientoOrigen = dataMain[1][0];
        //             let establecimientoDestino = dataMain[2][0];

        //             let detalleDocumento = []; //
        //             for (let item of dataMain[3]) {
        //                 this.getDataArticuloParaCompra({
        //                     json: item
        //                 }).then(response => {
        //                     item.medidas = JSON.parse(response.payload)[1]
        //                 })
    
        //                 detalleDocumento.push(item)
        //             } 

        //             return {
        //                 dataDocumento,
        //                 establecimientoOrigen,
        //                 establecimientoDestino,
        //                 detalleDocumento,
        //                 isComplete
        //             }
        //         }

        //     })

        // } 

    })


})(window.angular)