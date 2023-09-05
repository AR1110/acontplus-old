import { TaxRate, RawTaxRateData } from "../models"; 

function taxRateAdapter(taxRates: RawTaxRateData[]): Array<TaxRate> { 
 
    return taxRates.map(taxRate=>({
        taxRateId: taxRate.idTarifaImpuesto,
        taxCode: taxRate.codImpuesto, //Codigo Impuesto
        taxRateCode: taxRate.codigo, //Codigo Impuesto Tarifa
        description: taxRate.descripcion,
        percentage: taxRate.porcentaje
    }) )   
}

export {
    taxRateAdapter
}