

import { formatDate } from '@domain/utils/date.util';
import { imgDefault, isValidField } from '@domain/utils/utils';
import { mergeMeasureFromAdapter } from "@data/mappers/medida.adapter";
import { plus } from '@domain/utils/decimal.util';
import { DECIMALS, SRI_IDENTIFICATION_CODE } from '@domain/enums/main.enum';
import { Order, OrderItem } from '@domain/models/order.model';
import { OrderApi, OrderItemApi } from '@data/repositories/order/order.entity';

export class OrderMapper {

  // Método para adaptar los ítems a enviar a la API
  static toApiItems(items: OrderItem[]) {
    const results: OrderItemApi[] = items.map((item, index) => {
      let cantidadTransaccion = item.quantity * (item.conversion || 1)
      return {
        orderIndex: index + 1,
        orderItemId: item.id,
        uuid: item.uuid,
        itemId: item.itemId || 0,
        itemTypeId: item.itemTypeId,
        feeId: item.feeId,

        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        description: item.descripcion,
        taxValue: item.taxValue,
        quantity: item.quantity,
        cost: item.cost,
        costoFraccionado: item.costoFraccionado,
        conversion: item.conversion,
        price: item.price,
        discount: item.discount,
        total: item.precioTotalSinImpuesto, // Actualmente, el total enviado es sin incluir IVA. En el frontend, se muestra como total con IVA. El precio sin IVA se denomina 'precioSubtotalSinImpuesto'.

        obs: isValidField(item.obs),
        itemTypeCode: item.itemTypeCode,
        menuId: item.menuId || 0,
        bodegaId: item.bodegaId,
        envioSri: item.envioSri,
        medidaId: item.medidaId,
        cantidadTransaccion,
        llevaInventario: item.llevaInventario,
        taxPercent: item.taxPercent,
        productId: item.productId
      }
    })
    return results;
  }

  // Método para adaptar el pedido a enviar a la API
  static toApiOrder(order: Order): OrderApi {
    return {
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
  }

  // Método para adaptar los impuestos de los ítems
  static toApiTaxes(orderItems: OrderItem[]): any[] {

    return orderItems.map(item => {
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

  }

  // Método principal para preparar el pedido para enviar
  static formatOrderForApi(order: Order) {
    const items = this.toApiItems(order.items);
    const data = {
      ...this.toApiOrder(order),
      items,
      taxes: this.toApiTaxes(order.items)
    }
    return data;
  }

  //datos que recibe bd
  static toApiParams(obj:any){
    // const {items, taxes, ...rest} = obj;
    // return {
    //   orderDocument: rest,
    //   taxes,
    //   items
    // }
    return structuredClone(obj)
  }


  static fromApiData(apiResponse: any): { order: Order } {
    const { order: apiOrder, orderItems: apiOrderItems } = apiResponse;

    // Mapear items de la orden
    const mappedOrderItems = apiOrderItems.map(OrderMapper.mapOrderItemFromApi);

    // Crear objeto Order mapeado
    const mappedOrder = OrderMapper.mapOrderFromApi(apiOrder, mappedOrderItems);

    return { order: mappedOrder };
  }


  // Función para mapear un item de la orden
  private static mapOrderItemFromApi(item: any): OrderItem {
    const { medidasFraccionado, medidasPrincipal, ...restOrderItem } = item;

    const mergedMeasures = mergeMeasureFromAdapter(medidasPrincipal, medidasFraccionado);
    const measureData = mergedMeasures.find(measure => measure.idMedida === restOrderItem.medidaId);

    const subtotalWithoutTax = restOrderItem.total;
    const totalWithTax = plus(subtotalWithoutTax, restOrderItem.taxValue, DECIMALS.CINCO) as number

    return {
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
      pvps: measureData?.pvps || [],
      costoFraccionado: measureData?.precioCostoFraccionado ?? 0,
      conversion: measureData?.conversion ?? 1,
      medidaId: restOrderItem.medidaId,
      medidas: mergedMeasures,
      codigoTarifaImpuesto: restOrderItem.taxRateCode,
      taxPercent: restOrderItem.taxPercent,
      menuId: restOrderItem.menuId,
      itemTypeCode: restOrderItem.itemTypeCode,
      remainingQuantity: restOrderItem.remainingQuantity || 0,
      medida: restOrderItem.medida,
      precioTotalSinImpuesto: subtotalWithoutTax,
      total: totalWithTax,
      consolidacionesFecha: [],
      paid: restOrderItem.paid
    };
  }

  // Función para mapear la orden
  private static mapOrderFromApi(apiOrder: any, orderItems: OrderItem[]): Order {
    return {
      customerName: apiOrder.customerName,
      tableDesc: apiOrder.tableName,
      orderId: apiOrder.id,
      uuid: apiOrder.uuid,
      establecimientoId: apiOrder.establecimientoId,
      puntoEmisionId: apiOrder.puntoEmisionId,
      tableId: apiOrder.tableId,
      tipoIdentificacionSri: apiOrder.tipoIdentificacionSri ?? SRI_IDENTIFICATION_CODE.CONSUMIDOR_FINAL,
      customerCompanyId: apiOrder.customerCompanyId,
      tax: apiOrder.tax,
      discount: apiOrder.discount,
      tip: apiOrder.tip,
      total: apiOrder.total,
      obs: apiOrder.obs,
      createdAt: formatDate(apiOrder.createdAt),
      userId: apiOrder.userId,
      items: orderItems,
      subtotalSinImpuestos: 0 // Este valor debería calcularse si es necesario
    };
  }

}
