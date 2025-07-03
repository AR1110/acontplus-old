import {InventoryAdjustmentFormDataResponse} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";
import {ApiResponse} from "@core/models/api-response";
import {groupEstabUtil} from "@core/utils/group-estab.util";

export class InventoryAdjustmentFormDataMapper {
  static toJson(){
    return JSON.stringify({
      tipo: 2
    })
  }

  static fromJson(response:any): InventoryAdjustmentFormDataResponse{
    const result = new InventoryAdjustmentFormDataResponse();
    console.log(response);
    const { ptoEmision,bodegas, subFamilia,decimales,tiposTransaccion,tipoDocumento } = response;

    result.estabs = groupEstabUtil(
      {
        estabs: ptoEmision,
        bodegas: bodegas,
        isGroupBodega: true,
        isGroupPuntoEmision: true,
      }
    );
    result.subFamilias = subFamilia.map((item:any)=>{
      return {
        id: item.idSubFamilia,
        name: item.descripcion,
      }
    });
    result.decimal = decimales[0];
    result.tiposDoc = tipoDocumento;
    result.tiposTransaccion = tiposTransaccion;
    return result;

  }
}
