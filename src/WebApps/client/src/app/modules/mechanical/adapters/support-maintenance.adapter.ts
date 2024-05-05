import { formatDateMoment } from "@core/utils/format-date-moment";

import { SupportMaintenanceDetail } from "../models/support-maintenance.model";
import { isValidField } from "@core/utils/utils";

type ToProps = {
  data: any
  details: SupportMaintenanceDetail[],
  detailsDeleted: SupportMaintenanceDetail[],
}
class SupportMaintenanceAdapter {

  to(obj: ToProps) {
    const { data, details, detailsDeleted } = obj;


    let resultData = this.dataTo(data);
    let resultDetalles = this.detailTo(details);
    let resultDetallesDeleted = this.detailTo(detailsDeleted);

    let resultDetallesMerge = [...resultDetalles, ...resultDetallesDeleted]

    return {
      //order: resultOrder,
      support: {
        id: resultData.id,
        total: resultData.total,
        discount: resultData.discount
      },
      supportDetails: resultDetallesMerge,
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
        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        discount: item.discount,
        tarifaId: item.feeId,
        bodegaId: item.bodegaId,
        medidaId: item.medidaId,
        description: item.descripcion,
        quantity: item.quantity,
        taxValue: item.taxValue,
        price: item.price,
        cost: item.cost,
        total: item.precioTotalSinImpuesto,
        inventory: item.llevaInventario,
        enabled: item.enabled,
        deleted: item.deleted,
        obs: isValidField(item.obs)
      }
    })
    return results;
  }


}


export const supportMaintenanceAdapter = new SupportMaintenanceAdapter()
