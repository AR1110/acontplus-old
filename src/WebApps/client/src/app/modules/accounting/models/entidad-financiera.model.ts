type EntidadFinancieraCode = 'EFECT' | 'TRAN'
export interface EntidadFinanciera {
  idEntidadFinanciera: number
  codigo: EntidadFinancieraCode
  descripcion: string
}

export interface EntidadFinancieraRead extends EntidadFinanciera{}
