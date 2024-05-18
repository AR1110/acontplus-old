import {AccesoSubMenu, LicenciaSubMenu, SubMenuNode} from "@modules/config/models/sub-menu.model";

export  interface  Menu {
  menuId: number
  code: string
  url: string
  icon:string
  name: string
  submenu: false
  subMenusNode: SubMenuNode[]
}

export interface LicenciaMenu {
  menuId: number
  name: string
  subMenus:LicenciaSubMenu[]
}

export  interface  AccesoMenu {
  menuId: number
  name: string
  subMenus:AccesoSubMenu[]
}
