import { Aplicacion } from "./aplicacion";

export interface Sistema {
  id: number,
  code: string,
  name: string,
  domainUrl?: string,
  ipAddress: string,
  connectionStrings?: string,
  aplicaciones: Aplicacion[]
}
