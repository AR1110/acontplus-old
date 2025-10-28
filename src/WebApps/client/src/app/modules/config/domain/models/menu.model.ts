import { AccesoSubMenu } from '@modules/config/domain/models/sub-menu.model';

export interface AccesoMenu {
  menuId: number;
  name: string;
  menus: AccesoSubMenu[];
}
