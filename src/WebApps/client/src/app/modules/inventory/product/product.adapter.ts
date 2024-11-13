import { ProductSearch } from "../models/product.model";


export class ProductAdapter {

  searchFrom(products: unknown): Array<ProductSearch> {
    if (Array.isArray(products)) {
      let results = products.map((product, index) => {
        let tarifas = JSON.parse(product.priceSale);
        let resultsTarifasMapped = tarifas.map((tarifa: any) => {
          return {
            tarifa: tarifa.tarifa,
            precioVenta: tarifa.precioVenta,
            precio: tarifa.precio
          }
        })
        let obj = {
          position: index +1,
          idArticulo: product.idArticulo,
          codigo: product.codigo,
          descripcion: product.descripcion,
          iva: product.iva,
          stock: product.stock,
          subFamilia: product.subFamilia,
          marca: product.marca,
          medida: product.medida,
          fraccionado: product.fraccionado,
          style: product.style,
          tarifas: resultsTarifasMapped,
          warehouses: JSON.parse(product.warehouses),
          precioSinSubsidio: product.precioSinSubsidio,
          s3ObjectUrl: product.s3ObjectUrl,
          s3ObjectKey: product.s3ObjectKey,
          totalRecords: product.totalRecords
        }
        return obj;
      })

      return results;
    }
    return [];
  }



}
