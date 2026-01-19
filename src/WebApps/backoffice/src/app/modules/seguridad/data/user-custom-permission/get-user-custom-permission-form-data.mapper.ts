import { UserCustomPermissionDataForm } from '@modules/seguridad/domain/models/user-custom-permission.model';
import { ApiResponse } from 'acontplus-utils';

export class GetUserCustomPermissionFormDataMapper {
  static fromJson(response: ApiResponse): UserCustomPermissionDataForm {
    const { menus, actions } = response.payload as any;
    console.log(response.payload);
    return {
      menus: menus || [],
      actions: actions || [],
    };
  }
}
