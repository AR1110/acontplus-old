import { imgDefault } from "@core/utils/utils";
import { ApiResponse } from "@core/models/api-response";

export class ProductSearchMapper {
  static toJson(obj: any): any {
    return JSON.stringify({
      pageIndex: obj.page || obj.pageIndex || 1,
      pageSize: obj.per_page || obj.pageSize || 15,
      search: obj.textSearch || obj.q || obj.search, // 'busqueda' → 'search'
      busqueda: obj.textSearch || obj.q || obj.search, // 'busqueda' → 'search'
    });
  }

  static fromJson(response: ApiResponse) {
    const result = {
      items: [],
      total: 0,
    };

    const products = response.payload ? JSON.parse(response.payload as string): []

    result.items = products.map((product:any, index:number) => {
      const prices = JSON.parse(product.priceSale); // 'tarifas' → 'prices'
      const mappedPrices = prices.map((price: any) => {
        return {
          id: price.idTarifa,       // 'idTarifa' → 'id'
          name: price.tarifa,       // 'tarifa' → 'name'
          salePrice: price.precioVenta, // 'precioVenta' → 'salePrice'
          price: price.precioVenta, // 'precioVenta' → 'salePrice'
        };
      });

      return {
        index: index + 1,
        id: product.idArticulo,         // 'idArticulo' → 'id'
        code: product.codigo,           // 'codigo' → 'code'
        description: product.descripcion, // 'descripcion' → 'description'
        vat: product.iva,               // 'iva' → 'vat'
        stock: product.stock,
        subFamily: product.subFamilia,  // 'subFamilia' → 'subFamily'
        brand: product.marca,           // 'marca' → 'brand'
        measure: product.medida,        // 'medida' → 'measure'
        fractional: product.fraccionado, // 'fraccionado' → 'fractional'
        style: product.style,
        prices: mappedPrices,           // 'tarifas' → 'prices'
        warehouses: JSON.parse(product.warehouses),
        priceWithoutSubsidy: product.precioSinSubsidio, // 'precioSinSubsidio' → 'priceWithoutSubsidy'
        imageUrl: product.s3ObjectUrl || imgDefault(),
      };
    });

    result.total = products.length > 0 ? products[0].totalRecords : 0;
    return result;
  }
}
