import { AccesoSubMenu } from '@modules/config/data/models/sub-menu.model';

export interface AccesoMenu {
  menuId: number;
  name: string;
  menus: AccesoSubMenu[];
}
