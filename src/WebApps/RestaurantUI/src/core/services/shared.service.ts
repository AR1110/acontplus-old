
import Swal from "sweetalert2"
import { PATHS_API } from "../constants"
import { ApiResponse, CustomerCedulaSRI, CustomerRucSRI } from "../models"
import { Http, SnackbarUtility } from "../utilities"
import FileSaver from "file-saver"

type ParamsPrint = { id: number, documentoId: number, tipo: 1 | 2 | 3 | 4 }


class Shared {
    async checkClientSRIByRUC(identificacion: string): Promise<CustomerRucSRI> {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS_API.CONSULTA}GetRucSRI`,
            params: {
                Ruc: identificacion
            }
        })
        return resultAxios.data;
    }

    async checkClientSRIByCedula(identificacion: string): Promise<CustomerCedulaSRI> {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS_API.CONSULTA}GetCedulaSri`,
            params: {
                Ruc: identificacion
            }
        })
        return resultAxios.data;
    }

    async downloadExternal(parameters: object, returnData = false, oldVersion=false) {
        const url = oldVersion? PATHS_API.REPORT_V1 : PATHS_API.REPORT_V2

        const resultAxios = await Http({
            method: 'post',
            url: `${url}Download`,
            data: JSON.stringify(parameters),
            responseType: 'blob'
        })

        if (!returnData) {
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
            return
        }
        return resultAxios
    }

    async askToPrint(obj: ParamsPrint) {
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
            this.getPrinter(obj)
        }
    }

    async getPrinter(obj: ParamsPrint) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS_API.PRIVATE}Order/Print/${JSON.stringify(obj)}`,
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
            const resultAxios = await Http({
                method: 'post',
                url: param.urlPrinter,
                data: JSON.stringify(param)
            });
            const response: ApiResponse = resultAxios.data;
            if (response.code === "0") {
                SnackbarUtility.warning(response.message)
            }
            if (response.code === "1") {
                SnackbarUtility.success(response.message)
            }
        }
    }
}
export const SharedService = new Shared()



