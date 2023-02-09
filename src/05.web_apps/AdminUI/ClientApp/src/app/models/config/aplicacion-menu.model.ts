
export interface AplicacionMenu {
  idAplicacion:number
  idAplicacionMenu:number
  idMenu: number
  idSubMenu:number
  aplicacion:string,
  menu:string,
  subMenu:string
  estado:boolean
}

export interface AplicacionMenuCreateDTO{
  idAplicacion:number
  idMenu:number
  idSubMenu:number
}

export interface AplicacionMenuUpdateDTO extends Partial<AplicacionMenu>{}

