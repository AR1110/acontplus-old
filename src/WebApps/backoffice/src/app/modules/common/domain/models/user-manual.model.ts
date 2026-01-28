import { Menu } from '@modules/config/models/menu';

export interface UserManual {
  id: number;
  userManualTypeId: number;
  userManualType: UserManualType;
  userManualTypeName: string;
  menuId: number;
  menu: Menu;
  title: string;
  content: string;
  userManualTags: UserManualTag[];
  isActive: boolean;
}

export interface UserManualType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface UserManualTag {
  id: number;
  name: string;
}

export interface UserManualMenu extends Pick<Menu, 'id' | 'name'> {
  menuId: number;
  menuName: string;
}
