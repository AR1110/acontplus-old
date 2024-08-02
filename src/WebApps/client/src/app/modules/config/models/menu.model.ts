import {AccesoSubMenu, } from "@modules/config/models/sub-menu.model";


export  interface  AccesoMenu {
  menuId: number
  name: string
  subMenus:AccesoSubMenu[]
}
