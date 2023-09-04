import { Tax, RawTaxData } from "../models"; 

function taxAdapter(taxes: RawTaxData[]): Array<Tax> { 
    console.log(taxes)
    return taxes.map(tax=>({
        taxId: tax.idImpuesto,
        code: tax.codigo,
        description: tax.descripcion
    }) )   
}

export {
    taxAdapter
}