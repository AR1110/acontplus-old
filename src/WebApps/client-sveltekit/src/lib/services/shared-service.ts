import { hideLoader } from '$utils/loading-spinner';
import { showLoader } from '$utils/loading-spinner';
import FileSaver from "file-saver";
import { client } from "$utils/axiosClient";

class Shared {
  download(parameters: object, isReturnData?: boolean) {
    showLoader();
    client.post("Reports/Reporte/Download", parameters, { responseType: "blob" }).then((response) => {
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
    }).finally(() => hideLoader())
  }

  roundNumber(number, max = 1) {
    number = Number(number);

    if (typeof number !== "number" || isNaN(number)) {
      throw new TypeError("Número inválido: " + number);
    }

    if (typeof max !== "number" || isNaN(max)) {
      throw new TypeError("Máximo de dígitos inválido: " + max);
    }

    const factor = Math.pow(10, max);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }
}

export const sharedService = new Shared();
