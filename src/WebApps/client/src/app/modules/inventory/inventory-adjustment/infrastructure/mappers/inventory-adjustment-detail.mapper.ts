import {
  InventoryAdjustmentDetailResponse,
} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";
import {fechaString} from "@core/utils/date.util";

export class InventoryAdjustmentDetailMapper {
  static toJson(id:number){

    return JSON.stringify({
      tipo: 3,
      id
    })
  }

  static fromJson(response:any): InventoryAdjustmentDetailResponse{
    const result = new InventoryAdjustmentDetailResponse();
    const {comprobante, detalles} = response;
    const header = comprobante[0];
    result.header = {
      id: header.idConsolidacionInventario,
      fechaEmision: fechaString(header.fechaEmision),
      observacion: header.observacion,
      total: header.total,
      estabNombre: header.nombreComercial,
      ptoEmision: header.ptoEmi,
      tipoDocNombre: header.tipoDocumento,
      movimientoNombre: header.movimiento,
    }

    result.items = detalles.map((item:any, index:number) => {
      return {
        index: index+1,
        "idConsolidacionInventarioDetalle": item.idConsolidacionInventarioDetalle,
        "codigo": item.codigo,
        "descripcion":item.descripcion,
        "stock": item.stock,
        "cantidad": item.cantidad,
        "medidaNombre": item.medida,
        "bodegaNombre": item.bodega,
        "precioActual": item.precioActual,
        "precioCosto": item.precioCosto,
        "total": item.total,
      }
    })
    return result;
  }
}
