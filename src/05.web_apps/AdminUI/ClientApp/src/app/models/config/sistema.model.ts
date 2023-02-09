export interface Sistema {
  idSistema:number
  codigo:string
  descripcion:string
  urlSistema:string
  hostApp:string
  connectionStrings:string
  fechaRegistro:string
  estado:boolean
}

export interface SistemaCreateDTO extends Omit<Sistema, 'idSistema' | 'fechaRegistro'| 'estado' >{}

export interface SistemaUpdateDTO extends Partial<Sistema>{ }
