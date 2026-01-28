import { UserRole } from '@modules/config/data/models/user/user-role.model';

export interface UserPermission {
  idUserPermission: number;
}

export interface UserPermissionList {}

export interface UserPermissionResponse {
  userPermissions: any[];
  userPermissionData: UserPermission;
  usersAdmin: UserRole[];
  permissionsSale: any[];
  permissionsProduct: any[];
  permissionsCashBox: any[];
}
