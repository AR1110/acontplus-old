import { CreateInventoryAdjustmentCommand } from '@inventory/inventory-adjustment/domain/use-cases/create-inventory-adjustment.use-case';
import { formatDateToString } from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';

export class SaveInventoryAdjustmentMapper {
  static toJson(params: CreateInventoryAdjustmentCommand) {
    const consolidacion = {
      idPuntoEmision: params.emissionPointId,
      idTipoDocumento: params.documentTypeId,
      idTipoTransaccion: params.transactionTypeId,
      fechaEmision: formatDateToString(params.emissionDate),
      total: params.total,
      observacion: isValidField(params.observations),
    };

    const detalles = params.details.map(item => {
      return {
        idConsolidacionInventarioDetalle: item.id,
        orderIndex: item.orderIndex,
        idArticulo: item.productId,
        idBodega: item.warehouseId,
        idMedida: item.unitOfMeasureId,
        cantidad: item.quantity,
        conversion: item.unitConversion,
        cantidadTransaccion: item.transactionQuantity,
        precioUnitario: item.unitPrice,
        precioCosto: item.costPrice,
        precioCostoFraccionado: item.fractionalCostPrice,
        total: item.total,
        nota: isValidField(item.notes),
        descripcion: item.description,
        estado: item.status,
      };
    });

    return {
      consolidacion,
      detalles,
    };
  }
}
