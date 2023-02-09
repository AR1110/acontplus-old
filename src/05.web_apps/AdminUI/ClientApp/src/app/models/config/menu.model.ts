export interface Menu {
    idMenu: number
    codigo: string
    urlMenu: string
    icono: string
    descripcion: string
}

export interface MenuViewDTO extends Partial<Menu> {
  codMenu:string,
  subMenus: [{
    descripcion:string
  }]
}

