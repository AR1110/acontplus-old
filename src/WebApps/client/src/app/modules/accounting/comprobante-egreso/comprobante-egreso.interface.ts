  interface  ComprobanteEgreso {
    idComprobanteEgreso:number
    fechaEmision: string
    serieComprobante: string
    total:number
    nombreEstado: string
    estado: boolean
    codEstab: string
}

export  interface  ComprobanteEgresoLista extends   ComprobanteEgreso {
  index: number

}
