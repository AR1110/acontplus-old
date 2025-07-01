import {ApiResponse} from "@core/models/api-response";
import {imgDefault} from "@core/utils/utils";

export class ListProductWithPricesUseCaseMapper {
  static toJson(params:any) {
    const searchBy: Record<string, string> = {
      description: "DESC",
      code: "COD",
      barcode: "BAR",
      auxCode: "AUX",
    }
    const stockFilters: Record<string, number> = {
      'with-stock': 1,
      'without-stock': 2,
    }

    return JSON.stringify({
      tipo: 3,
      bySearch : params.q,
      pageIndex : params.page,
      pageSize : params.pageSize,
      byColumn : searchBy[params.searchBy] || null,
      byStock: stockFilters[params.stockFilter] || null,
    });
  }

  static fromJson(response:ApiResponse){
    let data = [] as any[];
    if(response.code==="1"){
      console.log('init')
      const {products=[]}= JSON.parse(response.payload as string);
      console.log(products);
      data = products.map((item:any, index: number)=>{
        const prices = JSON.parse(item.tarifa)||[];
        return {
          index: index+1,
          id: item.idArticulo,
          code: item.codigo,
         // description: item.descripcion,
          name: item.descripcion,
          barcode: item.codigoBarra,
          "precioCosto": 31,
          "estado": true,
          stock: item.stock,
          "observaciones": "",
          subcategory: item.subFamilia,
          prices: prices.map((item:any, index:number)=>{
            return {
              id: index,
              label: item.tarifa,
              value: item.precioConIva,
              currency: 'USD',
              // validFrom: new Date('2024-11-24'),
              // validTo: new Date('2024-11-30'),
              isDefault: item.predeterminado,
              includesTax: true,
              isActive: true

            }
          }),
          "unit": item.medida,
          "modelo": null,
          "brand": item.marca,
          "modelo1": "Ninguno",
          "tipoIva": "15%",
          taxName: item.tipoIva,
          "tipoArticulo": "Simple",
          "style": "badge badge-danger",
          "precioSinSubsidio": 0,
          stockMinimo: item.stockMinimo,
          totalRecords: item.totalRecords,
          imageUrl: item.s3ObjectUrl || imgDefault()
        }
      })
    }
    console.log(response);
    const totalRecords = data.length>0?data[0].totalRecords:0;
    return {
      data,
      totalRecords
    }
  }
}
