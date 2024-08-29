import {Injectable} from '@angular/core';
import {ProductSale, ProductSearchApiDto, ProductSearchDto, ProductoConsolidacion} from '@/models/inventory/product.model';
import {Tarifa} from '@/models/inventory/tarifa.model';
import {mergeMeasureFromAdapter} from "@/adapters/medida.adapter";
import {MedidaProducto} from '@/models/inventory/medida.model';

type SaleFromProps = {
  product: ProductSale
  medidasPrincipal: unknown[]
  medidasFraccionado: unknown[]
  productoConsolidaciones: ProductoConsolidacion[]
}

@Injectable({
  providedIn: 'root'
})
export class ProductAdapter {


  searchFrom(products: Array<ProductSearchApiDto>): Array<ProductSearchDto> {
    const results = products.map(product => {
      const tempTarifas: Array<any> = JSON.parse(product.priceSale) || []
      const tarifas: Array<Tarifa> = tempTarifas.map(tarifa => ({
        idTarifa: tarifa.idTarifa,
        descripcion: tarifa.tarifa,
        precioVenta: tarifa.precioVenta,
        precioConIva: tarifa.precioConIva,
        default: tarifa.predeterminada
      }))
      return {
        idArticulo: product.idArticulo,
        codigo: product.codigo,
        descripcion: product.descripcion,
        iva: product.iva,
        tarifas: tarifas,
        s3ObjectUrl: product.s3ObjectUrl ?? 'product-default.png',
      }
    })
    return results;
  }


  saleFrom(data: SaleFromProps) {
    let {
      product,
      medidasPrincipal,
      medidasFraccionado,
      productoConsolidaciones
    } = data;

    const resultMedidas: Array<MedidaProducto> = mergeMeasureFromAdapter(
      medidasPrincipal,
      medidasFraccionado
    )

    productoConsolidaciones = productoConsolidaciones.map(data => {
      return {
        ...data,
        fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
      }
    })

    return {
      product,
      medidas: resultMedidas,
      productoConsolidaciones
    }
  }


}
