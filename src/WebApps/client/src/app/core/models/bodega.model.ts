
export interface Bodega {
    idBodega: number
    bodega: string,
    codEstab: string,
    codEstab_Asig: string
    defaultBodega: boolean,
}

export interface BodegaEstablecimiento {
    idEstablecimiento: number
    nombreComercial: string
    codEstab: string
    idBodega: number
    bodega: string
    defaultEstab:  boolean
    defaultBodega: boolean
}
