
export interface Anticipo {
  idAnticipo: number
  idTipoDocumento: number
  codEstab: string
  fechaEmision: string
  valor: number
  obs: string
  serieComprobante: string
  identificacion: string
  nombreFiscal: string
  subEntidadFinanciera: string
  estadoDoc: string
  codDoc: string
  usuario: string
  identificacionUsuario: string
}

export interface AnticipoRead extends Omit<Anticipo, "nombreFiscal"  >{
  razonSocialCiente: string
  totalRecords: number
}
