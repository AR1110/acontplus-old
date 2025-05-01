import {ApiResponse} from "@core/models/api-response";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {FilterDataCuentaPorPagarResponse} from "@accounting/core/models/cuenta-por-pagar.model";

export class GetFilterDataCuentaPorPagarMapper {
  static toJson(){
    return JSON.stringify({
      tipo: 6,
    });
  }
  static fromJson(response:ApiResponse){
    const resultData = new FilterDataCuentaPorPagarResponse()

    if(response.code==="1"){
      let [tempEstabs, tempEstadosDoc, tempTiposDoc, tempCategorias] = JSON.parse(
        response.payload as string,
      );

      let dataToGroup = {
        estabs: tempEstabs,
        isGroupPuntoEmision: true,
      };
      resultData.estabs = groupEstabUtil(dataToGroup);
      resultData.estadosDoc = tempEstadosDoc;
      resultData.tiposDoc = tempTiposDoc;
      resultData.categorias = tempCategorias;

    }

    return resultData
  }
}
