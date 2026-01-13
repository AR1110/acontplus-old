import { UserCustomerRoleResponse } from '@modules/config/data/models/user-customer/user-customer-role.model';

export class ListUserCustomerRoleMapper {
  static toJson<T>(parameters: T) {
    return JSON.stringify({
      tipo: 1,
      ...parameters,
    });
  }

  static fromJson(response: any): UserCustomerRoleResponse {
    const userCustomerRoles = response.userCustomerRoles || [];
    const data = userCustomerRoles.map((item: any, index: number) => {
      return {
        idUsuarioRol: item.idUsuarioRol,
        idUsuario: item.idUsuario,
        idEntidad: item.idEntidad,
        username: item.nombreUsuario,
        nroIdentificacion: item.nroIdentificacion,
        rucEmpresa: item.ruc,
        razonSocialEmpresa: item.razonSocial,
        estado: item.estado,
        roleName: item.roleName,
      };
    });
    return {
      data,
    };
  }
}
