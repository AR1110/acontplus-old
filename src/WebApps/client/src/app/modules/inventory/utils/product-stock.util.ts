import { isDateValid } from '@core/utils/date.util';
import { ConsolidacionBodega } from '@inventory/data/models/consolidacion-bodega.model';
import { MedidaProducto } from '@inventory/data/models/measure.model';

interface Row {
  productId: number;
  bodegaId: number;
  medidaId: number;
  medidas: MedidaProducto[];
  quantity: number;
}
interface MergeProductStockProps {
  rows: Row[];
  row: Row;
}

//Merge Item Detalle Documento Venta
export const mergeProductStock = function (obj: MergeProductStockProps) {
  // Filtra los elementos que tienen las mismas propiedades idArticulo e idBodega que rowEntity.
  const foundItemByArticuloAndBodega = obj.rows.filter(
    (item) => item.productId === obj.row.productId && item.bodegaId === obj.row.bodegaId,
  );

  const { totalCantidadFraccionada, totalCantidadPrincipal } = foundItemByArticuloAndBodega.reduce(
    (total, item) => {
      const dataMedidaFraccionado = item.medidas.find(
        (medida) => medida.idMedida === item.medidaId && medida.tipo === 'FRACCIONADO',
      );
      const dataMedidaPrincipal = item.medidas.find(
        (medida) => medida.idMedida === item.medidaId && medida.tipo === 'PRINCIPAL',
      );
      if (dataMedidaFraccionado) {
        const conversionSum = item.quantity * dataMedidaFraccionado.conversion;
        total.totalCantidadFraccionada += conversionSum;
      }
      if (dataMedidaPrincipal) {
        const conversionSum = item.quantity * dataMedidaPrincipal.conversion;
        total.totalCantidadPrincipal += conversionSum;
      }
      return total;
    },
    {
      totalCantidadFraccionada: 0,
      totalCantidadPrincipal: 0,
    },
  );

  const cantidad = foundItemByArticuloAndBodega.reduce((prevQuantity, itemCurrent) => {
    prevQuantity += itemCurrent.quantity;
    return prevQuantity;
  }, 0);

  // Devuelve el objeto resultante de la fusión.
  return {
    cantidad,
    cantidadStock: totalCantidadPrincipal + totalCantidadFraccionada,
  };
};

interface GetCantidadStockProps {
  bodegaId: number;
  fechaEmision: Date;
  cantidadStock: number;
  consolidacionesFecha: ConsolidacionBodega[];
}

export const getCantidadStock = function (obj: GetCantidadStockProps): number {
  const { fechaEmision, cantidadStock, consolidacionesFecha, bodegaId } = obj;

  const dataConsolidacionFecha = consolidacionesFecha.find(
    (cdataFecha) => cdataFecha.idBodega === bodegaId,
  );

  if (dataConsolidacionFecha) {
    const fechaConsolidacion = new Date(dataConsolidacionFecha.fechaConsolidacion);

    if (isDateValid(fechaConsolidacion) && fechaConsolidacion >= fechaEmision) {
      return 0;
    }
  }
  return cantidadStock;
};
