 
import Swal from "sweetalert2"
import { PATHS } from "../constants"
import { ApiResponse} from "../models" 
import { Http, SnackbarUtility } from "../utilities"



class Shared {
    async askToPrint(orderId: number){
        const {
            isConfirmed
        } = await Swal.fire({
            icon: 'warning',
            html: `<small>Desea Imprimir este comprobante?</small>`,
            confirmButtonText: '<icon class="mdi mdi-cloud-print-outline"></icon> Sí, imprimir',
            showDenyButton: true,
            denyButtonText: 'No, cancelar',
            allowOutsideClick: false
        })
        if (isConfirmed) {
            this.getPrinter(orderId)
        }
    }

    async getPrinter(orderId: number){
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.PRIVATE}Order/Print/${orderId}`, 
        })
    
        const response: ApiResponse = resultAxios.data;
        if(response.code==="0"){
            SnackbarUtility.warning(response.message)
        }
        if(response.code==="1"){
            this.print(JSON.parse(response.payload));
        }       
    }
    

    print(params: any){
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

}

 

export const SharedService  = new Shared()
 


 