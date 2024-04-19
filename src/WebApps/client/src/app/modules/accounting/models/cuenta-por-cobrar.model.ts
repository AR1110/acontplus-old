 
// De Api
export interface CuotaAPI {
    idCuotaPorCobrar: number
    idCuentaPorCobrar: number
    nroCuota: string,
    cuota: number
    mora: number
    interes: number
    diasMora: number
    abono: number
    saldoCta: number
    saldo: number
    estado: string,
    saldoOriginal: number
}

export interface CuentaPorCobrarAPI {
    codEstab: string
    idCliente: number
    identificacionComprador: string
    razonSocialComprador: string
    idCuentaPorCobrar: number
    serieComprobante: string
    codDoc: string
    fechaEmision: string
    fechaVencimiento: string
    importeTotal: number
    diasMora: number
    mora: number
    abono: number
    saldo: number
    saldoDoc: number
    descripcion: string
    cuotas: string
}

//Se usa internamente
export interface Cuota {
    idCuotaPorCobrar: number
    idCuentaPorCobrar: number
    nroCuota: string,
    cuota: number
    mora: number
    interes: number
    diasMora: number
    abono: number
    saldoCta: number
    saldo: number
    estado: string,
    saldoOriginal: number
}

export interface CuentaPorCobrar {
    codEstab: string
    idCliente: number
    identificacionComprador: string
    razonSocialComprador: string
    idCuentaPorCobrar: number
    serieComprobante: string
    codDoc: string
    fechaEmision: string
    fechaVencimiento: string
    importeTotal: number
    diasMora: number
    mora: number
    abono: number
    saldo: number
    saldoDoc: number
    descripcion: string
    cuotas: Array<Cuota>
    cuotasOriginal: Array<Cuota>
}

export interface CuentaPorCobrarComprobante {
    codEstab: string
    idCliente: number
    identificacionComprador: string
    razonSocialComprador: string
    serieComprobante: string
    importeTotal: number
    saldo: number
    abono: number
    fechaEmision: string
}

export interface CuentaPorCobrarProps {
    idCuentaPorCobrar: number
    codEstab: string
}