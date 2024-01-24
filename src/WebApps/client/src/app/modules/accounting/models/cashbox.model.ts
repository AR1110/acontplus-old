 
export interface Cashbox {
  idCaja: number
  descripcion: string
  estado: boolean,
  actividad: string
  usuario: string
  turno: string
  idTurno: number
  idUsuario: number
  totalRecords: number
}



export interface ControlCaja {
  id: number
  fechaApertura: string
  fechaCierre: string | null
  faltante: number
  sobrante: number
  totalArqueo: number
  estado: boolean
  totalRecords: number
}

export interface CashboxSelectHtmlOnly extends Pick<Cashbox, 'idCaja' | 'descripcion'> {}