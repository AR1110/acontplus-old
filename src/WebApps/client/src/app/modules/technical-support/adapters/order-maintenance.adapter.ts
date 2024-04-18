import { OrderMaintenance } from "../models/order-maintenance.model";

type ToProps = {
  order: any
  detalles: any[]
}
class OrderMaintenanceAdapter {

  to(obj: ToProps) {
    const { order, detalles } = obj;


    let resultOrder = this.orderTo(order);
    let resultDetalles = this.detailTo(detalles);

    return {
      order: resultOrder,
      detalles: resultDetalles
    }
  }



  private orderTo(data: any) {
    let obj = {
      id: data.id,
      bodegaId: data.bodegaId,
      customerCompanyId: data.customerCompanyId,
      percentageDiscount: data.percentageDiscount,
      subTotalSinImpuesto: data.subTotalSinImpuesto,
      codDoc: data.codDoc,
      tax: data.tax,
      tip: data.tip,
      total: data.total,
      puntoEmisionId: data.puntoEmisionId,
    }
    return obj;
  }

  private detailTo(detalles: OrderMaintenance[]) {
    let results = detalles.map((item, index) => {
      return {
        id: item.id,
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
        total: item.total,
        obs: item.obs,

      }
    })
    return results;
  }


}


export const orderMaintenanceAdapter = new OrderMaintenanceAdapter()
