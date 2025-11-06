import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class FractionalProductGetAllMapper {
  static fromJson(responseApi: any) {
    const resultResponse = new ApiResponseLegacy();

    let articulosFraccionado = [];

    if (responseApi?.articulosFraccionados) {
      articulosFraccionado = responseApi.articulosFraccionados || [];
    }

    console.log(responseApi);

    const data = articulosFraccionado.map((item: any, index: number) => {
      return {
        idArticuloFraccionado: item.idArticuloFraccionado,
        conversion: item.conversion,
        precioCostoFraccionado: item.precioCostoFraccionado,
        gestionVenta: item.gestionVenta,
        estado: item.estado,
        nomProducto: item.articulo,
        nomMedida: item.medida,
        codigo: item.codigo,
        totalRecords: item.totalRecords,
        nomEstado: item.estado ? 'Activo' : 'Inactivo',
      };
    });

    const totalRecords = data.length > 0 ? data[0].totalRecords : 0;
    resultResponse.payload = {
      data,
      totalRecords,
    };

    return resultResponse;
  }
}
