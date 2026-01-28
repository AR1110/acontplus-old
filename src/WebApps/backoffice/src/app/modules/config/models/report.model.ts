export interface Report {
  idReporte: number
  codigo: string
  reportPath: string
  contentType: string
  storedProcedure: string
  nombreReporte: string
  estado: boolean
}

export interface ReportReadDto extends Report{
  fechaRegistro: string
  nextDs:number
  dataSources: string
  totalRecords: number
}
