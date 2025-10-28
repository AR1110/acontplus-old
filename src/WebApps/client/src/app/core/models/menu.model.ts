export interface Menu {
  id: number;
  name: string;
  url: string;
}

export interface MenuAction {
  code: string;
  name: string;
}

export interface MenuItem {
  id: number;
  code: string;
  url: string;
  icon: string;
  name: string;
  parentId?: number;
  actions: MenuAction[];
  children: MenuItem[];
}

export interface UserData {
  id: number;
  username: string;
  fullName: string;
  roleName: string;
  companyId: number;
  codeRole: string;
  idCard: string;
  avatar: string;
}

export interface PermissionsCache {
  userData: UserData;
  menuItems: MenuItem[];
  timestamp: number;
  version: string; // Para invalidar cache en actualizaciones
}


