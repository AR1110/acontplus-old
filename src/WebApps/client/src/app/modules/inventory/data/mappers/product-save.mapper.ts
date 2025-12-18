import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField } from '@core/utils/utils';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ProductSaveMapper {
  static toJson(obj: any): any {
    const { data, dataUbicacion, dataPvp } = obj;
    let lote;
    let fechaCreacion;
    let fechaCaducidadLote;
    let fechaCaducidad;
    if (data.datosLote) {
      lote = data.lote;
      fechaCreacion = formatDateToString(data.fechaCreacion);
      fechaCaducidadLote = formatDateToString(data.fechaCaducidadLote);
    }

    if (data.caducidad) {
      fechaCaducidad = formatDateToString(data.fechaCaducidad);
    }
    const jsonArticulo = {
      idSubFamilia: data.idSubFamilia,
      idMarca: getValidId(data.idMarca)!,
      idModelo: getValidId(data.idModelo)!,
      idTipoIce: getValidId(data.idTipoIce)!,
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
    };

    const jsonPvp = dataPvp.map((item: any, index: number) => {
      return {
        index: index + 1,
        idArticuloPvP: item.idArticuloPvP,
        idTarifa: item.idTarifa,
        porcentajeUtilidad: item.porcentajeUtilidad,
        precioConIva: item.precioConIva,
        precioPredeterminado: item.precioPredeterminado,
        precioVenta: item.precioVenta,
      };
    });

    return {
      idBodega: dataUbicacion.idBodega,
      ubicacion: isValidField(data.ubicacion),
      jsonArticulo: JSON.stringify(jsonArticulo),
      jsonPvp: JSON.stringify(jsonPvp),
    };
  }

  static fromJson(response: ApiResponseLegacy) {
    const data = JSON.parse(response.payload as string);
    const resultResponse = new ApiResponseLegacy();

    resultResponse.code = response.code;
    resultResponse.message = response.message;
    resultResponse.payload = data[0];
    return resultResponse;
  }
}
