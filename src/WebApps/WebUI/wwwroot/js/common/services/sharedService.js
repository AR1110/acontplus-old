app.factory('sharedService', sharedService )
sharedService.$inject = ['$injector', 'mainService']
function sharedService($injector, mS){

    return {
        getDataFormNotificacion
    }

    function getDataFormNotificacion(params){

        let url = 'Config/EmailConfig/';
        let json = JSON.stringify({
            tipo: 2,
            ...params
        })
        showLoader();
        return mS.getData('get', `${url}Get?json=${json}`, null, true).then(response => {
            let data = {
                correos: [],
                telefonos: [],
                telefonoEstab: null
            }
            if (response.code === "1") {
                let [mainData] = JSON.parse(response.payload);
                console.log(mainData)
                let { correo, telefono, telefonoEstab,correoEstab,nombreEstab } = mainData[0];

                data.correos = correo ? correo.split(/[\|;]/) : [];
                data.telefonos = telefono ? telefono.split(/[\|;]/) : [];
                data.telefonoEstab = telefonoEstab;
                data.correoEstab = correoEstab;
                data.nombreEstab = nombreEstab;
               
            } 
            return data;
        }).finally(() => hideLoader())
    }





}

