
import { formatDateToString } from "@core/utils/date.util";
import { SupportMaintenanceDetail } from "@mechanical/domain/models/support-maintenance.model";
import { isValidField } from "@core/utils/utils";

interface ToProps {
  data: any
  details: SupportMaintenanceDetail[],
  detailsDeleted: SupportMaintenanceDetail[],
}
export class SupportMaintenanceAdapter {

  static to(obj: ToProps) {
    const { data, details, detailsDeleted } = obj;


    const resultData = this.dataTo(data);
    const resultDetalles = this.detailTo(details);
    const resultDetallesDeleted = this.detailTo(detailsDeleted);

    const resultDetallesMerge = [...resultDetalles, ...resultDetallesDeleted]

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



  private static dataTo(data: any) {
    const obj = {
      id: data.id,
      bodegaId: data.bodegaId,
      fechaEmision: formatDateToString(data.fechaEmision),
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

  private static detailTo(detalles: SupportMaintenanceDetail[]) {
    const results = detalles.map((item, index) => {
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


