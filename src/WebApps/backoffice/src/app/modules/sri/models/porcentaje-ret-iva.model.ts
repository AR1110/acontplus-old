export interface PorcentajeRetIva {
  idPorcentajeRetIva: number
  codigo: string
  descripcion: string
  porcentaje: number
  estado: boolean

}

export interface PorcentajeRetIvaRead extends PorcentajeRetIva {
  totalRecords: number
}
