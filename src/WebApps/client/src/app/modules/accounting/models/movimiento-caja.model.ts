export interface MovimientoCaja {
  idTipoDocumento: number
  codDoc: string
  idMovimientoCaja: number
  codEstab: string
  fechaEmision: string
  valor: number
  observaciones: string
  nroDoc: string
  estado: string
  subEntidadFinanciera: string
  empleado: string
  caja: string
  nroIdentificacion: string 
}

export interface MovimientoCajaRead extends MovimientoCaja {
  totalRecords: number
}