import { isValidJSON } from '@core/utils/utils';
import { UserPermissionResponse } from '@modules/config/data/models/user/user-permission.model';
import { UserPermissionParams } from '@modules/config/data/user-permission/user-permission.entity';
export class ListUserPermissionMapper {
  static toJson(parameters: any): UserPermissionParams {
    return {
      tipo: 1,
      idUsuarioRol: parameters.userRoleId,
    };
  }

  static fromJson(response: any): UserPermissionResponse {
    const userPermissionData = response.userPermissionData[0] || {};
    const userCustomPermissionsApi = response.userCustomPermissions || [];
    const userCustomPermissionsSavedApi = response.userCustomPermissionsSaved || [];
    const usersCustomerAdmin = response.usersCustomerAdmin || [];

    const userCustomPermissionsMerged = [
      ...userCustomPermissionsApi,
      ...userCustomPermissionsSavedApi,
    ];

    function transformMenuData(data: any[]): any[] {
      const menuMap = new Map<string, any>();

      data.forEach(({ id, nomMenu, descAction, securityType, enabled, requiresKey, users }) => {
        const fullName = nomMenu;

        if (!menuMap.has(fullName)) {
          menuMap.set(fullName, { name: fullName, children: [] });
        }

        const menu = menuMap.get(fullName)!;
        menu.children.push({
          id,
          name: descAction,
          securityType,
          enabled,
          requiresKey,
          hasStatus: true,
          users: isValidJSON(users) ? JSON.parse(users) : [],
        });
      });

      return Array.from(menuMap.values()).map((item: any, index) => ({
        ...item,
        index: index + 1,
      }));
    }

    const userCustomPermissions = transformMenuData(userCustomPermissionsMerged);

    const [permissionsSale, permissionsProduct, permissionsCashBox] = response.permissions;

    permissionsSale.permission = JSON.parse(permissionsSale.permission);
    permissionsProduct.permission = JSON.parse(permissionsProduct.permission);
    permissionsCashBox.permission = JSON.parse(permissionsCashBox.permission);

    return {
      userPermissions: userCustomPermissions,
      userPermissionData,
      usersAdmin: usersCustomerAdmin,
      permissionsSale,
      permissionsProduct,
      permissionsCashBox,
    };
  }
}
