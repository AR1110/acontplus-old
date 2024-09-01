import { Order, OrderItem, OrderItemPostDB, OrderPostDB } from '@/models/order.model';
import { Injectable } from '@angular/core';
import { formatDate } from '@/core/utils/date.util';
import { imgDefault, isValidField } from '@/core/utils/utils';
import { mergeMeasureFromAdapter } from "@/adapters/medida.adapter";
import { plus } from '@/core/utils/decimal.util';
import { DECIMALS } from '@/enums/main.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderAdapter {

  itemsTo(items: OrderItem[]): OrderItemPostDB[] {
    const results = items.map((item, index) => {
      let cantidadTransaccion = item.quantity * (item.conversion || 1)
      return {
        orderIndex: index + 1,
        orderItemId: item.id,
        uuid: item.uuid,
        itemId: item.itemId || 0,
        feeId: item.feeId,
        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        descripcion: item.descripcion,
        taxValue: item.taxValue,
        quantity: item.quantity,
        cost: item.cost,
        costoFraccionado: item.costoFraccionado,
        conversion: item.conversion,
        price: item.price,
        discount: item.discount,
        total: item.precioTotalSinImpuesto, // por ahora el total al enviar viene ser sin incluir iva mas sin embargo en el front end es incluido iva, y el precio sin iva se llama preciosubtotal sin impuesto
        obs: isValidField(item.obs),
        itemTypeCode: item.itemTypeCode,
        menuId: item.menuId || 0,
        bodegaId: item.bodegaId,
        envioSri: item.envioSri,
        medidaId: item.medidaId,
        cantidadTransaccion,
        llevaInventario: item.llevaInventario,
        taxPercent: item.taxPercent
      }
    })
    return results;
  }

  orderTo(order: Order) {
    const data: OrderPostDB = {
      orderId: order.orderId,
      uuid: order.uuid,
      items: [],
      establecimientoId: order.establecimientoId,
      puntoEmisionId: order.puntoEmisionId,
      tableId: order.tableId,
      customerCompanyId: order.customerCompanyId,
      tax: 0,
      discount: order.discount,
      tip: order.tip,
      total: order.total,
      obs: isValidField(order.obs),
      userId: order.userId,
      taxPercentId: 0,
      quickSale: order.quickSale,
      subtotalSinImpuestos: order.subtotalSinImpuestos,
      codDoc: order.codDoc,
      itemsToPay: order.itemsToPay,
      customDetail: order.customDetail,
      saveDoc: order.saveDoc,
      updateOrder: order.updateOrder,
      taxes: []
    }
    return data;
  }

  taxesTo(orderItems: OrderItem[]) {

    let impuestosTarifa = orderItems.map(item => {
      const obj = {
        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        percent: item.taxPercent,
        taxBase: item.precioTotalSinImpuesto,
        taxValue: item.taxValue,
        discount: item.discount,
      }
      return obj;
    })
    return impuestosTarifa;

  }

  postTo(order: Order) {
    const items = this.itemsTo(order.items);
    const data = {
      ...this.orderTo(order),
      items,
      taxes: this.taxesTo(order.items)
    }
    return data;
  }

  getIdFrom(data: any): { order: Order } {
    const { order, orderItems } = data;

    const orderItemsMapper: OrderItem[] = orderItems.map((orderItem: any) => {

      const { medidasFraccionado, medidasPrincipal, ...restOrderItem } = orderItem;

      const measures = mergeMeasureFromAdapter(medidasPrincipal, medidasFraccionado);

      /**
       * Obtener los datos de la medida
       *
       * Parámetros:
       *  - orderMedidaArray: El array de medidas ordenado
       *  - restItem: El artículo
       *
       * Devuelve:
       *  - Los datos de la medida, o un objeto vacío si la medida no se encuentra
       */
      const dataMedida = measures.find(m => m.idMedida === restOrderItem.medidaId);

      const precioTotalSinImpuesto = restOrderItem.total;
      const total = plus(precioTotalSinImpuesto, restOrderItem.taxValue, DECIMALS.CINCO) as number

      const obj: OrderItem = {
        productId: restOrderItem.idArticulo,
        id: restOrderItem.id,
        uuid: restOrderItem.uuid,
        itemId: restOrderItem.itemId,
        itemTypeId: restOrderItem.itemTypeId,
        taxId: restOrderItem.taxId,
        taxPercentId: restOrderItem.taxPercentId,
        taxValue: restOrderItem.taxValue,
        quantity: restOrderItem.quantity,
        cost: restOrderItem.cost,

        price: restOrderItem.price,
        discount: restOrderItem.discount,
        obs: restOrderItem.obs ?? "",
        feeId: restOrderItem.feeId,
        bodegaId: restOrderItem.bodegaId,
        descripcion: restOrderItem.descripcion,
        summary: restOrderItem.summary,
        code: restOrderItem.codigoArticulo,
        img: restOrderItem.s3ObjectUrl || imgDefault,
        llevaInventario: restOrderItem.llevaInventario,
        precioConIva: restOrderItem.priceWithVat,
        pvps: dataMedida && dataMedida.pvps || [], // Asignar los datos de las tarifas obtenidos de data medida
        costoFraccionado: dataMedida?.precioCostoFraccionado ?? 0,
        conversion: dataMedida?.conversion ?? 1,
        medidaId: restOrderItem.medidaId,
        medidas: measures,
        codigoTarifaImpuesto: restOrderItem.taxRateCode,
        taxPercent: restOrderItem.taxPercent,
        menuId: restOrderItem.menuId,
        itemTypeCode: restOrderItem.itemTypeCode,
        remainingQuantity: restOrderItem.remainingQuantity || 0,
        medida: restOrderItem.medida,
        precioTotalSinImpuesto: precioTotalSinImpuesto,
        total,

        consolidacionesFecha: [],
        paid: restOrderItem.paid
      }
      return obj;

    })

    const orderMapper: Order = {
      customerName: order.customerName,
      tableDesc: order.tableName,
      orderId: order.id,
      uuid: order.uuid,
      establecimientoId: order.establecimientoId,
      puntoEmisionId: order.puntoEmisionId,
      tableId: order.tableId,
      customerCompanyId: order.customerCompanyId,
      tax: order.tax,
      discount: order.discount,
      tip: order.tip,
      total: order.total,
      obs: order.obs,
      createdAt: formatDate(order.createdAt),

      userId: order.userId,
      items: orderItemsMapper,
      subtotalSinImpuestos: 0
    }


    return {
      order: orderMapper,
    }


  }


}
