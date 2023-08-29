export interface QueryParams {
    orderId: number
    idDocumento: number
    idTipoDocumento: number
    codEstab: string
    tiempoCredito: number
    idCliente: number
    codDoc: 'NE' | 'FV';
    idCuentaPorCobrar: number
    payAutomatic: boolean
    printerAutomatic: boolean
}

export const queryParamsInitialState: QueryParams = {
    orderId: 0,
    idDocumento: 0,
    idTipoDocumento: 0,
    codEstab: "",
    tiempoCredito: 0,
    idCliente: 0,
    codDoc: "NE",
    idCuentaPorCobrar: 0,
    payAutomatic: false,
    printerAutomatic: false
}

 export interface Quota {
    idCuotaPorCobrar: number
    idCuentaPorCobrar: number
    nroCuota: number
    cuota: number
    interes: number
    mora: number
    diasMora: number
    abono: number
    saldoCta: number
    saldo: number
    estado: string    
    abonoPosfechado: number
}
export interface VoucherQuota {
    idCuentaPorCobrar: number
    serieComprobante: string
    tipoDoc: string
    fechaEmision: string
    fechaVencimiento: string
    importeTotal: number,
    diasMora: number,
    mora: number,
    abono: number,
    saldoDoc: number,
    saldo: number,
    estado: string,
    cuotas: Array<Quota>
}