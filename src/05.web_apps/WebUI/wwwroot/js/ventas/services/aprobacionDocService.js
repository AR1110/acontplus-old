
(function(){

    'use strict';

    app.factory('aprobacionDocService', function($injector){
        let url = 'AprobacionDocumento/';
        let mS = $injector.get('mainService');
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
                    return {
                        comprobante: dataRepository[0][0],
                        detalle: dataRepository[1],
                        infoAdicionalDocumento: dataRepository[2],
                        datosAdicionalesArticulo: dataRepository[3].map(item=>({
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

        return service;

    })




})(window.angular)