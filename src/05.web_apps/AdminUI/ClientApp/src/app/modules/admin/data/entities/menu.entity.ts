

export interface MenuEntity{
  idMenu: number,
  codigo: string,
  urlMenu: string,
  icono: string,
  descripcion: string,
  estado: boolean
}

export interface ISubMenuEntity
{
  idSubMenu: number
  idMenu:number
  codigo:string
  codMenu:string
  urlSubMenu:string
  icono:string
  descripcion:string
  estado: boolean
}
