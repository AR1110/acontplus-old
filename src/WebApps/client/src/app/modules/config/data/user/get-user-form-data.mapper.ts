import { UserDataForm } from '@modules/config/data/models/user/user.model';

export class GetUserFormDataMapper {
  static toJson() {
    return {
      tipo: 2,
    };
  }

  static fromJson(response: any): UserDataForm {
    return {
      roles: response?.roles || [],
    };
  }
}
