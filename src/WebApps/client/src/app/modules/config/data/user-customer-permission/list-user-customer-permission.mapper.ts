
import {
  UserCustomerPermissionResponse
} from "@modules/config/domain/models/user-customer/user-customer-permission.model";
import {
  UserCustomerPermissionParams
} from "@modules/config/data/user-customer-permission/user-customer-permission.entity";
export class ListUserCustomerPermissionMapper {

  static toJson (parameters:any): UserCustomerPermissionParams{
    return {
      tipo: 1,
      idUsuarioRol: parameters.userRoleId,
    }
  }

  static fromJson(response: any): UserCustomerPermissionResponse {
    console.log(response)
    const userPermissionData = response.userPermissionData[0] || {}
    const  userCustomPermissionsApi  = response.userCustomPermissions   || [];
    const  userCustomPermissionsSavedApi  = response.userCustomPermissionsSaved   || [];
    const usersCustomerAdmin = response.usersCustomerAdmin   || []

    const userCustomPermissionsMerged = [
      ...userCustomPermissionsApi,
      ...userCustomPermissionsSavedApi
    ]

    function transformMenuData(data: any[]): any[] {
      const menuMap = new Map<string, any>();

      data.forEach(({id,   nomMenu, nomSubMenu,   descAction, securityType, enabled, requiresKey,  }) => {
        const fullName = nomSubMenu ? `${nomMenu} - ${nomSubMenu}` : nomMenu;

        if (!menuMap.has(fullName)) {
          menuMap.set(fullName, {   name: fullName, children: [] });
        }

        const menu = menuMap.get(fullName)!;
        menu.children.push({
          id,
          name: descAction,
          securityType ,
          enabled,
          requiresKey,
          hasStatus: true
        });
      });

      return Array.from(menuMap.values()).map((item:any, index)=>({
        ...item,
        index: index+1,
      }));
    }


    const userCustomPermissions = transformMenuData(userCustomPermissionsMerged)


    return {
      userCustomPermissions ,
      userPermissionData,
      usersCustomerAdmin
    };
  }
}
