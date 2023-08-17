
export interface RawTaxRateData {
    idTarifaImpuesto: number,
    codImpuesto: string,
    codigo: string,
    descripcion: string,
    porcentaje: number,
    estado: boolean
}

export interface TaxRate {
    taxRateId: number
    taxCode: string
    code: string
    description: string
    percentage: number    
}