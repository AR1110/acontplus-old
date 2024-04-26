
import { formatDateMoment } from "@core/utils/format-date-moment";
import { SupportMaintenanceDetail } from "../models/support-maintenance.model";


type ToProps = {
  data: any
  details: SupportMaintenanceDetail[],
}
class SupportMaintenanceAdapter {

  to(obj: ToProps) {
    const { data, details } = obj;


    let resultData = this.dataTo(data);
    let resultDetalles = this.detailTo(details);


    return {
      //order: resultOrder,
      supportId: resultData.id,
      supportDetails: resultDetalles,
      //  customDetails: resultCustomDetails
    }
  }



  private dataTo(data: any) {
    let obj = {
      id: data.id,
      bodegaId: data.bodegaId,
      fechaEmision: formatDateMoment(data.fechaEmision),
      establecimientoId: data.establecimientoId,
      customerCompanyId: data.customerCompanyId,
      percentageDiscount: data.percentageDiscount,
      subTotalSinImpuesto: data.subTotalSinImpuesto,
      codDoc: data.codDoc,
      tax: data.tax,
      tip: data.tip,
      total: data.total,
      puntoEmisionId: data.puntoEmisionId,
      discount: data.discount
    }
    return obj;
  }

  private detailTo(detalles: SupportMaintenanceDetail[]) {
    let results = detalles.map((item, index) => {
      return {
        id: item.id,
        rowguid: item.rowguid,
        orderIndex: index + 1,
        articuloId: item.productId,
        tarifaId: item.feeId,
        bodegaId: item.bodegaId,
        medidaId: item.medidaId,
        description: item.descripcion,
        quantity: item.quantity,
        price: item.price,
        cost: item.cost,
        total: item.total,
        codePercentage: item.codePercentage,
        percentage: item.percentage,
        inventory: item.llevaInventario,
        estado: item.estado
      }
    })
    return results;
  }


}


export const supportMaintenanceAdapter = new SupportMaintenanceAdapter()
