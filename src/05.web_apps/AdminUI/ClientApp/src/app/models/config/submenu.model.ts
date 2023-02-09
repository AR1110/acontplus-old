export interface Submenu{
  idSubMenu: number
  idMenu:number
  codigo:string
  codMenu:string
  urlSubMenu:string
  icono:string
  descripcion:string
}

export interface CreateDTO extends Omit<Submenu, 'idSubMenu'>{
  idMenu: number
}

export interface UpdateDTO extends Partial<CreateDTO>{

}
