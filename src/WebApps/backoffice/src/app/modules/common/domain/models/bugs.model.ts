export interface BugsList{
  idErrorSistema: number
  method: string
  errorProcedure: string
  errorMessage:string
  totalRecords: number
}

export interface BugsResponse{
  data: BugsList[]
  totalRecords: number
}
