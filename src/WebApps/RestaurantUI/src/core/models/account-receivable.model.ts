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
    abonoPosfechado: number,
    saldoOriginal: number
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
    cloneCuotas: Array<Quota>
}