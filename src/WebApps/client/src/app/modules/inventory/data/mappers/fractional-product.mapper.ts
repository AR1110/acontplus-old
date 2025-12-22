import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import {
  FractionalProductDataGetId,
  FractionalProductDataSave,
} from '@inventory/data/models/fractional-product.model';

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

//get id

export class FractionalProductGetIdMapper {
  static fromJson(responseApi: any) {
    const resultResponse = new ApiResponseLegacy<FractionalProductDataGetId>();

    const dataApi = responseApi.data[0];
    const data = {
      idArticuloFraccionado: dataApi.idArticuloFraccionado,
      idArticulo: dataApi.idArticulo,
      idMedida: dataApi.idMedida,
      conversion: dataApi.conversion,
      gestionVenta: dataApi.gestionVenta,
      precioCostoFraccionado: dataApi.precioCostoFraccionado,
      descripcion: dataApi.descripcion,
      precioCosto: dataApi.precioCosto,
      codigo: dataApi.codigo,
      nombreMedida: dataApi.nombreMedida,
    };

    const productPvps = responseApi.pvps.map((item: any, index: number) => {
      const utilidad = pricingCalculateUtil.getValueUtility(item.precioVenta, data.precioCosto);
      return {
        idArticuloFraccionadoPvP: item.idArticuloFraccionadoPvP,
        idTarifa: item.idTarifa,
        precioVenta: item.precioVenta,
        precioConIva: item.precioConIva,
        porcentajeUtilidad: item.porcentajeUtilidad,
        precioPredeterminado: item.precioPredeterminado,
        nomTarifa: item.tarifa,
        porcentajeIva: item.porcentajeIva,
        utilidad,
        nomEstado: item.precioPredeterminado ? 'Predeterminado' : '',
      };
    });

    resultResponse.payload = {
      data,
      productPvps,
    };

    return resultResponse;
  }
}

// mapper post

export class FractionalProductPostMapper {
  static toJson(obj: FractionalProductDataSave) {
    const { data } = obj;

    const pvps = obj.pvps.map((item: any, index: number) => {
      return {
        idTarifa: item.idTarifa,
        precioVenta: item.precioVenta,
        precioConIva: item.precioConIva,
        porcentajeUtilidad: item.porcentajeUtilidad,
      };
    });
    return {
      idArticulo: data.idArticulo,
      idMedida: data.idMedida,
      conversion: data.conversion,
      gestionVenta: data.gestionVenta,
      precioCostoFraccionado: data.precioCostoFraccionado,
      pvps,
    };
  }
}
