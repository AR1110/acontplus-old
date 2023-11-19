import { Measure, ProductSaleReadDto, ProductSearchDto, RawMeasure, RawProductPVPData, RawProductSaleData, RawProductSearchData } from "../models";

function productSaleReadAdapter(product: RawProductSaleData): ProductSaleReadDto { 
    return ({
        productId: product.idArticulo,
        measureId: product.idMedida,
        vatRatId: product.idTipoIva,
        taxRateCode: product.codigoPorcentaje,
        description: product.descripcion,
        carryInventory: product.llevaInventario,
        costPrice: product.precioCosto,
        priceWithoutSubsidy: product.precioSinSubsidio,
        productCode: product.codigoArticulo,
        stock: product.stock,
        s3ObjectKey: product.s3ObjectKey,
        s3ObjectUrl: product.s3ObjectUrl,
        tarifaImpuesto: product.tarifaImpuesto
    })
}

function productSaleRateReadAdapter(measures: RawMeasure[]): Array<Measure> {

    return measures.map(item => {
        let productPVPs: RawProductPVPData[] = [];
        if (typeof item.tarifas==='string'){
            productPVPs = JSON.parse(item.tarifas); 
        }else{
            productPVPs = item.tarifas;
        }
        return {
            measureId: item.idMedida,
            description: item.descripcion,
            conversion: item.conversion, 
            defaultMedida: item.defaultMedida,
            pvps: productPVPs.map(pvp => ({
                feeId: pvp.idTarifa,
                salePrice: pvp.precioVenta,
                priceWithVat: pvp.precioConIva,
                description: pvp.tarifa,
                default: pvp.predeterminada
            }))
        }
    })
}

function productSearchAdapter(products:Array<RawProductSearchData>): Array<ProductSearchDto>{
    return products.map(product=>{
        return {
            productId: product.idArticulo,            
            code: product.codigo,
            description: product.descripcion,
            iva: product.iva,
            pvps: JSON.parse(product.priceSale) || [],
            s3ObjectUrl: product.s3ObjectUrl,
            s3ObjectKey: product.s3ObjectKey
        }
    })
}

export {
    productSaleReadAdapter,
    productSaleRateReadAdapter,
    productSearchAdapter
}