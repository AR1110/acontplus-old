import {PURCHASE_CODE_REPORT} from "@purchase/constants/purchase.constants";
import {FORMAT_REPORT} from "@core/constants/global.constants";

interface  Params {
  dataParams: string
  hasService: boolean
  reportParams: string
}
interface  Options {
  id: number
  codEstab: string
}

export  class ParameterReportUtil {



  static  getParams(codDoc: string, options: Options): Params {
    let params: { [key: string]: Params } = {
      "DH": {
        dataParams  : JSON.stringify({
          id: options.id,
          tipo: 1
        }),
       hasService: true,
        reportParams: JSON.stringify({
          hasParams: true,
          codigo: PURCHASE_CODE_REPORT.RCNH,
          format: FORMAT_REPORT.PDF,
          aditionalParams: []
        })
      },

    };

    return params[codDoc];
  }




}
