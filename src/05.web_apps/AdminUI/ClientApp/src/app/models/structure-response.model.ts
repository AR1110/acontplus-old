
interface Payload{
  code?: string,
  message?: string,
  data?:string
}
export interface StructureResponse{
  code:string
  message:string
  data: string
  payload: Payload | any
}

export interface GenericResponse{
  id:string
  code:string
  message:string
  titleSms: string
  data:string
}



