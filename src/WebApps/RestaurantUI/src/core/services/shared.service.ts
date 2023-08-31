
import Swal from "sweetalert2"
import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http, SnackbarUtility } from "../utilities"



class Shared {
    async askToPrint(orderId: number) {
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

    async getPrinter(orderId: number) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.PRIVATE}Order/Print/${orderId}`,
        })

        const response: ApiResponse = resultAxios.data;
        if (response.code === "0") {
            SnackbarUtility.warning(response.message)
        }
        if (response.code === "1") {
            this.print(JSON.parse(response.payload));
        }
    }


    async print(params: any) {

        for (const param of params) {
            //console.log(param)
            //const urlPrint = `${param.urlPrinter}?rdlcProps=${param.rdlcProps}&dataSources=${encodeURIComponent(param.dataSources)}&rdlcParams=${param.rdlcParams}`
            // console.log(urlPrint)
            await fetch(param.urlPrinter, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "no-cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(param), // body data type must match "Content-Type" header
            }).then(function (response) {
                if (response.ok) {
                    SnackbarUtility.success("Impresion correcta!")
                } else {
                    SnackbarUtility.warning("Error!")
                }
            }).catch(function (error) {
                SnackbarUtility.error('Hubo un problema al imprimir:' + error.message);
            })
        }

        // console.log(params)

    }

}



export const SharedService = new Shared()



