import { ProductSearch } from "./product.model";
import {groupSubCategoryUtil} from "@inventory/utils/group-sub-category.util";
import {ApiResponse} from "@core/models/api-response";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {mergeMeasureUtil} from "@inventory/utils/merge-measure.util";


export class ProductAdapter {

  static fromApiDataFilter(response:ApiResponse){

    let { brands, measures,models, subcategories , taxes } = JSON.parse(response.payload as string);
      const subCategorias = groupSubCategoryUtil(subcategories)

    return {
      subCategorias,
      medidas: measures,
      marcas: brands,
      modelos: models,
      tiposIva: taxes
    }
  }

  static fromApiDataForm(response:ApiResponse){

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
      warehouses

    } = JSON.parse(response.payload as string);
    const estabs = groupEstabUtil({
      bodegas: warehouses,
      isGroupBodega: true
    })

    return {
    categorias : categories,
    decimal : decimal[0],
    estabs   ,

    etiquetas : tags,
    marcas : brands,
    medidas : measures,
    modelos : models,
    subCategorias : subcategories,

    subCategoriasGroup : groupSubCategoryUtil(subcategories),

    tarifas: fees,
    tiposArticulo: productTypes ,
    tiposIce : ice,
    tiposIva: taxes ,
    }
  }

  static searchFrom(products: unknown): Array<ProductSearch> {
    if (Array.isArray(products)) {
      let results = products.map((product, index) => {
        let tarifas = JSON.parse(product.priceSale);
        let resultsTarifasMapped = tarifas.map((tarifa: any) => {
          return {
            tarifa: tarifa.tarifa,
            precioVenta: tarifa.precioVenta,
            precio: tarifa.precio
          }
        })
        let obj = {
          position: index +1,
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
          s3ObjectUrl: product.s3ObjectUrl,
          s3ObjectKey: product.s3ObjectKey,
          totalRecords: product.totalRecords
        }
        return obj;
      })

      return results;
    }
    return [];
  }


  static fromApiGetAll(response:ApiResponse){

    //let { products } = JSON.parse(response.payload as string);
    let [products]  = JSON.parse(response.payload as string);

    let data = products || [];

    return data.map((item: any) => {
      return {
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
        s3ObjectUrl: item.s3ObjectUrl
      }
    })
  }


  static fromApiDataReport(response:ApiResponse){

    // const {brands, documentTypes,fees,subcategories,warehouses} = JSON.parse(response.payload as string);
    const [warehouses, subcategories, brands, documentTypes, fees, ] = JSON.parse(response.payload as string)

    let estabs = groupEstabUtil({
      bodegas: warehouses,
      isGroupBodega: true
    })
    let subCategorias = groupSubCategoryUtil(subcategories);

    return {
    estabs : estabs,
    subCategorias : subCategorias,
    marcas : brands,
    tarifas : fees,
    tiposDoc : documentTypes,

    }
  }


  static fromApiSale(response:ApiResponse){
    let   {
      product, fractionedMeasures, measures, inventoryAdjustment, additionalInfo
    } = JSON.parse(response.payload as string);


    const medidas = mergeMeasureUtil(measures, fractionedMeasures);

    inventoryAdjustment = inventoryAdjustment || []
    const consolidacionesFecha = inventoryAdjustment.map((data: any) => ({
      ...data,
      fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
    }))

    return {
      product : product[0],
      medidas,
      consolidacionesFecha
    }
  }


  static fromApiCheckStockNotificacion(responseApi: any) {
    let { stockCheckResponse } = JSON.parse(responseApi.payload);
    return stockCheckResponse[0];
  }
}
