export interface CuentaPorPagarLista {
  idCuentaPorPagar: number
  idDocumento: number
  idTiempoCredito: number
  idProveedor: number
  codEstab:string
  identificacionComprador: string
  nombreComprador: string
  nombreDoc: string
  codDoc: string
  serieComprobante: string
  fechaEmision: string
  fechaVencimiento: string
  total: number
  abono: number
  saldo: number
  diasCredito:number
  nombreEstado: string
  codigoEstado: string
  numAutDocSustento: string
  totalRecords:number
}

export interface CuentaPorPagarCuotaConfig {
    idCuotaPorPagar: number
    idCuentaPorPagar: number
    fechaVencimiento: Date
    nroCuota: number | string
    cuota: number
    abono: number
    saldo: number
    nombreEstado: string,
    codigoEstado: string
}


