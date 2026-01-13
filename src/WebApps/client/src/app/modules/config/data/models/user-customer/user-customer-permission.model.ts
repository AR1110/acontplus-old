import { UserCustomerRole } from '@modules/config/data/models/user-customer/user-customer-role.model';

export interface UserCustomerPermission {
  idUserPermission: number;
}

export interface UserCustomerPermissionList {}

export interface UserCustomerPermissionResponse {
  userCustomPermissions: any[];
  userPermissionData: UserCustomerPermission;
  usersCustomerAdmin: UserCustomerRole[];
  permissionsSale: any[];
  permissionsProduct: any[];
  permissionsCashBox: any[];
}
