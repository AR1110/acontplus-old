
import {ApiResponse} from "@core/models/api-response";
import {ProductDataEntity, ProductDataPvpEntity, ProductParamsSaveEntity} from "@inventory/product/infrastructure/product/product.entity";
import {getValidId, isValidField} from "@core/utils/utils";
import {formatDateToString} from "@core/utils/date.util";


export class ProductSaveMapper {
  static  toJson(obj: any): ProductParamsSaveEntity  {
    const {data, dataUbicacion, dataPvp} = obj;
    let lote;
    let fechaCreacion;
      let fechaCaducidadLote;
      let fechaCaducidad;
    if(data.datosLote){
      lote = data.lote;
      fechaCreacion = formatDateToString(data.fechaCreacion)
      fechaCaducidadLote = formatDateToString(data.fechaCaducidadLote);
    }

    if(data.caducidad){
      fechaCaducidad = formatDateToString(data.fechaCaducidad)
    }
    const jsonArticulo: ProductDataEntity = {
      idSubFamilia: data.idSubFamilia,
      idMarca: getValidId (data.idMarca) as number,
      idModelo: getValidId(data.idModelo) as number,
      idTipoIce: getValidId(data.idTipoIce) as number,
      idTipoArticulo: data.idTipoArticulo,
      idTipoIva: data.idTipoIva,
      idMedida: data.idMedida,
      precioCosto: data.precioCosto,
      precioSinSubsidio: data.precioSinSubsidio,
      codigo: data.codigo,
      codigoAuxiliar: data.codigoAuxiliar,
      valorIce: data.valorIce,
      descripcion: data.descripcion,
      llevaInventario: data.llevaInventario,
      datosAdicionales: data.datosAdicionales,
      productoFraccionable: data.productoFraccionable,
      datosLote: data.datosLote,
      lote,
      fechaCreacion,
      fechaCaducidadLote,
      stockMinimo: data.stockMinimo,
      stockMaximo: data.stockMaximo,
      observaciones: isValidField(data.observaciones),
      caducidad: data.caducidad,
      fechaCaducidad,
      codigoBarra: isValidField(data.codigoBarra),
      idEtiqueta: getValidId(data.idEtiqueta) as any,
      cantMinimaVentaPorMayor: isValidField(data.cantMinimaVentaPorMayor),
    }


    const jsonPvp: ProductDataPvpEntity = dataPvp.map((item:any, index: number)=>{

      let result: ProductDataPvpEntity = {
        index: index + 1,
        idArticuloPvP: item.idArticuloPvP,
        idTarifa: item.idTarifa,
        porcentajeUtilidad: item.porcentajeUtilidad,
        precioConIva: item.precioConIva,
        precioPredeterminado: item.precioPredeterminado,
        precioVenta: item.precioVenta

      }

      return result

    })


    return {
      idBodega: dataUbicacion.idBodega,
      ubicacion: isValidField(data.ubicacion),
      jsonArticulo: JSON.stringify(jsonArticulo),
      jsonPvp: JSON.stringify(jsonPvp),
    }

  }

  static fromJson(response:ApiResponse){

    const data = JSON.parse(response.payload as string);
    let resultResponse = new ApiResponse()

    resultResponse.code=response.code;
    resultResponse.message=response.message;
    resultResponse.payload =data[0];
    return resultResponse;


  }

}
