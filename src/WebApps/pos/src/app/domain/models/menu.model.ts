// export type ActionName = 'crear' | 'editar' | 'eliminar';
export class ActionName{
  crear = false
  editar = false
  create_invoice = false
  create_ne =false;
  eliminar = false
  anular = false
  reporte = false;
}
export interface Action {
  code: string;
  name: ActionName;
}


export interface MenuItem {
  id: string;
  code: string;
  name: string;
  icon?: string;
  route?: string;
  children?: SubMenuItem[];
  url: string
   submenu : boolean
}

export interface SubMenuItem {
  code: string
  url: string
  icon: string
  name: string
  order: number
  menuId: number
  actions: ActionName;
}
