
export interface IPuntoEmision {
    idPuntoEmision: number,
    ptoEmi: string,
    idPtoEmi_asig?: number,
    codEstab_Asig?: string
    defaultPtoEmi: boolean
}

export interface IPuntoEmisionEstablecimiento {
    idEstablecimiento: number
    nombreComercial: string
    codEstab: string
    idPuntoEmision: number
    ptoEmi: string
    defaultEstab: boolean
    defaultPtoEmi: boolean
}