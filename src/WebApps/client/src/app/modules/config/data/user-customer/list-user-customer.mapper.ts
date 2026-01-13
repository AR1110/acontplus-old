import { UserCustomerResponse } from '@modules/config/data/models/user-customer/user-customer.model';

export class ListUserCustomerMapper {
  static toJson<T>(parameters: T) {
    return JSON.stringify({
      tipo: 1,
      ...parameters,
    });
  }

  static fromJson(response: any): UserCustomerResponse {
    const usersCustomer = response?.userCustomers || [];
    const data = usersCustomer.map((item: any, index: number) => {
      return {
        index: index + 1,
        idUsuario: item.idUsuario,
        nroIdentificacion: item.nroIdentificacion,
        username: item.username,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        nombreCompleto: item.nombreCompleto,
        totalRecords: item.totalRecords,
        roleId: item.roleId,
        nomEstado: item.estado ? 'Activo' : 'Inactivo',
        estado: item.estado,
      };
    });

    const totalRecords = data.length > 0 ? data[0].totalRecords : 0;
    return {
      data,
      totalRecords,
    };
  }
}
