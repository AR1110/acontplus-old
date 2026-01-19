import { UserCustomPermissionResponse } from '@modules/seguridad/domain/models/user-custom-permission.model';
import { ApiResponse } from 'acontplus-utils';

export class ListUserCustomPermissionMapper {
  static toJson<T>(parameters: T) {
    return JSON.stringify({
      tipo: 1,
      ...parameters,
    });
  }

  static fromJson(response: ApiResponse): UserCustomPermissionResponse {
    const list = response.payload as any;
    const data = list.map((item: any, index: number) => {
      let nomSecurityType = 'Ninguno';
      if (item.securityType === 1) {
        nomSecurityType = 'Requiere Clave';
      }
      if (item.securityType === 2) {
        nomSecurityType = 'Requiere Aprobación';
      }
      return {
        index: index + 1,
        id: item.id,
        securityType: item.securityType,
        nomSecurityType,
        menuId: item.menu.id,
        nomMenu: item.menu.name,
        nomSubMenu: item.subMenu ? item.subMenu.name : '---',
        nomAction: item.action.description || item.action.name,
        actionId: item.action.id,
        isActive: item.isActive,

        createdAt: item.createdAt,
      };
    });
    return {
      data,
      totalRecords: 0,
    };
  }
}
