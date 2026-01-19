import { UserCustomPermissionSaveEntity } from '@modules/seguridad/data/user-custom-permission/user-custom-permission.entity';
import { getValidId } from '@core/utils/data-validation';

export class SaveUserCustomPermissionMapper {
  static toJson(params: any): UserCustomPermissionSaveEntity {
    return {
      id: params.id,
      actionId: params.actionId,
      menuId: params.menuId,
      securityType: getValidId(params.securityType),
    };
  }
}
