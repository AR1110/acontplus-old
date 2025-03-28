(function( ){
     
    app.factory('solicitudAutorizacionService',solicitudAutorizacionService) 
    solicitudAutorizacionService.$inject = ['mainService']
    function solicitudAutorizacionService($mS){
     
        const url = 'Config/SolicitudAutorizacion'

        return {
            create,
            update,
            verifyUserPermission
        }

        function create(data){
            return $mS.getData('post', `${url}`, {data} )
        }


        function update(){


        }

        function verifyUserPermission(obj){
            let json = JSON.stringify({
                tipo: 2,
                idDocumento: obj.idDocumento,
                codigoAccion: obj.codigoAccion,
                codigoModulo: obj.codigoModulo
            })
            return $mS.getData('get', `${url}/?json=${json}`).then(response=>{
                let resultResponse = {};
                if(response.code==="1"){
                    const parseData = JSON.parse(response.payload);

                    resultResponse = parseData.response[0] || {}
                }
                console.log(resultResponse)
                return resultResponse;
            })
        }


    } 



})(window.angular)