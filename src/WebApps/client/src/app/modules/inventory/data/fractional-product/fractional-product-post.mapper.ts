import {FractionalProductDataSave} from "@inventory/domain/models/fractional-product.model";

export class FractionalProductPostMapper {

  static toJson(obj:FractionalProductDataSave){
    const {data} = obj;

    const pvps = obj.pvps.map((item:any, index:number)=>{

      return {
        idTarifa: item.idTarifa,
        precioVenta: item.precioVenta,
        precioConIva: item.precioConIva,
        porcentajeUtilidad : item.porcentajeUtilidad,
      }
    })
    return {
      idArticulo: data.idArticulo,
      idMedida: data.idMedida,
      conversion: data.conversion,
      gestionVenta: data.gestionVenta,
      precioCostoFraccionado: data.precioCostoFraccionado,
      pvps
    };


  }

}
