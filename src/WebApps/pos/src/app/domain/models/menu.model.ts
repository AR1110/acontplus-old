export type ActionName = 'crear' | 'editar' | 'eliminar';

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
  actions: Record<ActionName, boolean>;
}
