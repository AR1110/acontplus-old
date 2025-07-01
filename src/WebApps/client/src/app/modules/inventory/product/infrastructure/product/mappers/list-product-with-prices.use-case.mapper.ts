import {ApiResponse} from "@core/models/api-response";
import {imgDefault} from "@core/utils/utils";

export class ListProductWithPricesUseCaseMapper {
  static toJson(params:any) {
    return JSON.stringify({
      tipo: 3,
      ...params
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
          id: item.idArticulo,
          code: item.codigo,
          "description": item.descripcion,
          "barcode": item.codigoBarra,
          "precioCosto": 31,
          "estado": true,
          "stock": 0,
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
              includesTax: true,
              isActive: true

            }
          }),
          "unit": item.medida,
          "modelo": null,
          "brand": item.marca,
          "modelo1": "Ninguno",
          "tipoIva": "15%",
          "tipoArticulo": "Simple",
          "style": "badge badge-danger",
          "precioSinSubsidio": 0,
          "stockMinimo": 0,
          "totalRecords": item.totalRecords,
          "s3ObjectKey": null,
          "s3ObjectUrl": null,
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
