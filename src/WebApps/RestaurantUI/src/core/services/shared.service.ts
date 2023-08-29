
import { PATHS } from "../constants"
import { ApiResponse} from "../models" 
import { Http, SnackbarUtility } from "../utilities"

export const print = (params: any)=>{
    const urlPrinter = params[0].urlPrinter + '?rdlcProps=' + params[0].rdlcProps + '&dataSources=' + encodeURIComponent(params[0].dataSources) + '&rdlcParams=' + params[0].rdlcParams

    fetch(urlPrinter).then(function (response) {
        if (response.ok) {
            SnackbarUtility.success("Impresion correcta!") 
        } else {
            SnackbarUtility.warning("Error!")            
        }
    }).catch(function (error) {
        SnackbarUtility.error('Hubo un problema al imprimir:' + error.message);
    })
}


const SharedService = {
    async getPrinter(id: number) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.CONFIG}Impresion/?`,
            params: {
                id
            }
        })

        const response: ApiResponse = resultAxios.data;
        if(response.code==="0"){
            SnackbarUtility.warning(response.message)
        }
        if(response.code==="1"){
            print(JSON.parse(response.payload));
        }       
    },
    download() {
        console.log('')
    }


}

export {
    SharedService
};