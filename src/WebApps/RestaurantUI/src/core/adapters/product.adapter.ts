import { Measure, ProductSaleReadDto, RawMeasure, RawProductPVPData, RawProductSaleData } from "../models";

function productSaleReadAdapter(product: RawProductSaleData): ProductSaleReadDto { 
    return ({
        productId: product.idArticulo,
        measureId: product.idMedida,
        vatRatId: product.idTipoIva,
        taxRateCode: product.codigoPorcentaje,
        description: product.descripcion,
        takesInventory: product.llevaInventario,
        costPrice: product.precioCosto,
        priceWithoutSubsidy: product.precioSinSubsidio,
        productCode: product.codigoArticulo,
        stock: product.stock,
        s3ObjectKey: product.s3ObjectKey,
        s3ObjectUrl: product.s3ObjectUrl
    })
}

function productSaleRateReadAdapter(measures: RawMeasure[]): Array<Measure> {

    return measures.map(item => {
        const productPVPs: RawProductPVPData[] = JSON.parse(item.tarifas);
        return {
            measureId: item.idMedida,
            description: item.medida,
            pvps: productPVPs.map(pvp => ({
                feeId: pvp.idTarifa,
                salePrice: pvp.precioVenta,
                priceWithVat: pvp.precioConIva,
                description: pvp.tarifa,
                default:  pvp.precioPredeterminado
            }))
        }
    })
}


export {
    productSaleReadAdapter,
    productSaleRateReadAdapter
}