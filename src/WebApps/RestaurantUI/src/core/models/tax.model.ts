
export interface RawTaxData {
    idImpuesto: number,
    codigo: string,
    descripcion: string,
    estado: boolean
}

export interface Tax {
    taxId: number
    code: string
    description: string
}