
export interface IBodega {
    idBodega: number
    bodega: string,
    codEstab: string,
    codEstab_Asig: string
    defaultBodega: boolean,
}

export interface IBodegaEstablecimiento {
    idEstablecimiento: number
    nombreComercial: string
    codEstab: string
    idBodega: number
    bodega: string
    defaultEstab:  boolean
    defaultBodega: boolean
}