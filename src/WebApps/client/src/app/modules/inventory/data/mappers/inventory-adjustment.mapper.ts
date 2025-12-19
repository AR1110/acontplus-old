import {
  InventoryAdjustmentDetailDto,
  InventoryAdjustmentFormDataDto,
  InventoryAdjustmentListProductsDto,
  InventoryAdjustmentListResultDto,
} from '@inventory/data/dtos/inventory-adjustment.dto';
import { fechaString, formatDateToString } from '@core/utils/date.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';
import { CreateInventoryAdjustmentCommand } from '@inventory/domain/models/inventory-adjustment.model';
import { isValidField } from '@core/utils/utils';

export class InventoryAdjustmentDetailMapper {
  static toJson(id: number) {
    return JSON.stringify({
      tipo: 3,
      id,
    });
  }

  static fromJson(response: any): InventoryAdjustmentDetailDto {
    const result = new InventoryAdjustmentDetailDto();
    const { comprobante, detalles } = response;
    const header = comprobante[0];
    result.header = {
      id: header.idConsolidacionInventario,
      fechaEmision: fechaString(header.fechaEmision),
      observacion: header.observacion,
      total: header.total,
      estabNombre: header.nombreComercial,
      ptoEmision: header.ptoEmi,
      tipoDocNombre: header.tipoDocumento,
      movimientoNombre: header.movimiento,
    };

    result.items = detalles.map((item: any, index: number) => {
      return {
        index: index + 1,
        idConsolidacionInventarioDetalle: item.idConsolidacionInventarioDetalle,
        codigo: item.codigo,
        descripcion: item.descripcion,
        stock: item.stock,
        cantidad: item.cantidad,
        medidaNombre: item.medida,
        bodegaNombre: item.bodega,
        precioActual: item.precioActual,
        precioCosto: item.precioCosto,
        total: item.total,
      };
    });
    return result;
  }
}

export class InventoryAdjustmentFormDataMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 2,
    });
  }

  static fromJson(response: any): InventoryAdjustmentFormDataDto {
    const result = new InventoryAdjustmentFormDataDto();
    console.log(response);
    const { ptoEmision, bodegas, subFamilia, decimales, tiposTransaccion, tipoDocumento } =
      response;

    result.estabs = groupEstabUtil({
      estabs: ptoEmision,
      bodegas: bodegas,
      isGroupBodega: true,
      isGroupPuntoEmision: true,
    });
    result.subFamilias = subFamilia.map((item: any) => {
      return {
        id: item.idSubFamilia,
        name: item.descripcion,
      };
    });
    result.decimal = decimales[0];
    result.tiposDoc = tipoDocumento;
    result.tiposTransaccion = tiposTransaccion;
    return result;
  }
}

export class InventoryAdjustmentListMapper {
  static toJson(params: any) {
    return JSON.stringify({
      tipo: 1,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      ckFecha: params.useFilterDate,
      fechaInicio: params.startDate,
      fechaFin: params.endDate,
      nroSecuencial: params.serie,
      tipoDocId: params.tipoDocId,
      textSearch: params.text,
    });
  }

  static fromJson(response: any): InventoryAdjustmentListResultDto {
    const result = new InventoryAdjustmentListResultDto();
    const { consolidaciones = [] } = response;
    result.data = consolidaciones.map((item: any, index: number) => {
      return {
        index: index + 1,
        id: item.idConsolidacionInventario,
        fechaEmision: item.fechaEmision,
        observacion: item.observacion,
        total: item.total,
        nroDoc: item.nroDoc,
        estadoNombre: item.estadoDoc,
        codDoc: item.codDoc,
        usuarioNombre: item.usuario,
        style: item.style,
        tipoDocNombre: item.tipoDocumento,
        totalRecords: item.totalRecords,
      };
    });
    result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
    return result;
  }
}

export class InventoryAdjustmentListProductsMapper {
  static toJson(params: any) {
    return JSON.stringify({
      tipo: 4,
      ...params,
    });
  }

  static fromJson(response: any): InventoryAdjustmentListProductsDto {
    const result = new InventoryAdjustmentListProductsDto();
    if (response !== null && typeof response === 'object') {
      result.data = (response.articulos || []).map((item: any) => {
        const { principal, fraccionado, ...restItem } = item;
        const medidas = mergeMeasureUtil(principal, fraccionado);

        const dataMedida = medidas.find((m) => m.idMedida === restItem.idMedida);

        return {
          idArticulo: restItem.idArticulo,
          codigo: restItem.codigo,
          codigoAuxiliar: restItem.codigoAuxiliar,
          codigoBarra: restItem.codigoBarra,
          descripcion: restItem.descripcion,
          stock: restItem.stock,
          precioCosto: restItem.precioCosto,
          precioUnitario: dataMedida?.precioUnitario || 0,
          precioCostoFraccionado: dataMedida?.precioCostoFraccionado || 0,
          estado: restItem.estado,
          iva: restItem.iva,
          cantidad: restItem.cantidad,
          llevaInventario: restItem.llevaInventario,
          idMedida: restItem.idMedida,
          medidaNombre: restItem.medida,
          impuestoNombre: restItem.nombreTipoIva,
          medidas,
          conversion: dataMedida?.conversion || 0,
        };
      });
    }

    return result;
  }
}

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

    const detalles = params.details.map((item) => {
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
