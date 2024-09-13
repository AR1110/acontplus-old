import {OrderItem} from "@/models/order.model";
import {ConsolidacionFecha} from "@/models/inventory/medida.model";
import {isValidDate} from "rxjs/internal/util/isDate";

export const mergeStockQty = function <T extends {
  idArticulo: number,
  idBodega: number
}>(items: OrderItem[], dataItem: T) {
  // Filtra los elementos que tienen las mismas propiedades idArticulo e idBodega que rowEntity.
  let foundItemByArticuloAndBodega = items.filter(item => (
    item.productId === dataItem.idArticulo &&
    item.bodegaId === dataItem.idBodega
  ))

  let {totalCantidadFraccionada, totalCantidadPrincipal} = foundItemByArticuloAndBodega.reduce((total, item) => {
    let medidaFraccionado = item.medidas.find(medida => medida.idMedida === item.medidaId && medida.tipo === 'FRACCIONADO')
    let medidaPrincipal = item.medidas.find(medida => medida.idMedida === item.medidaId && medida.tipo === 'PRINCIPAL')
    if (medidaFraccionado) {
      total.totalCantidadFraccionada += item.quantity * medidaFraccionado.conversion;
    }
    if (medidaPrincipal) {
      total.totalCantidadPrincipal += item.quantity * medidaPrincipal.conversion;
    }
    return total;
  }, {
    totalCantidadFraccionada: 0,
    totalCantidadPrincipal: 0
  });

//  let dataItemMerge = foundItemByArticuloAndBodega.reduce((itemPrevious, itemCurrent) => {
//    itemPrevious.cantidad += itemCurrent.cantidad;
//    return itemPrevious;
//  }, { 
//    cantidad: 0,
//  });

  // Devuelve el objeto resultante de la fusión. 
  return {
    cantidadStock: totalCantidadPrincipal + totalCantidadFraccionada
  };
}


export const calculateCantidadStock = function <T extends {
  cantidadStock: number,
  idBodega: number,
  fechaEmision: Date,
  productoConsolidaciones: ConsolidacionFecha[]
}>(data: T) {
  let fechaEmisionValidate = data.fechaEmision;
  let cantidadStock = data.cantidadStock;

  let dataConsolidacionFecha = data.productoConsolidaciones.find(
    cdataFecha => cdataFecha.idBodega === data.idBodega
  )

  if (dataConsolidacionFecha && isValidDate(dataConsolidacionFecha.fechaConsolidacion)) {
    if (dataConsolidacionFecha.fechaConsolidacion >= fechaEmisionValidate) {
      return 0;
    }
  }

  return cantidadStock < 0 ? cantidadStock : -cantidadStock;

}
