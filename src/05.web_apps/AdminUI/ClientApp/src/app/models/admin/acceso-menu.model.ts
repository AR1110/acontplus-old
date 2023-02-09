export interface AccesoMenuAccion {
  idAccesoAccion:number
  codSubMenu:string,
  codAccion: string
  descripcion:string,
  estado:boolean
}

export interface AccesoMenuSubMenu{
  readonly idAccesoMenu:number
  readonly descripcion:string
  readonly urlSubMenu:string
  readonly  codMenu:string,
  readonly  codSubMenu:string,
  acciones:  AccesoMenuAccion[],
  estado:boolean
}




export interface AccesoMenu{
  readonly descripcion: string
  readonly codMenu:string
  readonly  urlMenu:string
  isExpanded:boolean
  subMenus: AccesoMenuSubMenu[]
}


export interface AccesoMenuSubMenuPut extends Partial<AccesoMenuSubMenu>{}
export interface AccesoMenuAccionPut extends Partial<AccesoMenuAccion>{}

