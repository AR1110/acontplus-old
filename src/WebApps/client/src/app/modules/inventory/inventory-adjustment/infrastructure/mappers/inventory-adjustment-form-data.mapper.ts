import { groupEstabUtil } from '@core/utils/group-estab.util';
import { InventoryAdjustmentFormDataDto } from '@inventory/inventory-adjustment/domain/dtos/inventory-adjustment.dto';

export class InventoryAdjustmentFormDataMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 2,
    });
  }

  static fromJson(response: any): InventoryAdjustmentFormDataDto {
    const result = new InventoryAdjustmentFormDataDto();
    console.log(response);
    const { ptoEmision, bodegas, subFamilia, decimales, tiposTransaccion, tipoDocumento } =
      response;

    result.estabs = groupEstabUtil({
      estabs: ptoEmision,
      bodegas: bodegas,
      isGroupBodega: true,
      isGroupPuntoEmision: true,
    });
    result.subFamilias = subFamilia.map((item: any) => {
      return {
        id: item.idSubFamilia,
        name: item.descripcion,
      };
    });
    result.decimal = decimales[0];
    result.tiposDoc = tipoDocumento;
    result.tiposTransaccion = tiposTransaccion;
    return result;
  }
}
