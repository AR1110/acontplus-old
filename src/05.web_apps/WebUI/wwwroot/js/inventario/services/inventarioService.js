(function() {

    'use strict';

    app.factory('familiaService', function($injector){
        
        let url = 'Familia/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function(query){
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let familias = JSON.parse(response.payload) || [];
                    return familias.map(item=>({
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                        siglas: item.siglas,
                        estado: item.estado,
                        totalRecords: item.totalRecords                        
                    }))                    
                }
            })
        }

        service.save = function(data){
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function(id, data){
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function(id){
            return mS.getData('delete', url + 'Delete' + id, null, true);
        }

        service.listForSelect = function(query){
            return mS.getData('get', url + 'ListForSelect?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let familias = JSON.parse(response.payload) || [];
                    return familias.map(item=>({
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,                                           
                    }))                    
                }
            })
        }
        
        return service;
    })



    /**
     * SubFamilias 
     */
    app.factory('subFamiliaService', function($injector){
        
        let url = 'SubFamilia/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function(query){
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let subFamilias = JSON.parse(response.payload) || [];
                    
                    return subFamilias.map(item=>({                        
                        idSubFamilia: item.idSubFamilia,
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        siglas: item.siglas,
                        codigo: item.codigo,
                        montoObjetivo: item.montoObjetivo,
                        nombreFamilia: item.nombreFamilia,
                        totalRecords: item.totalRecords,                                               
                    }))                    
                }
            })
        }

        service.save = function(data){
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function(id, data){
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function(id){
            return mS.getData('delete', url + 'Delete' + id, null, true);
        }

        
        return service;
    })


    /**
     * SubFamilias 
     */
    app.factory('modeloService', function($injector){
        
        let url = 'Modelo/';
        let mS = $injector.get('mainService');
        let service = {};

        service.getAll = function(query){
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let subFamilias = JSON.parse(response.payload) || [];
                    
                    return subFamilias.map(item=>({                        
                        idSubFamilia: item.idSubFamilia,
                        idFamilia: item.idFamilia,
                        descripcion: item.descripcion,
                        estado: item.estado,
                        siglas: item.siglas,
                        codigo: item.codigo,
                        montoObjetivo: item.montoObjetivo,
                        nombreFamilia: item.nombreFamilia,
                        totalRecords: item.totalRecords,                                               
                    }))                    
                }
            })
        }

        service.save = function(data){
            return mS.getData('post', url + 'Insert', data, true);
        }

        service.update = function(id, data){
            return mS.getData('put', url + 'Update/' + id, data, true);
        }

        service.delete = function(id){
            return mS.getData('delete', url + 'Delete' + id, null, true);
        }

        
        return service;
    })


})(window.angular)