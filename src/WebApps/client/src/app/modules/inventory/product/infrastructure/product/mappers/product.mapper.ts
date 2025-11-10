import { groupSubCategoryUtil } from '@inventory/domain/utils/group-sub-category.util';
import { ProductSearch } from '@inventory/product/domain/entities/product.entity';
import { mergeMeasureUtil } from '@inventory/domain/utils/merge-measure.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { imgDefault } from '@core/utils/utils';

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

  static searchFrom(products: unknown): ProductSearch[] {
    if (Array.isArray(products)) {
      const results = products.map((product, index) => {
        const tarifas = JSON.parse(product.priceSale);
        const resultsTarifasMapped = tarifas.map((tarifa: any) => {
          return {
            tarifa: tarifa.tarifa,
            precioVenta: tarifa.precioVenta,
            precio: tarifa.precio,
          };
        });
        const obj = {
          position: index + 1,
          idArticulo: product.idArticulo,
          codigo: product.codigo,
          descripcion: product.descripcion,
          iva: product.iva,
          stock: product.stock,
          subFamilia: product.subFamilia,
          marca: product.marca,
          medida: product.medida,
          fraccionado: product.fraccionado,
          style: product.style,
          tarifas: resultsTarifasMapped,
          warehouses: JSON.parse(product.warehouses),
          precioSinSubsidio: product.precioSinSubsidio,
          imagen: product.s3ObjectUrl || imgDefault(),
          s3ObjectUrl: product.s3ObjectUrl,
          s3ObjectKey: product.s3ObjectKey,
          totalRecords: product.totalRecords,
        };
        return obj;
      });

      return results;
    }
    return [];
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

  static fromApiSale(response: ApiResponseLegacy) {
    let { product, fractionedMeasures, measures, inventoryAdjustment, additionalInfo } = JSON.parse(
      response.payload as string,
    );

    const medidas = mergeMeasureUtil(measures, fractionedMeasures);

    inventoryAdjustment = inventoryAdjustment || [];
    const consolidacionesFecha = inventoryAdjustment.map((data: any) => ({
      ...data,
      fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion),
    }));

    return {
      product: product[0],
      medidas,
      consolidacionesFecha,
    };
  }

  static fromApiCheckStockNotificacion(responseApi: ApiResponseLegacy) {
    const { stockCheckResponse } = JSON.parse(responseApi.payload as string);
    return stockCheckResponse[0];
  }
}
