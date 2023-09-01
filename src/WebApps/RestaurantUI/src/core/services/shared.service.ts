
import Swal from "sweetalert2"
import { PATHS } from "../constants"
import { ApiResponse } from "../models"
import { Http, SnackbarUtility } from "../utilities"
import FileSaver from "file-saver"



class Shared {

    async downloadReport(id: number) {
        const resultAxios = await Http({
            method: 'post',
            url: `${PATHS.PRIVATE}Order/Report/${id}`,
            responseType: 'blob'
        })
        const ieEDGE = navigator.userAgent.match(/Edge/g);
        const ie = navigator.userAgent.match(/.NET/g); // IE 11+
        const oldIE = navigator.userAgent.match(/MSIE/g);
        const blob = new window.Blob([resultAxios.data], {
            type: resultAxios.headers["content-type"],
        });
        let fileName = resultAxios.headers["content-disposition"]
            .split(";")[1]
            .split("=")[1]
            .replace('"', "");
        fileName = fileName.replace('"', "");
        if (ie || oldIE || ieEDGE) {
            FileSaver.saveAs(blob, fileName);
        } else {
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, fileName);
        }
    }

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

        // await fetch(params[0].urlPrinter + "/GetPrinters")
        //     .then(response => response.json())
        //     .then(data => { console.log(data); })
        //     .catch(function (error) {
        //         SnackbarUtility.error('Hubo un problema al obtener las impresoras:' + error.message);
        //     })

        for (const param of params) {
            //console.log(param)
            //const urlPrint = `${param.urlPrinter}?rdlcProps=${param.rdlcProps}&dataSources=${encodeURIComponent(param.dataSources)}&rdlcParams=${param.rdlcParams}`
            // console.log(urlPrint)
            await fetch(param.urlPrinter, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                //mode: "no-cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                //redirect: "follow", // manual, *follow, error
                //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(param), // body data type must match "Content-Type" header
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code == "1") {
                        SnackbarUtility.success(data.message)
                    } else {
                        SnackbarUtility.warning(data.message)
                    }
                }).catch(function (error) {
                    console.log(error)
                    SnackbarUtility.error('Hubo un problema al imprimir:' + error.message);
                })
        }

        // console.log(params)

    }

}



export const SharedService = new Shared()



