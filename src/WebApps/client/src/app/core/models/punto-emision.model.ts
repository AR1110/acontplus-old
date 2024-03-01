
export interface PuntoEmision {
    idPuntoEmision: number,
    ptoEmi: string,
    idPtoEmi_asig?: number,
    codEstab_Asig?: string
    defaultPtoEmi: boolean
}

export interface PuntoEmisionEstablecimiento {
    idEstablecimiento: number
    nombreComercial: string
    codEstab: string
    idPuntoEmision: number
    ptoEmi: string
    defaultEstab: boolean
    defaultPtoEmi: boolean
}
