import { ActionModel } from '@modules/seguridad/domain/models/action.model';
import { Menu } from '@modules/config/models/menu';

export interface UserCustomPermissionDataForm {
  menus: MenuPermission[];
  actions: ActionModel[];
}

export interface UserCustomPermissionList {
  id: number;
  securityType?: number | null;
  menuId: number;
  actionId: number;
  nomMenu: string;
  nombreAction: string;
  isActive: boolean;
  nomSecurityType: string;
  createdAt: string;
}
export interface UserCustomPermissionResponse {
  data: UserCustomPermissionList[];
  totalRecords: number;
}

export interface MenuPermission
  extends Pick<Menu, 'id' | 'name' | 'url' | 'aplicacionId' | 'isActive'> {
  menuId: number;
}
