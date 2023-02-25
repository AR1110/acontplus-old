

export interface IMenu{
  idMenu: number,
  codigo: string,
  urlMenu: string,
  icono: string,
  descripcion: string,
  estado: boolean
}

export interface ISubMenu{
  idSubMenu: number
  idMenu:number
  codigo:string
  codMenu:string
  urlSubMenu:string
  icono:string
  descripcion:string,
  estado: boolean
}

