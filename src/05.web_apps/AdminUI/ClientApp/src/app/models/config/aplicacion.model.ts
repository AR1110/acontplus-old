export interface Aplicacion{
  idAplicacion:number
  idSistema:number,
  codigo:string
  codSistema:string
  descripcion:string
  fechaRegistro:string
  estado:boolean
}

export interface AplicacionCreateDTO extends Omit<Aplicacion, 'idAplicacion' | 'codSistema' | 'fechaRegistro' | 'estado'>{}

export interface AplicacionUpdateDTO extends Partial<Aplicacion>{}
