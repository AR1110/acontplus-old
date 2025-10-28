import { UserCustomerPermissionSaveEntity } from '@modules/config/data/user-customer-permission/user-customer-permission.entity';

export class CreateUserCustomerPermissionMapper {
  static toJson(parameters: any): UserCustomerPermissionSaveEntity {
    return {
      id: parameters.id,
      userRoleId: parameters.userRoleId,
      permissionsData: JSON.stringify(parameters.permissionsData),
    };
  }
}
