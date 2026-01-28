export interface  CodigoRetencion {
  idCodigoRetencion: number
  codigo: string
  concepto: string
  porcentajeMin: number
  porcentajeMax: number
  estado:boolean

}


export interface CodigoRetencioRead extends CodigoRetencion {
  totalRecords: number
}
