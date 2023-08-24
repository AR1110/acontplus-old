import { Measure, ProductSaleReadDto, RawMeasure, RawProductSaleData, RawRateData } from "../models";

function productSaleReadAdapter(product: RawProductSaleData): ProductSaleReadDto {
    console.log(product)
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
        const rates: RawRateData[] = JSON.parse(item.tarifas);
        return {
            measureId: item.idMedida,
            description: item.medida,
            rates: rates.map(rate => ({
                rateId: rate.idTarifa,
                salePrice: rate.precioVenta,
                priceWithVat: rate.precioConIva,
                description: rate.tarifa,
                default:  rate.precioPredeterminado
            }))
        }
    })
}


export {
    productSaleReadAdapter,
    productSaleRateReadAdapter
}