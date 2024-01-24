type EntidadFinancieraCode = 'EFECT' | 'TRAN'
export interface EntidadFinanciera {
  idEntidadFinanciera: number
  codigo: EntidadFinancieraCode
  descripcion: string
}