

app.factory('documentoVentaService', documentoVentaService);

documentoVentaService.$inject = ['commonService', 'mainService'];

function documentoVentaService(_commonSvc, _mS){

    return {

        initiload: function(){
            return _mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
                if(response.code==='0'){                
                    throw response
                }
                return JSON.parse(response.payload)
            })
        }


    }


}