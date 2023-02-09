export interface Licencia{
  idLicencia:number
  codigo:string
  titulo:string
  descripcion: string
  fechaRegistro:number
  estado:boolean
}


export interface CreateLicenciaDTO extends Omit<Licencia, 'idLicencia' | 'fechaRegistro' | 'estado'>{}

export interface UpdateLicenciaDTO extends Partial<CreateLicenciaDTO>{}
