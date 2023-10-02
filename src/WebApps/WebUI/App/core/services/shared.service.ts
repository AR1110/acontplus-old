

import FileSaver from "file-saver";
import { clientFile } from "$core/api/axiosClient";



class Shared {
    download(parameters: object, returnData = false) {

        clientFile('Reporte/Download', parameters).then(response => { 
            const ieEDGE = navigator.userAgent.match(/Edge/g);
            const ie = navigator.userAgent.match(/.NET/g); // IE 11+
            const oldIE = navigator.userAgent.match(/MSIE/g);
            const blob = new window.Blob([response.data], {
                type: response.headers["content-type"],
            });
            let fileName = response.headers["content-disposition"]
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
        })


    }

}


export const sharedService = new Shared();