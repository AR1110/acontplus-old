import { formatDateToString } from '@core/utils/date.util';
import { OrderMaintenance } from './../models/order-maintenance.model';

type OrderMaintenanceTo = OrderMaintenance & { envioSri: boolean, isGroup: boolean }
type ToProps = {
  order: any
  detalles: OrderMaintenanceTo[],
  customDetails: OrderMaintenanceTo[]
}
class OrderMaintenanceAdapter {

  to(obj: ToProps) {
    const { order, detalles, customDetails } = obj;


    let resultOrder = this.orderTo(order);
    let resultDetalles = this.detailTo(detalles);
    let resultCustomDetails = this.detailTo(customDetails);
    let mergeDetails = [...resultDetalles, ...resultCustomDetails];


    return {
      order: resultOrder,
      detalles: mergeDetails.map((_, index) => ({ ..._, orderIndex: index + 1 })),
      //  customDetails: resultCustomDetails
    }
  }



  private orderTo(data: any) {
    let obj = {
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

  private detailTo(detalles: OrderMaintenanceTo[]) {
    let results = detalles.map((item, index) => {
      return {
        rowguid: item.rowguid,
        id: item.id,
        descripcion: item.descripcion,
        orderIndex: index + 1,
        bodegaId: item.bodegaId,
        orderDetailId: item.orderDetailId,
        codigo: item.codigo,
        costoFraccionado: item.costoFraccionado,
        precioConIva: item.precioConIva,
        precioTotalSinImpuesto: item.precioTotalSinImpuesto,
        feeId: item.feeId,
        medidaId: item.medidaId,
        productId: item.productId,
        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        quantity: item.quantity,
        cost: item.cost,
        taxValue: item.taxValue,
        price: item.price,
        discount: item.discount,
        percentageDiscount: item.percentageDiscount,
        total: item.total,
        obs: item.obs,
        conversion: item.conversion,
        cantidadTransaccion: item.quantity * item.conversion,
        envioSri: item.envioSri,
        isGroup: item.isGroup //en caso de que el detalle sea personalizado
      }
    })
    return results;
  }


}


export const orderMaintenanceAdapter = new OrderMaintenanceAdapter()
