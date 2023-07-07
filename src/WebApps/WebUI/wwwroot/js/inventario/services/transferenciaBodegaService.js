

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
            return mS.getData('post', `${url}Insert`, query).then(response=>{
                if(response.code=="0"){
                    throw response;
                }
                return response;
            }).catch(err=>{
                throw err;
            })
        }


        function update(id, query){
            return mS.getData('put', `${url}Update?id=` + id, query).then(response=>{
                if(response.code=="0"){
                    throw response;
                }
                return response;
            }).catch(err=>{
                throw err;
            })
        }

        function anular(id){
            return mS.getData('delete', `${url}Delete?id=` + id).then(response=>{
                if(response.code=="0"){
                    throw response;
                }
                return response;
            }).catch(err=>{
                throw err;
            })
        }

       

    })


})(window.angular)