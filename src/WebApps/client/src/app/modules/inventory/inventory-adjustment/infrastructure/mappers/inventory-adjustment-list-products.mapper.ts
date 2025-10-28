import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';
import { InventoryAdjustmentListProductsDto } from '@inventory/inventory-adjustment/domain/dtos/inventory-adjustment.dto';
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

        const dataMedida = medidas.find(m => m.idMedida === restItem.idMedida);

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
