import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  GetProductEstabStockResult,
  GetProductPurchaseResult,
  ProductGetIdResult,
  ProductSale,
} from '@inventory/data/models/product.entity';
import { MedidaProducto } from '@inventory/data/models/measure.model';
import { ProductMeasure } from '@inventory/data/models/product-measure';
import { mergeMeasureUtil, mergeProductMeasures } from '@inventory/utils/merge-measure.util';
import { imgDefault } from '@core/utils/utils';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { groupSubCategoryUtil } from '@inventory/utils/group-sub-category.util';
import { formatDate } from '@core/utils/date.util';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';

export class GetProductEstabsStockMapper {
  static toJson(id: number) {
    return JSON.stringify({ idArticulo: id, tipo: 10 });
  }

  static fromJson(response: ApiResponseLegacy): GetProductEstabStockResult {
    const result = {
      establishments: [] as any[],
    };
    if (response.code === '1') {
      const { establishments } = JSON.parse(response.payload as string);
      console.log(establishments);
      result.establishments = establishments.map((item: any, index: number) => {
        const warehouses = JSON.parse(item.warehouses);
        console.log(warehouses);
        return {
          index,
          nameEstab: item.branchOffice,
          warehouses: warehouses.map((item: any) => {
            return {
              nameWarehouse: item.bodega,
              stock: item.stock,
              ubication: item.ubicacion,
            };
          }),
        };
      });
    }

    return result;
  }
}

export class GetProductForSaleMapper {
  static toJson(obj: { id?: number; search?: string }) {
    return JSON.stringify({
      idArticulo: obj.id || undefined,
      bySearch: obj.search || undefined,
      tipo: 6,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    const results = {
      product: {} as ProductSale,
      medidas: [] as MedidaProducto[],
      consolidacionesFecha: [] as any[],
      additionalInfo: [] as any[],
      inventoryAdjustments: [] as any[],

      measures: [] as ProductMeasure[],
      taxRates: [] as any[],
    };

    if (response.code === '1') {
      const {
        product,
        fractionedMeasures,
        measures,
        inventoryAdjustment = [],
        additionalInfo = [],
        taxes = [],
      } = JSON.parse(response.payload as string);

      const productTemp = product[0];
      results.product = {
        ...productTemp,

        //nombres estandarizados
        code: productTemp.codigoArticulo,
        description: productTemp.descripcion,
        taxCode: productTemp.codigoPorcentaje,
      };

      results.medidas = mergeMeasureUtil(measures, fractionedMeasures);

      results.measures = mergeProductMeasures(measures, fractionedMeasures);

      const consolidacionesFecha = inventoryAdjustment.map((data: any) => ({
        ...data,
        fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion),
      }));

      results.consolidacionesFecha = consolidacionesFecha; // eliminar una vez migrado todo

      results.inventoryAdjustments = consolidacionesFecha;

      results.additionalInfo = additionalInfo.map((item: any) => ({
        productId: item.idArticulo,
        tagId: item.idEtiqueta,
        additionalInfoId: item.idInfoAdicional,
        additionalJson: item.jsonAdicional ? JSON.parse(item.jsonAdicional) : null,
        uniqueId: item.uniqueId,
        status: item.estado,
      }));

      results.taxRates = taxes.map((item: any) => ({
        id: item.idTarifaImpuesto,
        code: item.codigoPorcentaje,
        name: item.descripcion,
      }));
    }
    console.log(results);

    return results;
  }
}

export class GetProductPurchaseMapper {
  static toJson(id: number) {
    return JSON.stringify({ idArticulo: id, tipo: 9 });
  }

