import { ProductSearchDto } from '@domain/models/inventory/product.model';
import { Tarifa } from '@domain/models/inventory/tarifa.model';
import { MedidaProducto } from '@domain/models/inventory/medida.model';
import { mergeMeasureFromAdapter } from '../../mappers/medida.adapter';
import { imgDefault } from '@domain/utils/utils';

export class ProductAdapter {
  static fromApiSearch(products: any[]): Array<ProductSearchDto> {

    const results = products.map((item: any) => {
      const tempTarifas: Array<any> = JSON.parse(item.priceSale) || [];
      const tarifas: Array<Tarifa> = tempTarifas.map((tarifa) => ({
        idTarifa: tarifa.idTarifa,
        descripcion: tarifa.tarifa,
        precioVenta: tarifa.precioVenta,
        precioConIva: tarifa.precioConIva,
        default: tarifa.predeterminada,
      }));
      return {
        idArticulo: item.idArticulo,
        codigo: item.codigo,
        descripcion: item.descripcion,
        iva: item.iva,
        tarifas: tarifas,
        s3ObjectUrl: item.s3ObjectUrl || imgDefault,
      };
    });
    return results;
  }

  static fromApiGetSale(response: any) {
    let {
      product,
      measures: medidasPrincipal,
      fractionedMeasures: medidasFraccionado,
      inventoryAdjustment: productoConsolidaciones,
      additionalInfo,
    } = response;

    const resultMedidas: Array<MedidaProducto> = mergeMeasureFromAdapter(
      medidasPrincipal,
      medidasFraccionado
    );

    productoConsolidaciones = productoConsolidaciones.map((item: any) => {
      return {
        ...item,
        fechaConsolidacion:
          item.fechaConsolidacion && new Date(item.fechaConsolidacion),
      };
    });

    return {
      product: product[0] || {},
      medidas: resultMedidas,
      productoConsolidaciones,
    };
  }

  static fromApiCheckStockNotificacion(responseApi: any) {
    let { stockCheckResponse } = JSON.parse(responseApi.payload);
    return stockCheckResponse[0];
  }
}
