import { ApiResponse } from '@core/models/api-response';
import { formatDate } from '@core/utils/date.util';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { ProductGetIdResult } from '@inventory/product/domain/entities/product.entity';

export class ProductGetIdMapper {
  static fromJson(responseApi: ApiResponse) {
    const resultResponse = new ProductGetIdResult();
    const {
      products,
      productPvps: productPvpsApi,
      productBarcodes: productBarcodesApi,
      productLocations: productLocationsApi = [],
      productMeasures,
    } = JSON.parse(responseApi.payload as string);

    console.log(responseApi);

    const mainDataProduct = products[0];
    let lote, fechaCreacion, fechaCaducidadLote, fechaCaducidad;
    if (mainDataProduct.caducidad) {
      fechaCaducidad = formatDate(mainDataProduct.fechaCaducidad);
    }
    if (mainDataProduct.datosLote) {
      lote = mainDataProduct.lote;
      fechaCreacion = formatDate(mainDataProduct.fechaCreacion);
      fechaCaducidadLote = formatDate(mainDataProduct.fechaCaducidadLote);
    }

    const data = {
      idArticulo: mainDataProduct.idArticulo,
      idSubFamilia: mainDataProduct.idSubFamilia,
      idTipoIce: mainDataProduct.idTipoIce,
      idTipoArticulo: mainDataProduct.idTipoArticulo,
      idModelo: mainDataProduct.idModelo,
      idMarca: mainDataProduct.idMarca,
      idTipoIva: mainDataProduct.idTipoIva,
      idMedida: mainDataProduct.idMedida,
      codigo: mainDataProduct.codigo,
      codigoBarra: mainDataProduct.codigoBarra,
      codigoAuxiliar: mainDataProduct.codigoAuxiliar,
      descripcion: mainDataProduct.descripcion,
      valorIce: mainDataProduct.valorIce,
      llevaInventario: mainDataProduct.llevaInventario,
      datosAdicionales: mainDataProduct.datosAdicionales,
      datosLote: mainDataProduct.datosLote,
      lote,
      fechaCreacion,
      fechaCaducidadLote,
      productoFraccionable: mainDataProduct.productoFraccionable,
      stockMinimo: mainDataProduct.stockMinimo,
      stockMaximo: mainDataProduct.stockMaximo,
      observaciones: mainDataProduct.observaciones,
      caducidad: mainDataProduct.caducidad,
      fechaCaducidad,
      estado: mainDataProduct.estado,
      precioCosto: mainDataProduct.precioCosto,
      precioSinSubsidio: mainDataProduct.precioSinSubsidio,
      idEtiqueta: mainDataProduct.idEtiqueta,
      nombreTipoIva: mainDataProduct.nombreTipoIva,
      porcentajeTipoIva: mainDataProduct.porcentajeTipoIva,
      codigoTipoIva: mainDataProduct.codigoTipoIva,
      nombreMedida: mainDataProduct.nombreMedida,
      codigoArticulo: mainDataProduct.codigoArticulo,
      cantMinimaVentaPorMayor: mainDataProduct.cantMinimaVentaPorMayor,
      imgUrl: mainDataProduct.s3ObjectUrl,
      productPhotoId: mainDataProduct.productPhotoId,
    };

    const productPvps = productPvpsApi.map((item: any, index: number) => {
      const utilidad = pricingCalculateUtil.getValueUtility(item.precioVenta, data.precioCosto);
      return {
        idArticuloPvP: item.idArticuloPvP,
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

    const productLocations = productLocationsApi.map((item: any, index: number) => {
      return {
        index: index + 1,
        idArticuloUbicacion: item.idArticuloUbicacion,
        idBodega: item.idBodega,
        ubicacion: item.ubicacion,
        estado: item.estado,
        nomBodega: item.descripcion,
      };
    });

    const productBarcodes = productBarcodesApi.map((item: any, index: number) => {
      return {
        index: index + 1,
        idArticuloCodigoBarra: item.idArticuloCodigoBarra,
        idMedida: item.idMedida,
        codigoBarra: item.codigoBarra,
        descripcion: item.descripcion,
        color: item.color,
        estado: item.estado,
        nomMedida: item.medida,
      };
    });

    resultResponse.data = data;
    resultResponse.productPvps = productPvps;
    resultResponse.productBarcodes = productBarcodes;
    resultResponse.productLocations = productLocations;
    resultResponse.productMeasures = productMeasures;

    return resultResponse;
  }
}
