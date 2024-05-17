import {SubMenuNode} from "@modules/config/models/sub-menu.model";

export  interface  Menu {
  id: number
  code: string
  url: string
  icon:string
  name: string
  submenu: false
  subMenusNode: SubMenuNode[]
}

