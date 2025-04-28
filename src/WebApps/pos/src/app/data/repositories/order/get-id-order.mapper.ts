import {ApiResponse} from "acontplus-utils";
import {
  GetIdOrderResponse,
  Order,
  OrderItem,
} from "@domain/models/order.model";
import {DECIMALS, DOC_TYPE, SRI_IDENTIFICATION_CODE} from "@domain/enums/main.enum";
import {mergeMeasureFromAdapter} from "@data/mappers/medida.adapter";
import {plus} from "@domain/utils/decimal.util";
import {imgDefault} from "@domain/utils/utils";
import {formatDate} from "@domain/utils/date.util";

export class GetIdOrderMapper {
  static toJson(id: number){
    return JSON.stringify({ id, tipo: 2 })
  }

  static fromJson(response:ApiResponse): GetIdOrderResponse{
    const { order, orderItems } = JSON.parse(response.payload as string);
    console.log(order)

    // Mapear items de la orden
    const mappedOrderItems = orderItems.map(GetIdOrderMapper.itemFromJson);

    // Crear objeto Order mapeado
    const mappedOrder = GetIdOrderMapper.orderFromJson(order, mappedOrderItems);

    console.log(mappedOrder)
    return { order: mappedOrder };

  }


  static itemFromJson(item: any){
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
  private static orderFromJson(apiOrder: any, orderItems: OrderItem[]): Order {
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
