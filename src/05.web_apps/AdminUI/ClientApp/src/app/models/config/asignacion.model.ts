export interface Asignacion{
  readonly idAsignacion:number
  readonly menu:string
  readonly subMenu:string
  readonly accion:string
}

export interface AsignacionCreateDTO {
  idAplicacionMenu:number
  idAccion:number
}
