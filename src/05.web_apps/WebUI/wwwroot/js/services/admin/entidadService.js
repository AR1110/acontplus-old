export class EntidadService{
    static $inject = ['$http']
    constructor($http, _commonSvc){        
        this.$http      = $http;
        this._commonSvc = _commonSvc; 
    }

    getAllSubContribuyente(){
        return this.$http.get('/SubContribuyente/OptionSubContribuyente').then(({data:response})=>response);
    }

    getAllCiudadProvincia(){
        return this.$http.get('/Ciudad/ReadCiudadProvincia').then(({data:response})=>response)
    }

    getAllCodigoEnvioSRI(){
        return this.$http.get('/CodigoEnvioSri/Get').then(({data:response})=>response)
    }

    getAllAnioFiscal(){
        return this.$http.get('/AnioFiscal/GetAll').then(({data:response})=>response)
    }

    getDataByIdEntidad(idEntidad){
        if(idEntidad===null || idEntidad ===undefined || idEntidad===0) return
        
        return this._commonSvc.getDataApi({
            method:'get',
            url:`apiCliente/EntidadConfigSri/Get/${JSON.stringify({idEntidad})}`,
            typeUrl: 1
        }).then(response=>response)        
    }



}