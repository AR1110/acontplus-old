
(function(){

    'use strict';

    app.factory('docRecibidoService', function($injector){        
       
        const URL = 'Compra/DocumentoRecibido/'
        let mS = $injector.get('mainService');

        let service = {};

        service.get = function(query){
            return mS.getData('get', URL +'Get/' + JSON.stringify(query), null, true).then(response=>{
              
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){

                    let mainData = JSON.parse(response.payload);

                    if(query.tipo && query.tipo==="1"){
                        return mainData;
                    }

                    if(query.tipo && query.tipo===3){
                        return mainData[0];
                    }

                    return mainData[0];
                }
            })
        }

        service.readFileTxt = function(fileTxt){
            return mS.getDataFile(`${URL}Read`, fileTxt, null, true)
        }

        service.uploadXml = function(query, file){
            return mS.getDataFile(`${URL}UploadXml/?json=${JSON.stringify(query)}`, file, null, true)
        }

        service.checkExistenceXml = function(item){
            return mS.getData('post', `${URL}CheckExistenceXml/?claveAcceso=${item}`, null, true)
        }

        service.post = function(data){                                        
            return mS.getData('post', `${URL}Post`, { data: data }, true).then(response=>{                
                return response
            })
        }

        service.putXml = function(id){
            return mS.getData('put', `${URL}Put/${id}`, null, true)
        }

        service.putXmlManual = function(idDocumento, claveAcceso){
            return mS.getDataFile(`${URL}${idDocumento}/${claveAcceso}`, file, null, true)
        } 

        service.delete = function(item){
            return mS.getData('delete',`${URL}${item}`, null, true)            
        }

        service.getId = function(idDocumento){
            return mS.getData('get', `${URL}GetId/${idDocumento}`, null, true)
        }

        service.migrate = function(data){
            return mS.getData('put', `${URL}Migrate`, { data: data }, true)
        }
         
        return service;
    })
})(window.angular)