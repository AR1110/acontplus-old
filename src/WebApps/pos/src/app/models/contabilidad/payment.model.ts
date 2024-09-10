

export interface CuotaCobro {
  idCuotaPorCobrar: number
  idCuentaPorCobrar: number
  fechaVencimiento: string
  nroCuota: string
  cuota: number
  mora: number
  interes: number
  diasMora: number
  abono: number
  saldo: number
  estado: string
}


//cuotas con calculos de mora
export interface CuotaCobroCalculado extends CuotaCobro {

  saldoTotalOriginal: number
  saldoTotalLectura: number
  interesActual: number
  interesPorMoraActual: number
  diasMoraActual: number
  saldoTotalActual: number
  abonoPosfechado: number
  esCuotaAfectada: boolean
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
  cuotas: CuotaCobro[]
  cuotasClone: CuotaCobro[]
}

//cuentas por cobrar incluidos calculos de mora
export interface CuentaPorCobrarCalculado {
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
  cuotasCalculadas: CuotaCobroCalculado[],
  cuotasCalculadasClone: CuotaCobroCalculado[]
  saldoActualDoc: number
  diasMoraActual: number
  interesPorMoraActual: number
  interesActual: number
}


export interface DataCuentaPorCobrar {
  codEstab: string
  idCliente: number
  identificacionComprador: string
  razonSocialComprador: string
  serieComprobante: string
  importeTotal: number
  saldo: number
  oldSaldo: number
  abono: number
  oldAbono: number
  fechaEmision: string
  cambio: number
}


export interface CobroDetalle {
  idCuentaPorCobrar: number,
  idCuotaPorCobrar: number
  abono: number

  diasMoraActual: number
  interesPorMoraActual: number
  interesActual: number


  cuota: number
  saldo: number
  secuencial: number
  valorSaldoLectura: number
  saldoOriginal: number
  posfechado: boolean
}

export interface HistorialCuenta {
  secuencial: number
  valorSaldoLectura: number
  idCuentaPorCobrar: number
  abono: number
  saldo: number
  diasMoraActual: number
  interesPorMoraActual: number
  interesActual: number
}


export interface Cobro {
  secuencial: number
  idEntidadFinanciera: number,
  idSubEntidadFinanciera: number
  idBanco: number
  idCiudad: number
  fechaEmision: string
  posfechado: boolean

  cobro: boolean
  referencia: null | string
  aprobacion: null | string
  lote: null | string

  //Data Documento
  nro: null | string
  valorAbono: number
  controlCaja: boolean
  observacion: null | string

  infoCobro: string | undefined
  paymentTypeCode: string | null | undefined
  abonoCuota: number
}
