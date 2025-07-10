
import {InventoryAdjustmentListDto} from "@inventory/inventory-adjustment/domain/dtos/inventory-adjustment.dto";

export class InventoryAdjustmentListMapper {
  static toJson(params:any){

    return JSON.stringify({
      tipo: 1,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      ckFecha: params.useFilterDate,
      fechaInicio:params.startDate,
      fechaFin:  params.endDate,
      nroSecuencial: params.serie,
      tipoDocId: params.tipoDocId,
      textSearch: params.text
    })
  }

  static fromJson(response:any): InventoryAdjustmentListDto{
    const result = new InventoryAdjustmentListDto();
    const {consolidaciones=[]} = response;
    result.data = consolidaciones.map((item:any, index: number)=>{
      return {
        index: index+1,
        "id": item.idConsolidacionInventario,
        "fechaEmision": item.fechaEmision,
        "observacion": item.observacion,
        "total": item.total,
        "nroDoc": item.nroDoc,
        "estadoNombre": item.estadoDoc,
        "codDoc": item.codDoc,
        "usuarioNombre": item.usuario,
        "style": item.style,
        "tipoDocNombre": item.tipoDocumento,
        "totalRecords": item.totalRecords
      }
    })
    result.totalRecords = result.data.length>0 ? result.data[0].totalRecords : 0;
    return result;
  }
}