  static fromJson(response: ApiResponseLegacy): GetProductPurchaseResult {
    const result = new GetProductPurchaseResult();
    const { product, measures, fractionedMeasures, tags } = JSON.parse(response.payload as string);
    const data = product[0];
    const articulo = {
      id: data.idArticulo,
      vatTypeId: data.idTipoIva,
      auxiliaryCode: data.codigoAuxiliar,
      description: data.descripcion,
      code: data.codigoArticulo,
      stock: data.stock,
      minWholesaleQty: data.cantMinimaVentaPorMayor,
      iceValue: data.valorIce,
      hasInventory: data.llevaInventario,
      hasAdditionalData: data.datosAdicionales,
      isFractionable: data.productoFraccionable,
      costPrice: data.precioCosto,
      priceWithoutSubsidy: data.precioSinSubsidio,
      vatTypeName: data.nombreTipoIva,
      rate: data.tarifa,
      percentageCode: data.codigoPorcentaje,
    };

    const medidas = mergeMeasureUtil(measures, fractionedMeasures);

    const etiquetasMapper = tags.map((item: any) => ({
      idEtiqueta: item.idEtiqueta,
      descripcion: item.descripcion,
      etiquetas: item.etiquetas.split(';'),
    }));

    result.data = articulo;
    result.measures = medidas;
    result.tags = etiquetasMapper;

    return result;
  }
}

export class ListProductWithPricesMapper {
  static toJson(params: any) {
    const searchBy: Record<string, string> = {
      description: 'DESC',
      code: 'COD',
      barcode: 'BAR',
      auxCode: 'AUX',
    };
    const stockFilters: Record<string, number> = {
      'with-stock': 1,
      'without-stock': 2,
    };

    return JSON.stringify({
      tipo: 3,
      bySearch: params.q,
      pageIndex: params.page,
      pageSize: params.pageSize,
      byColumn: searchBy[params.searchBy] || null,
      byStock: stockFilters[params.stockFilter] || null,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    let data = [] as any[];
    if (response.code === '1') {
      console.log('init');
      const { products = [] } = JSON.parse(response.payload as string);
      console.log(products);
      data = products.map((item: any, index: number) => {
        const prices = JSON.parse(item.tarifa) || [];
        return {
          index: index + 1,
          id: item.idArticulo,
          code: item.codigo,
          // description: item.descripcion,
          name: item.descripcion,
          barcode: item.codigoBarra,
          precioCosto: 31,
          estado: true,
          stock: item.stock,
          observaciones: '',
          subcategory: item.subFamilia,
          prices: prices.map((item: any, index: number) => {
            return {
              id: index,
              label: item.tarifa,
              value: item.precioConIva,
              currency: 'USD',
              // validFrom: new Date('2024-11-24'),
              // validTo: new Date('2024-11-30'),
              isDefault: item.predeterminado,
              includesTax: true,
              isActive: true,
            };
          }),
          unit: item.medida,
          modelo: null,
          brand: item.marca,
          modelo1: 'Ninguno',
          tipoIva: '15%',
          taxName: item.tipoIva,
          tipoArticulo: 'Simple',
          style: 'badge badge-danger',
          precioSinSubsidio: 0,
          stockMinimo: item.stockMinimo,
          totalRecords: item.totalRecords,
          imageUrl: item.s3ObjectUrl || imgDefault(),
        };
      });
    }
    console.log(response);
    const totalRecords = data.length > 0 ? data[0].totalRecords : 0;
    return {
      data,
      totalRecords,
    };
  }
}

export class ProductDataFormMapper {
  static fromJson(response: ApiResponseLegacy) {
    const {
      brands,
      categories,
      decimal,
      fees,
      ice,
      measures,
      models,
      productTypes,
      subcategories,
      tags,
      taxes,
      warehouses,
    } = JSON.parse(response.payload as string);
    const estabs = groupEstabUtil({
      bodegas: warehouses,
      isGroupBodega: true,
    });

    return {
      categorias: categories,
      decimal: decimal[0],
      estabs,

      etiquetas: tags,
      marcas: brands,
      medidas: measures,
      modelos: models,
      subCategorias: subcategories,

      subCategoriasGroup: groupSubCategoryUtil(subcategories),

      tarifas: fees,
      tiposArticulo: productTypes,
      tiposIce: ice,
      tiposIva: taxes,
    };
  }
}

export class ProductGetIdMapper {
  static fromJson(responseApi: ApiResponseLegacy) {
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

export class ProductSearchMapper {
  static toJson(obj: any): any {
    return JSON.stringify({
      pageIndex: obj.page || obj.pageIndex || 1,
      pageSize: obj.per_page || obj.pageSize || 15,
      search: obj.textSearch || obj.q || obj.search, // 'busqueda' → 'search'
      busqueda: obj.textSearch || obj.q || obj.search, // 'busqueda' → 'search'
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    const result = {
      items: [],
      total: 0,
    };

    const products = response.payload ? JSON.parse(response.payload as string) : [];

    result.items = products.map((product: any, index: number) => {
      const prices = JSON.parse(product.priceSale); // 'tarifas' → 'prices'
      const mappedPrices = prices.map((price: any) => {
        return {
          id: price.idTarifa, // 'idTarifa' → 'id'
          name: price.tarifa, // 'tarifa' → 'name'
          salePrice: price.precioVenta, // 'precioVenta' → 'salePrice'
          price: price.precioVenta, // 'precioVenta' → 'salePrice'
        };
      });

      return {
        index: index + 1,
        id: product.idArticulo, // 'idArticulo' → 'id'
        code: product.codigo, // 'codigo' → 'code'
        description: product.descripcion, // 'descripcion' → 'description'
        vat: product.iva, // 'iva' → 'vat'
        stock: product.stock,
        subFamily: product.subFamilia, // 'subFamilia' → 'subFamily'
        brand: product.marca, // 'marca' → 'brand'
        measure: product.medida, // 'medida' → 'measure'
        fractional: product.fraccionado, // 'fraccionado' → 'fractional'
        style: product.style,
        prices: mappedPrices, // 'tarifas' → 'prices'
        warehouses: JSON.parse(product.warehouses),
        priceWithoutSubsidy: product.precioSinSubsidio, // 'precioSinSubsidio' → 'priceWithoutSubsidy'
        imageUrl: product.s3ObjectUrl || imgDefault(),
      };
    });

    result.total = products.length > 0 ? products[0].totalRecords : 0;
    return result;
  }
}

export class ProductMapper {
  static fromApiDataFilter(response: ApiResponseLegacy) {
    const { brands, measures, models, subcategories, taxes } = JSON.parse(
      response.payload as string,
    );
    const subCategorias = groupSubCategoryUtil(subcategories);

    return {
      subCategorias,
      medidas: measures,
      marcas: brands,
      modelos: models,
      tiposIva: taxes,
    };
  }

  static fromApiGetAll(response: ApiResponseLegacy) {
    const { products } = JSON.parse(response.payload as string);

    const data = products || [];

    return data.map((item: any, index: number) => {
      return {
        index: index + 1,
        id: item.idArticulo,
        idArticulo: item.idArticulo,
        idMedida: item.idMedida,
        code_unique: item.code_unique,
        codigo: item.codigo,
        descripcion: item.descripcion,
        precioCosto: item.precioCosto,
        estado: item.estado,
        stock: item.stock,
        observaciones: item.observaciones,
        imagen: item.imagen,
        subFamilia: item.subFamilia,
        medida: item.medida,
        tipoIva: item.tipoIva,
        tipoArticulo: item.tipoArticulo,
        totalRecords: item.totalRecords,
        style: item.style,
        s3ObjectKey: item.s3ObjectKey,
        s3ObjectUrl: item.s3ObjectUrl,
      };
    });
  }

  static fromApiDataReport(response: ApiResponseLegacy) {
    const {
      brands,
      documentTypes,
      fees,
      subcategories,
      warehouses,
      taxes = [],
    } = JSON.parse(response.payload as string);

    const estabs = groupEstabUtil({
      bodegas: warehouses,
      isGroupBodega: true,
    });
    const subCategorias = groupSubCategoryUtil(subcategories);

    return {
      estabs: estabs,
      subCategorias: subCategorias,
      marcas: brands,
      tarifas: fees,
      tiposDoc: documentTypes,
      taxes,
    };
  }

  static fromApiCheckStockNotificacion(responseApi: ApiResponseLegacy) {
    const { stockCheckResponse } = JSON.parse(responseApi.payload as string);
    return stockCheckResponse[0];
  }
}
