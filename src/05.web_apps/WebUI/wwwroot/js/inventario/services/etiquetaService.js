
(function(){

    'use strict';

    app.factory('etiquetaService', function(mainService){
        let url = 'Etiqueta/';
        
        return {
            getAll: function(query){
                return mainService.getData('get', url + 'Get/' + query , null, true).then(response => {
                    if(response.code==="0"){
                        throw response
                    }
                    if(response.code==="1"){
                        let etiquetas = JSON.parse(response.payload);
                        return etiquetas.map(item => ({
                            idEtiqueta: item.idEtiqueta,
                            descripcion: item.descripcion,
                            etiquetas: JSON.parse(item.etiquetas),
                            estado: item.estado
                        }))
                    }
                })
            },

            create: function(data){
                return mainService.getData('post', url + 'Insert?json=' + JSON.stringify(data), null, true).then(response => {
                    if(response.code==="0"){
                        return response;
                    }

                    if(response.code==="1"){
                        return response;
                    }
                })
            },
            update: function(id, data){
                return mainService.getData('put', url + 'Update/' + id +'/?json=' + JSON.stringify(data), null, true).then(response => {
                    if(response.code==="0"){
                        return response;
                    }

                    if(response.code==="1"){
                        return response;
                    }
                })
            },
            delete: function(id){
                return mainService.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                    if(response.code==="0"){
                        return response;
                    }

                    if(response.code==="1"){
                        return response;
                    }
                })
            }
        }

    });

    

})(window.angular)