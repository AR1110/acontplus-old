import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FractionalProductDataGetId } from '@inventory/product/domain/entities/fractional-product.model';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';

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
