import { UserPermissionSaveEntity } from '@modules/config/data/user-permission/user-permission.entity';

export class CreateUserPermissionMapper {
  static toJson(parameters: any): UserPermissionSaveEntity {
    return {
      id: parameters.id,
      userRoleId: parameters.userRoleId,
      permissionsData: JSON.stringify(parameters.permissionsData),
    };
  }
}
