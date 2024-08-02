import { isDateValid } from "@core/utils/format-date-moment"

import { ConsolidacionBodega } from "../models/consolidacion-bodega.model"
import { MedidaProducto } from "../models/measure.model"

type Row = {
  productId: number
  bodegaId: number
  medidaId: number
  medidas: MedidaProducto[]
  quantity: number
}
type MergeProductStockProps = {
  rows: Row[]
  row: Row
}

//Merge Item Detalle Documento Venta
export const mergeProductStock = function (obj: MergeProductStockProps) {
  // Filtra los elementos que tienen las mismas propiedades idArticulo e idBodega que rowEntity.
  let foundItemByArticuloAndBodega = obj.rows.filter(item => (
    item.productId === obj.row.productId &&
    item.bodegaId === obj.row.bodegaId
  ))

  let { totalCantidadFraccionada, totalCantidadPrincipal } = foundItemByArticuloAndBodega.reduce((total, item) => {
    let dataMedidaFraccionado = item.medidas.find(medida => medida.idMedida === item.medidaId && medida.tipo === 'FRACCIONADO')
    let dataMedidaPrincipal = item.medidas.find(medida => medida.idMedida === item.medidaId && medida.tipo === 'PRINCIPAL')
    if (dataMedidaFraccionado) {
      let conversionSum = item.quantity * dataMedidaFraccionado.conversion;
      total.totalCantidadFraccionada += conversionSum;
    }
    if (dataMedidaPrincipal) {
      let conversionSum = item.quantity * dataMedidaPrincipal.conversion;
      total.totalCantidadPrincipal += conversionSum;
    }
    return total;
  }, {
    totalCantidadFraccionada: 0,
    totalCantidadPrincipal: 0
  });

  let cantidad = foundItemByArticuloAndBodega.reduce((prevQuantity, itemCurrent) => {
    prevQuantity += itemCurrent.quantity;
    return prevQuantity;
  }, 0);

  // Devuelve el objeto resultante de la fusión.
  return {
    cantidad,
    cantidadStock: totalCantidadPrincipal + totalCantidadFraccionada
  };
}


type GetCantidadStockProps = {
  bodegaId: number;
  fechaEmision: Date;
  cantidadStock: number;
  consolidacionesFecha: ConsolidacionBodega[];
}

export const getCantidadStock = function (obj: GetCantidadStockProps): number {
  const { fechaEmision, cantidadStock, consolidacionesFecha, bodegaId } = obj;

  const dataConsolidacionFecha = consolidacionesFecha.find(
    cdataFecha => cdataFecha.idBodega === bodegaId
  );

  if (dataConsolidacionFecha) {
    const fechaConsolidacion = new Date(dataConsolidacionFecha.fechaConsolidacion);
    console.log(fechaConsolidacion)
    console.log(fechaEmision)
    if (isDateValid(fechaConsolidacion) && fechaConsolidacion >= fechaEmision) {
      return 0;
    }
  }

  const resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;
  return resultCantStock;
}
