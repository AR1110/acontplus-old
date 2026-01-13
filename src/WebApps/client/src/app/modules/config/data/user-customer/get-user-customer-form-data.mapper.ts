import { UserCustomerDataForm } from '@modules/config/data/models/user-customer/user-customer.model';

export class GetUserCustomerFormDataMapper {
  static toJson() {
    return {
      tipo: 2,
    };
  }

  static fromJson(response: any): UserCustomerDataForm {
    return {
      roles: response?.roles || [],
    };
  }
}
