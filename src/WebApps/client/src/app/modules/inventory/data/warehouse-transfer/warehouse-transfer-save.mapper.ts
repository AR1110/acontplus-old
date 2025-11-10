import { formatDateToString } from '@core/utils/date.util';
import DecimalUtil from '@core/utils/decimal.util';
import { InventoryTransactionType } from '@inventory/domain/enums/inventory.enum';
import { DOC_TYPE } from '@core/constants/global.constants';

export class WarehouseTransferSaveMapper {
  static toJson(obj: any) {
    const { data, details, transactionTypes, documentTypes, detailsDeleted } = obj;

    const getIdByCode = (
      arr: any,
      code: InventoryTransactionType.INBOUND | InventoryTransactionType.OUTBOUND | DOC_TYPE.TB,
    ) => arr.find((item: any) => item.code === code)?.id ?? null;

    console.log(transactionTypes);
    const idTipoTransaccionOrigen = getIdByCode(
      transactionTypes,
      InventoryTransactionType.OUTBOUND,
    );
    console.log(idTipoTransaccionOrigen);
    const idTipoTransaccionDestino = getIdByCode(
      transactionTypes,
      InventoryTransactionType.INBOUND,
    );
    const idTipoDocumento = getIdByCode(documentTypes, DOC_TYPE.TB);

    // --- Total general ---
    const comprobante = this.mapHeaderToDto({ ...data });

    // --- Detalles ---
    const origen = this.mapDetailToDto(
      details,
      idTipoTransaccionOrigen,
      idTipoDocumento,
      data.sourceWarehouseId,
    );
    const destino = this.mapDetailToDto(
      details,
      idTipoTransaccionDestino,
      idTipoDocumento,
      data.destinationWarehouseId,
    );

    // Combinar detalles
    const transaccionDetalles = [...origen, ...destino].map((item, i) => ({
      ...item,
      orderIndex: i + 1,
    }));

    const detallesCompletos = [
      ...origen,
      ...detailsDeleted.map((item: any, i: number) => ({ ...item, orderIndex: i + 1 })),
    ];
    console.log(comprobante);

    // --- Resultado final ---
    return {
      id: data.id,
      comprobante,
      detalles: detallesCompletos,
      transaccion: [
        {
          idTipoTransaccion: idTipoTransaccionOrigen,
          idTipoDocumento,
          fechaEmision: comprobante.fechaEmision,
        },
        {
          idTipoTransaccion: idTipoTransaccionDestino,
          idTipoDocumento,
          fechaEmision: comprobante.fechaEmision,
        },
      ],
      transaccionDetalles,
    };
  }

  /**
   * Mapea el encabezado (comprobante) al formato esperado por el backend.
   */
  private static mapHeaderToDto(header: any): any {
    return {
      idPuntoEmision: header.puntoEmisionId,
      idBodegaOrigen: header.sourceWarehouseId,
      idBodegaDestino: header.destinationWarehouseId,
      fechaEmision: formatDateToString(header.issueDate),
      observacion: header.obs,
      total: header.total,
    };
  }

  /**
   * Mapea un detalle de producto al formato esperado por el backend.
   */
  private static mapDetailToDto(
    detalles: any[],
    idTipoTransaccion: number,
    idTipoDocumento: number,
    idBodega: number,
  ) {
    return detalles.map((item, index) => ({
      orderIndex: index + 1,
      idTransferenciaBodegaDetalle: item.id,
      idTipoTransaccion,
      idTipoDocumento,
      idArticulo: item.productId,
      idBodega,
      idMedida: item.measureId,
      descripcion: item.description,
      cantidad: item.quantity,
      conversion: item.conversion,
      cantidadTransaccion: DecimalUtil.multiplyAsNumber(item.quantity, item.conversion),
      precioUnitario: item.unitPrice,
      precioCosto: item.costPrice,
      precioCostoFraccionado: item.fractionalCostPrice,
      total: item.total,
      estado: item.status,
    }));
  }

  static fromJson(response: any) {}
}
